<script setup lang="ts">
import { OrderStatus, type OrderDetailDTO } from "~/types/order";
import OrderStatusBadge from "~/components/admin/OrderStatusBadge.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;
const toast = useToast();

const { data: order, error, pending } = await useAPI<OrderDetailDTO>(`/order/${id}`);

const statusOptions = [
  { label: "En attente", value: OrderStatus.PENDING },
  { label: "Payée", value: OrderStatus.PAID },
  { label: "Échouée", value: OrderStatus.FAILED },
  { label: "Espèces en attente", value: OrderStatus.CASH_PENDING },
  { label: "Payée en espèces", value: OrderStatus.CASH_PAID },
];

const selectedStatus = ref<OrderStatus>(order.value?.status ?? OrderStatus.PENDING);
const saving = ref(false);

async function saveStatus() {
  saving.value = true;
  try {
    await useAPI(`/order/${id}/status`, {
      method: "PATCH",
      body: { status: selectedStatus.value },
    });
    toast.add({ title: "Statut mis à jour", color: "success" });
  } catch {
    toast.add({ title: "Erreur lors de la mise à jour", color: "error" });
  } finally {
    saving.value = false;
  }
}

const statusColorMap: Record<OrderStatus, "success" | "warning" | "error"> = {
  [OrderStatus.PAID]: "success",
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.FAILED]: "error",
  [OrderStatus.CASH_PENDING]: "warning",
  [OrderStatus.CASH_PAID]: "success",
};
</script>

<template>
  <div class="p-6 w-full max-w-3xl mx-auto flex flex-col gap-6">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <UButton variant="ghost" icon="i-heroicons-arrow-left" to="/admin/order" />
      <div>
        <h1 class="text-2xl font-bold text-primary">Détail de la commande</h1>
        <p v-if="order" class="text-sm text-neutral-400 font-mono">{{ order.id }}</p>
      </div>
    </div>

    <div v-if="pending" class="text-center py-16 text-neutral-400">Chargement...</div>
    <div v-else-if="error" class="text-error">Erreur : {{ error.message }}</div>
    <template v-else-if="order">

      <!-- Statut + actions -->
      <UCard>
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <OrderStatusBadge :status="order.status" />
            <span class="text-sm text-neutral-400">
              {{ new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <USelect
              :model-value="selectedStatus"
              :items="statusOptions"
              @update:model-value="(val) => { if (val) selectedStatus = val as OrderStatus; }"
            />
            <UButton
              :loading="saving"
              :color="statusColorMap[selectedStatus]"
              icon="i-heroicons-check"
              @click="saveStatus"
            >
              Enregistrer
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Acheteur + résumé -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2 text-sm font-semibold">
              <UIcon name="i-heroicons-user" class="size-4 text-primary" />
              Acheteur
            </div>
          </template>
          <div class="flex flex-col gap-1">
            <p class="font-medium">{{ order.buyer.nickname }}</p>
            <p class="text-sm text-neutral-400">{{ order.buyer.email }}</p>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2 text-sm font-semibold">
              <UIcon name="i-heroicons-banknotes" class="size-4 text-primary" />
              Récapitulatif
            </div>
          </template>
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">Articles</span>
              <span>{{ order.items.reduce((s, i) => s + i.quantity, 0) }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span>Total</span>
              <span class="text-primary">{{ order.total.toFixed(2) }} €</span>
            </div>
            <p v-if="order.paymentIntentId" class="mt-2 text-xs text-neutral-400 font-mono truncate">{{ order.paymentIntentId }}</p>
          </div>
        </UCard>
      </div>

      <!-- Articles -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-sm font-semibold">
            <UIcon name="i-heroicons-shopping-bag" class="size-4 text-primary" />
            Articles
            <UBadge :label="String(order.items.length)" variant="outline" size="sm" />
          </div>
        </template>
        <div class="flex flex-col divide-y divide-neutral-200/50">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3">
                <ImageWithFallback 
                  v-if="item.sku.product.imageUrl"
                  :src="item.sku.product.imageUrl"
                  :alt="item.sku.product.name"
                  class="size-12 rounded-xl object-cover shrink-0"
                />
              <div v-else class="size-12 rounded-xl bg-neutral-100 shrink-0 flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="size-5 text-neutral-300" />
              </div>
              <div>
                <p class="font-medium">{{ item.sku.product.name }}</p>
                <p class="text-xs text-neutral-400 font-mono">{{ item.sku.skuCode }}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm text-neutral-400">{{ item.quantity }} × {{ item.unitPrice.toFixed(2) }} €</p>
              <p class="font-semibold">{{ (item.quantity * item.unitPrice).toFixed(2) }} €</p>
            </div>
          </div>
        </div>
      </UCard>

    </template>
  </div>
</template>
