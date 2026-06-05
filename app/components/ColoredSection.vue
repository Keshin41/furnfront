<script setup lang="ts">
import type { ClassValue } from "vue";

interface Props {
  backgroundColor: ClassValue;
  title: string;
  textColor?: ClassValue;
  titleColor?: ClassValue;
}

const {
  backgroundColor,
  title,
  textColor = "default",
  titleColor = "",
} = defineProps<Props>();
</script>
<template>
  <section :class="`bg-${backgroundColor} py-16 text-${textColor}`">
    <div class="mx-auto max-w-4xl px-6">
      <h2 class="mb-4 text-3xl font-semibold" :class="`text-${titleColor}`">
        {{ title }}
      </h2>
      <slot />
    </div>
  </section>
</template>
