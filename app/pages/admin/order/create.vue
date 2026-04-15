<script setup lang="ts">
import {
  ManualOrderPaymentMethod,
  type CreateManualOrderPayload,
  type OrderDetailDTO,
} from "~/types/order";
import type { Product } from "~/types/product";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

type SkuRow = {
  id: string;
  skuId: string;
  skuCode: string;
  label: string;
  unitPrice: number;
  stock: number;
  trackStock: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  skus: SkuRow[];
};

const toast = useToast();

const buyer = ref({
  email: "",
  firstname: "",
  lastname: "",
  nickname: "",
  address: "",
  postalCode: "",
  city: "",
});

const paymentMethod = ref<ManualOrderPaymentMethod>(ManualOrderPaymentMethod.CASH);
const isPaid = ref(true);
const search = ref("");
const selectedSkuByProduct = ref<Record<string, string>>({});
const quantitiesBySku = ref<Record<string, number>>({});
const saving = ref(false);

const { data: products, pending } = await useAPI<Product[]>("/product");

const productRows = computed<ProductRow[]>(() =>
  (products.value ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    skus: product.skus.map((sku) => ({
      id: sku.id,
      skuId: sku.id,
      skuCode: sku.skuCode,
      label: sku.options.length
        ? sku.options
            .map((option) => option.optionValue.value)
            .join(" / ")
        : "Standard",
      unitPrice: Number(sku.priceOverride ?? product.basePrice),
      stock: sku.stock,
      trackStock: sku.trackStock,
    })),
  })),
);

watch(
  productRows,
  (rows) => {
    const nextSelection: Record<string, string> = { ...selectedSkuByProduct.value };

    for (const product of rows) {
      const currentSkuId = nextSelection[product.id];
      const exists = product.skus.some((sku) => sku.skuId === currentSkuId);
      if (!exists) {
        nextSelection[product.id] = product.skus[0]?.skuId ?? "";
      }
    }

    selectedSkuByProduct.value = nextSelection;
  },
  { immediate: true },
);

const filteredProductRows = computed(() => {
  const term = search.value.trim().toLowerCase();
  return !term
    ? productRows.value
    : productRows.value.filter((product) =>
        product.name.toLowerCase().includes(term) ||
        product.skus.some(
          (sku) =>
            sku.skuCode.toLowerCase().includes(term) ||
            sku.label.toLowerCase().includes(term),
        ),
      );
});

const getSelectedSku = (product: ProductRow): SkuRow | null => {
  const selectedId = selectedSkuByProduct.value[product.id];
  return (
    product.skus.find((sku) => sku.skuId === selectedId) ??
    product.skus[0] ??
    null
  );
};

const getSelectedSkuId = (product: ProductRow) =>
  getSelectedSku(product)?.skuId ?? "";

const getProductQuantitySum = (product: ProductRow) =>
  product.skus.reduce(
    (sum, sku) => sum + Number(quantitiesBySku.value[sku.skuId] ?? 0),
    0,
  );

const selectedItems = computed<
  Array<{ product: ProductRow; sku: SkuRow; quantity: number }>
>(() =>
  productRows.value.flatMap((product) =>
    product.skus
      .map((sku) => ({
        product,
        sku,
        quantity: Number(quantitiesBySku.value[sku.skuId] ?? 0),
      }))
      .filter((item) => Number.isFinite(item.quantity) && item.quantity > 0),
  ),
);

const total = computed(() =>
  selectedItems.value.reduce(
    (sum, item) => sum + item.quantity * item.sku.unitPrice,
    0,
  ),
);

const selectedLineCount = computed(() => selectedItems.value.length);

const selectedQuantityCount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.quantity, 0),
);

const selectedItemsPreview = computed(() =>
  [...selectedItems.value].sort((left, right) =>
    left.product.name.localeCompare(right.product.name, "fr"),
  ),
);

const paymentStatusLabel = computed(() => {
  if (paymentMethod.value === ManualOrderPaymentMethod.CASH) {
    return isPaid.value ? "Payée en espèces" : "Espèces en attente";
  }

  return isPaid.value ? "Payée (TPE)" : "En attente (TPE)";
});

const canSubmit = computed(() => {
  const hasBuyer =
    buyer.value.email.trim() &&
    buyer.value.firstname.trim() &&
    buyer.value.lastname.trim() &&
    buyer.value.nickname.trim();

  return Boolean(hasBuyer && selectedItems.value.length > 0 && !saving.value);
});

const setQuantity = (skuId: string, raw: string) => {
  const parsed = Number.parseInt(raw, 10);
  quantitiesBySku.value[skuId] = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const getQuantity = (skuId: string) => Number(quantitiesBySku.value[skuId] ?? 0);

const adjustQuantity = (skuId: string, delta: number) => {
  const next = Math.max(0, getQuantity(skuId) + delta);
  quantitiesBySku.value[skuId] = next;
};

const clearItems = () => {
  quantitiesBySku.value = {};
};

const resetForm = () => {
  quantitiesBySku.value = {};
  search.value = "";
};

async function createManualOrder() {
  if (!canSubmit.value) {
    toast.add({ title: "Complète les champs obligatoires", color: "warning" });
    return;
  }

  const payload: CreateManualOrderPayload = {
    buyer: {
      email: buyer.value.email.trim(),
      firstname: buyer.value.firstname.trim(),
      lastname: buyer.value.lastname.trim(),
      nickname: buyer.value.nickname.trim(),
      address: buyer.value.address.trim() || undefined,
      postalCode: buyer.value.postalCode.trim() || undefined,
      city: buyer.value.city.trim() || undefined,
    },
    items: selectedItems.value.map((item) => ({
      skuId: item.sku.skuId,
      quantity: item.quantity,
    })),
    paymentMethod: paymentMethod.value,
    isPaid: isPaid.value,
  };

  saving.value = true;
  try {
    const { data } = await useAPI<OrderDetailDTO>("/order/manual", {
      method: "POST",
      body: payload,
    });

    toast.add({ title: "Commande manuelle créée", color: "success" });
    resetForm();

    if (data.value?.id) {
      await navigateTo(`/admin/order/${data.value.id}`);
      return;
    }

    await navigateTo("/admin/order");
  } catch (error: any) {
    const message = error?.data?.message ?? "Impossible de créer la commande";
    toast.add({ title: "Erreur", description: String(message), color: "error" });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
    <section class="rounded-3xl border border-primary/20 p-5 shadow-sm md:p-6">
      <div class="flex items-start gap-3">
        <UButton variant="ghost" icon="i-heroicons-arrow-left" to="/admin/order" class="mt-1" />
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-primary md:text-3xl">Nouvelle commande manuelle</h1>
          <p class="text-sm text-neutral-600 md:text-base">
            Ajoute un achat réglé sur place (TPE ou espèces) pour garder un suivi clair des ventes et du stock.
          </p>
          
        </div>
      </div>
    </section>

    <UCard class="border-neutral-200/80 shadow-sm">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-user-circle" class="size-5 text-primary" />
          <h2 class="font-semibold">Acheteur</h2>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Email" required>
          <UInput v-model="buyer.email" type="email" placeholder="acheteur@exemple.com" />
        </UFormField>
        <UFormField label="Pseudo" required>
          <UInput v-model="buyer.nickname" placeholder="Pseudo" />
        </UFormField>
        <UFormField label="Prénom" required>
          <UInput v-model="buyer.firstname" placeholder="Prénom" />
        </UFormField>
        <UFormField label="Nom" required>
          <UInput v-model="buyer.lastname" placeholder="Nom" />
        </UFormField>
        <UFormField label="Adresse">
          <UInput v-model="buyer.address" placeholder="Adresse" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Code postal">
            <UInput v-model="buyer.postalCode" placeholder="75000" />
          </UFormField>
          <UFormField label="Ville">
            <UInput v-model="buyer.city" placeholder="Paris" />
          </UFormField>
        </div>
      </div>
    </UCard>

    <UCard class="border-neutral-200/80 shadow-sm">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-credit-card" class="size-5 text-primary" />
          <h2 class="font-semibold">Paiement</h2>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <UFormField label="Mode de paiement">
          <USelect
            v-model="paymentMethod"
            :items="[
              { label: 'Espèces', value: ManualOrderPaymentMethod.CASH },
              { label: 'TPE', value: ManualOrderPaymentMethod.TPE },
            ]"
          />
        </UFormField>
        <UFormField label="Paiement reçu ?">
          <USwitch v-model="isPaid" :label="isPaid ? 'Oui' : 'Non'" />
        </UFormField>
        <div class="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-neutral-600">
          Statut enregistré:
          <span class="font-semibold text-primary">
            {{ paymentStatusLabel }}
          </span>
        </div>
      </div>
    </UCard>

    <UCard class="border-neutral-200/80 shadow-sm">
      <template #header>
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-shopping-bag" class="size-5 text-primary" />
            <h2 class="font-semibold">Articles</h2>
          </div>
          <div class="flex w-full gap-2 md:w-auto">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher un produit ou une variante"
              class="w-full md:w-80"
            />
            <UButton
              v-if="selectedLineCount > 0"
              color="neutral"
              variant="soft"
              icon="i-heroicons-x-mark"
              @click="clearItems"
            >
              Vider
            </UButton>
          </div>
        </div>
      </template>

      <div v-if="pending" class="py-12 text-center text-neutral-500">Chargement des produits...</div>
      <div v-else class="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div
          v-for="product in filteredProductRows"
          :key="product.id"
          class="rounded-2xl border border-neutral-200/90 bg-linear-to-br from-white to-slate-50 p-4 shadow-xs transition hover:border-primary/30 hover:shadow-sm"
        >
          <template v-if="getSelectedSku(product)">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-neutral-800 truncate">{{ product.name }}</p>
              <p class="text-xs text-neutral-500">{{ getSelectedSku(product)?.label }}</p>
            </div>
            <span class="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {{ getSelectedSku(product)?.unitPrice.toFixed(2) }} €
            </span>
          </div>

          <div class="mt-3">
            <UFormField label="Variante">
              <USelect
                :model-value="selectedSkuByProduct[product.id]"
                :items="product.skus.map((sku) => ({
                  label: `${sku.label} · ${sku.skuCode}`,
                  value: sku.skuId,
                }))"
                @update:model-value="(value) => {
                  if (value) {
                    selectedSkuByProduct[product.id] = value as string;
                  }
                }"
              />
            </UFormField>
          </div>

          <div class="mt-3 text-sm">
            <span
              v-if="getSelectedSku(product)?.trackStock"
              class="rounded-full px-2 py-1 text-xs"
              :class="(getSelectedSku(product)?.stock ?? 0) <= 2 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-neutral-700'"
            >
              Stock: {{ getSelectedSku(product)?.stock }}
            </span>
            <span v-else class="rounded-full bg-slate-100 px-2 py-1 text-xs text-neutral-700">
              Stock non suivi
            </span>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-minus"
              class="h-11 w-11 justify-center rounded-xl"
              @click="adjustQuantity(getSelectedSkuId(product), -1)"
            />

            <input
              :value="getQuantity(getSelectedSkuId(product))"
              type="number"
              min="0"
              inputmode="numeric"
              class="h-11 w-20 rounded-xl border border-neutral-300 bg-white px-3 text-center text-base"
              @input="setQuantity(getSelectedSkuId(product), ($event.target as HTMLInputElement).value)"
            />

            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-plus"
              class="h-11 w-11 justify-center rounded-xl"
              @click="adjustQuantity(getSelectedSkuId(product), 1)"
            />

            <div class="ml-auto text-sm text-neutral-500">
              <span v-if="getQuantity(getSelectedSkuId(product)) > 0" class="font-medium text-primary">
                {{ (getQuantity(getSelectedSkuId(product)) * (getSelectedSku(product)?.unitPrice ?? 0)).toFixed(2) }} €
              </span>
              <span v-else>0.00 €</span>
            </div>
          </div>
          </template>
        </div>

        <div v-if="filteredProductRows.length === 0" class="py-10 text-center text-neutral-500 lg:col-span-2">
          Aucun produit trouvé.
        </div>
      </div>
    </UCard>

    <UCard class="sticky bottom-3 border-primary/20 bg-linear-to-br from-primary/5 to-brand-ice/30 shadow-sm">
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-sm text-neutral-600">
              {{ selectedLineCount }} ligne{{ selectedLineCount > 1 ? 's' : '' }} sélectionnée{{ selectedLineCount > 1 ? 's' : '' }} · {{ selectedQuantityCount }} article{{ selectedQuantityCount > 1 ? 's' : '' }}
            </p>
            <p class="text-2xl font-bold text-primary">Total: {{ total.toFixed(2) }} €</p>
          </div>
          <div class="w-full sm:w-auto">
            <UButton
              :disabled="!canSubmit"
              :loading="saving"
              icon="i-heroicons-check"
              class="w-full sm:w-auto h-11 px-5"
              @click="createManualOrder"
            >
              Créer la commande
            </UButton>
          </div>
        </div>

        <div v-if="selectedItemsPreview.length > 0" class="rounded-2xl border border-primary/20 bg-white/95 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Récapitulatif</p>
          <div class="max-h-44 space-y-1.5 overflow-auto pr-1">
            <div
              v-for="item in selectedItemsPreview"
              :key="item.sku.skuId"
              class="flex items-center justify-between gap-2 text-sm"
            >
              <p class="min-w-0 truncate text-neutral-700">
                {{ item.product.name }}
                <span class="text-neutral-400">({{ item.sku.label }} · {{ item.sku.skuCode }})</span>
              </p>
              <p class="shrink-0 font-medium text-neutral-900">
                {{ item.quantity }} × {{ item.sku.unitPrice.toFixed(2) }} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
