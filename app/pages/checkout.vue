<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import StripeWrapperClient from "~/components/StripeWrapper.client.vue";
import { useCart } from "~/composables/useCart";
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
const { items: cartItems } = useCart();

const activeStep = ref<number | string | undefined>(
  query.payment === "confirmation" || query.payment === "failed" ? 2 : 0,
);
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
          >Merci de compléter d'abord l'étape des informations.</template
        >
        <template v-else>
          <StripeWrapperClient
            :order="{
              user: buyerInfo,
              basket: cartItems.map((item) => ({
                skuId: item.skuId,
                quantity: item.quantity,
              })),
            }"
          />
        </template>
      </template>
      <template #confirmation>
        <template v-if="query.payment_intent_client_secret">
          <StripeConfirm
            :client-secret="query.payment_intent_client_secret.toString()"
          />
        </template>
      </template>
    </UStepper>
  </UContainer>
</template>
