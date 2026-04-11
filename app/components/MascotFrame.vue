<script setup lang="ts">
interface Props {
  imageSrc?: string;
  imageAlt?: string;
  outerBg?: string;
  innerBg?: string;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  imageSrc: "/mascote.png",
  imageAlt: "Mascotte Fur'N'Tours",
  outerBg: "bg-linear-to-b from-brand-light-blue/30 to-transparent",
  innerBg: "bg-linear-to-b from-brand-yellow to-brand-mango",
  height: "h-115",
  width: "w-90",
});
</script>

<template>
  <div class="relative" :class="`${height} ${width}`">
    <div class="absolute inset-0 rounded-full" :class="outerBg" />
    <div class="absolute inset-6 rounded-[36px] shadow-xl" :class="innerBg">
      <img
        :src="imageSrc"
        :alt="imageAlt"
        class="h-full w-full object-contain"
      />
    </div>
  </div>
</template>
