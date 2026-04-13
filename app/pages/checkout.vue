<script setup lang="ts">
import type { FormSubmitEvent, StepperItem } from "@nuxt/ui";
import StripeWrapperClient from "~/components/StripeWrapper.client.vue";
import type { Order } from "~/types/basket";
import { useCart } from "~/composables/useCart";

// The checkout flow has 3 steps: billing info → Stripe payment → confirmation.
// Steps are controlled by `activeStep`. The stepper is set to `disabled` so the
// user can't jump ahead manually; navigation is driven by the code below.
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

// When Stripe redirects back after payment it appends ?payment=success&payment_intent=pi_xxx.
// We go directly to step 2 (index 2 = confirmation) and start verifying the payment.
const activeStep = ref<string | number | undefined>(query.payment === "success" ? 2 : 0);

// Filled at step 0 (billing form); passed to StripeWrapper at step 1 to create the PaymentIntent.
const buyerInfo = ref<Order["user"] | null>(null);

// Drives the UI shown in the confirmation step.
const paymentConfirmationState = ref<"idle" | "pending" | "success" | "error">(
  query.payment === "success" ? "pending" : "idle",
);
const paymentConfirmationMessage = ref("");

// Stripe charge details returned by the backend after confirming the payment intent.
const paymentTicket = ref<{
  paymentIntentId: string;
  chargeId: string | null;
  receiptUrl: string | null;
  amount: number; // in smallest currency unit (cents)
  currency: string;
} | null>(null);

// Order lines fetched from the DB after payment confirmation — the source of truth for what was paid.
const paymentOrderItems = ref<Array<{
  productName: string;
  skuCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}>>([]); 

if (query.payment === "success") {
  // The `payment_intent` query param is the Stripe PaymentIntent ID.
  // We forward it to the backend which verifies the payment status, marks the
  // order as PAID in the DB, creates tickets/adhesions, and returns the order summary.
  const paymentIntentId = typeof query.payment_intent === "string" ? query.payment_intent : "";

  if (!paymentIntentId) {
    paymentConfirmationState.value = "error";
    paymentConfirmationMessage.value = "Paiement revenu de Stripe sans identifiant de confirmation.";
  } else {
    const { data, error } = await useAPI<{
      ok: boolean;
      orderItems: Array<{
        productName: string;
        skuCode: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
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
      paymentOrderItems.value = data.value?.orderItems ?? [];
      // Cart is only cleared once the backend confirms the payment, not on Stripe redirect.
      const { clearCart } = useCart();
      clearCart();
    }
  }
}

const handleFormSubmit = (event: FormSubmitEvent<unknown>) => {
  event.preventDefault();
  buyerInfo.value = event.data as Order["user"];
  // Advance to the Stripe payment step.
  activeStep.value = 1;
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

          <div v-if="paymentOrderItems.length > 0" class="w-full rounded-2xl border border-neutral-200 bg-neutral-50 text-left text-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-neutral-200">
              <p class="font-semibold text-neutral-900">Récapitulatif de commande</p>
            </div>
            <ul class="divide-y divide-neutral-100">
              <li
                v-for="item in paymentOrderItems"
                :key="item.skuCode"
                class="flex items-center justify-between gap-4 px-4 py-2.5 text-neutral-700"
              >
                <span class="flex-1 min-w-0">
                  <span class="font-medium text-neutral-900">{{ item.productName }}</span>
                  <span v-if="item.quantity > 1" class="ml-1.5 text-neutral-500">× {{ item.quantity }}</span>
                </span>
                <span class="shrink-0 tabular-nums text-neutral-700">
                  {{ item.totalPrice.toFixed(2) }} {{ paymentTicket?.currency }}
                </span>
              </li>
            </ul>
            <div class="flex items-center justify-between gap-4 border-t border-neutral-200 px-4 py-3 font-semibold text-neutral-900">
              <span>Total</span>
              <span class="tabular-nums" v-if="paymentTicket">{{ (paymentTicket.amount / 100).toFixed(2) }} {{ paymentTicket.currency }}</span>
            </div>
          </div>
          <div v-if="paymentTicket?.receiptUrl" class="w-full text-center">
            <UButton
              :to="paymentTicket.receiptUrl"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="neutral"
              size="sm"
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
