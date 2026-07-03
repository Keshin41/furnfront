<script setup lang="ts">
import type { Activity } from "~/types/registration";

const props = defineProps<{
  eventActivities: Activity;
}>();
</script>
<template>
  <ul class="list-disc list-inside">
    {{
      props.eventActivities.label
    }}
  </ul>
</template>
