<script setup lang="ts">
import z from "zod";
import type { FurmeetResponse } from "~/types/furmeet";
import ImageWithFallback from "~/components/ImageWithFallback.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;

const { data, error, pending, refresh } = await useAPI<FurmeetResponse>(`/event/${id}`);

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  published: z.boolean(),
  opened: z.boolean(),
  eventActivities: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Le titre de l'activité est requis"),
      description: z.string().optional(),
      date: z.string(),
      time: z.string(),
      order: z.number().optional(),
    }),
  ),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  title: data.value?.title ?? "",
  description: data.value?.description ?? "",
  published: data.value?.published ?? false,
  opened: data.value?.opened ?? false,
  eventActivities:
    data.value?.eventActivities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      date: activity.date.split("T")[0] ?? "", // Extract date part
      time: activity.date.split("T")[1]?.substring(0, 5) ?? "00:00", // Extract time part
      order: activity.order,
    })) ?? [],
});
const meetImageUrl = ref(data.value?.imageUrl ?? "");
const uploadingImage = ref(false);
const savingImage = ref(false);

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  uploadingImage.value = true;
  try {
    const { $api } = useNuxtApp();
    const result = await $api<{ url: string }>("/event/upload-image", {
      method: "POST",
      body: formData,
    });
    meetImageUrl.value = result.url;
  } catch (err) {
    console.error("Failed to upload meet image", err);
    alert("Une erreur est survenue lors de l'upload de l'image.");
  } finally {
    uploadingImage.value = false;
    input.value = "";
  }
};

const saveMeetImage = async () => {
  savingImage.value = true;
  try {
    await useAPI(`/event/${id}/image`, {
      method: "PUT",
      body: {
        imageUrl: meetImageUrl.value,
      },
    });
    await refresh();
    alert("Image de la meet enregistrée.");
  } catch (err) {
    console.error("Failed to save meet image", err);
    alert("Une erreur est survenue lors de l'enregistrement de l'image.");
  } finally {
    savingImage.value = false;
  }
};
console.log("🚀 ~ state:", typeof data.value?.eventActivities[0]?.date);
</script>
<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4">Admin - Meet Details</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <UForm
        :schema="schema"
        :state="state"
        class=""
        @submit="() => console.log('Form submitted', state)"
      >
        <div class="mb-6 rounded-2xl border border-brand-light-blue/50 bg-brand-white p-4">
          <h2 class="text-lg font-semibold mb-3 text-primary">Image de la meet</h2>
          <UFormField label="Image (URL)">
            <UInput v-model="meetImageUrl" placeholder="https://..." />
          </UFormField>
          <UFormField label="Importer une image locale" class="mt-3">
            <input
              type="file"
              accept="image/*"
              :disabled="uploadingImage"
              class="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              @change="handleImageUpload"
            />
            <p v-if="uploadingImage" class="mt-1 text-xs text-neutral-500">
              Upload en cours...
            </p>
          </UFormField>

          <div v-if="meetImageUrl" class="mt-3">
            <ImageWithFallback
              :src="meetImageUrl"
              :alt="state.title || 'Aperçu image meet'"
              :fallback="'/furmeet/thumbnail/default.png'"
              class="h-36 w-full max-w-sm rounded-lg border border-neutral-200 object-cover"
            />
          </div>

          <UButton
            class="mt-3"
            :loading="savingImage"
            @click="saveMeetImage"
          >
            Enregistrer l'image
          </UButton>
        </div>

        <UFormField label="Titre" name="title">
          <UInput
            v-model="state.title"
            placeholder="Entrez le titre de la meet"
          />
        </UFormField>
        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Entrez la description du meet"
          />
        </UFormField>
        <UFormField label="Publié" name="published">
          <USwitch v-model="state.published" />
        </UFormField>
        <UFormField label="Ouvert aux inscriptions" name="opened">
          <USwitch v-model="state.opened" />
        </UFormField>
        <div class="col-span-2 mt-4">
          <h2 class="text-xl font-semibold mb-2">Activités</h2>
          <div
            v-for="(activity, index) in state.eventActivities"
            :key="index"
            class="overflow-hidden rounded-3xl border border-brand-light-blue/50 bg-brand-white shadow-sm p-4 mb-4"
          >
            <UFormField :name="'eventActivities[' + index + '].title'">
              <UInput
                v-model="activity.title"
                class="w-full"
                placeholder="Entrez le titre de l'activité"
              />
            </UFormField>
            <UFormField
              :label="'Description'"
              :name="'eventActivities[' + index + '].description'"
            >
              <UTextarea
                v-model="activity.description"
                class="w-full"
                placeholder="Entrez la description de l'activité"
              />
            </UFormField>
            <UFormField
              label="Date"
              :name="'eventActivities[' + index + '].date'"
              :validate-on-input-delay="2000"
            >
              <UInput v-model="activity.date" type="date" />
            </UFormField>
            <UFormField
              label="Heure"
              :name="'eventActivities[' + index + '].time'"
              :validate-on-input-delay="2000"
            >
              <UInput v-model="activity.time" type="time" />
            </UFormField>
          </div>
        </div>
      </UForm>
    </div>
  </div>
</template>
