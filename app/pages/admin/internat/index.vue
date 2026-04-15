<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import BooleanCellRenderer from "~/components/admin/BooleanCellRenderer.vue";
import type { TicketListDto } from "~/types/internat";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { data, pending } = await useAPI<TicketListDto[]>("/internat/list");

const columns: TableColumn<TicketListDto>[] = [
  { accessorKey: "nickname", header: "Pseudo" },
  {
    accessorKey: "date",
    header: "Date de l'événement",
    cell: ({ row }) =>
      new Date(row.original.date ?? "").toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  },
  {
    accessorKey: "duvet",
    header: "Couette",
    cell: ({ row }) => h(BooleanCellRenderer, { data: row.original.duvet }),
  },
  {
    accessorKey: "goodies",
    header: "Goodies",
    cell: ({ row }) => h(BooleanCellRenderer, { data: row.original.goodies }),
  },
];
</script>
<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary">
      Admin - Liste des inscrits JTF 2026
    </h1>
    <UTable
      :columns="columns"
      :data="data ?? []"
      :loading="pending"
      class="w-full"
    />
  </div>
</template>
