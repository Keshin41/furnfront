<script setup lang="ts">
import z from "zod";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { FurmeetActivityType, MeetUpsertPayload } from "~/types/furmeet";

useSeoMeta({
  title: "Création d'un event",
});

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();

const FieldType = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  SELECT: "SELECT",
  CHECKBOX: "CHECKBOX",
  RADIO: "RADIO",
} as const;

type FieldTypeType = (typeof FieldType)[keyof typeof FieldType];

type ActivityQuestionItem = { label: string; value: FieldTypeType };

const questionTypeItems: ActivityQuestionItem[] = [
  { label: "Texte", value: FieldType.TEXT },
  { label: "Nombre", value: FieldType.NUMBER },
  { label: "Liste", value: FieldType.SELECT },
  { label: "Case à cocher", value: FieldType.CHECKBOX },
  { label: "Bouton radio", value: FieldType.RADIO },
];

type ActivityTypeItem = { label: string; value: FurmeetActivityType };

const activityTypeItems: ActivityTypeItem[] = [
  { label: "Activite", value: "ACTIVITY" },
  { label: "Restaurant", value: "RESTAURANT" },
  { label: "Bar", value: "BAR" },
  { label: "Autre", value: "OTHER" },
];

const setActivityType = (
  index: number,
  value: FurmeetActivityType | undefined,
) => {
  const activity = state.eventActivities[index];
  if (!activity || !value) {
    return;
  }
  activity.type = value;
};

const addActivityQuestion = (activityIndex: number) => {
  const activity = state.eventActivities[activityIndex];
  if (!activity) {
    return;
  }
  if (!activity.activityQuestions) {
    activity.activityQuestions = [] as Array<
      ReturnType<typeof createEmptyQuestion>
    >;
  }
  activity.activityQuestions.push(createEmptyQuestion());
};

const removeActivityQuestion = (
  activityIndex: number,
  questionIndex: number,
) => {
  const activity = state.eventActivities[activityIndex];
  if (!activity || !activity.activityQuestions) {
    return;
  }
  activity.activityQuestions.splice(questionIndex, 1);
};

const setActivityQuestionType = (
  activityIndex: number,
  questionIndex: number,
  value: FieldTypeType | undefined,
) => {
  const activity = state.eventActivities[activityIndex];
  const question = activity?.activityQuestions?.[questionIndex];
  if (!question || !value) {
    return;
  }
  question.type = value;
};

const choiceIdCounter = ref(0);

const createEmptyChoice = (): { id: string; label: string; value: string } => {
  return {
    id: `choice-${++choiceIdCounter.value}-${Date.now()}`,
    label: "",
    value: "",
  };
};

const addChoice = (activityIndex: number, questionIndex: number) => {
  const activity = state.eventActivities[activityIndex];
  const question = activity?.activityQuestions?.[questionIndex];
  if (!question) {
    return;
  }
  if (!question.choices) {
    question.choices = [];
  }
  question.choices.push(createEmptyChoice());
};

const removeChoice = (
  activityIndex: number,
  questionIndex: number,
  choiceIndex: number,
) => {
  const activity = state.eventActivities[activityIndex];
  const question = activity?.activityQuestions?.[questionIndex];
  if (!question?.choices) {
    return;
  }
  question.choices.splice(choiceIndex, 1);
};

const moveChoice = (
  activityIndex: number,
  questionIndex: number,
  choiceIndex: number,
  direction: -1 | 1,
) => {
  const activity = state.eventActivities[activityIndex];
  const question = activity?.activityQuestions?.[questionIndex];
  if (!question?.choices) {
    return;
  }
  const newIndex = choiceIndex + direction;
  if (newIndex < 0 || newIndex >= question.choices.length) {
    return;
  }
  const temp = question.choices[choiceIndex]!;
  question.choices[choiceIndex] = question.choices[newIndex]!;
  question.choices[newIndex] = temp;
};

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
      activityQuestions: z
        .array(
          z.object({
            label: z.string().min(1, "Label obligatoire"),
            order: z.number().optional(),
            type: z.enum(["TEXT", "NUMBER", "SELECT", "CHECKBOX", "RADIO"]),
            required: z.boolean(),
            choices: z
              .array(
                z.object({
                  id: z.string(),
                  label: z.string().min(1, "Le libellé est requis"),
                  value: z.string().min(1, "La valeur est requise"),
                }),
              )
              .optional(),
          }),
        )
        .optional(),
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
      activityQuestions: activity.activityQuestions?.map((question) => ({
        label: question.label,
        order: question.order,
        type: question.type,
        required: question.required,
        choices: question.choices?.map((c) => ({
          id: c.id,
          label: c.label,
          value: c.value,
        })),
      })),
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
      title: "Event créé",
      color: "success",
    });
    await navigateTo("/admin/meet");
  } catch (err) {
    console.error("Failed to create event", err);
    toast.add({
      title: "Erreur lors de la création de l'event",
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
                    :model-value="activity.type"
                    :items="activityTypeItems"
                    class="min-w-30"
                    @update:model-value="
                      (value) =>
                        setActivityType(index, value as FurmeetActivityType)
                    "
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

                <section
                  class="rounded-2xl border border-brand-light-blue/60 bg-brand-white p-4"
                >
                  <div
                    class="mb-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <h3 class="text-base font-semibold text-brand-dark-blue">
                        Questions de l'activité
                      </h3>
                      <p class="text-sm text-brand-ink">
                        Ajoute des questions demandées lors de l'inscription.
                      </p>
                    </div>
                    <UButton
                      size="sm"
                      variant="outline"
                      icon="i-lucide-plus"
                      @click.prevent="addActivityQuestion(index)"
                    >
                      Ajouter une question
                    </UButton>
                  </div>

                  <div
                    v-if="
                      !activity.activityQuestions ||
                      activity.activityQuestions.length === 0
                    "
                    class="rounded-xl border border-dashed border-brand-light-blue/70 bg-brand-light-blue/10 p-4 text-sm text-brand-sky"
                  >
                    Aucune question. Ajoute une question si tu veux demander des
                    informations supplémentaires.
                  </div>

                  <div v-else class="space-y-4">
                    <article
                      v-for="(question, qIndex) in activity.activityQuestions"
                      :key="qIndex"
                      class="rounded-2xl border border-brand-light-blue/60 bg-linear-to-br from-brand-white to-brand-light-blue/10 p-4"
                    >
                      <div
                        class="mb-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <p class="text-sm font-semibold text-brand-dark-blue">
                            Question {{ qIndex + 1 }}
                          </p>
                          <p class="text-xs text-brand-ink">
                            Cette question sera liée à l'activité.
                          </p>
                        </div>
                        <UButton
                          size="xs"
                          color="error"
                          variant="soft"
                          icon="i-lucide-trash-2"
                          @click.prevent="removeActivityQuestion(index, qIndex)"
                        >
                          Supprimer
                        </UButton>
                      </div>

                      <div class="grid gap-4 md:grid-cols-2">
                        <UFormField
                          :name="
                            'eventActivities[' +
                            index +
                            '].activityQuestions[' +
                            qIndex +
                            '].label'
                          "
                        >
                          <UInput
                            v-model="question.label"
                            placeholder="Intitulé de la question"
                          />
                        </UFormField>

                        <UFormField
                          label="Type"
                          :name="
                            'eventActivities[' +
                            index +
                            '].activityQuestions[' +
                            qIndex +
                            '].type'
                          "
                        >
                          <USelect
                            :model-value="question.type"
                            :items="questionTypeItems"
                            class="min-w-30"
                            @update:model-value="
                              (value) =>
                                setActivityQuestionType(
                                  index,
                                  qIndex,
                                  value as FieldTypeType,
                                )
                            "
                          />
                        </UFormField>
                      </div>

                      <div class="grid gap-4 md:grid-cols-2">
                        <UFormField
                          label="Requise"
                          :name="
                            'eventActivities[' +
                            index +
                            '].activityQuestions[' +
                            qIndex +
                            '].required'
                          "
                        >
                          <USwitch v-model="question.required" />
                        </UFormField>

                        <UFormField
                          label="Ordre"
                          :name="
                            'eventActivities[' +
                            index +
                            '].activityQuestions[' +
                            qIndex +
                            '].order'
                          "
                        >
                          <UInput
                            v-model.number="question.order"
                            type="number"
                            min="0"
                            step="1"
                          />
                        </UFormField>
                      </div>

                      <!-- Options de la question (for SELECT, CHECKBOX, RADIO) -->
                      <div
                        v-if="
                          question.type === 'SELECT' ||
                          question.type === 'CHECKBOX' ||
                          question.type === 'RADIO'
                        "
                        class="mt-4"
                      >
                        <div class="mb-2 flex items-center justify-between">
                          <h4
                            class="text-sm font-semibold text-brand-dark-blue"
                          >
                            Options
                          </h4>
                          <UButton
                            size="xs"
                            variant="soft"
                            icon="i-lucide-plus"
                            @click.prevent="addChoice(index, qIndex)"
                          >
                            Ajouter une option
                          </UButton>
                        </div>

                        <div
                          v-if="
                            !question.choices || question.choices.length === 0
                          "
                          class="rounded-xl border border-dashed border-brand-light-blue/70 bg-brand-light-blue/10 p-3 text-sm text-brand-sky"
                        >
                          Aucune option. Ajoute des options pour que
                          l'utilisateur puisse choisir.
                        </div>

                        <div v-else class="space-y-2">
                          <div
                            v-for="(choice, cIndex) in question.choices"
                            :key="choice.id"
                            class="flex items-center gap-2 rounded-lg border border-brand-light-blue/60 bg-brand-white p-2"
                          >
                            <div class="flex flex-col gap-0.5">
                              <UButton
                                size="xs"
                                variant="ghost"
                                icon="i-lucide-chevron-up"
                                :disabled="cIndex === 0"
                                @click="moveChoice(index, qIndex, cIndex, -1)"
                              />
                              <UButton
                                size="xs"
                                variant="ghost"
                                icon="i-lucide-chevron-down"
                                :disabled="
                                  cIndex === question.choices.length - 1
                                "
                                @click="moveChoice(index, qIndex, cIndex, 1)"
                              />
                            </div>

                            <UInput
                              v-model="choice.label"
                              placeholder="Libellé de l'option"
                              size="sm"
                              class="flex-1"
                            />

                            <UInput
                              v-model="choice.value"
                              placeholder="Valeur"
                              size="sm"
                              class="w-28"
                            />

                            <UButton
                              size="xs"
                              color="error"
                              variant="soft"
                              icon="i-lucide-trash-2"
                              @click.prevent="
                                removeChoice(index, qIndex, cIndex)
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>
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
