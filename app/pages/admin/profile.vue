<script setup lang="ts">
import z from "zod";
import type { UserProfile } from "~/types/user";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();
const { $api } = useNuxtApp();

const profileSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  nickname: z.string().min(1, "Le pseudo est requis"),
  email: z.email("Email invalide"),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "La confirmation doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ProfileSchema = z.output<typeof profileSchema>;
type PasswordSchema = z.output<typeof passwordSchema>;

const { data, error, pending, refresh } = await useAPI<UserProfile>("/user/profile");

const profileState = reactive<ProfileSchema>({
  firstname: data.value?.firstname ?? "",
  lastname: data.value?.lastname ?? "",
  nickname: data.value?.nickname ?? "",
  email: data.value?.email ?? "",
  address: data.value?.address ?? "",
  postalCode: data.value?.postalCode ?? "",
  city: data.value?.city ?? "",
});

const passwordState = reactive<PasswordSchema>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const savingProfile = ref(false);
const savingPassword = ref(false);

const toNullable = (value?: string) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const handleProfileSubmit = async () => {
  savingProfile.value = true;

  try {
    const payload = profileSchema.parse(profileState);

    const updatedProfile = await $api<UserProfile>("/user/profile", {
      method: "PATCH",
      body: {
        ...payload,
        address: toNullable(payload.address),
        postalCode: toNullable(payload.postalCode),
        city: toNullable(payload.city),
      },
    });

    Object.assign(profileState, {
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname,
      nickname: updatedProfile.nickname,
      email: updatedProfile.email,
      address: updatedProfile.address ?? "",
      postalCode: updatedProfile.postalCode ?? "",
      city: updatedProfile.city ?? "",
    });

    toast.add({
      title: "Profil mis à jour",
      color: "success",
    });

    await refresh();
  } catch (err) {
    console.error("Failed to update profile", err);
    toast.add({
      title: "Erreur lors de la mise à jour du profil",
      color: "error",
    });
  } finally {
    savingProfile.value = false;
  }
};

const handlePasswordSubmit = async () => {
  savingPassword.value = true;

  try {
    const payload = passwordSchema.parse(passwordState);
    await $api<{ success: true }>("/user/password", {
      method: "PATCH",
      body: payload,
    });

    Object.assign(passwordState, {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.add({
      title: "Mot de passe mis à jour",
      color: "success",
    });
  } catch (err) {
    console.error("Failed to update password", err);
    toast.add({
      title: "Erreur lors de la mise à jour du mot de passe",
      color: "error",
    });
  } finally {
    savingPassword.value = false;
  }
};
</script>

<template>
  <div class="w-full p-4">
    <h1 class="mb-6 text-2xl font-bold text-primary">Mon profil admin</h1>

    <div v-if="pending">Chargement...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>
    <div v-else class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div>
            <h2 class="text-lg font-semibold">Informations du compte</h2>
            <p class="text-sm text-neutral-500">
              Modifie tes informations personnelles et ton email de connexion.
            </p>
          </div>
        </template>

        <UForm :schema="profileSchema" :state="profileState" @submit="handleProfileSubmit">
          <div class="space-y-4">
            <UFormField label="Prénom" name="firstname">
              <UInput v-model="profileState.firstname" />
            </UFormField>

            <UFormField label="Nom" name="lastname">
              <UInput v-model="profileState.lastname" />
            </UFormField>

            <UFormField label="Pseudo" name="nickname">
              <UInput v-model="profileState.nickname" />
            </UFormField>

            <UFormField label="Email" name="email">
              <UInput v-model="profileState.email" type="email" />
            </UFormField>

            <UFormField label="Adresse" name="address">
              <UInput v-model="profileState.address" />
            </UFormField>

            <UFormField label="Code postal" name="postalCode">
              <UInput v-model="profileState.postalCode" />
            </UFormField>

            <UFormField label="Ville" name="city">
              <UInput v-model="profileState.city" />
            </UFormField>

            <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
              Rôle actuel : <span class="font-semibold text-neutral-900">{{ data?.role }}</span>
            </div>

            <UButton
              type="submit"
              label="Enregistrer le profil"
              :loading="savingProfile"
            />
          </div>
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="text-lg font-semibold">Mot de passe</h2>
            <p class="text-sm text-neutral-500">
              Saisis ton mot de passe actuel pour définir un nouveau mot de passe.
            </p>
          </div>
        </template>

        <UForm :schema="passwordSchema" :state="passwordState" @submit="handlePasswordSubmit">
          <div class="space-y-4">
            <UFormField label="Mot de passe actuel" name="currentPassword">
              <UInput v-model="passwordState.currentPassword" type="password" />
            </UFormField>

            <UFormField label="Nouveau mot de passe" name="newPassword">
              <UInput v-model="passwordState.newPassword" type="password" />
            </UFormField>

            <UFormField label="Confirmer le mot de passe" name="confirmPassword">
              <UInput v-model="passwordState.confirmPassword" type="password" />
            </UFormField>

            <UButton
              type="submit"
              label="Mettre à jour le mot de passe"
              :loading="savingPassword"
            />
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>