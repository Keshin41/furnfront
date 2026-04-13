<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import EventPartCellRenderer from "~/components/admin/EventPartCellRenderer.vue";
import type { FurmeetResponse } from "~/types/furmeet";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { data, pending } = await useAPI<FurmeetResponse[]>("/event/");

const columns: TableColumn<FurmeetResponse>[] = [
  { accessorKey: "title", header: "Titre" },
  {
    accessorKey: "eventDate",
    header: "Date de l'événement",
    cell: ({ row }) =>
      new Date(row.original.eventDate ?? "").toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  },
  {
    accessorKey: "eventActivities",
    header: "Activités",
    cell: ({ row }) =>
      h(EventPartCellRenderer, {
        eventActivities: row.original.eventActivities ?? [],
      }),
  },
  {
    accessorKey: "published",
    header: "Publié",
    cell: ({ row }) => (row.original.published ? "Oui" : "Non"),
  },
  {
    accessorKey: "opened",
    header: "Inscriptions",
    cell: ({ row }) => (row.original.opened ? "Ouvertes" : "Fermées"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(UButton, {
        variant: "outline",
        size: "sm",
        label: "Voir",
        onClick: () => navigateTo(`/admin/meet/${id}`),
      });
    },
  },
];
</script>
<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary">Admin - Meets</h1>
    <UTable
      :columns="columns"
      :data="data ?? []"
      :loading="pending"
      class="w-full"
    />
  </div>
</template>
