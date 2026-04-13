<script setup lang="ts">
import z from "zod";
import type { Product } from "~/types/product";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;

const { data, error, pending } = await useAPI<Product>(`/product/${id}`);

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  basePrice: z.string().min(0, "Le prix de base doit être un nombre positif"),
  category: z.string().optional(),
  virtual: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: data.value?.name ?? "",
  description: data.value?.description ?? "",
  basePrice: data.value?.basePrice ?? "0",
  category: data.value?.category ?? "",
  virtual: data.value?.virtual ?? false,
});

const handleSubmit = () => {
  useAPI(`/product/${id}`, {
    method: "PUT",
    body: schema.parse(state),
  })
    .then(() => {
      navigateTo("/admin/product");
    })
    .catch((err) => {
      console.error("Failed to update product", err);
      alert("Une erreur est survenue lors de la mise à jour du produit.");
    });
};
</script>
<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary col-span-2">
      Détails du produit
    </h1>
    <div>
      <h2 class="text-xl font-semibold mb-2 text-primary">
        Informations générales
      </h2>
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="data">
        <UForm :schema="schema" :state="state" @submit="handleSubmit">
          <UFormField label="Nom" name="name">
            <UInput
              v-model="state.name"
              placeholder="Entrez le nom du produit"
            />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea
              v-model="state.description"
              placeholder="Entrez la description du meet"
            />
          </UFormField>
          <UFormField label="Prix de base" name="basePrice">
            <UInput
              v-model="state.basePrice"
              placeholder="Entrez le prix de base du produit"
            />
          </UFormField>
          <UFormField label="Catégorie" name="category">
            <UInput
              v-model="state.category"
              placeholder="Entrez la catégorie du produit"
            />
          </UFormField>
          <UFormField label="Produit virtuel" name="virtual">
            <USwitch v-model="state.virtual" />
          </UFormField>

          <UButton
            class="mt-4"
            type="submit"
            label="Enregistrer les modifications"
          />
        </UForm>
      </div>
    </div>
  </div>
</template>
