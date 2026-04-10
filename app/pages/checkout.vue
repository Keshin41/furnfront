<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import StripeWrapperClient from "~/components/StripeWrapper.client.vue";
import type { Order } from "~/types/basket";

const stepperItems: StepperItem[] = [
  {
    title: "Informations de facturation",
    slot: "info",
  },
  {
    title: "Paiement",
    slot: "payment",
  },
  {
    title: "Confirmation",
    slot: "confirmation",
  },
];

const query = useRoute().query;

const activeStep = ref<number>(query.payment === "success" ? 2 : 0);
const buyerInfo = ref<Order["user"] | null>(null);

const handleFormSubmit = (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  // Handle form submission logic here
  console.log("Form submitted with data:", event.data);
  buyerInfo.value = event.data as Order["user"]; // Store buyer info for later use
  activeStep.value = 1; // Move to the next step
};
</script>
<template>
  <UContainer class="mt-4">
    <UStepper
      v-model="activeStep"
      :items="stepperItems"
      disabled
      :ui="{
        trigger: 'bg-neutral-200',
      }"
    >
      <template #info>
        <CheckoutForm :on-submit="handleFormSubmit" />
      </template>
      <template #payment>
        <template v-if="!buyerInfo"
          >Please complete the information step first.</template
        >
        <template v-else>
          <StripeWrapperClient
            :order="{
              user: buyerInfo,
              basket: [{ skuId: 'internat-1-sku-draps-oui', quantity: 1 }],
            }"
          />
        </template>
      </template>
      <template #confirmation>
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Merci pour votre commande !</h2>
          <p class="text-lg text-gray-700">
            Votre paiement a été traité avec succès. Nous vous enverrons une
            confirmation par email sous peu.
          </p>
        </div>
      </template>
    </UStepper>
  </UContainer>
</template>
