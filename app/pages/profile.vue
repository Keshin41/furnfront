<script setup lang="ts">
import { useApi } from '~/composables/useAPI';


definePageMeta({ middleware: 'auth' })

const api = useApi()

const user = ref()

const data = await api('/user/profile');

user.value = data
</script>

<template>
  <div>
    <h1>Profile</h1>

    <pre>{{ user }}</pre>
  </div>
</template>