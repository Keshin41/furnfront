<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  src?: string | null;
  alt: string;
  fallback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '/logo-arrow.png',
});

const hasFailed = ref(false);

watch(
  () => props.src,
  () => {
    // Reset error state whenever source changes (e.g., changing SKU variant).
    hasFailed.value = false;
  },
);

const currentSrc = computed<string>(() => {
  if (hasFailed.value) {
    return props.fallback;
  }
  return props.src || props.fallback;
});

const handleImageError = () => {
  hasFailed.value = true;
};
</script>
<template>
  <img
    :src="currentSrc"
    :alt="alt"
    loading="lazy"
    decoding="async"
    v-bind="$attrs"
    @error="handleImageError"
  />
</template>
