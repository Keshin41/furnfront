<script setup lang="ts">
const { pageTitle, title, description } = defineProps<{
  pageTitle: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <section
    class="relative overflow-hidden bg-brand-blue py-20 text-brand-white"
  >
    <div class="pointer-events-none absolute inset-0 opacity-10">
      <div
        class="absolute -left-16 -top-16 h-96 w-96 rounded-full bg-brand-white blur-3xl"
      />
      <div
        class="absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-brand-yellow blur-3xl"
      />
    </div>
    <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
      <p
        class="text-sm font-semibold uppercase tracking-widest text-brand-white/70"
      >
        {{ pageTitle }}
      </p>
      <h1 class="mt-3 text-5xl font-bold leading-tight md:text-6xl">
        {{ title }}
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-brand-white/85">
        {{ description }}
      </p>
    </div>
  </section>
</template>
