<template>
  <div class="min-h-screen bg-brand-white text-brand-ink-deep">
    <AppHeader />

    <main class="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div class="mb-8">
        <CustomButton
          label="← Retour aux furmeets"
          size="sm"
          bgClass="bg-brand-light-blue"
          textClass="text-brand-ink"
          to="/furmeet"
        />
      </div>

      <div v-if="loading" class="py-24 text-center text-brand-sky">
        Chargement de l'article...
      </div>

      <div v-else-if="error" class="py-24 text-center text-red-500">
        Erreur : {{ error.message || error }}
      </div>

      <div v-else-if="!furmeet" class="py-24 text-center text-brand-ink">
        Furmeet introuvable.
      </div>

      <article v-else class="overflow-hidden rounded-3xl border border-brand-light-blue/50 bg-brand-white shadow-sm">
        <ImageWithFallback
          :src="`/furmeet/thumbnail/${furmeet.id}.png`"
          :fallback="'/furmeet/thumbnail/default.png'"
          :alt="furmeet.title"
          class="h-72 w-full object-cover"
        />

        <div class="p-6 md:p-8">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-sky">
            {{ formatDate(furmeet.publishedAt) }}
          </p>
          <h1 class="mt-2 text-4xl font-bold text-brand-dark-blue">{{ furmeet.title }}</h1>

          <p class="mt-6 rounded-2xl bg-brand-light-blue/25 p-4 text-brand-ink">
            {{ furmeet.description || "Aucune description courte pour cet article." }}
          </p>

          <div class="prose prose-slate mt-8 max-w-none prose-headings:text-brand-dark-blue prose-p:text-brand-ink">
            <p v-for="(paragraph, index) in paragraphs" :key="index" class="leading-relaxed">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </article>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
import CustomButton from "~/components/CustomButton.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";

type FurmeetApi = {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  published?: boolean;
};

const route = useRoute();
const id = route.params.id as string;

const { data, error, pending } = await useAPI<FurmeetApi | null>(`/furmeet/${id}`);

const furmeet = computed(() => {
  const item = data.value;
  if (!item || (item.published === false)) {
    return null;
  }

  return {
    ...item,
    publishedAt: item.date || item.createdAt || item.updatedAt || new Date().toISOString(),
    body: item.content || item.description || "Article en cours de redaction.",
  };
});

const paragraphs = computed(() => {
  const body = furmeet.value?.body ?? "";
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
});

const loading = computed(() => pending.value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

useSeoMeta({
  title: computed(() => (furmeet.value ? `${furmeet.value.title} - Furmeet` : "Furmeet - Fur'N'Tours")),
  description: computed(() => furmeet.value?.description || "Detail d'un furmeet sous forme d'article."),
});
</script>
