<script setup lang="ts">
import { z } from "zod";

const route = useRoute();
const id = route.params.id as string;

const toast = useToast();

export type QuestionDto = {
  id: string;
  question: string;
  required: boolean;
  type: "TEXT" | "NUMBER" | "SELECT" | "CHECKBOX" | "RADIO";
  options?: { id: string; label: string; value: string }[];
};

export type FormDto = {
  id: string;
  activity: string;
  questions: QuestionDto[];
}[];

export type AnswerDto = {
  questionId: string;
  answer: string;
};

export type ActivityAnswersDto = {
  activityId: string;
  present: boolean;
  answers: AnswerDto[];
};

export type FormAnswersDto = {
  email: string;
  activities: ActivityAnswersDto[];
};

const { data, error, pending } = await useAPI<FormDto | null>(
  `/event/${id}/form`,
);

type Participation = "yes" | "no" | undefined;

interface FormState {
  email: string;
  participations: Record<string, Participation>;
  answers: Record<string, string>;
}

function buildInitialState(form: FormDto | null | undefined): FormState {
  const participations: Record<string, Participation> = {};
  const answers: Record<string, string> = {};

  form?.forEach((section) => {
    participations[section.id] = undefined;
    section.questions.forEach((question) => {
      answers[question.id] = question.type === "CHECKBOX" ? "[]" : "";
    });
  });

  return { email: "", participations, answers };
}

const state = reactive<FormState>(buildInitialState(data.value));

function getAnswer(questionId: string) {
  return state.answers[questionId] ?? "";
}

function setAnswer(questionId: string, value: string) {
  state.answers[questionId] = value;
}

function getCheckboxAnswer(questionId: string): string[] {
  const raw = state.answers[questionId] ?? "";
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setCheckboxAnswer(
  questionId: string,
  value: string,
  checked: boolean,
) {
  const current = getCheckboxAnswer(questionId);
  const next = checked
    ? [...current, value]
    : current.filter((v) => v !== value);
  state.answers[questionId] = JSON.stringify(next);
}

// --- Conditional schema ------------------------------------------------------
// The schema depends on which activities the user has opted into ("yes").
// Only questions belonging to a "yes" activity become required/validated;
// questions under a "no" or unanswered activity are left untouched.

const schema = computed(() => {
  return z
    .object({
      email: z.email("Email invalide").min(1, "Email requis"),
      participations: z.record(
        z.string(),
        z.enum(["yes", "no"], { message: "Merci de répondre" }).optional(),
      ),
      answers: z.record(z.string(), z.string()),
    })
    .superRefine((val, ctx) => {
      // Validate that every activity has a yes/no answer
      data.value?.forEach((section) => {
        if (!val.participations[section.id]) {
          ctx.addIssue({
            code: "custom",
            message: "Merci de répondre",
            path: ["participations", section.id],
          });
        }

        // Only validate questions for opted-in activities
        const participates = val.participations[section.id] === "yes";
        if (!participates) return;

        section.questions.forEach((question) => {
          const answer = val.answers[question.id] ?? "";

          if (question.type === "CHECKBOX") {
            try {
              const checked = JSON.parse(answer) as string[];
              if (question.required && checked.length === 0) {
                ctx.addIssue({
                  code: "custom",
                  message: "Ce champ est requis",
                  path: ["answers", question.id],
                });
              }
            } catch {
              // Invalid JSON — treat as empty
              if (question.required) {
                ctx.addIssue({
                  code: "custom",
                  message: "Ce champ est requis",
                  path: ["answers", question.id],
                });
              }
            }
            return;
          }

          if (question.required && answer.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Ce champ est requis",
              path: ["answers", question.id],
            });
          }

          if (
            question.type === "NUMBER" &&
            answer !== "" &&
            Number.isNaN(Number(answer))
          ) {
            ctx.addIssue({
              code: "custom",
              message: "Ce champ doit être un nombre",
              path: ["answers", question.id],
            });
          }
        });
      });
    });
});

const submitting = ref(false);

async function onSubmit() {
  submitting.value = true;
  let submitResult;
  try {
    const payload: FormAnswersDto = {
      email: state.email,
      activities:
        data.value?.map((section) => {
          const present = state.participations[section.id] === "yes";
          return {
            activityId: section.id,
            present,
            answers: present
              ? section.questions
                  .map((q) => {
                    if (q.type === "CHECKBOX") {
                      return {
                        questionId: q.id,
                        answer: JSON.stringify(state.answers[q.id] ?? []),
                      };
                    }
                    return {
                      questionId: q.id,
                      answer: state.answers[q.id] ?? "",
                    };
                  })
                  .filter(
                    (a) =>
                      a.answer !== "" ||
                      section.questions.find(
                        (q) => q.id === a.questionId && q.required,
                      ),
                  )
              : [],
          };
        }) ?? [],
    };

    submitResult = await useAPI(`/event/${id}/form`, {
      method: "POST",
      body: payload,
    });
    if (submitResult?.error.value) {
      console.error("Failed to process form", submitResult?.error);
      toast.add({
        title: "Erreur lors de l'envoi du formulaire",
        color: "error",
      });
    } else {
      toast.add({
        title: "Réponse enregistrée avec succès",
        color: "success",
      });
      await navigateTo(`/furmeet/${id}`);
    }
  } catch (err) {
    console.error("Failed to process form", err);
    toast.add({
      title: "Erreur lors de l'envoi du formulaire",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4">
    <p v-if="pending">Chargement du formulaire...</p>
    <p v-else-if="error">Erreur dans le formulaire.</p>
    <p v-else-if="!data || data.length === 0">Aucun formulaire disponible.</p>

    <UForm
      v-else
      :schema="schema"
      :state="state"
      class="space-y-8"
      @submit="onSubmit"
    >
      <h1 class="text-xl font-bold text-brand-dark-blue">
        Formulaire d'inscription
      </h1>
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" type="email" />
      </UFormField>

      <div v-for="section in data" :key="section.id" class="space-y-4">
        <h2 class="text-lg font-bold text-brand-dark-blue">
          {{ section.activity }}
        </h2>

        <UFormField
          :label="`Souhaitez-vous participer à ${section.activity} ?`"
          :name="`participations.${section.id}`"
          required
        >
          <URadioGroup
            :model-value="state.participations[section.id]"
            orientation="horizontal"
            :items="[
              { label: 'Oui', value: 'yes' },
              { label: 'Non', value: 'no' },
            ]"
            @update:model-value="
              (v) => (state.participations[section.id] = v as Participation)
            "
          />
        </UFormField>

        <template v-if="state.participations[section.id] === 'yes'">
          <UFormField
            v-for="question in section.questions"
            :key="question.id"
            :label="question.question"
            :name="`answers.${question.id}`"
            :required="question.required"
          >
            <UInput
              v-if="question.type === 'TEXT'"
              :model-value="getAnswer(question.id)"
              @update:model-value="(v) => setAnswer(question.id, String(v))"
            />
            <UInput
              v-else-if="question.type === 'NUMBER'"
              type="number"
              :model-value="getAnswer(question.id)"
              @update:model-value="(v) => setAnswer(question.id, String(v))"
            />
            <USelect
              v-else-if="question.type === 'SELECT'"
              :items="
                question.options ?? [{ label: 'Option 1', value: 'option-1' }]
              "
              :model-value="getAnswer(question.id)"
              @update:model-value="(v) => setAnswer(question.id, String(v))"
            />
            <div v-else-if="question.type === 'CHECKBOX'" class="space-y-2">
              <UCheckbox
                v-for="choice in question.options ?? []"
                :key="choice.id"
                :model-value="
                  getCheckboxAnswer(question.id).includes(choice.value)
                "
                @update:model-value="
                  (v) =>
                    setCheckboxAnswer(question.id, choice.value, Boolean(v))
                "
              >
                {{ choice.label }}
              </UCheckbox>
            </div>
            <URadioGroup
              v-else-if="question.type === 'RADIO'"
              :items="
                question.options ?? [{ label: 'Option 1', value: 'option-1' }]
              "
              :model-value="getAnswer(question.id)"
              @update:model-value="(v) => setAnswer(question.id, String(v))"
            />
          </UFormField>
        </template>
      </div>

      <UButton type="submit" :loading="submitting"> Submit </UButton>
    </UForm>
  </div>
</template>
