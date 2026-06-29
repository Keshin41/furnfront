<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

export type QuestionDto = {
  id: string;
  question: string;
  required: boolean;
  type: "TEXT" | "NUMBER" | "SELECT" | "CHECKBOX" | "RADIO";
};

export type FormDto = {
  activity: string;
  questions: QuestionDto[];
}[];

type Answer = {
  questionId: string;
  answer: string;
};

const { data, error, pending } = await useAPI<FormDto | null>(
  `/event/${id}/form`,
);

function buildInitialState(form: FormDto | null | undefined): Answer[] {
  if (!form) return [];
  return form.flatMap((section) =>
    section.questions.map((question) => ({
      questionId: question.id,
      answer: question.type === "CHECKBOX" ? "false" : "",
    })),
  );
}

const state = reactive(buildInitialState(data.value));

function getAnswer(questionId: string) {
  return state.find((a) => a.questionId === questionId)?.answer ?? "";
}

function setAnswer(questionId: string, value: string) {
  const entry = state.find((a) => a.questionId === questionId);
  if (entry) entry.answer = value;
}

const submitting = ref(false);

async function onSubmit() {
  submitting.value = true;
  try {
    await useAPI(`/event/${id}/form`, {
      method: "POST",
      body: state,
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

    <UForm v-else :state="state" class="space-y-8" @submit="onSubmit">
      <div v-for="section in data" :key="section.activity" class="space-y-4">
        <h2 class="text-lg font-semibold">{{ section.activity }}</h2>

        <UFormField
          v-for="question in section.questions"
          :key="question.id"
          :label="question.question"
          :name="question.id"
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
            :items="[{ label: 'Option 1', value: 'option-1' }]"
            :model-value="getAnswer(question.id)"
            @update:model-value="(v) => setAnswer(question.id, String(v))"
          />

          <UCheckbox
            v-else-if="question.type === 'CHECKBOX'"
            :model-value="getAnswer(question.id) === 'true'"
            @update:model-value="(v) => setAnswer(question.id, String(v))"
          />

          <URadioGroup
            v-else-if="question.type === 'RADIO'"
            :items="[{ label: 'Option 1', value: 'option-1' }]"
            :model-value="getAnswer(question.id)"
            @update:model-value="(v) => setAnswer(question.id, String(v))"
          />
        </UFormField>
      </div>

      <UButton type="submit" :loading="submitting"> Submit </UButton>
    </UForm>
  </div>
</template>
