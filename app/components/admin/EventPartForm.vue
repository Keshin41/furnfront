<script lang="ts" setup>
import { EventPartType } from "~/types/logicConstants";

const { activity, index, removeActivity } = defineProps<{
  activity: any;
  index: number;
  removeActivity: (index: number) => void;
}>();
</script>
<template>
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
    <UFormField :label="'Type'" :name="'eventActivities[' + index + '].type'">
      <USelect
        v-model="activity.type"
        :items="createOptionFromEnum(EventPartType, mapEventPartTypeToLabel)"
        class="min-w-30"
      />
    </UFormField>

    <UFormField :label="'Ordre'" :name="'eventActivities[' + index + '].order'">
      <UInput v-model.number="activity.order" type="number" min="0" step="1" />
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
</template>
