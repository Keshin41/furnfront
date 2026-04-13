<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import type { ProductOptionType } from "~/types/product";
import z from "zod";

const props = defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
  optionTypes: ProductOptionType[];
  optionValuePriceAdjustments?: Record<string, number>;
  adhesionPrice?: number;
  apiError?: string;
}>();

const active = ref<string | number>('0');

const buildDefaultSelectedOptions = () =>
  Object.fromEntries(
    props.optionTypes.map((optionType) => [optionType.id, optionType.optionValues[0]?.id ?? '']),
  );

const createEmptyItem = () => ({
  surname: '',
  firstname: '',
  nickname: '',
  email: '',
  selectedOptions: buildDefaultSelectedOptions(),
});

const optionItemsByTypeId = computed<Record<string, RadioGroupItem[]>>(() =>
  Object.fromEntries(
    props.optionTypes.map((optionType) => [
      optionType.id,
      optionType.optionValues.map((optionValue) => ({
        label: optionValue.value,
        description:
          (props.optionValuePriceAdjustments?.[optionValue.id] ?? 0) > 0
            ? `+${(props.optionValuePriceAdjustments?.[optionValue.id] ?? 0).toFixed(2)} €`
            : undefined,
        value: optionValue.id,
      })),
    ]),
  ),
);

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
  selectedOptions: z.record(z.string(), z.string()),
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

    data.items.forEach((item, index) => {
      props.optionTypes.forEach((optionType) => {
        if (!item.selectedOptions[optionType.id]) {
          ctx.addIssue({
            code: 'custom',
            path: ['items', index, 'selectedOptions', optionType.id],
            message: `Choix requis pour ${optionType.name}`,
          });
        }
      });
    });
  });

type InnerSchema = z.output<typeof innerSchema>;
type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  items: [
    createEmptyItem(),
  ]
});

watch(
  () => props.optionTypes,
  () => {
    const defaultOptions = buildDefaultSelectedOptions();

    state.items.forEach((item) => {
      item.selectedOptions = {
        ...defaultOptions,
        ...item.selectedOptions,
      };
    });
  },
  { immediate: true, deep: true },
);


const ticketCount = computed({
  get: () => state.items.length,
  set: (newVal: number) => {
    active.value = '0';
    const current = state.items.length
    if (newVal > current) {
      state.items.push(createEmptyItem())
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
    :ui="{ title: 'text-2xl sm:text-3xl' }"
  />
  
  <UForm
    :state="state"
    :schema="schema"
    @submit="onSubmit"
    class="space-y-4 sm:space-y-6"
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
    <div class="grid gap-4 lg:grid-cols-[minmax(18rem,24rem)_1fr] lg:items-start">
      <div class="flex flex-col gap-4 order-1">
        <UFormField label="Nombre de billets" orientation="horizontal" class="shrink-0 rounded-2xl border border-neutral-200 bg-white p-4 justify-between">
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
            <h2 class="text-base font-semibold">Informations</h2>
          </template>
          <p class="text-sm leading-6 text-neutral-600">
            Remplis les informations de chaque participant. Chaque ticket garde ses propres options et ses propres coordonnees.
          </p>
          <UAlert
            color="info"
            variant="soft"
            icon="i-lucide-badge-info"
            class="mt-4"
          >
            <template #description>
              <p>L'adhésion à l'association est <strong>obligatoire</strong> pour participer à l'internat.</p>
              <ul class="mt-1 list-disc list-inside space-y-1">
                <li v-if="adhesionPrice !== undefined">Si vous n'êtes pas encore adhérent·e, <strong>+{{ adhesionPrice.toFixed(2) }}&nbsp;€</strong> seront ajoutés automatiquement par participant.</li>
                <li v-else>Si vous n'êtes pas encore adhérent·e, une adhésion sera ajoutée automatiquement par participant.</li>
                <li>Si vous êtes déjà adhérent·e, utilisez l'adresse mail liée à votre adhésion.</li>
              </ul>
            </template>
          </UAlert>
        </UCard>
      </div>
      <div class="order-2 min-w-0">
        <UTabs :items="tabs" v-model="active" class="min-w-0">
          <template #content="{ item }">
            <UCard class="min-w-0">
              <div class="grid gap-4 sm:grid-cols-2">
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
                <UFormField
                  v-for="optionType in props.optionTypes"
                  :key="optionType.id"
                  :label="optionType.name"
                  :name="`items.${item.index}.selectedOptions.${optionType.id}`"
                  required
                  class="sm:col-span-2"
                >
                  <URadioGroup
                    variant="table"
                    :items="optionItemsByTypeId[optionType.id] ?? []"
                    :model-value="state.items[item.index]!.selectedOptions[optionType.id]"
                    @update:model-value="val => {
                      if (val != null) {
                        state.items[item.index]!.selectedOptions[optionType.id] = String(val)
                      }
                    }"
                  />
                </UFormField>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <div class="flex justify-stretch sm:justify-center mt-4">
      <UButton type="submit" size="xl" block class="sm:w-auto" :disabled="Boolean(duplicateEmailMessage)">
        Valider
      </UButton>
    </div>
  </UForm>
</template>
