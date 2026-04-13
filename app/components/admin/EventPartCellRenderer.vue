<script setup lang="ts">
import type { FurmeetActivity } from "~/types/furmeet";

const props = defineProps<{
  eventActivities: FurmeetActivity[];
}>();
</script>
<template>
  <ul class="list-disc list-inside">
    <li v-for="activity in props.eventActivities" :key="activity.id">
      {{ activity.title }}
    </li>
  </ul>
</template>
