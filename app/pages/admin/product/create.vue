<script setup lang="ts">
import z from "zod";
import ImageWithFallback from "~/components/ImageWithFallback.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  basePrice: z.number().min(1, "Le prix de base est requis"),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  virtual: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
  basePrice: 0,
  category: "",
  imageUrl: "",
  virtual: false,
});

const uploadingImage = ref(false);

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  uploadingImage.value = true;
  try {
    const { $api } = useNuxtApp();
    const result = await $api<{ url: string }>("/product/upload-image", {
      method: "POST",
      body: formData,
    });
    state.imageUrl = result.url;
  } catch (err) {
    console.error("Failed to upload product image", err);
    alert("Une erreur est survenue lors de l'upload de l'image.");
  } finally {
    uploadingImage.value = false;
    input.value = "";
  }
};

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

        <UFormField label="Image (URL)" name="imageUrl">
          <UInput
            v-model="state.imageUrl"
            placeholder="https://..."
          />
        </UFormField>

        <UFormField label="Importer une image locale">
          <input
            type="file"
            accept="image/*"
            :disabled="uploadingImage"
            class="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            @change="handleImageUpload"
          />
          <p v-if="uploadingImage" class="mt-1 text-xs text-neutral-500">
            Upload en cours...
          </p>
        </UFormField>

        <div v-if="state.imageUrl" class="my-2">
          <ImageWithFallback
            :src="state.imageUrl"
            :alt="state.name || 'Aperçu image produit'"
            class="h-28 w-28 rounded-lg border border-neutral-200 object-cover"
          />
        </div>

        <UFormField label="Produit virtuel" name="virtual">
          <USwitch v-model="state.virtual" />
        </UFormField>

        <UButton class="mt-4" type="submit" label="Créer le produit" />
      </UForm>
    </div>
  </div>
</template>
