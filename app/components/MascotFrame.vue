<template>
  <div class="relative" :class="`${height} ${width}`">
    <div class="absolute inset-0 rounded-full" :class="outerBg"></div>
    <div class="absolute inset-6 rounded-[36px] shadow-xl" :class="innerBg">
      <img :src="imageSrc" :alt="imageAlt" class="h-full w-full object-contain">
    </div>
    <div class="absolute -top-2 left-6 h-3 w-3 rounded-full bg-white"></div>
    <div class="absolute top-10 right-5 h-2.5 w-2.5 rounded-full bg-white"></div>
    <div class="absolute bottom-6 left-4 h-2.5 w-2.5 rounded-full bg-white"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageSrc?: string
  imageAlt?: string
  outerBg?: string
  innerBg?: string
  height?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageSrc: "/mascote.png",
  imageAlt: "Mascotte Fur'N'Tours",
  outerBg: 'bg-linear-to-b from-brand-light-blue/30 to-transparent',
  innerBg: 'bg-linear-to-b from-brand-yellow to-brand-mango',
  height: 'h-115',
  width: 'w-90'
})
</script>