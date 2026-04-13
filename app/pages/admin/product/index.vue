<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Product } from "~/types/product";

const UButton = resolveComponent("UButton");

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { data, pending } = await useAPI<Product[]>("/product/");

const columns: TableColumn<Product>[] = [
  { accessorKey: "name", header: "Nom" },
  {
    accessorKey: "basePrice",
    header: "Prix de base",
    cell: ({ row }) =>
      `${Number.parseFloat(row.original.basePrice).toFixed(2)} €`,
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "virtual",
    header: "Produit virtuel",
    cell: ({ row }) => (row.original.virtual ? "Oui" : "Non"),
  },
  {
    accessorKey: "optionTypes",
    header: "Options",
    cell: ({ row }) =>
      row.original.optionTypes?.map((opt) => opt.name).join(", ") ?? "-",
  },
  {
    id: "stock",
    header: "Stock total",
    cell: ({ row }) => {
      const skus = row.original.skus ?? [];
      const totalStock = skus.reduce((sum, sku) => sum + sku.stock, 0);
      return skus.some((sku) => sku.trackStock) ? totalStock : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(UButton, {
        variant: "outline",
        label: "Voir",
        onClick: () => navigateTo(`/admin/product/${id}`),
      });
    },
  },
  {
    id: "options",
    header: "Options",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(UButton, {
        variant: "outline",
        label: "Options",
        onClick: () => navigateTo(`/admin/product/option/${id}`),
      });
    },
  },
  {
    id: "skus",
    header: "SKUs",
    cell: ({ row }) => {
      const id = row.original.id;
      return h(UButton, {
        variant: "outline",
        label: "SKUs",
        onClick: () => navigateTo(`/admin/product/sku/${id}`),
      });
    },
  },
];
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-primary">Liste des produits</h1>
    <UButton
      class="mb-4"
      label="Créer un produit"
      @click="navigateTo('/admin/product/create')"
    />
    <UTable
      :columns="columns"
      :data="data ?? []"
      :loading="pending"
      class="w-full"
    />
  </div>
</template>
