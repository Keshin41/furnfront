<script setup lang="ts">
const links = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-gray-500">© 2025 MyApp. All rights reserved.</p>
    </template>

    <template #right>
      <UButton
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        variant="ghost"
        size="xs"
      >
        {{ link.label }}
      </UButton>
    </template>
  </UFooter>
</template>
