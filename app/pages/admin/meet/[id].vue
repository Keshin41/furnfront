<script setup lang="ts">
import z from "zod";
import type { FurmeetResponse } from "~/types/furmeet";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;

const { data, error, pending } = await useAPI<FurmeetResponse>(`/event/${id}`);

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
