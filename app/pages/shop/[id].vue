<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CustomButton from "~/components/CustomButton.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Product } from "~/types/product";

const route = useRoute();
const id = route.params.id as string;

const { data, error, pending } = await useAPI<Product | null>(`/product/${id}`);

const product = computed(() => data.value);
const loading = computed(() => pending.value);
const selectedOptions = ref<Record<string, string>>({});

watch(
  product,
  (value) => {
    if (!value) {
      selectedOptions.value = {};
      return;
    }

    selectedOptions.value = Object.fromEntries(
      value.optionTypes.map((optionType) => [
        optionType.id,
        optionType.optionValues[0]?.id ?? "",
      ]),
    );
  },
  { immediate: true },
);

const selectedSku = computed(() => {
  if (!product.value) {
    return null;
  }

  if (!product.value.optionTypes.length) {
    return product.value.skus[0] ?? null;
  }

  return (
    product.value.skus.find((sku) =>
      product.value?.optionTypes.every((optionType) => {
        const selectedValueId = selectedOptions.value[optionType.id];
        return sku.options.some(
          (option) => option.optionValue.id === selectedValueId,
        );
      }),
    ) ?? null
  );
});

const selectedImageUrl = computed(
  () => selectedSku.value?.imageUrl || product.value?.imageUrl || null,
);

const selectedPrice = computed(() => {
  if (!product.value) {
    return "0.00";
  }

  return Number(
    selectedSku.value?.priceOverride ?? product.value.basePrice,
  ).toFixed(2);
});

const selectedOptionSummary = computed(() => {
  if (!selectedSku.value) {
    return "";
  }

  return selectedSku.value.options
    .map((option) => option.optionValue.value)
    .join(" / ");
});

const selectOptionValue = (optionTypeId: string, optionValueId: string) => {
  selectedOptions.value = {
    ...selectedOptions.value,
    [optionTypeId]: optionValueId,
  };
};

const { addItem } = useCart();
const addedToCart = ref(false);

watch(selectedSku, () => {
  addedToCart.value = false;
});

function handleAddToCart() {
  if (!selectedSku.value || !product.value) return;

  addItem({
    skuId: selectedSku.value.id,
    skuCode: selectedSku.value.skuCode,
    productId: product.value.id,
    productName: product.value.name,
    variantLabel: selectedOptionSummary.value,
    price: Number(selectedSku.value.priceOverride ?? product.value.basePrice),
    imageUrl: selectedSku.value.imageUrl ?? product.value.imageUrl ?? null,
  });

  addedToCart.value = true;
  setTimeout(() => {
    addedToCart.value = false;
  }, 2000);
}
</script>

<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <main class="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div class="mb-8 flex items-center gap-4">
        <CustomButton
          label="← Retour au shop"
          size="sm"
          bgClass="bg-slate-200"
          textClass="text-slate-800"
          @click="$router.back()"
        />
      </div>

      <div v-if="loading" class="py-24 text-center text-slate-400">
        Chargement...
      </div>
      <div v-else-if="error" class="py-24 text-center text-red-500">
        Erreur : {{ error.message || error }}
      </div>
      <div v-else-if="!product" class="py-24 text-center text-slate-500">
        Produit introuvable
      </div>
      <div v-else class="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div
          class="flex rounded-3xl border border-slate-100 bg-slate-50 items-center justify-center p-6 min-h-80"
        >
          <ImageWithFallback
            :src="selectedImageUrl"
            :alt="product.name"
            class="max-w-full object-contain"
          />
        </div>

        <div>
          <h1 class="text-3xl font-bold text-brand-dark-blue">
            {{ product.name }}
          </h1>
          <p class="mt-3 text-slate-600">
            {{ product.description || "Aucune description." }}
          </p>

          <div
            class="mt-5 flex items-center gap-3 text-2xl font-bold text-brand-blue"
          >
            Prix : {{ selectedPrice }} €
          </div>

          <div v-if="product.optionTypes.length" class="mt-6 space-y-5">
            <div v-for="optionType in product.optionTypes" :key="optionType.id">
              <div class="mb-2 flex items-center justify-between gap-3">
                <h2
                  class="text-sm font-semibold uppercase tracking-wide text-slate-500"
                >
                  {{ optionType.name }}
                </h2>
                <span class="text-sm text-slate-500">
                  {{
                    optionType.optionValues.find(
                      (value) => value.id === selectedOptions[optionType.id],
                    )?.value
                  }}
                </span>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="optionValue in optionType.optionValues"
                  :key="optionValue.id"
                  type="button"
                  class="rounded-full border px-4 py-2 text-sm font-medium transition"
                  :class="
                    selectedOptions[optionType.id] === optionValue.id
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  "
                  @click="selectOptionValue(optionType.id, optionValue.id)"
                >
                  {{ optionValue.value }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div v-if="selectedSku" class="space-y-2">
              <div
                v-if="selectedOptionSummary"
                class="flex items-center justify-between gap-3"
              >
                <span class="text-sm font-medium text-slate-500">Variante</span>
                <span class="text-right text-slate-900">{{
                  selectedOptionSummary
                }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-500">Stock</span>
                <span class="text-slate-900">
                  {{
                    selectedSku.trackStock
                      ? `${selectedSku.stock} disponible(s)`
                      : "Stock non suivi"
                  }}
                </span>
              </div>
            </div>
            <p v-else class="text-sm text-red-500">
              Cette combinaison n'est pas disponible.
            </p>
          </div>

          <div class="mt-5">
            <button
              type="button"
              :disabled="!selectedSku || addedToCart"
              class="w-full rounded-full py-3 text-base font-semibold transition"
              :class="
                addedToCart
                  ? 'bg-green-500 text-white cursor-default'
                  : selectedSku
                    ? 'bg-brand-blue text-white hover:brightness-110'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              "
              @click="handleAddToCart"
            >
              {{ addedToCart ? "✓ Ajouté au panier" : "Ajouter au panier" }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>