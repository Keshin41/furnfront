<script setup lang="ts">
import type { Stripe, StripeElements } from "@vue-stripe/vue-stripe";
import {
  VueStripeElements,
  VueStripePaymentElement,
  VueStripeProvider,
} from "@vue-stripe/vue-stripe";
import type { Order } from "~/types/basket";
import type { CreatePaymentIntentResponse } from "~/types/payment";

const config = useRuntimeConfig();
const publishableKey = config.public.stripePublishableKey;
const toast = useToast();

const props = defineProps<{
  order: Order;
}>();
const emit = defineEmits<{ cancel: [] }>();
const { refreshStock } = useCart();

const stripeInstance = ref<Stripe | null>(null);
const elementsInstance = ref<StripeElements | null>(null);

const onStripeLoad = (stripe: Stripe) => {
  stripeInstance.value = stripe;
};

const onElementsReady = (elements: StripeElements) => {
  elementsInstance.value = elements;
};

const { data, status, error } = useAPI<CreatePaymentIntentResponse>("/payment/create-payment-intent", {
  method: "POST",
  body: JSON.stringify(props.order),
});

// Stock conflicts can still happen after the cart view; translate backend errors into UI feedback.
const paymentCreationErrorMessage = computed(() => {
  const backendMessage = (error.value as { data?: { message?: string | string[] } } | null)
    ?.data?.message;

  const message = Array.isArray(backendMessage)
    ? backendMessage.join(" ")
    : backendMessage;

  if (typeof message === "string" && message.toLowerCase().includes("insufficient stock")) {
    return "Le stock a change juste avant le paiement. Le panier a ete mis a jour, verifie les quantites et relance le checkout.";
  }

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return "Impossible d'initialiser le paiement. Merci de reessayer.";
});

watch(
  () => error.value,
  async (newError) => {
    if (!newError) {
      return;
    }

    const backendMessage = (newError as { data?: { message?: string | string[] } } | null)
      ?.data?.message;

    const normalizedMessage = Array.isArray(backendMessage)
      ? backendMessage.join(" ").toLowerCase()
      : (backendMessage ?? "").toLowerCase();

    if (!normalizedMessage.includes("insufficient stock")) {
      return;
    }

    // Refresh local cart stock so the next checkout attempt starts from server truth.
    const refreshResult = await refreshStock();
    if (refreshResult.issues.length) {
      toast.add({
        title: "Stock mis a jour",
        description: refreshResult.issues[0],
        color: "warning",
      });
    }
  },
  { immediate: true },
);

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
      return_url: `${globalThis.location.origin}${globalThis.location.pathname}?payment=confirmation`,
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
  const paymentIntentId = data.value?.paymentIntent?.split("_secret")[0];
  if (!paymentIntentId || !data.value?.cancelToken) {
    emit("cancel");
    return;
  }

  isCancelling.value = true;
  const { $api } = useNuxtApp();
  try {
    // Shop and internat use the same cancel-token pattern, only the endpoint changes.
    await ($api as typeof $fetch)(`/payment/checkout/${paymentIntentId}`, {
      method: "DELETE",
      headers: {
        "x-cancel-token": data.value.cancelToken,
      },
    });
  } catch {
    // Best-effort: even if the call fails, return to checkout form state.
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
        v-if="status === 'success'"
        :client-secret="data?.paymentIntent"
        @ready="onElementsReady"
      >
        <UForm class="flex flex-col gap-6 mb-12" @submit.prevent="handleSubmit">
          <div class="grid gap-6 lg:grid-cols-2">
            <VueStripePaymentElement />
            <PaymentRecap @submit="handleSubmit" @cancel="handleCancel" />
          </div>
        </UForm>
      </VueStripeElements>
      <div v-else-if="status === 'pending'">Chargement...</div>
      <div v-else-if="status === 'error'" class="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p class="font-semibold">Paiement indisponible</p>
        <p class="text-sm">{{ paymentCreationErrorMessage }}</p>
        <UButton color="neutral" variant="soft" @click="emit('cancel')">
          Retour aux informations
        </UButton>
      </div>
    </VueStripeProvider>
  </ClientOnly>
</template>
