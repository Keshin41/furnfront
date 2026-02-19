<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const navItems: NavigationMenuItem[] = [
  {
    label: "Notre association",
    children: [
      { label: "Histoire et objectifs", to: "/about" },
      { label: "Qu'est ce qu'un furry", to: "/values" },
      { label: "Notre équipe", to: "/team" },
    ],
  },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
</script>

<template>
  <UHeader>
    <template #left>
      <ULink to="/">
        <SiteLogo variant="arrow" class="h-30" />
      </ULink>
    </template>
    <UNavigationMenu
      :items="navItems"
      content-orientation="vertical"
      :ui="{
        link: 'text-white hover:text-black ',
      }"
    />

    <template #right>
      <UPopover>
        <UButton>
          <UIcon name="i-lucide-shopping-cart" class="text-white h-5 w-5" />
        </UButton>
        <template #content>
          <div class="p-4 w-64">
            <p class="text-sm text-gray-500">Your cart is empty.</p>
          </div>
        </template>
      </UPopover>
    </template>
  </UHeader>
</template>
