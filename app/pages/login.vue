<script setup lang="ts">
import { z } from "zod";
const { login, token } = useAuth();

if (token.value) navigateTo("/admin");

const schema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
});

async function handleLogin() {
  try {
    console.log("Attempting login with", state.email, state.password);
    await login(state.email, state.password);
    await navigateTo("/admin");
  } catch {
    console.error("Login failed");
  }
}
</script>

<template>
  <div>
    <h1>Connexion</h1>

    <UForm :state="state" :schema="schema" @submit="handleLogin">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Email" />
      </UFormField>
      <UFormField label="Mot de passe" name="password">
        <UInput
          v-model="state.password"
          placeholder="Password"
          type="password"
        />
      </UFormField>
      <UButton type="submit" label="Connexion" />
    </UForm>
  </div>
</template>
