<script setup lang="ts">
type PaymentRecapItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

const props = defineProps<{
  items?: PaymentRecapItem[];
  total?: number;
}>();

const { items: cartItems, total: cartTotal } = useCart();
const emit = defineEmits<{ submit: []; cancel: [] }>();

// The recap stays reusable: shop falls back to the cart, internat passes its own lines.
const recapItems = computed<PaymentRecapItem[]>(() => {
  if (props.items) {
    return props.items;
  }

  return cartItems.value.map((item) => ({
    id: item.skuId,
    name: item.productName,
    quantity: item.quantity,
    unitPrice: item.price,
  }));
});

const recapTotal = computed(() => props.total ?? cartTotal.value);
</script>
<template>
  <section
    class="mx-auto w-full h-fit max-w-3xl rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm backdrop-blur md:p-8"
  >
    <div class="mb-6 space-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Paiement
      </p>
      <h2 class="text-2xl font-bold text-neutral-900">Récapitulatif de votre commande</h2>
      <p class="text-sm text-neutral-600">
        Vérifiez les articles et le total avant de valider le paiement.
      </p>
    </div>

    <div class="mb-6 space-y-3 rounded-xl bg-neutral-50 p-4 md:p-6">
      <ul class="space-y-3">
        <li
          v-for="item in recapItems"
          :key="item.id"
          class="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-b-0"
        >
          <div class="flex flex-col gap-1">
            <p class="font-medium text-neutral-900">{{ item.name }}</p>
            <p class="text-xs text-neutral-600">
              {{ item.quantity }} × {{ item.unitPrice.toFixed(2) }} €
            </p>
          </div>
          <p class="text-right font-semibold text-neutral-900">
            {{ (item.unitPrice * item.quantity).toFixed(2) }} €
          </p>
        </li>
      </ul>
    </div>

    <div class="space-y-2 rounded-xl bg-primary/5 p-4 md:p-6">
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-neutral-900">Total à payer</span>
        <span class="text-2xl font-bold text-primary">{{ recapTotal.toFixed(2) }} €</span>
      </div>
    </div>

    <UButton
      type="button"
      size="xl"
      block
      color="primary"
      class="mt-6"
      @click="emit('submit')"
    >
      Payer maintenant
    </UButton>

    <UButton
      type="button"
      size="xl"
      block
      variant="outline"
      color="neutral"
      class="mt-3"
      @click="emit('cancel')"
    >
      Annuler et revenir au formulaire
    </UButton>
  </section>
</template>
