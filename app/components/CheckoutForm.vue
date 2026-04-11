<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
}>();

const cart = useCart();

// For demo purposes, we can add a test item to the cart when the component is mounted
if (import.meta.dev && cart.items.value.length === 0) {
  cart.addItem({
    skuId: "internat-1-sku-draps-oui",
    productName: "Draps Oui",
    price: 30,
    productId: "internat-1-product-draps-oui",
    skuCode: "DRAPS-OUI",
    variantLabel: "Standard",
    imageUrl: null,
  })
}

const schema = z.object({
  lastname: z.string().min(1, "Le nom est requis"),
  firstname: z.string().min(1, "Le prénom est requis"),
  nickname: z.string().min(1, "Le pseudo est requis"),
  email: z.email("Adresse email invalide"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit comporter 5 chiffres"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>(
  // For development, we can pre-fill the form with test data. In production, it will be empty.
  import.meta.dev
    ? {
        lastname: "Doe",
        firstname: "John",
        nickname: "johndoe",
        email: "example@example.com",
        address: "rue Gabriel Dejean",
        city: "Saint-Pierre",
        postalCode: "97410",
      }
    : {
        lastname: "",
        firstname: "",
        nickname: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
      },
);

</script>
<template>
  <section
    class="mx-auto w-full max-w-3xl rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm backdrop-blur md:p-8"
  >
    <div class="mb-6 space-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Checkout
      </p>
      <h2 class="text-2xl font-bold text-neutral-900">Informations de facturation</h2>
      <p class="text-sm text-neutral-600">
        Renseignez vos coordonnées pour passer au paiement.
      </p>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      :ui="{
        base: 'grid grid-cols-1 gap-4 md:grid-cols-2',
      }"
      @submit="onSubmit"
    >
      <UFormField label="Prénom" name="firstname" class="w-full">
      <UInput
        v-model="state.firstname"
        type="text"
        size="lg"
        class="w-full"
        placeholder="Entrez votre prénom"
      />
    </UFormField>
      <UFormField label="Nom" name="lastname" class="w-full">
      <UInput
        v-model="state.lastname"
        type="text"
        size="lg"
        class="w-full"
        placeholder="Entrez votre nom"
      />
    </UFormField>
      <UFormField label="Email" name="email" class="w-full md:col-span-2">
      <UInput
        v-model="state.email"
        type="email"
        size="lg"
        class="w-full"
        placeholder="Entrez votre adresse email"
      />
    </UFormField>
      <UFormField label="Pseudo" name="nickname" class="w-full">
      <UInput
        v-model="state.nickname"
        type="text"
        size="lg"
        class="w-full"
        placeholder="Entrez votre pseudo"
      />
    </UFormField>
      <UFormField label="Adresse" name="address" class="w-full md:col-span-2">
      <UInput
        v-model="state.address"
        type="text"
        size="lg"
        class="w-full"
        placeholder="Entrez votre adresse"
      />
    </UFormField>
      <UFormField label="Ville" name="city" class="w-full">
      <UInput
        v-model="state.city"
        type="text"
        size="lg"
        class="w-full"
        placeholder="Entrez votre ville"
      />
    </UFormField>
      <UFormField
        label="Code postal"
        name="postalCode"
        class="w-full"
        help="5 chiffres"
      >
      <UInput
        v-model="state.postalCode"
        type="text"
        maxlength="5"
        size="lg"
        class="w-full"
        placeholder="Entrez votre code postal"
      />
    </UFormField>

      <div class="mt-2 flex w-full flex-col gap-3 md:col-span-2 md:flex-row">
        <UButton type="submit" color="primary" size="lg" block class="md:flex-1">
          Passer au paiement
        </UButton>
      </div>
    </UForm>
  </section>
</template>
