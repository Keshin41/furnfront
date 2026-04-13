<script setup lang="ts">
import type {
  Product,
  ProductOptionType,
  ProductOptionValue,
} from "~/types/product";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const id = useRoute().params.id as string;
const { data, error, pending, refresh } = await useAPI<Product>(
  `/product/${id}`,
);

const toast = useToast();

const editingOptionTypeId = ref<string | null>(null);
const editingOptionTypeName = ref("");

const newOptionValueMap = reactive<Record<string, string>>({});
const editingOptionValueId = ref<string | null>(null);
const editingOptionValueText = ref("");

const draft = reactive({
  name: "",
  values: ["", ""] as string[],
});

const draftCanSubmit = computed(
  () =>
    draft.name.trim().length > 0 &&
    draft.values.filter((v) => v.trim().length > 0).length >= 2,
);

const addDraftValue = () => {
  draft.values.push("");
};

const removeDraftValue = (index: number) => {
  if (draft.values.length > 2) draft.values.splice(index, 1);
};

const addOptionType = async () => {
  if (!draftCanSubmit.value) return;
  const name = draft.name.trim();
  const values = draft.values.map((v) => v.trim()).filter(Boolean);
  await useAPI(`/option/type/${id}`, {
    method: "POST",
    body: { name, values },
  }).catch((err) => {
    toast.add({
      type: "foreground",
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ajout du type d'option.",
    });
  });
  draft.name = "";
  draft.values = ["", ""];
  await refresh();
};

const startEditOptionType = (ot: ProductOptionType) => {
  editingOptionTypeId.value = ot.id;
  editingOptionTypeName.value = ot.name;
};

const saveOptionType = async (otId: string) => {
  const name = editingOptionTypeName.value.trim();
  if (!name) return;
  await useAPI(`/option/type/${otId}`, {
    method: "PUT",
    body: { name },
  }).catch((err) => {
    console.error("Failed to update option type", err);
    alert("Une erreur est survenue lors de la mise à jour du type d'option.");
  });
  editingOptionTypeId.value = null;
  await refresh();
};

const cancelEditOptionType = () => {
  editingOptionTypeId.value = null;
};

const deleteOptionType = async (otId: string) => {
  if (!confirm("Supprimer ce type d'option et toutes ses valeurs ?")) return;
  await useAPI(`/option/type/${otId}`, { method: "DELETE" }).catch((err) => {
    console.error("Failed to delete option type", err);
    alert("Une erreur est survenue lors de la suppression du type d'option.");
  });
  await refresh();
};

const addOptionValue = async (otId: string) => {
  const value = (newOptionValueMap[otId] ?? "").trim();
  if (!value) return;
  await useAPI(`/option/value/${otId}`, {
    method: "POST",
    body: { value },
  }).catch((err) => {
    console.error("Failed to add option value", err);
    alert("Une erreur est survenue lors de l'ajout de la valeur.");
  });
  newOptionValueMap[otId] = "";
  await refresh();
};

const startEditOptionValue = (ov: ProductOptionValue) => {
  editingOptionValueId.value = ov.id;
  editingOptionValueText.value = ov.value;
};

const saveOptionValue = async (ovId: string) => {
  const value = editingOptionValueText.value.trim();
  if (!value) return;
  await useAPI(`/option/value/${ovId}`, {
    method: "PUT",
    body: { value },
  }).catch((err) => {
    console.error("Failed to update option value", err);
    alert("Une erreur est survenue lors de la mise à jour de la valeur.");
  });
  editingOptionValueId.value = null;
  await refresh();
};

const cancelEditOptionValue = () => {
  editingOptionValueId.value = null;
};

const deleteOptionValue = async (ovId: string) => {
  if (!confirm("Supprimer cette valeur d'option ?")) return;
  await useAPI(`/option/value/${ovId}`, { method: "DELETE" }).catch((err) => {
    console.error("Failed to delete option value", err);
    alert("Une erreur est survenue lors de la suppression de la valeur.");
  });
  await refresh();
};
</script>

<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-bold mb-4 text-primary">Options du produit</h1>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <!-- Option Types list -->
      <div
        v-for="optionType in data.optionTypes"
        :key="optionType.id"
        class="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <!-- Option Type header -->
        <div class="flex items-center gap-2 mb-3">
          <template v-if="editingOptionTypeId === optionType.id">
            <div
              class="flex-1"
              @keyup.enter="saveOptionType(optionType.id)"
              @keyup.escape="cancelEditOptionType"
            >
              <UInput
                v-model="editingOptionTypeName"
                placeholder="Nom du type d'option"
              />
            </div>
            <UButton
              size="sm"
              label="Enregistrer"
              @click="saveOptionType(optionType.id)"
            />
            <UButton
              size="sm"
              variant="ghost"
              label="Annuler"
              @click="cancelEditOptionType"
            />
          </template>
          <template v-else>
            <h2 class="text-lg font-semibold text-primary flex-1">
              {{ optionType.name }}
            </h2>
            <UButton
              size="sm"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="startEditOptionType(optionType)"
            />
            <UButton
              size="sm"
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              @click="deleteOptionType(optionType.id)"
            />
          </template>
        </div>

        <!-- Option Values list -->
        <div class="space-y-2 pl-2">
          <div
            v-for="optionValue in optionType.optionValues"
            :key="optionValue.id"
            class="flex items-center gap-2"
          >
            <template v-if="editingOptionValueId === optionValue.id">
              <div
                class="flex-1"
                @keyup.enter="saveOptionValue(optionValue.id)"
                @keyup.escape="cancelEditOptionValue"
              >
                <UInput v-model="editingOptionValueText" placeholder="Valeur" />
              </div>
              <UButton
                size="sm"
                label="Enregistrer"
                @click="saveOptionValue(optionValue.id)"
              />
              <UButton
                size="sm"
                variant="ghost"
                label="Annuler"
                @click="cancelEditOptionValue"
              />
            </template>
            <template v-else>
              <UBadge variant="soft" class="flex-1 justify-start">
                {{ optionValue.value }}
              </UBadge>
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                @click="startEditOptionValue(optionValue)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="deleteOptionValue(optionValue.id)"
              />
            </template>
          </div>

          <!-- Add new option value -->
          <div
            class="flex items-center gap-2 mt-2"
            @keyup.enter="addOptionValue(optionType.id)"
          >
            <UInput
              v-model="newOptionValueMap[optionType.id]"
              class="flex-1"
              placeholder="Nouvelle valeur…"
            />
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              label="Ajouter"
              @click="addOptionValue(optionType.id)"
            />
          </div>
        </div>
      </div>

      <!-- Add new option type (draft form — requires name + ≥2 values) -->
      <div
        class="mt-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
      >
        <h2 class="text-sm font-medium text-gray-500 mb-3">
          Nouveau type d'option
        </h2>

        <UFormField label="Nom du type" name="draftName" class="mb-4">
          <div @keyup.enter="addOptionType">
            <UInput v-model="draft.name" placeholder="Ex : Couleur, Taille…" />
          </div>
        </UFormField>

        <p class="text-xs text-gray-400 mb-2">
          Valeurs <span class="font-medium">(2 minimum)</span>
        </p>

        <div class="space-y-2 mb-3">
          <div
            v-for="(_, index) in draft.values"
            :key="index"
            class="flex items-center gap-2"
          >
            <div class="flex items-center gap-2" @keyup.enter="addOptionType">
              <UInput
                v-model="draft.values[index]"
                :placeholder="`Valeur ${index + 1}`"
                class="flex-1"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                :disabled="draft.values.length <= 2"
                @click="removeDraftValue(index)"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <UButton
              size="sm"
              variant="ghost"
              icon="i-heroicons-plus"
              label="Ajouter une valeur"
              @click="addDraftValue"
            />
            <UButton
              icon="i-heroicons-check"
              label="Créer le type d'option"
              :disabled="!draftCanSubmit"
              @click="addOptionType"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
