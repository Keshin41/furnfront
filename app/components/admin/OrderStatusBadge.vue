<script setup lang="ts">
import { OrderStatus } from "~/types/order";

const { status } = defineProps<{
  status: OrderStatus;
}>();

const OrderStatusMapping: Record<
  OrderStatus,
  { color: "success" | "warning" | "error"; label: string }
> = {
  [OrderStatus.PAID]: { color: "success", label: "Payée" },
  [OrderStatus.PENDING]: { color: "warning", label: "En attente" },
  [OrderStatus.FAILED]: { color: "error", label: "Échouée" },
  [OrderStatus.CASH_PENDING]: {
    color: "warning",
    label: "Espèces en attente",
  },
  [OrderStatus.CASH_PAID]: { color: "success", label: "Payée en espèces" },
};
</script>
<template>
  <UBadge :color="OrderStatusMapping[status].color" variant="outline">
    {{ OrderStatusMapping[status].label }}
  </UBadge>
</template>
