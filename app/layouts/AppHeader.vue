<script setup lang="ts">
import { useKonamiCode } from "~/composables/useKonamiCode";

useKonamiCode();

const route = useRoute();

console.log("Current route:", route.meta);
</script>

<template>
  <AppShell
    variant="header"
    class="flex min-h-screen flex-col overflow-visible"
  >
    <AppHeader />

    <AppContent class="flex-1">
      <slot />
    </AppContent>

    <AppFooter />
  </AppShell>
</template>
