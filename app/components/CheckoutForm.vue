<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
}>();

const cart = useCart();

const schema = z.object({
  lastname: z.string().min(1, "Lastname is required"),
  firstname: z.string().min(1, "Firstname is required"),
  nickname: z.string().min(1, "Nickname is required"),
  email: z.email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(5, "Postal code must be at most 5 characters"),
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
    <UFormField label="Firstname" name="firstname">
      <UInput
        v-model="state.firstname"
        type="text"
        placeholder="Enter your firstname"
      />
    </UFormField>
    <UFormField label="Lastname" name="lastname">
      <UInput
        v-model="state.lastname"
        type="text"
        placeholder="Enter your lastname"
      />
    </UFormField>
    <UFormField label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="Enter your email"
      />
    </UFormField>
    <UFormField label="Nickname" name="nickname">
      <UInput
        v-model="state.nickname"
        type="text"
        placeholder="Enter your nickname"
      />
    </UFormField>
    <UFormField label="Address" name="address">
      <UInput
        v-model="state.address"
        type="text"
        placeholder="Enter your address"
      />
    </UFormField>
    <UFormField label="City" name="city">
      <UInput v-model="state.city" type="text" placeholder="Enter your city" />
    </UFormField>
    <UFormField label="Postal Code" name="postalCode">
      <UInput
        v-model="state.postalCode"
        type="text"
        placeholder="Enter your postal code"
      />
    </UFormField>
    <UButton type="submit" color="primary" class="col-span-2"> Submit </UButton>
    <UButton color="primary" class="col-span-2" @click="handleClick">
      Ajouter un drap au panier (demo)
    </UButton>
  </UForm>
</template>
