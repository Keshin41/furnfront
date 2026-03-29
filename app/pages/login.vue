<script setup lang="ts">
import { z } from "zod";
const { login, token } = useAuth();

const schema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
});

async function handleLogin() {
  try {
    await login(state.email, state.password);
    await navigateTo("/profile");
  } catch {
    console.error("Login failed");
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <UForm :state="state" :schema="schema" @submit="handleLogin">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Email" />
      </UFormField>
      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          placeholder="Password"
          type="password"
        />
      </UFormField>
      <UButton type="submit" label="Login" />
    </UForm>
  </div>
</template>
