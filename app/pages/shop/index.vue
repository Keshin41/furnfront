<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <main class="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <section class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-brand-dark-blue">
          Boutique Fur'N'Tours
        </h1>
        <p class="mt-3 text-gray-600">
          Découvrez nos produits officiels et nos goodies pour soutenir
          l’association.
        </p>
      </section>

      <section>
        <div v-if="isLoading" class="text-center py-24 text-slate-400">
          Chargement des produits...
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-24">
          Erreur lors du chargement des produits : {{ error.message || error }}
        </div>

        <div v-else>
          <div
            v-if="products.length === 0"
            class="text-center text-slate-500 py-16"
          >
            Aucun produit disponible pour le moment.
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="product in products"
              :key="product.id"
              class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                class="flex h-48 items-center justify-center bg-slate-50 p-4"
              >
                <ImageWithFallback
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="max-h-full max-w-full object-contain"
                />
              </div>

              <div class="p-4">
                <h2 class="text-xl font-semibold text-brand-dark-blue">
                  {{ product.name }}
                </h2>
                <p class="mt-2 text-sm text-slate-500 truncate">
                  {{ product.description || "Aucune description disponible." }}
                </p>

                <div class="mt-4 flex items-center justify-between">
                  <span class="text-lg font-bold text-brand-blue">
                    {{ displayMinPrice(product) }} €
                  </span>
                  <CustomButton
                    size="sm"
                    label="Voir le produit"
                    bgClass="bg-brand-blue"
                    textClass="text-white"
                    @click="goProduct(product.id)"
                  />
                </div>

                <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span
                    v-if="product.category"
                    class="px-2 py-1 bg-slate-100 rounded-full"
                    >{{ product.category }}</span
                  >
                  <span
                    v-if="product.virtual"
                    class="px-2 py-1 bg-green-100 text-green-700 rounded-full"
                    >Produit virtuel</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CustomButton from "~/components/CustomButton.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Product } from "~/types/product";

const { data, error, pending } = await useAPI<Product[]>(
  "/product?virtual=false",
);

const products = computed(() => data.value ?? []);
const isLoading = computed(() => pending.value);

const displayMinPrice = (product: Product): string => {
  const skuPrices = product.skus.map((sku) =>
    Number(sku.priceOverride ?? product.basePrice),
  );
  if (!skuPrices.length) return Number(product.basePrice).toFixed(2);
  return Math.min(...skuPrices).toFixed(2);
};

const router = useRouter();
const goProduct = (id: string) => router.push(`/shop/${id}`);
</script>
