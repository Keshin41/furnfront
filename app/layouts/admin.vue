<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { logout } = useAuth();

const sidebarItems = ref<NavigationMenuItem[]>([
  { label: "Mon profil", to: "/admin/profile" },
  { label: "Meets", to: "/admin/meet" },
  { label: "Commandes", to: "/admin/order" },
  { label: "Commande manuelle", to: "/admin/order/create" },
  { label: "Boutique", to: "/admin/product" },
  { label: "Internat", to: "/admin/internat" },
]);

const open = ref(true);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UMain class="flex flex-1">
      <USidebar :open="open" collapsible="icon">
        <template #header>
          <SiteLogo variant="arrow" />
        </template>
        <UNavigationMenu
          :items="sidebarItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
        <template #footer>
          <UButton variant="ghost" @click="logout"> Se déconnecter </UButton>
        </template>
      </USidebar>

      <slot />
    </UMain>
  </div>
</template>
