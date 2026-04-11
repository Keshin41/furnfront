<script setup lang="ts">
import { computed } from 'vue'
import { useAttrs } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = defineProps({
  to: { type: String, required: false },
  href: { type: String, required: false },
  target: { type: String, required: false },
  rel: { type: String, required: false },
  label: { type: String, required: false, default: '' },
  bgClass: { type: String, required: false, default: 'bg-brand-yellow' },
  textClass: { type: String, required: false, default: 'text-brand-green' },
  size: { type: String as () => Size, required: false, default: 'lg' },
  hoverClass: { type: String, required: false, default: '' },
})

const attrs = useAttrs()
const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  const base = 'rounded-full font-semibold shadow-lg px-8 py-3'
  return [base, props.bgClass, props.textClass, props.hoverClass].filter(Boolean).join(' ')
})

const extraAttrs = attrs

const onClick = (event: Event) => {
  emit('click', event)
}
</script>

<template>
  <UButton
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
    :class="buttonClass"
    :size="size"
    @click="onClick"
    v-bind="extraAttrs"
  >
    <slot>{{ label }}</slot>
  </UButton>
</template>

