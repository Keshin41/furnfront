<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
}>();

const cart = useCart();

const schema = z.object({
  lastname: z.string().min(1, "Le nom est requis"),
  firstname: z.string().min(1, "Le prénom est requis"),
  nickname: z.string().min(1, "Le pseudo est requis"),
  email: z.email("Adresse email invalide"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z
    .string()
    .min(5, "Le code postal est requis")
    .max(5, "Le code postal doit comporter au plus 5 caractères"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  lastname: "",
  firstname: "",
  nickname: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
});

const handleClick = () => {
  // This function is just for demonstration and can be removed
  cart.addItem({
    skuId: "internat-1-sku-draps-oui",
    productName: "Draps Oui",
    price: 29.99,
    productId: "internat-1-product-draps-oui",
    skuCode: "DRAPS-OUI",
    variantLabel: "Standard",
    imageUrl: null,
  });
};
</script>
<template>
  <UForm
    :schema="schema"
    :state="state"
    :ui="{
      base: 'grid grid-cols-2 gap-4 mx-auto max-w-2xl justify-items-center',
    }"
    @submit="onSubmit"
  >
    <UFormField label="Prénom" name="firstname">
      <UInput
        v-model="state.firstname"
        type="text"
        placeholder="Entrez votre prénom"
      />
    </UFormField>
    <UFormField label="Nom" name="lastname">
      <UInput
        v-model="state.lastname"
        type="text"
        placeholder="Entrez votre nom"
      />
    </UFormField>
    <UFormField label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="Entrez votre adresse email"
      />
    </UFormField>
    <UFormField label="Pseudo" name="nickname">
      <UInput
        v-model="state.nickname"
        type="text"
        placeholder="Entrez votre pseudo"
      />
    </UFormField>
    <UFormField label="Adresse" name="address">
      <UInput
        v-model="state.address"
        type="text"
        placeholder="Entrez votre adresse"
      />
    </UFormField>
    <UFormField label="Ville" name="city">
      <UInput
        v-model="state.city"
        type="text"
        placeholder="Entrez votre ville"
      />
    </UFormField>
    <UFormField label="Code postal" name="postalCode">
      <UInput
        v-model="state.postalCode"
        type="text"
        placeholder="Entrez votre code postal"
      />
    </UFormField>
    <UButton type="submit" color="primary" class="col-span-2">
      Passer au paiement
    </UButton>
    <UButton color="primary" class="col-span-2" @click="handleClick">
      Ajouter un drap au panier (demo)
    </UButton>
  </UForm>
</template>
