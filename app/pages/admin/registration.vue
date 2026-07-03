<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import ActivitiesCellRenderer from "~/components/admin/ActivitiesCellRenderer.vue";
import ChoicesCellRenderer from "~/components/admin/ChoicesCellRenderer.vue";
import type { Registration } from "~/types/registration";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { data, pending } = await useAPI<Registration[]>("/event/registrations/");
console.log("🚀 ~ data:", data);

const columns: TableColumn<Registration>[] = [
  { accessorKey: "name", header: "Nom" },
  {
    accessorKey: "event",
    header: "Event",
  },
  {
    accessorKey: "nickname",
    header: "Pseudo",
  },
  {
    header: "Activités",
    cell: ({ row }) =>
      h(ActivitiesCellRenderer, {
        eventActivities: row.original.eventPart ?? [],
      }),
  },
  {
    header: "Choix des options",
    cell: ({ row }) =>
      h(ChoicesCellRenderer, {
        choices: row.original.choices ?? [],
      }),
  },
];
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-primary">Liste des inscriptions</h1>
    <UTable
      :columns="columns"
      :data="data ?? []"
      :loading="pending"
      class="w-full"
    />
  </div>
</template>
