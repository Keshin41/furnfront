<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem, StepperItem } from "@nuxt/ui";
import InternatStripeWrapperClient from "~/components/InternatStripeWrapper.client.vue";
import type { Order } from "~/types/basket";
import { useCart } from "~/composables/useCart";
import z from "zod";
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
const { items: cartItems } = useCart();

const activeStep = ref<string | number | undefined>(query.payment === "success" ? 2 : 0);
const buyerInfo = ref<Order["user"] | null>(null);
const basket = ref<any>(null);
const paymentIntent = ref<string>('');

if (query.payment === "success") {
  // Clear the cart after successful payment
  const { clearCart } = useCart();
  clearCart();
}

const handleTicketFormSubmit = async (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  // Handle form submission logic here
  console.log("Form submitted with data:", event.data);
  const { data } = await useAPI<InternatOrder>('/internat/checkout', {
    method: "POST",
    body: JSON.stringify(event.data),
  });
    basket.value = data.value?.basket;
    paymentIntent.value = data.value?.paymentIntent ?? '';
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
          <div class="flex items-center justify-center rounded-full bg-green-50 p-6 ring-12 ring-green-100">
            <UIcon name="i-heroicons-check-circle-20-solid" class="size-16 text-green-500" />
          </div>

          <div class="space-y-3">
            <h2 class="text-3xl font-bold text-neutral-900">Commande confirmée !</h2>
            <p class="text-base text-neutral-500 max-w-sm mx-auto">
              Un email de confirmation vous sera envoyé sous peu avec les détails de votre commande.
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
