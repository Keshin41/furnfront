<script setup lang="ts">
const props = defineProps<{
  size?: "small" | "medium" | "large";
  variant?: "default" | "no-tail" | "arrow" | "pride";
}>();
</script>

<template>
  <img :src="`/logo-${variant ?? 'default'}.png`" alt="Logo" />
</template>
