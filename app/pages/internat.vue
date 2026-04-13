<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Product } from "~/types/product";

type InternatFormPayload = {
  items?: Array<{
    surname: string;
    firstname: string;
    nickname: string;
    email: string;
    selectedOptions: Record<string, string>;
  }>;
};

const { addItem, items } = useCart();
const ticketErrorMessage = ref("");
const adhesionInfoMessage = ref("");

const { data, error } = await useAPI<Product[]>("/product?virtual=true", {
  method: "GET",
});

const { data: adhesionProductData } = await useAPI<Product | null>("/product/adhesion-2026", {
  method: "GET",
});

const internatProduct = computed(() =>
  (data.value ?? []).find((product) =>
    product.skus.some((sku) => sku.skuCode === "INTERNAT_2026"),
  ) ?? null,
);

const skuByCode = computed(() => {
  const product = internatProduct.value;
  return new Map(product?.skus.map((sku) => [sku.skuCode, sku]) ?? []);
});

const adhesionProduct = computed(() => adhesionProductData.value ?? null);

const adhesionSku = computed(() =>
  adhesionProduct.value?.skus.find((sku) => sku.skuCode === "ADHESION_2026") ?? null,
);

const existingTicketEmails = computed(() =>
  items.value
    .filter((item) => item.kind === "internat-ticket" && item.ticketDetails)
    .map((item) => item.ticketDetails!.email.trim().toLowerCase()),
);

const createLineId = () =>
  globalThis.crypto?.randomUUID?.() ?? `internat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const resolveInternatSku = (selectedOptions: Record<string, string>) => {
  if (!internatProduct.value) {
    return null;
  }

  if (!internatProduct.value.optionTypes.length) {
    return internatProduct.value.skus[0] ?? null;
  }

  return (
    internatProduct.value.skus.find((sku) =>
      internatProduct.value?.optionTypes.every((optionType) => {
        const selectedValueId = selectedOptions[optionType.id];
        return sku.options.some((option) => option.optionValue.id === selectedValueId);
      }),
    ) ?? null
  );
};

const buildVariantLabel = (sku: Product["skus"][number]) =>
  sku.options.map((option) => option.optionValue.value).join(" • ");

const baseInternatPrice = computed(() => {
  if (!internatProduct.value) {
    return 0;
  }

  const prices = internatProduct.value.skus.map((sku) =>
    Number(sku.priceOverride ?? internatProduct.value!.basePrice),
  );

  return prices.length > 0 ? Math.min(...prices) : Number(internatProduct.value.basePrice);
});

const optionValuePriceAdjustments = computed<Record<string, number>>(() => {
  if (!internatProduct.value) {
    return {};
  }

  const basePrice = baseInternatPrice.value;

  return Object.fromEntries(
    internatProduct.value.optionTypes.flatMap((optionType) =>
      optionType.optionValues.map((optionValue) => {
        const matchingPrices = internatProduct.value!.skus
          .filter((sku) => sku.options.some((option) => option.optionValue.id === optionValue.id))
          .map((sku) => Number(sku.priceOverride ?? internatProduct.value!.basePrice));

        const valuePrice = matchingPrices.length > 0 ? Math.min(...matchingPrices) : basePrice;

        return [optionValue.id, Math.max(valuePrice - basePrice, 0)];
      }),
    ),
  );
});

const hasPositiveOption = (sku: Product["skus"][number], optionTypeName: string) => {
  const selectedValue = sku.options.find(
    (option) => option.optionValue.optionType.name.toLowerCase() === optionTypeName.toLowerCase(),
  )?.optionValue.value;

  if (!selectedValue) {
    return false;
  }

  return !selectedValue.toLowerCase().startsWith("sans");
};

const handleTicketFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  ticketErrorMessage.value = "";
  adhesionInfoMessage.value = "";

  if (error.value || !internatProduct.value) {
    ticketErrorMessage.value = "Les produits internat ne sont pas disponibles pour le moment.";
    return;
  }

  const submittedItems = ((event.data as InternatFormPayload | undefined)?.items ?? []).map((item) => ({
    surname: item.surname.trim(),
    firstname: item.firstname.trim(),
    nickname: item.nickname.trim(),
    email: item.email.trim().toLowerCase(),
    selectedOptions: item.selectedOptions,
  }));

  const preparedItems = submittedItems.map((item) => {
    const sku = resolveInternatSku(item.selectedOptions);

    return {
      ...item,
      sku,
    };
  });

  const missingSkuItem = preparedItems.find((item) => !item.sku);
  if (missingSkuItem) {
    ticketErrorMessage.value = "Une combinaison d'options internat est introuvable.";
    return;
  }

  const duplicateCartEmails = submittedItems
    .map((item) => item.email)
    .filter((email, index, emails) => emails.indexOf(email) === index)
    .filter((email) => existingTicketEmails.value.includes(email));

  if (duplicateCartEmails.length > 0) {
    ticketErrorMessage.value = `Ces emails sont deja presents dans le panier : ${duplicateCartEmails.join(", ")}`;
    return;
  }

  const validationPayload = {
    items: preparedItems.map((item) => ({
      surname: item.surname,
      firstname: item.firstname,
      nickname: item.nickname,
      email: item.email,
      drap: hasPositiveOption(item.sku!, "Draps"),
      goodies: hasPositiveOption(item.sku!, "Goodies"),
    })),
  };

  const { data: validationData, error: validationError } = await useAPI<{
    ok: boolean;
    nonAdherentEmails: string[];
  }>("/internat/validate", {
    method: "POST",
    body: JSON.stringify(validationPayload),
  });

  if (validationError.value) {
    const payload = validationError.value.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message;
    ticketErrorMessage.value = message ?? "Impossible de verifier les tickets internat.";
    return;
  }

  const nonAdherentEmails = validationData.value?.nonAdherentEmails ?? [];

  for (const item of preparedItems) {
    const sku = item.sku!;

    addItem({
      lineId: createLineId(),
      skuId: sku.id,
      skuCode: sku.skuCode,
      productId: internatProduct.value.id,
      productName: internatProduct.value.name,
      variantLabel: buildVariantLabel(sku),
      price: Number(sku.priceOverride ?? internatProduct.value.basePrice),
      imageUrl: internatProduct.value.imageUrl ?? null,
      kind: "internat-ticket",
      ticketDetails: {
        email: item.email,
        firstname: item.firstname,
        lastname: item.surname,
        nickname: item.nickname,
        drap: hasPositiveOption(sku, "Draps"),
        goodies: hasPositiveOption(sku, "Goodies"),
      },
    });
  }

  if (nonAdherentEmails.length > 0) {
    if (!adhesionProduct.value || !adhesionSku.value) {
      ticketErrorMessage.value = "Impossible d'ajouter l'adhesion automatique (SKU introuvable).";
      return;
    }

    for (const item of submittedItems.filter((submittedItem) => nonAdherentEmails.includes(submittedItem.email))) {
      addItem({
        lineId: createLineId(),
        skuId: adhesionSku.value.id,
        skuCode: adhesionSku.value.skuCode,
        productId: adhesionProduct.value.id,
        productName: adhesionProduct.value.name,
        variantLabel: "Adhesion annuelle",
        price: Number(adhesionSku.value.priceOverride ?? adhesionProduct.value.basePrice),
        imageUrl: adhesionProduct.value.imageUrl ?? null,
        quantity: 1,
        kind: "adhesion",
        ticketDetails: {
          email: item.email,
          firstname: item.firstname,
          lastname: item.surname,
          nickname: item.nickname,
          drap: false,
          goodies: false,
        },
      });
    }

    adhesionInfoMessage.value = `${nonAdherentEmails.length} adhesion${nonAdherentEmails.length > 1 ? "s" : ""} ajoutee${nonAdherentEmails.length > 1 ? "s" : ""} automatiquement au panier.`;
  }

  await navigateTo("/checkout");
};
</script>

<template>
  <UContainer class="mt-4">
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      class="mb-4"
      title="Impossible de charger les packs internat."
    />

    <UAlert
      v-if="adhesionInfoMessage"
      color="info"
      variant="soft"
      icon="i-lucide-badge-info"
      class="mb-4"
      :title="adhesionInfoMessage"
    />

    <InternatForm
      :on-submit="handleTicketFormSubmit"
      :api-error="ticketErrorMessage"
      :option-types="internatProduct?.optionTypes ?? []"
      :option-value-price-adjustments="optionValuePriceAdjustments"
      :adhesion-price="adhesionSku ? Number(adhesionSku.priceOverride ?? adhesionProduct?.basePrice) : undefined"
    />
  </UContainer>
</template>
