<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <AppHeader />
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

      <div v-if="loading" class="text-center text-slate-400 py-24">Chargement...</div>
      <div v-else-if="error" class="text-center text-red-500 py-24">Erreur : {{ error.message || error }}</div>
      <div v-else-if="!product" class="text-center text-slate-500 py-24">Produit introuvable</div>
      <div v-else class="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div class="rounded-3xl border border-slate-100 overflow-hidden">
          <ImageWithFallback
            :src="product.imageUrl"
            :alt="product.name"
            class="h-80 w-full object-cover"
          />
        </div>

        <div>
          <h1 class="text-3xl font-bold text-brand-dark-blue">{{ product.name }}</h1>
          <p class="mt-3 text-slate-600">{{ product.description || 'Aucune description.' }}</p>

          <div class="mt-5 flex items-center gap-3 text-2xl font-bold text-brand-blue">
            Prix : {{ Number(product.basePrice).toFixed(2) }} €
          </div>

          <div class="mt-5">
            <h2 class="text-xl font-semibold mb-2">Skus</h2>
            <div class="space-y-2">
              <div
                v-for="sku in product.skus"
                :key="sku.id"
                class="rounded-xl border border-slate-200 p-3"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-medium">{{ sku.skuCode }}</span>
                  <span class="text-sm text-slate-500">Stock: {{ sku.stock }}</span>
                </div>
                <div class="text-sm mt-1">
                  Prix: {{ Number(sku.priceOverride ?? product.basePrice).toFixed(2) }} €
                </div>
              </div>
            </div>
          </div>

          <div v-if="product.optionTypes.length" class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Options</h2>
            <div class="space-y-3">
              <div v-for="opt in product.optionTypes" :key="opt.id">
                <p class="font-medium">{{ opt.name }}</p>
                <ul class="list-disc list-inside text-sm text-slate-600">
                  <li v-for="value in opt.optionValues" :key="value.id">{{ value.value }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import CustomButton from '~/components/CustomButton.vue';
import ImageWithFallback from '~/components/ImageWithFallback.vue';
import type { Product } from '~/types/product';

const route = useRoute();
const id = route.params.id as string;

const { data, error, pending } = await useAPI<Product | null>(`/product/${id}`);

const product = computed(() => data.value);
const loading = computed(() => pending.value);
</script>
