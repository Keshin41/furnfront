<script setup lang="ts">
import z from "zod";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  basePrice: z.number().min(1, "Le prix de base est requis"),
  category: z.string().optional(),
  virtual: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
  basePrice: 0,
  category: "",
  virtual: false,
});

const handleSubmit = () => {
  useAPI("/product", {
    method: "POST",
    body: schema.parse(state),
  })
    .then(() => {
      navigateTo(`/admin/product/`);
    })
    .catch((err) => {
      console.error("Failed to create product", err);
      alert("Une erreur est survenue lors de la création du produit.");
    });
};
</script>

<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary col-span-2">
      Nouveau produit
    </h1>

    <div>
      <h2 class="text-xl font-semibold mb-2 text-primary">
        Informations générales
      </h2>

      <UForm :schema="schema" :state="state" @submit="handleSubmit">
        <UFormField label="Nom" name="name">
          <UInput v-model="state.name" placeholder="Entrez le nom du produit" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Entrez la description du produit"
          />
        </UFormField>

        <UFormField label="Prix de base" name="basePrice">
          <UInput
            v-model="state.basePrice"
            placeholder="Entrez le prix de base du produit"
            type="number"
            min="0"
            step="0.01"
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

        <UButton class="mt-4" type="submit" label="Créer le produit" />
      </UForm>
    </div>
  </div>
</template>
