<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  src?: string | null;
  alt: string;
  fallback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '/logo-arrow.png',
});

const currentSrc = ref<string>(props.src || props.fallback);

const handleImageError = () => {
  currentSrc.value = props.fallback;
};
</script>
<template>
  <img
    :src="currentSrc"
    :alt="alt"
    @error="handleImageError"
    v-bind="$attrs"
  />
</template>
