<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    photos: string[];
    interval?: number;
    duration?: number;
  }>(),
  {
    interval: 4000,
    duration: 800,
  },
);

const current = ref(0);

onNuxtReady(() => {
  setInterval(() => {
    current.value = (current.value + 1) % props.photos.length;
  }, props.interval);
});
</script>

<template>
  <div class="slideshow">
    <transition-group name="fade" tag="div" class="slideshow__frames">
      <div
        v-for="(src, index) in photos"
        v-show="index === current"
        :key="src"
        class="slideshow__frame"
      >
        <img :src="src" class="slideshow__img" />
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.slideshow {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.slideshow__frames {
  position: relative;
  width: 100%;
  height: 100%;
}

.slideshow__frame {
  position: absolute;
  inset: 0;
}

.slideshow__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind("`${duration}ms`") ease;
  position: absolute;
  inset: 0;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
