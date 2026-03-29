<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { logout } = useAuth();

const user = ref();

const data = useAPI("/user/profile");

user.value = data.data;
</script>

<template>
  <div>
    <h1>Profile</h1>

    <pre>{{ user }}</pre>
    <UButton label="Logout" @click="logout" />
  </div>
</template>
