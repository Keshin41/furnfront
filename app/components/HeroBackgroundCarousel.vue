<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    photos?: string[];
    interval?: number;
    duration?: number;
  }>(),
  {
    photos: () => [
      "/hero-duck.webp",
      "/hero-outdoor.webp",
      "/hero-shuffle.webp",
      "/hero-jtf.webp",
    ],
    interval: 4500,
    duration: 900,
  },
);

const current = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (props.photos.length <= 1) {
    return;
  }

  timer = setInterval(() => {
    current.value = (current.value + 1) % props.photos.length;
  }, props.interval);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <transition-group name="hero-fade" tag="div" class="relative h-full w-full">
      <div
        v-for="(src, index) in photos"
        v-show="index === current"
        :key="src"
        class="absolute inset-0"
      >
        <img
          :src="src"
          alt=""
          class="h-full w-full object-cover"
          decoding="async"
          :fetchpriority="index === 0 ? 'high' : 'low'"
          :loading="index === 0 ? 'eager' : 'lazy'"
        />
      </div>
    </transition-group>

    <div class="absolute inset-0 bg-brand-ink-deep/85"></div>
  </div>
</template>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity v-bind("`${duration}ms`") ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.hero-fade-enter-to,
.hero-fade-leave-from {
  opacity: 1;
}
</style>
