<script setup lang="ts">

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  try {
    loading.value = true

    const response = await $fetch<{ accessToken: string }>('http://localhost:3001/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    localStorage.setItem('token', response.accessToken)

    await navigateTo('/profile')

  } catch {
    error.value = 'Invalid login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
	<div>
		<h1>Login</h1>
	
		<UInput v-model="email" placeholder="Email"/>
	
		<UInput v-model="password" placeholder="Password"/>
	
		<UButton label="Login" @click="login" />
	</div>
</template>