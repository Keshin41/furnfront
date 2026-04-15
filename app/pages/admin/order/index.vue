<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import OrderStatusBadge from "~/components/admin/OrderStatusBadge.vue";
import { OrderStatus, type OrderListDTO } from "~/types/order";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const UButton = resolveComponent("UButton");
const page = ref(1);
const pageSize = 10;
const selectedStatus = ref<OrderStatus | "ALL">("ALL");
const search = ref("");

const { data: orderCount, pending: orderCountPending } = await useAPI<number>("/order/count");

const totalOrderCount = computed(() => Math.max(orderCount.value ?? 0, 1));

const { data: orders, pending: ordersPending } = await useAPI<OrderListDTO[]>(
  "/order/list",
  {
    query: computed(() => ({ page: 0, pageSize: totalOrderCount.value })),
  },
);

const statusTabs = [
  { key: "ALL", label: "Toutes" },
  { key: OrderStatus.PAID, label: "Payées" },
  { key: OrderStatus.PENDING, label: "En attente" },
  { key: OrderStatus.FAILED, label: "Échouées" },
  { key: OrderStatus.CASH_PENDING, label: "Espèces" },
  { key: OrderStatus.CASH_PAID, label: "Espèces payées" },
];

const filteredOrders = computed(() => {
  if (selectedStatus.value === "ALL") return orders.value ?? [];
  return (orders.value ?? []).filter((o) => o.status === selectedStatus.value);
});

const searchedOrders = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return filteredOrders.value;

  return filteredOrders.value.filter((order) => {
    const dateText = new Date(order.date ?? "").toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      order.id.toLowerCase().includes(term) ||
      order.buyer.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.amount.toFixed(2).includes(term) ||
      dateText.includes(term)
    );
  });
});

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * pageSize;
  return searchedOrders.value.slice(start, start + pageSize);
});


watch(searchedOrders, (value) => {
  const maxPage = Math.max(1, Math.ceil(value.length / pageSize));
  if (page.value > maxPage) {
    page.value = maxPage;
  }
});

const sorting = ref([{ id: "date", desc: true }]);

const columns: TableColumn<OrderListDTO>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) =>
      h("span", { class: "font-mono text-xs text-neutral-400" }, row.original.id.slice(0, 8) + "…"),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.date ?? "").toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  { accessorKey: "buyer", header: "Acheteur" },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) =>
      h("span", { class: "font-semibold" }, `${row.original.amount.toFixed(2)} €`),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => h(OrderStatusBadge, { status: row.original.status }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(UButton, {
        variant: "ghost",
        size: "sm",
        icon: "i-heroicons-arrow-right",
        onClick: () => navigateTo(`/admin/order/${id}`),
      });
    },
  },
];
</script>

<template>
  <div class="p-6 w-full flex flex-col gap-6 bg-linear-to-br from-brand-ice/50 via-white to-brand-light-blue/20 min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-primary">Commandes</h1>
        <p class="text-sm text-neutral-500 mt-0.5">
          {{ orderCount ?? 0 }} commande{{ (orderCount ?? 0) > 1 ? 's' : '' }} au total
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        @click="navigateTo('/admin/order/create')"
      >
        Commande manuelle
      </UButton>
    </div>

    <!-- Filtres statut + recherche -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="w-full md:max-w-sm">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Rechercher (ID, acheteur, date, montant, statut)"
          size="md"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              v-if="search"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              aria-label="Effacer la recherche"
              @click="search = ''; page = 1"
            />
          </template>
        </UInput>
      </div>

      <div class="flex flex-wrap gap-2">
      <UButton
        v-for="tab in statusTabs"
        :key="tab.key"
        size="sm"
        :variant="selectedStatus === tab.key ? 'solid' : 'outline'"
        :color="selectedStatus === tab.key ? 'primary' : 'neutral'"
        @click="selectedStatus = tab.key as typeof selectedStatus; page = 1"
      >
        {{ tab.label }}
      </UButton>
      </div>
    </div>

    <!-- Table -->
    <UCard class="bg-white/90 border border-brand-light-blue/40 shadow-sm" :ui="{ body: 'p-0' }">
      <UTable
        :columns="columns"
        :data="paginatedOrders"
        :loading="ordersPending || orderCountPending"
        :sorting="sorting"
        @update:sorting="(s) => { if (s) sorting = s; }"
        class="w-full"
      />
      <div class="px-4 py-3 border-t border-neutral-200/50 flex justify-between items-center">
        <span class="text-sm text-neutral-400">
          Page {{ page }} · {{ searchedOrders.length }} résultat{{ searchedOrders.length > 1 ? 's' : '' }}
        </span>
        <UPagination
          v-model:page="page"
          :items-per-page="pageSize"
          :total="searchedOrders.length"
        />
      </div>
    </UCard>
  </div>
</template>
