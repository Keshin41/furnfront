<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import InternatStripeWrapperClient from "~/components/InternatStripeWrapper.client.vue";
import { useCart } from "~/composables/useCart";
import type { Order } from "~/types/basket";
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

const activeStep = ref<string | number | undefined>(
  query.payment === "success" || query.payment === "failed" ? 2 : 0,

);
const buyerInfo = ref<Order["user"] | null>(null);
const basket = ref<any>(null);
const paymentIntent = ref<string>("");


const handleTicketFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  // Handle form submission logic here
  console.log("Form submitted with data:", event.data);
  const { data, error } = await useAPI<InternatOrder>("/internat/checkout", {
    method: "POST",
    body: JSON.stringify(event.data),
  });
  if (error.value?.statusCode === 500) {
    alert("Une erreur est survenue lors de la création de la commande. Veuillez réessayer.");
    return;
  }
  basket.value = data.value?.basket;
  paymentIntent.value = data.value?.paymentIntent ?? "";
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
      <template #tickets>
        <InternatForm :on-submit="handleTicketFormSubmit" />
      </template>
      <template #payment>
        <template v-if="!basket || !paymentIntent"
          >Merci de compléter d'abord l'étape des informations.</template
        >
        <template v-else>
          <InternatStripeWrapperClient
            :basket="basket"
            :payment-intent="paymentIntent"
          />
        </template>
      </template>
      <template #confirmation>
        <section
          class="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white/90 px-8 py-16 shadow-sm backdrop-blur text-center md:px-16 md:py-20"
        >
            <div v-if="query.payment === 'failed'" class="space-y-3">
              <UIcon
                name="i-heroicons-x-circle-20-solid"
                class="size-16 text-red-500"
              />
              <h2 class="text-3xl font-bold text-neutral-900">
                Oups, le paiement a échoué
              </h2>
              <p class="text-base text-neutral-500 max-w-sm mx-auto">
                Malheureusement, une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer ou contacter notre support si le problème persiste.
              </p>
            </div>

          <div v-else-if="query.payment === 'success'" class="space-y-3">
              <UIcon
                name="i-heroicons-check-circle-20-solid"
                class="size-16 text-green-500"
              />
            <h2 class="text-3xl font-bold text-neutral-900">
              Commande confirmée !
            </h2>
             
            <p class="text-base text-neutral-500 max-w-sm mx-auto">
              Un email de confirmation vous sera envoyé sous peu avec les
              détails de votre commande.
            </p>
          </div>

          <USeparator class="w-full" />

          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <UButton to="/" color="primary" size="xl" block>
              Retour à l'accueil
            </UButton>
          </div>
        </section>
      </template>
    </UStepper>
  </UContainer>
</template>
