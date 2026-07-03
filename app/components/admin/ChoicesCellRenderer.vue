<script setup lang="ts">
import type { ActivityChoice } from "~/types/registration";

const props = defineProps<{
  choices: ActivityChoice[];
}>();
console.log("🚀 ~ props:", props);
</script>
<template>
  <ul class="list-disc list-inside">
    <li v-for="choice in props.choices" :key="choice.id">
      {{ choice.value }}
    </li>
  </ul>
</template>
