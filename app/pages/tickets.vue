<script setup lang="ts">
import type { InternatTicketListItem } from '~/types/internat';

const { data, error, status, refresh } = await useAPI<InternatTicketListItem[]>('/internat/tickets', {
  method: 'GET',
});

const tickets = computed(() => data.value ?? []);
const ticketCount = computed(() => tickets.value.length);
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900">Tickets internat</h1>
        <p class="mt-2 text-sm text-neutral-500">
          {{ ticketCount }} ticket{{ ticketCount > 1 ? 's' : '' }} enregistre{{ ticketCount > 1 ? 's' : '' }}.
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
      title="Impossible de charger les tickets internat."
    />

    <div v-if="status === 'pending'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <USkeleton v-for="index in 6" :key="index" class="h-56 rounded-2xl" />
    </div>

    <div v-else-if="tickets.length === 0" class="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
      Aucun ticket internat pour le moment.
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="ticket in tickets" :key="`${ticket.email}-${ticket.skuCode}`" class="rounded-3xl border border-neutral-200 shadow-sm">
        <template #header>
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-neutral-900">
              {{ ticket.firstname }} {{ ticket.lastname }}
            </h2>
            <p class="text-sm text-neutral-500">{{ ticket.nickname }} • {{ ticket.email }}</p>
          </div>
        </template>

        <div class="space-y-3 text-sm text-neutral-700">
          <div class="flex items-center justify-between gap-3">
            <span class="text-neutral-500">Produit</span>
            <span class="font-medium text-neutral-900">{{ ticket.productName }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-neutral-500">SKU</span>
            <span class="font-mono text-xs text-neutral-900">{{ ticket.skuCode }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-neutral-500">Prix</span>
            <span class="font-medium text-neutral-900">{{ ticket.unitPrice }} EUR</span>
          </div>
        </div>

        <template #footer>
          <div class="flex flex-wrap gap-2">
            <UBadge :color="ticket.drap ? 'primary' : 'neutral'" variant="soft">
              Draps {{ ticket.drap ? 'oui' : 'non' }}
            </UBadge>
            <UBadge :color="ticket.goodies ? 'success' : 'neutral'" variant="soft">
              Goodies {{ ticket.goodies ? 'oui' : 'non' }}
            </UBadge>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>