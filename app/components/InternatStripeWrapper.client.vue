<script setup lang="ts">
import type { Stripe, StripeElements } from "@vue-stripe/vue-stripe";
import {
  VueStripeElements,
  VueStripePaymentElement,
  VueStripeProvider,
} from "@vue-stripe/vue-stripe";
import type { Order } from "~/types/basket";

const config = useRuntimeConfig();
const publishableKey = config.public.stripePublishableKey;
const toast = useToast();

const props = defineProps<{
  basket: {name: string, unitPrice: string, quantity: number}[];
  paymentIntent: string;
}>();
console.log("🚀 ~ order:", props.basket);

const stripeInstance = ref<Stripe | null>(null);
const elementsInstance = ref<StripeElements | null>(null);

const onStripeLoad = (stripe: Stripe) => {
  stripeInstance.value = stripe;
};

const onElementsReady = (elements: StripeElements) => {
  elementsInstance.value = elements;
};

const handleSubmit = async () => {
  if (!stripeInstance.value || !elementsInstance.value) {
    console.error("Stripe.js has not loaded yet.");
    toast.add({
      title: "Erreur",
      description:
        "Le formulaire de paiement n'est pas encore prêt. Veuillez réessayer dans un instant.",
      type: "foreground",
    });
    return;
  }

  const { error } = await stripeInstance.value.confirmPayment({
    elements: elementsInstance.value,
    confirmParams: {
      return_url: `${globalThis.location.origin}${globalThis.location.pathname}?payment=success`,
    },
  });

  if (error) {
    console.error("Payment failed:", error);
    toast.add({
      title: "Erreur de paiement",
      description:
        error.message || "Une erreur s'est produite lors du paiement.",
      type: "foreground",
    });
  }
};
</script>

<template>
  <ClientOnly>
    <VueStripeProvider :publishable-key="publishableKey" @load="onStripeLoad">
      <VueStripeElements
        :client-secret="paymentIntent"
        @ready="onElementsReady"
      >
        <UForm class="flex flex-col gap-6 mb-12" @submit.prevent="handleSubmit">
          <div class="grid gap-6 lg:grid-cols-2">
            <VueStripePaymentElement />
            <InternatRecap @submit="handleSubmit" :basket="basket" />
          </div>
        </UForm>
      </VueStripeElements>
    </VueStripeProvider>
  </ClientOnly>
</template>
