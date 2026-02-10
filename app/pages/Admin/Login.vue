<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { LoaderCircle } from "lucide-vue-next";
import { watch } from "vue";
import z from "zod";

definePageMeta({
  layout: "app-header",
});

const schema = z.object({
  email: z.email("Mail invalide"),
  password: z.string("Un mot de passe est requis"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const { success, error } = useNotification();

watch(
  () => true,
  (flash: any) => {
    if (flash?.success) {
      success("Succès", flash.success);
    }
    if (flash?.error) {
      error("Erreur", flash.error);
    }
  },
  { immediate: true, deep: true },
);

const processing = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  processing.value = true;
  console.log(event.data);
}

useHead({
  title: "Connexion Admin",
});
</script>

<template>
  <div class="relative bg-linear-to-br from-[#2c3e50] to-[#34495e] py-16">
    <NotificationContainer />

    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-md">
        <div
          class="rounded-lg border border-white/15 bg-[#1f2a3b] p-8 shadow-2xl shadow-black/30"
        >
          <div class="mb-6 text-center">
            <h1 class="text-3xl font-semibold text-cyan-200">
              Connexion Admin
            </h1>
            <p class="mt-2 text-sm text-cyan-100/80">
              Accéder à la console d'administration
            </p>
          </div>

          <UForm
            class="flex flex-col gap-6"
            :schema="schema"
            :state="state"
            @submit="onSubmit"
          >
            <div class="grid gap-6">
              <UFormField name="email" label="Email">
                <UInput
                  v-model="state.email"
                  type="email"
                  required
                  autofocus
                  autocomplete="email"
                  placeholder="admin@furntours.com"
                  class="border-cyan-300/30 bg-[#1b2433] text-white focus:border-cyan-300 focus:ring-cyan-300/60"
                />
              </UFormField>
              <UFormField name="password" label="Mot de passe">
                <UInput
                  v-model="state.password"
                  name="password"
                  type="password"
                  required
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="border-cyan-300/30 bg-[#1b2433] text-white focus:border-cyan-300 focus:ring-cyan-300/60"
                />
              </UFormField>
            </div>

            <UButton
              type="submit"
              class="mt-2 w-full bg-linear-to-r from-cyan-300 to-light-blue text-[#0f172a] hover:from-cyan-200 hover:to-cyan-300"
              :disabled="processing"
            >
              <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
              <span v-else>Se connecter</span>
            </UButton>
          </UForm>

          <p class="mt-6 text-center text-xs text-cyan-50/70">
            💡 Astuce : Utilisez le code Konami sur les pages publiques
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
