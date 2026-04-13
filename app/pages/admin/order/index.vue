<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import OrderStatusBadge from "~/components/admin/OrderStatusBadge.vue";
import type { OrderListDTO } from "~/types/order";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const pagination = computed(() => ({
  pageIndex: 0,
  pageSize: 10,
}));

const table = useTemplateRef("table");

const { data: orders, pending: ordersPending } = await useAPI<OrderListDTO[]>(
  "/order/list",
  {
    query: {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    },
  },
);
const { data: orderCount, pending: orderCountPending } = await useAPI<string>(
  "/order/count",
  {
    query: {
      page: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    },
  },
);

const columns: TableColumn<OrderListDTO>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "date",
    header: "Date de l'événement",
    cell: ({ row }) =>
      new Date(row.original.date ?? "").toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "buyer",
    header: "Acheteur",
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => `${row.original.amount.toFixed(2)} €`,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => h(OrderStatusBadge, { status: row.original.status }),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(
        "UButton",
        { variant: "outline", size: "sm", to: `/admin/meet/${id}` },
        "Editer",
      );
    },
  },
];
</script>
<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary">
      Admin - Liste des commandes
    </h1>
    <UTable
      ref="table"
      :columns="columns"
      :data="orders ?? []"
      :loading="ordersPending || orderCountPending"
      :pagination="pagination"
      :pagination-options="{
        rowCount: Number.parseInt(orderCount ?? '0', 10),
      }"
      class="w-full"
    />
    <UPagination
      :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
      :items-per-page="table?.tableApi?.getState().pagination.pageSize"
      :total="table?.tableApi?.getFilteredRowModel().rows.length"
      @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
    />
  </div>
</template>
