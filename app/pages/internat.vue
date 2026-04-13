<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Product } from "~/types/product";

type InternatFormPayload = {
  items?: Array<{
    surname: string;
    firstname: string;
    nickname: string;
    email: string;
    optionRoom: boolean;
    optionGoodies: boolean;
  }>;
};

const { addItem, items } = useCart();
const ticketErrorMessage = ref("");

const { data, error } = await useAPI<Product[]>("/product?virtual=true", {
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

const existingTicketEmails = computed(() =>
  items.value
    .filter((item) => item.kind === "internat-ticket" && item.ticketDetails)
    .map((item) => item.ticketDetails!.email.trim().toLowerCase()),
);

const createLineId = () =>
  globalThis.crypto?.randomUUID?.() ?? `internat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const handleTicketFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  ticketErrorMessage.value = "";

  if (error.value || !internatProduct.value) {
    ticketErrorMessage.value = "Les produits internat ne sont pas disponibles pour le moment.";
    return;
  }

  const submittedItems = ((event.data as InternatFormPayload | undefined)?.items ?? []).map((item) => ({
    surname: item.surname.trim(),
    firstname: item.firstname.trim(),
    nickname: item.nickname.trim(),
    email: item.email.trim().toLowerCase(),
    optionRoom: item.optionRoom,
    optionGoodies: item.optionGoodies,
  }));

  const duplicateCartEmails = submittedItems
    .map((item) => item.email)
    .filter((email, index, emails) => emails.indexOf(email) === index)
    .filter((email) => existingTicketEmails.value.includes(email));

  if (duplicateCartEmails.length > 0) {
    ticketErrorMessage.value = `Ces emails sont deja presents dans le panier : ${duplicateCartEmails.join(", ")}`;
    return;
  }

  const validationPayload = {
    items: submittedItems.map((item) => ({
      surname: item.surname,
      firstname: item.firstname,
      nickname: item.nickname,
      email: item.email,
      drap: item.optionRoom,
      goodies: item.optionGoodies,
    })),
  };

  const { error: validationError } = await useAPI<{ ok: boolean }>("/internat/validate", {
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

  for (const item of submittedItems) {
    const skuCode = item.optionRoom
      ? (item.optionGoodies ? "INTERNAT_2026_DRAP_GOODIES" : "INTERNAT_2026_DRAP")
      : (item.optionGoodies ? "INTERNAT_2026_GOODIES" : "INTERNAT_2026");
    const sku = skuByCode.value.get(skuCode);

    if (!sku) {
      ticketErrorMessage.value = `Le pack ${skuCode} est introuvable.`;
      return;
    }

    addItem({
      lineId: createLineId(),
      skuId: sku.id,
      skuCode: sku.skuCode,
      productId: internatProduct.value.id,
      productName: internatProduct.value.name,
      variantLabel: `${item.optionRoom ? "Draps" : "Sans draps"} • ${item.optionGoodies ? "Goodies" : "Sans goodies"}`,
      price: Number(sku.priceOverride ?? internatProduct.value.basePrice),
      imageUrl: internatProduct.value.imageUrl ?? null,
      kind: "internat-ticket",
      ticketDetails: {
        email: item.email,
        firstname: item.firstname,
        lastname: item.surname,
        nickname: item.nickname,
        drap: item.optionRoom,
        goodies: item.optionGoodies,
      },
    });
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

    <InternatForm :on-submit="handleTicketFormSubmit" :api-error="ticketErrorMessage" />
  </UContainer>
</template>
