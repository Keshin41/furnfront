<script setup lang="ts">
import z from "zod";
import type { Product, ProductSku } from "~/types/product";
import ImageWithFallback from "~/components/ImageWithFallback.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;
const { data, error, pending, refresh } = await useAPI<Product>(
  `/product/${id}`,
);

// ── SKU inline edit state ─────────────────────────────────────

const skuSchema = z.object({
  skuCode: z.string().min(1, "Le code SKU est requis"),
  priceOverride: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "Le stock doit être positif"),
  trackStock: z.boolean(),
  imageUrl: z.string().optional(),
});

type SkuState = z.output<typeof skuSchema>;

// Map of skuId → editable state (only populated when row is being edited)
const editingSkuId = ref<string | null>(null);
const editingSkuState = reactive<SkuState>({
  skuCode: "",
  priceOverride: undefined,
  stock: 0,
  trackStock: true,
  imageUrl: "",
});

const uploadingSkuImage = ref(false);

const handleSkuImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  uploadingSkuImage.value = true;
  try {
    const { $api } = useNuxtApp();
    const result = await $api<{ url: string }>("/sku/upload-image", {
      method: "POST",
      body: formData,
    });
    editingSkuState.imageUrl = result.url;
  } catch (err) {
    console.error("Failed to upload SKU image", err);
    alert("Une erreur est survenue lors de l'upload de l'image.");
  } finally {
    uploadingSkuImage.value = false;
    input.value = "";
  }
};

const startEditSku = (sku: ProductSku) => {
  editingSkuId.value = sku.id;
  editingSkuState.skuCode = sku.skuCode;
  editingSkuState.priceOverride =
    Number.parseFloat(sku.priceOverride ?? "") || undefined;
  editingSkuState.stock = sku.stock;
  editingSkuState.trackStock = sku.trackStock;
  editingSkuState.imageUrl = sku.imageUrl ?? "";
};

const cancelEditSku = () => {
  editingSkuId.value = null;
};

const saveSku = async (skuId: string) => {
  const parsed = skuSchema.safeParse(editingSkuState);
  console.log("🚀 ~ saveSku ~ parsed:", parsed);
  if (!parsed.success) {
    return;
  }
  await useAPI(`/sku/${skuId}`, {
    method: "PUT",
    body: {
      skuCode: parsed.data.skuCode,
      priceOverride: parsed.data.priceOverride,
      stock: parsed.data.stock,
      trackStock: parsed.data.trackStock,
      imageUrl: parsed.data.imageUrl,
    },
  }).catch((err) => {
    console.error("Failed to update SKU", err);
    alert("Une erreur est survenue lors de la mise à jour du SKU.");
  });
  editingSkuId.value = null;
  await refresh();
};

// ── SKU helpers ───────────────────────────────────────────────

const skuLabel = (sku: ProductSku) =>
  sku.options
    ?.map((o) => o.optionValue?.value)
    .filter(Boolean)
    .join(" / ") || sku.skuCode;

const effectivePrice = (sku: ProductSku, product: Product) =>
  sku.priceOverride ?? product.basePrice;
</script>

<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary">SKUs du produit</h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <p class="text-sm text-gray-500 mb-4">
        Prix de base du produit :
        <span class="font-medium text-primary">{{ data.basePrice }} €</span>
        — laisser le champ "Prix" vide pour utiliser le prix de base.
      </p>

      <!-- SKU rows -->
      <div
        v-for="sku in data.skus"
        :key="sku.id"
        class="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <!-- SKU header: code + variant labels -->
        <div class="flex items-start justify-between mb-1">
          <div>
            <span class="font-semibold text-primary">{{ skuLabel(sku) }}</span>
            <span class="ml-2 text-xs text-gray-400 font-mono">{{
              sku.skuCode
            }}</span>
          </div>
          <div class="flex gap-2">
            <template v-if="editingSkuId === sku.id">
              <UButton size="sm" label="Enregistrer" @click="saveSku(sku.id)" />
              <UButton
                size="sm"
                variant="ghost"
                label="Annuler"
                @click="cancelEditSku"
              />
            </template>
            <UButton
              v-else
              size="sm"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="startEditSku(sku)"
            />
          </div>
        </div>

        <!-- View mode -->
        <template v-if="editingSkuId !== sku.id">
          <div class="flex gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>
              Prix :
              <span class="font-medium text-primary">
                {{ effectivePrice(sku, data) }} €
              </span>
              <span v-if="sku.priceOverride" class="text-xs text-gray-400 ml-1"
                >(override)</span
              >
            </span>
            <span>
              Stock :
              <span class="font-medium text-primary">{{ sku.stock }}</span>
            </span>
            <span>
              Image :
              <UBadge
                :color="sku.imageUrl ? 'success' : 'neutral'"
                variant="soft"
              >
                {{ sku.imageUrl ? "Oui" : "Non" }}
              </UBadge>
            </span>
            <span>
              Suivi stock :
              <UBadge
                :color="sku.trackStock ? 'success' : 'neutral'"
                variant="soft"
              >
                {{ sku.trackStock ? "Oui" : "Non" }}
              </UBadge>
            </span>
          </div>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <UForm :schema="skuSchema" :state="editingSkuState">
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-3">
              <UFormField label="Code SKU" name="skuCode">
                <UInput
                  v-model="editingSkuState.skuCode"
                  placeholder="Ex : PROD-RED-M"
                  class="font-mono"
                />
              </UFormField>

              <UFormField label="Prix (override)" name="priceOverride">
                <UInput
                  v-model="editingSkuState.priceOverride"
                  placeholder="Laisser vide = prix de base"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </UFormField>

              <UFormField label="Stock" name="stock">
                <UInput
                  v-model="editingSkuState.stock"
                  type="number"
                  min="0"
                  step="1"
                />
              </UFormField>

              <UFormField label="Suivi du stock" name="trackStock">
                <div class="flex items-center h-full pt-1">
                  <USwitch v-model="editingSkuState.trackStock" />
                </div>
              </UFormField>

              <UFormField label="Image (URL)" name="imageUrl" class="sm:col-span-2">
                <UInput
                  v-model="editingSkuState.imageUrl"
                  placeholder="https://..."
                />
              </UFormField>

              <UFormField label="Importer une image locale" class="sm:col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  :disabled="uploadingSkuImage"
                  class="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  @change="handleSkuImageUpload"
                />
                <p v-if="uploadingSkuImage" class="mt-1 text-xs text-neutral-500">
                  Upload en cours...
                </p>
              </UFormField>
            </div>

            <div v-if="editingSkuState.imageUrl" class="mt-3">
              <ImageWithFallback
                :src="editingSkuState.imageUrl"
                :alt="skuLabel(sku)"
                class="h-24 w-24 rounded-lg border border-neutral-200 object-cover"
              />
            </div>
          </UForm>
        </template>
      </div>

      <p v-if="!data.skus?.length" class="text-gray-500 text-sm">
        Aucun SKU trouvé pour ce produit.
      </p>
    </div>
  </div>
</template>
