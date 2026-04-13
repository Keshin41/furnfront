<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
  apiError?: string;
}>();

const optionChambre = ref<RadioGroupItem[]>([
  {
    label: 'Non',
    value: false,
  },
  {
    label: 'Oui',
    description: '6€ supplémentaire',
    value: true,
  },
])

const optionGoodies = ref<RadioGroupItem[]>([
  {
    label: 'Non',
    value: false,
  },
  {
    label: 'Oui',
    description: '14€ supplémentaire',
    value: true,
  },
])

const active = ref<string | number>('0');

const tabs = computed(() =>
  state.items.map((_, i) => ({
    label: `Ticket n°${i + 1}`,
    index: i,
  }))
);

const innerSchema = z.object({
  surname: z.string().min(2, "2 caractères minimums"),
  firstname: z.string().min(2, "2 caractères minimums"),
  nickname: z.string().min(2, "2 caractères minimums"),
  email: z.email('Format invalide'),
  optionRoom: z.boolean(),
  optionGoodies: z.boolean(),
});

const schema = z
  .object({
    items: z.array(innerSchema),
  })
  .superRefine((data, ctx) => {
    const seen = new Map<string, number>();

    data.items.forEach((item, index) => {
      const email = item.email.trim().toLowerCase();
      const previousIndex = seen.get(email);

      if (previousIndex !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', index, 'email'],
          message: `Email deja utilise pour le ticket n°${previousIndex + 1}`,
        });
        return;
      }

      seen.set(email, index);
    });
  });

type InnerSchema = z.output<typeof innerSchema>;
type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  items: [
    {
      surname: '',
      firstname: '',
      nickname: '',
      email: '',
      optionRoom: false,
      optionGoodies: false,
    },
  ]
});


const ticketCount = computed({
  get: () => state.items.length,
  set: (newVal: number) => {
    active.value = '0';
    const current = state.items.length
    if (newVal > current) {
      state.items.push({ surname: '', firstname: '', nickname: '', email: '', optionRoom: false, optionGoodies: false })
    } else {
      state.items.splice(newVal)
    }
  }
})

const duplicateEmailMessage = computed(() => {
  const seen = new Map<string, number>();

  for (let i = 0; i < state.items.length; i += 1) {
    const email = state.items[i]!.email.trim().toLowerCase();
    if (!email) {
      continue;
    }

    const previousIndex = seen.get(email);
    if (previousIndex !== undefined) {
      return `L'email ${state.items[i]!.email} est deja utilise pour le ticket n°${previousIndex + 1}.`;
    }

    seen.set(email, i);
  }

  return '';
});

</script>
<template>
  <UPageHeader
    title="Internat 2026"
    class="border-0"
  />
  
  <UForm
    :state="state"
    :schema="schema"
    @submit="onSubmit"
  >
    <UAlert
      v-if="apiError"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      class="mb-4"
      :title="apiError"
    />
    <UAlert
      v-if="duplicateEmailMessage"
      color="warning"
      variant="soft"
      icon="i-lucide-triangle-alert"
      class="mb-4"
      :title="duplicateEmailMessage"
    />
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre de billets" orientation="horizontal" class="shrink-0 justify-center">
          <UInputNumber
            :min="1"
            :max="4"
            :default-value="1"
            orientation="vertical"
            v-model="ticketCount"
          />
        </UFormField>
        <UCard class="flex-1">
          <template #header>
            <h2>Titre</h2>
          </template>
          <p>
            Lorem ipsum...
          </p>
        </UCard>
      </div>
      <div>
        <UTabs :items="tabs" v-model="active">
          <template #content="{ item }">
            <UCard>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Nom" :name="`items.${item.index}.surname`" required>
                  <UInput v-model="state.items[item.index]!.surname"/>
                </UFormField>
                <UFormField label="Prenom" :name="`items.${item.index}.firstname`" required>
                  <UInput v-model="state.items[item.index]!.firstname"/>
                </UFormField>
                <UFormField label="Pseudo" :name="`items.${item.index}.nickname`" required>
                  <UInput v-model="state.items[item.index]!.nickname"/>
                </UFormField>
                <UFormField label="Email" :name="`items.${item.index}.email`" required>
                  <UInput v-model="state.items[item.index]!.email"/>
                </UFormField>
                <UFormField label="Option draps" :name="`items.${item.index}.optionRoom`" required class="col-span-2">
                  <URadioGroup
                    variant="table"
                    :items="optionChambre"
                    :model-value="state.items[item.index]!.optionRoom"
                    @update:model-value="val => {
                      if (val != null)
                      state.items[item.index]!.optionRoom = val as boolean
                    }"
                  />
                </UFormField>
                <UFormField label="Pack goodies" :name="`items.${item.index}.optionGoodies`" required class="col-span-2">
                  <URadioGroup
                    variant="table"
                    :items="optionGoodies"
                    :model-value="state.items[item.index]!.optionGoodies"
                    @update:model-value="val => {
                      if (val != null)
                      state.items[item.index]!.optionGoodies = val as boolean
                    }"
                  />
                </UFormField>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <UButton type="submit" size="xl" :disabled="Boolean(duplicateEmailMessage)">
        Valider
      </UButton>
    </div>
  </UForm>
</template>
