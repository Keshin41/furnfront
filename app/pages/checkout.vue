<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import StripeWrapperClient from "~/components/StripeWrapper.client.vue";
import type { Order } from "~/types/basket";
import { useCart } from "~/composables/useCart";

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

const activeStep = ref<string | number | undefined>(query.payment === "success" ? 2 : 0);
const buyerInfo = ref<Order["user"] | null>(null);
const paymentConfirmationState = ref<"idle" | "pending" | "success" | "error">(
  query.payment === "success" ? "pending" : "idle",
);
const paymentConfirmationMessage = ref("");
const paymentTicket = ref<{
  paymentIntentId: string;
  chargeId: string | null;
  receiptUrl: string | null;
  amount: number;
  currency: string;
} | null>(null);

if (query.payment === "success") {
  const paymentIntentId = typeof query.payment_intent === "string" ? query.payment_intent : "";

  if (!paymentIntentId) {
    paymentConfirmationState.value = "error";
    paymentConfirmationMessage.value = "Paiement revenu de Stripe sans identifiant de confirmation.";
  } else {
    const { data, error } = await useAPI<{
      ok: boolean;
      paymentTicket: {
        paymentIntentId: string;
        chargeId: string | null;
        receiptUrl: string | null;
        amount: number;
        currency: string;
      };
    }>(
      `/payment/confirm-success?paymentIntentId=${encodeURIComponent(paymentIntentId)}`,
      { method: "GET" },
    );

    if (error.value) {
      const payload = error.value.data as { message?: string | string[] } | undefined;
      paymentConfirmationState.value = "error";
      paymentConfirmationMessage.value = Array.isArray(payload?.message)
        ? payload.message.join(", ")
        : (payload?.message ?? "Impossible de confirmer la commande cote serveur.");
    } else {
      paymentConfirmationState.value = "success";
      paymentTicket.value = data.value?.paymentTicket ?? null;
      const { clearCart } = useCart();
      clearCart();
    }
  }
}

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
                ticketDetails: item.ticketDetails,
              })),
            }"
          />
        </template>
      </template>
      <template #confirmation>
        <section
          class="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white/90 px-8 py-16 shadow-sm backdrop-blur text-center md:px-16 md:py-20"
        >
          <template v-if="paymentConfirmationState === 'pending'">
            <UIcon name="i-lucide-loader-circle" class="size-16 animate-spin text-primary" />
            <div class="space-y-3">
              <h2 class="text-3xl font-bold text-neutral-900">Verification de la commande...</h2>
              <p class="text-base text-neutral-500 max-w-sm mx-auto">
                Nous attendons la confirmation backend du paiement et de la prise en compte de la commande.
              </p>
            </div>
          </template>

          <template v-else-if="paymentConfirmationState === 'error'">
            <UAlert
              color="error"
              variant="soft"
              icon="i-lucide-circle-alert"
              class="w-full"
              :title="paymentConfirmationMessage"
            />
            <div class="space-y-3">
              <h2 class="text-3xl font-bold text-neutral-900">Confirmation incomplete</h2>
              <p class="text-base text-neutral-500 max-w-sm mx-auto">
                Le paiement Stripe est revenu, mais le backend n'a pas encore confirme la commande.
              </p>
            </div>
          </template>

          <template v-else>
          <div class="flex items-center justify-center rounded-full bg-green-50 p-6 ring-12 ring-green-100">
            <UIcon name="i-heroicons-check-circle-20-solid" class="size-16 text-green-500" />
          </div>

          <div class="space-y-3">
            <h2 class="text-3xl font-bold text-neutral-900">Commande confirmée !</h2>
            <p class="text-base text-neutral-500 max-w-sm mx-auto">
              Un email de confirmation vous sera envoyé sous peu avec les détails de votre commande.
            </p>
          </div>

          <div v-if="paymentTicket" class="w-full rounded-2xl bg-neutral-50 p-4 text-left text-sm text-neutral-700">
            <p class="font-semibold text-neutral-900">Ticket de paiement</p>
            <p>
              Montant: {{ (paymentTicket.amount / 100).toFixed(2) }} {{ paymentTicket.currency }}
            </p>
            <UButton
              v-if="paymentTicket.receiptUrl"
              :to="paymentTicket.receiptUrl"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="neutral"
              size="sm"
              class="mt-3"
            >
              Voir le reçu Stripe
            </UButton>
          </div>
          </template>

          <USeparator class="w-full" />

          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <UButton to="/" color="primary" size="xl" block>
              Retour à l'accueil
            </UButton>
            <UButton to="/shop" color="neutral" variant="soft" size="xl" block>
              Continuer mes achats
            </UButton>
          </div>
        </section>
      </template>
    </UStepper>
  </UContainer>
</template>
