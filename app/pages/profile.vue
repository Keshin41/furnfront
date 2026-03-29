<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const user = ref();

const data = useAPI("/user/profile");

user.value = data.data;
</script>

<template>
  <div>
    <h1>Profile</h1>

    <pre>{{ user }}</pre>
  </div>
</template>
