<script setup lang="ts">
import type { ActivityChoice } from "~/types/registration";

const props = defineProps<{
  choices: ActivityChoice[];
}>();
</script>
<template>
  <ul class="list-disc list-inside">
    <li v-for="choice in props.choices" :key="choice.id">
      {{ choice.choice }}
    </li>
  </ul>
</template>
