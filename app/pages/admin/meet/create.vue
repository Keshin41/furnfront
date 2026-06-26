<script setup lang="ts">
import z from "zod";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { FurmeetActivityType, MeetUpsertPayload } from "~/types/furmeet";

useSeoMeta({
  title: "Création d'une meet",
});

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();

const createEmptyActivity = () => ({
  title: "",
  description: "",
  date: "",
  time: "12:00",
  order: 0,
  type: "OTHER" as FurmeetActivityType,
});

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  published: z.boolean(),
  opened: z.boolean(),
  eventActivities: z.array(
    z.object({
      title: z.string().min(1, "Le titre de l'activité est requis"),
      description: z.string().optional().default(""),
      date: z.string().min(1, "La date est requise"),
      time: z.string().min(1, "L'heure est requise"),
      order: z.number().optional(),
      type: z.enum(["ACTIVITY", "RESTAURANT", "BAR", "OTHER"]),
    }),
  ),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  title: "",
  description: "",
  imageUrl: "",
  published: false,
  opened: false,
  eventActivities: [createEmptyActivity()],
});

const uploadingImage = ref(false);
const saving = ref(false);

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
    state.imageUrl = result.url.replace(/^http:\/\//i, "https://");
  } catch (err) {
    console.error("Failed to upload meet image", err);
    toast.add({
      title: "Erreur lors de l'upload de l'image",
      color: "error",
    });
  } finally {
    uploadingImage.value = false;
    input.value = "";
  }
};

const addActivity = () => {
  state.eventActivities.push({
    ...createEmptyActivity(),
    order: state.eventActivities.length,
  });
};

const removeActivity = (index: number) => {
  state.eventActivities.splice(index, 1);
};

const toActivityDateTime = (date: string, time: string) => {
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("invalid-date");
  }

  return parsed.toISOString();
};

const buildPayload = (): MeetUpsertPayload => {
  const parsed = schema.parse(state);

  return {
    title: parsed.title,
    description: parsed.description,
    imageUrl: parsed.imageUrl,
    published: parsed.published,
    opened: parsed.opened,
    eventActivities: parsed.eventActivities.map((activity, index) => ({
      title: activity.title,
      description: activity.description,
      date: toActivityDateTime(activity.date, activity.time),
      order: activity.order ?? index,
      type: activity.type,
    })),
  };
};

const handleSubmit = async () => {
  saving.value = true;
  try {
    const payload = buildPayload();
    await useAPI("/event/", {
      method: "POST",
      body: payload,
    });
    toast.add({
      title: "Meet créée",
      color: "success",
    });
    await navigateTo("/admin/meet");
  } catch (err) {
    console.error("Failed to create meet", err);
    toast.add({
      title: "Erreur lors de la création de la meet",
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <div
      class="rounded-3xl border border-brand-light-blue/60 bg-linear-to-br from-brand-white via-brand-white to-brand-light-blue/20 p-4 shadow-sm md:p-6"
    >
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="mt-2 text-3xl font-black text-brand-dark-blue">
            Création d'une meet
          </h1>
          <p class="mt-2 max-w-2xl text-sm text-brand-ink">
            Prépare une nouvelle meet avec son contenu, son image et son
            programme.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            icon="i-lucide-arrow-left"
            label="Retour"
            variant="outline"
            @click="navigateTo('/admin/meet')"
          />
          <UBadge color="neutral" variant="soft" class="rounded-full px-3 py-1">
            {{ state.eventActivities.length }} activite(s)
          </UBadge>
          <UBadge
            :color="state.published ? 'success' : 'neutral'"
            variant="soft"
            class="rounded-full px-3 py-1"
          >
            {{ state.published ? "Publiee" : "Brouillon" }}
          </UBadge>
        </div>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="handleSubmit"
      >
        <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div
            class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-5 shadow-xs"
          >
            <h2 class="text-lg font-bold text-brand-dark-blue">
              Contenu principal
            </h2>
            <p class="mb-4 mt-1 text-sm text-brand-ink">
              Informations visibles sur la page publique.
            </p>

            <div class="space-y-4">
              <UFormField label="Titre" name="title">
                <UInput
                  v-model="state.title"
                  placeholder="Ex: Meet de printemps"
                  size="xl"
                />
              </UFormField>

              <UFormField label="Description" name="description">
                <AdminRichTextEditor
                  v-model="state.description"
                  placeholder="Résumé de la meet"
                  min-height="150px"
                />
              </UFormField>
            </div>
          </div>

          <div
            class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-5 shadow-xs"
          >
            <h2 class="text-lg font-bold text-brand-dark-blue">Publication</h2>
            <p class="mb-4 mt-1 text-sm text-brand-ink">
              Contrôle l'état de diffusion et les inscriptions.
            </p>

            <div class="space-y-4">
              <UFormField label="Publié" name="published">
                <USwitch v-model="state.published" />
              </UFormField>
              <UFormField label="Ouvert aux inscriptions" name="opened">
                <USwitch v-model="state.opened" />
              </UFormField>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-5 shadow-xs"
        >
          <h2 class="text-lg font-bold text-brand-dark-blue">
            Image de couverture
          </h2>
          <p class="mb-4 mt-1 text-sm text-brand-ink">
            Ajoute une URL ou importe une image locale.
          </p>

          <div class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div class="space-y-3">
              <UFormField label="Image (URL)" name="imageUrl">
                <UInput v-model="state.imageUrl" placeholder="https://..." />
              </UFormField>

              <UFormField label="Importer une image locale">
                <input
                  type="file"
                  accept="image/*"
                  :disabled="uploadingImage"
                  class="block w-full rounded-xl border border-brand-light-blue/70 bg-brand-white px-3 py-2 text-sm"
                  @change="handleImageUpload"
                />
                <p v-if="uploadingImage" class="mt-1 text-xs text-brand-sky">
                  Upload en cours...
                </p>
              </UFormField>
            </div>

            <div
              class="-mt-17 rounded-xl border border-brand-light-blue/70 bg-brand-light-blue/15 p-3"
            >
              <p
                class="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-sky"
              >
                Apercu
              </p>
              <ImageWithFallback
                v-if="state.imageUrl"
                :src="state.imageUrl"
                :alt="state.title || 'Apercu image meet'"
                :fallback="'/furmeet/thumbnail/default.png'"
                class="h-48 w-full rounded-lg border border-brand-light-blue/70 object-cover"
              />
              <div
                v-else
                class="flex h-44 items-center justify-center rounded-lg border border-dashed border-brand-light-blue/70 text-sm text-brand-sky"
              >
                Aucune image selectionnee
              </div>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-5 shadow-xs"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-brand-dark-blue">Programme</h2>
              <p class="mt-1 text-sm text-brand-ink">
                Construis chaque etape de la meet.
              </p>
            </div>
            <UButton
              size="sm"
              variant="outline"
              icon="i-lucide-plus"
              @click="addActivity"
            >
              Ajouter une activite
            </UButton>
          </div>

          <div
            v-if="state.eventActivities.length === 0"
            class="rounded-xl border border-dashed border-brand-light-blue/70 bg-brand-light-blue/10 p-5 text-sm text-brand-sky"
          >
            Aucune activite. Ajoute au moins une etape au programme.
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="(activity, index) in state.eventActivities"
              :key="index"
              class="rounded-2xl border border-brand-light-blue/60 bg-linear-to-br from-brand-white to-brand-light-blue/10 p-4 shadow-xs"
            >
              <div class="mb-3 flex items-center justify-between gap-3">
                <div class="inline-flex items-center gap-2">
                  <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white"
                  >
                    {{ index + 1 }}
                  </span>
                  <p class="text-sm font-semibold text-brand-dark-blue">
                    Etape du programme
                  </p>
                </div>
                <UButton
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  @click="removeActivity(index)"
                >
                  Supprimer
                </UButton>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <UFormField
                  :label="'Type'"
                  :name="'eventActivities[' + index + '].type'"
                >
                  <USelect
                    v-model="activity.type"
                    :items="activityTypeOptions"
                    class="min-w-30"
                  />
                </UFormField>

                <UFormField
                  :label="'Ordre'"
                  :name="'eventActivities[' + index + '].order'"
                >
                  <UInput
                    v-model.number="activity.order"
                    type="number"
                    min="0"
                    step="1"
                  />
                </UFormField>
              </div>

              <div class="mt-4 space-y-4">
                <UFormField :name="'eventActivities[' + index + '].title'">
                  <UInput
                    v-model="activity.title"
                    class="w-full"
                    placeholder="Titre de l'activite"
                  />
                </UFormField>

                <UFormField
                  :label="'Description'"
                  :name="'eventActivities[' + index + '].description'"
                >
                  <AdminRichTextEditor
                    v-model="activity.description"
                    placeholder="Description de l'activite"
                    min-height="80px"
                  />
                </UFormField>

                <div class="grid gap-4 md:grid-cols-2">
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
            </article>
          </div>
        </section>

        <div class="sticky bottom-4 z-10 mt-2 flex justify-end">
          <div
            class="rounded-2xl border border-brand-light-blue/60 bg-brand-white/95 p-2 shadow-lg backdrop-blur"
          >
            <UButton
              type="submit"
              :loading="saving"
              size="lg"
              label="Créer la meet"
            />
          </div>
        </div>
      </UForm>
    </div>
  </div>
</template>
