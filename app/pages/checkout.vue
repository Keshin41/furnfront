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
const { items: cartItems, refreshStock } = useCart();
const toast = useToast();

const activeStep = ref<number | string | undefined>(
  query.payment === "success" ||
    query.payment === "failed" ||
    query.payment === "canceled"
    ? 2
    : 0,
);
const buyerInfo = ref<Order["user"] | null>(null);

const handleFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();

  const stockResult = await refreshStock();
  if (!stockResult.ok) {
    toast.add({
      title: "Stock mis a jour",
      description:
        stockResult.issues[0] ||
        "Le stock a change. Verifie ton panier avant de payer.",
      color: "warning",
    });

    if (!cartItems.value.length) {
      activeStep.value = 0;
      return;
    }
  }

  if (!cartItems.value.length) {
    toast.add({
      title: "Panier vide",
      description: "Ajoute un produit avant de passer au paiement.",
      color: "warning",
    });
    return;
  }

  buyerInfo.value = event.data as Order["user"]; // Store buyer info for later use
  activeStep.value = 1; // Move to the next step
};

const handlePaymentCancel = () => {
  buyerInfo.value = null;
  activeStep.value = 0;
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
            @cancel="handlePaymentCancel"
          />
        </template>
      </template>
      <template #confirmation>
        <template v-if="query.payment_intent_client_secret">
          <StripeConfirm
            :client-secret="query.payment_intent_client_secret.toString()"
            clear-cart-on-success
          />
        </template>
        <template v-else>
          <ConfirmRecap
            :status="query.payment === 'canceled' ? 'canceled' : 'requires_payment_method'"
          />
        </template>
      </template>
    </UStepper>
  </UContainer>
</template>
