<script setup lang="ts">
import type { Stripe, StripeElements } from "@vue-stripe/vue-stripe";
import {
  VueStripeElements,
  VueStripePaymentElement,
  VueStripeProvider,
} from "@vue-stripe/vue-stripe";

const config = useRuntimeConfig();
const publishableKey = config.public.stripePublishableKey;
const toast = useToast();

const props = defineProps<{
  basket: { name: string; unitPrice: string; quantity: number }[];
  paymentIntent: string;
  cancelToken: string;
}>();

const emit = defineEmits<{ cancel: [] }>();

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

    if (error.payment_intent?.object === "payment_intent" && error.payment_intent?.status === "canceled") 
    {
      window.location.href = `${globalThis.location.origin}${globalThis.location.pathname}?payment=canceled`;
    }
  }
};

const isCancelling = ref(false);

const handleCancel = async () => {
  const paymentIntentId = props.paymentIntent.split("_secret")[0];
  isCancelling.value = true;
  const { $api } = useNuxtApp();
  try {
    await ($api as typeof $fetch)(`/internat/checkout/${paymentIntentId}`, {
      method: "DELETE",
      headers: {
        "x-cancel-token": props.cancelToken,
      },
    });
  } catch {
    // Best-effort: even if the call fails (already cancelled, network…), reset UI
  } finally {
    isCancelling.value = false;
    emit("cancel");
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
            <InternatRecap :basket="basket" @submit="handleSubmit" @cancel="handleCancel" />
          </div>
        </UForm>
      </VueStripeElements>
    </VueStripeProvider>
  </ClientOnly>
</template>
