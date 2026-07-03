<script setup lang="ts">
import type { Activity } from "~/types/registration";

const props = defineProps<{
  eventActivities: Activity[];
}>();
</script>
<template>
  <ul class="list-disc list-inside">
    <li v-for="activity in props.eventActivities" :key="activity.id">
      {{ activity.label }}
    </li>
  </ul>
</template>
