<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import InternatStripeWrapperClient from "~/components/InternatStripeWrapper.client.vue";
import type { InternatOrder } from "~/types/internat";

const stepperItems: StepperItem[] = [
  {
    title: "Tickets",
    slot: "tickets",
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
const toast = useToast();

const activeStep = ref<string | number | undefined>(
  query.payment === "success" || query.payment === "failed" ? 2 : 0,
);
const basket = ref<any>(null);
const paymentIntent = ref<string>("");

const { data } = await useAPI<any>("/internat/maxTickets", {
  method: "GET",
});
const maxTickets = data.value.max;

const handleTicketFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  // Handle form submission logic here
  console.log("Form submitted with data:", event.data);
  const { data, error } = await useAPI<InternatOrder>("/internat/checkout", {
    method: "POST",
    body: JSON.stringify(event.data),
  });
  if (error.value?.statusCode === 500) {
    toast.add({
      title: "Erreur",
      description:
        "Une erreur est survenue lors de la création de la commande. Veuillez réessayer.",
      color: "error",
    });
    return;
  } else if (error.value) {
    toast.add({
      title: "Erreur",
      description:
        error.value.data?.message ||
        "Une erreur est survenue lors de la création de la commande. Veuillez réessayer.",
      color: "error",
    });
    return;
  }
  basket.value = data.value?.basket;
  paymentIntent.value = data.value?.paymentIntent ?? "";
  activeStep.value = 1; // Move to the next step
};

const handlePaymentCancel = () => {
  basket.value = null;
  paymentIntent.value = "";
  activeStep.value = 0;
  toast.add({
    title: "Commande annulée",
    description: "Votre commande a été annulée. Vous pouvez recommencer.",
    color: "warning",
  });
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
      <template #tickets>
        <InternatForm
          :on-submit="handleTicketFormSubmit"
          :max-tickets="maxTickets"
        />
      </template>
      <template #payment>
        <template v-if="!basket || !paymentIntent"
          >Merci de compléter d'abord l'étape des informations.</template
        >
        <template v-else>
          <InternatStripeWrapperClient
            :basket="basket"
            :payment-intent="paymentIntent"
            @cancel="handlePaymentCancel"
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
