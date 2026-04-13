<script setup lang="ts">
import type { ShopOrderListItem } from '~/types/order';

const { data, error, status, refresh } = await useAPI<ShopOrderListItem[]>('/order/', {
  method: 'GET',
});

const orders = computed(() => data.value ?? []);
const orderCount = computed(() => orders.value.length);

const formatDate = (value: string) =>
  new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusColor = (status: ShopOrderListItem['status']) => {
  if (status === 'PAID' || status === 'CASH_PAID') return 'success';
  if (status === 'PENDING' || status === 'CASH_PENDING') return 'warning';
  if (status === 'FAILED') return 'error';
  return 'neutral';
};
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900">Commandes boutique</h1>
        <p class="mt-2 text-sm text-neutral-500">
          {{ orderCount }} commande{{ orderCount > 1 ? 's' : '' }} enregistree{{ orderCount > 1 ? 's' : '' }}.
        </p>
      </div>

      <UButton color="neutral" variant="soft" icon="i-lucide-refresh-cw" @click="refresh()">
        Actualiser
      </UButton>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      class="mb-6"
      title="Impossible de charger les commandes boutique."
    />

    <div v-if="status === 'pending'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <USkeleton v-for="index in 6" :key="index" class="h-72 rounded-2xl" />
    </div>

    <div v-else-if="orders.length === 0" class="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
      Aucune commande boutique pour le moment.
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="order in orders" :key="order.id" class="rounded-3xl border border-neutral-200 shadow-sm">
        <template #header>
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-neutral-900">
                  {{ order.buyer.firstname }} {{ order.buyer.lastname }}
                </h2>
                <p class="text-sm text-neutral-500">{{ order.buyer.nickname }} • {{ order.buyer.email }}</p>
              </div>
              <UBadge :color="statusColor(order.status)" variant="soft">
                {{ order.status }}
              </UBadge>
            </div>
            <p class="text-xs text-neutral-500">{{ formatDate(order.createdAt) }}</p>
          </div>
        </template>

        <div class="space-y-3 text-sm text-neutral-700">
          <div
            v-for="item in order.items"
            :key="`${order.id}-${item.skuId}`"
            class="rounded-2xl bg-neutral-50 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium text-neutral-900">{{ item.productName }}</p>
                <p class="text-xs text-neutral-500">{{ item.skuCode }}</p>
              </div>
              <p class="font-semibold text-neutral-900">{{ item.totalPrice }} EUR</p>
            </div>
            <p class="mt-1 text-xs text-neutral-600">
              {{ item.quantity }} × {{ item.unitPrice }} EUR
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm text-neutral-500">Total</span>
            <span class="text-lg font-bold text-neutral-900">{{ order.totalPrice }} EUR</span>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>