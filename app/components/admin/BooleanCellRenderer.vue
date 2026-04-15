<script setup lang="ts">
const props = defineProps<{
  data: boolean;
}>();
</script>
<template>
  <UBadge :color="props.data ? 'success' : 'error'" variant="outline">
    {{ props.data ? "Oui" : "Non" }}
  </UBadge>
</template>
