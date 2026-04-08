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
  order: Order;
}>();
console.log("🚀 ~ order:", props.order);

const stripeInstance = ref<Stripe | null>(null);
const elementsInstance = ref<StripeElements | null>(null);

const onStripeLoad = (stripe: Stripe) => {
  stripeInstance.value = stripe;
};

const onElementsReady = (elements: StripeElements) => {
  elementsInstance.value = elements;
};

const { data, status } = useAPI<string>("/payment/create-payment-intent", {
  method: "POST",
  body: JSON.stringify(props.order),
});

const handleSubmit = async () => {
  if (!stripeInstance.value || !elementsInstance.value) {
    console.error("Stripe.js has not loaded yet.");
    toast.add({
      title: "Error",
      description: "Payment form is not ready. Please try again later.",
      type: "foreground",
    });
    return;
  }

  const { error } = await stripeInstance.value.confirmPayment({
    elements: elementsInstance.value,
    confirmParams: {
      return_url: window.location.href,
    },
  });

  if (error) {
    console.error("Payment failed:", error);
    toast.add({
      title: "Payment Failed",
      description: error.message || "An error occurred during payment.",
      type: "foreground",
    });
  }
};
</script>

<template>
  <ClientOnly>
    <VueStripeProvider :publishable-key="publishableKey" @load="onStripeLoad">
      <VueStripeElements
        v-if="status === 'success'"
        :client-secret="data"
        @ready="onElementsReady"
      >
        <UForm class="grid grid-cols-2 gap-8" @submit.prevent="handleSubmit">
          <VueStripePaymentElement />
          <PaymentRecap />
          <UButton type="submit" class="col-span-2 justify-self-center"
            >Pay</UButton
          >
        </UForm>
      </VueStripeElements>
      <div v-else-if="status === 'pending'">Loading...</div>
      <div v-else-if="status === 'error'">Error loading payment form.</div>
    </VueStripeProvider>
  </ClientOnly>
</template>
