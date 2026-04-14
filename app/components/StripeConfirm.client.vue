<script setup lang="ts">
import type { Stripe } from "@vue-stripe/vue-stripe";
import { VueStripeProvider } from "@vue-stripe/vue-stripe";

const config = useRuntimeConfig();
const publishableKey = config.public.stripePublishableKey;
const toast = useToast();
const cart = useCart();

const { clientSecret } = defineProps<{
  clientSecret: string;
}>();

const stripeInstance = ref<Stripe | null>(null);
const status = ref<string>("loading");

const onStripeLoad = (stripe: Stripe) => {
  stripeInstance.value = stripe;
  stripe
    .retrievePaymentIntent(clientSecret)
    .then(({ paymentIntent, error }) => {
      if (error) {
        console.error("Error retrieving payment intent:", error);
        toast.add({
          title: "Erreur",
          description:
            error.message ||
            "Une erreur s'est produite lors de la récupération du paiement.",
          type: "foreground",
        });
        status.value = "error";
      } else if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            status.value = "success";
            cart.clearCart();
            break;
          case "processing":
            status.value = "processing";
            cart.clearCart();
            break;
          case "requires_payment_method":
            status.value = "requires_payment_method";
            break;
          default:
            status.value = "unknown";
            break;
        }
      }
    });
};
</script>
<template>
  <ClientOnly>
    <VueStripeProvider :publishable-key="publishableKey" @load="onStripeLoad">
      <div v-if="status === 'loading'">Vérification du paiement...</div>
      <ConfirmRecap v-else :status="status" />
    </VueStripeProvider>
  </ClientOnly>
</template>
