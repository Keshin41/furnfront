<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import StripeWrapperClient from "~/components/StripeWrapper.client.vue";
import type { Order } from "~/types/basket";

const stepperItems: StepperItem[] = [
  {
    title: "Informations",
    description: "Enter your information",
    slot: "info",
  },
  {
    title: "Paiement",
    description: "Méthode de paiement",
    slot: "payment",
  },
];

const activeStep = ref<number>(0);
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
    <UStepper v-model="activeStep" :items="stepperItems" disabled>
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
              user: buyerInfo.value,
              basket: [{ skuId: 'internat-1-sku-draps-oui', quantity: 1 }],
            }"
          />
        </template>
      </template>
    </UStepper>
  </UContainer>
</template>
