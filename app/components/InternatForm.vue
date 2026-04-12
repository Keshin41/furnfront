<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
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

const schema = z.object({
  items: z.array(innerSchema),
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
              <UForm
                :name="`items.${item.index}`"
                :schema="innerSchema"
                nested
              >
                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="Nom" name="surname" required>
                    <UInput v-model="state.items[item.index]!.surname"/>
                  </UFormField>
                  <UFormField label="Prenom" name="firstname" required>
                    <UInput v-model="state.items[item.index]!.firstname"/>
                  </UFormField>
                  <UFormField label="Pseudo" name="nickname" required>
                    <UInput v-model="state.items[item.index]!.nickname"/>
                  </UFormField>
                  <UFormField label="Email" name="email" required>
                    <UInput v-model="state.items[item.index]!.email"/>
                  </UFormField>
                <UFormField label="Option draps" name="optionRoom" required class="col-span-2">
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
                <UFormField label="Pack goodies" name="optionRoom" required class="col-span-2">
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
              </UForm>
              
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <UButton type="submit" size="xl">
        Valider
      </UButton>
    </div>
  </UForm>
</template>
