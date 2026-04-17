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
        label: "Editer",
        onClick: () => navigateTo(`/admin/meet/${id}`),
      });
    },
  },
];
</script>
<template>
  <div class="w-full p-4 md:p-6">
    <div class="mb-4 rounded-3xl border border-brand-light-blue/60 bg-linear-to-r from-brand-white via-brand-white to-brand-light-blue/20 p-5 shadow-sm md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="mt-2 text-3xl font-black text-brand-dark-blue">Gestion des meets</h1>
          <p class="mt-2 text-sm text-brand-ink">
            Cree, organise et mets a jour les meets et leurs activites.
          </p>
        </div>
        <UButton
          icon="i-lucide-plus"
          label="Créer une meet"
          @click="navigateTo('/admin/meet/create')"
        />
      </div>
    </div>

    <div class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-2 shadow-xs md:p-3">
      <UTable
        :columns="columns"
        :data="data ?? []"
        :loading="pending"
        class="w-full"
      />
    </div>
  </div>
</template>
