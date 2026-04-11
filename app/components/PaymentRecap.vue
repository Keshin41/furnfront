<script setup lang="ts">
const { items, total, count } = useCart();
const emit = defineEmits<{ submit: [] }>();
</script>
<template>
  <section
    class="mx-auto w-full h-fit max-w-3xl rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm backdrop-blur md:p-8"
  >
    <div class="mb-6 space-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Payement
      </p>
      <h2 class="text-2xl font-bold text-neutral-900">Récapitulatif de votre commande</h2>
      <p class="text-sm text-neutral-600">
        Vérifiez les articles et le total avant de valider le paiement.
      </p>
    </div>

    <div class="mb-6 space-y-3 rounded-xl bg-neutral-50 p-4 md:p-6">
      <ul class="space-y-3">
        <li
          v-for="item in items"
          :key="item.skuId"
          class="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-b-0"
        >
          <div class="flex flex-col gap-1">
            <p class="font-medium text-neutral-900">{{ item.productName }}</p>
            <p class="text-xs text-neutral-600">
              {{ item.quantity }} × {{ item.price.toFixed(2) }} €
            </p>
          </div>
          <p class="text-right font-semibold text-neutral-900">
            {{ (item.price * item.quantity).toFixed(2) }} €
          </p>
        </li>
      </ul>
    </div>

    <div class="space-y-2 rounded-xl bg-primary/5 p-4 md:p-6">
      <div class="flex items-center justify-between text-sm text-neutral-600">
        <span>Articles ({{ count }})</span>
        <span>{{ total.toFixed(2) }} €</span>
      </div>
      <div class="border-t border-primary/20 pt-3">
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-neutral-900">Total à payer</span>
          <span class="text-2xl font-bold text-primary">{{ total.toFixed(2) }} €</span>
        </div>
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
  </section>
</template>
