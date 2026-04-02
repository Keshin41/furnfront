<template>
  <div class="min-h-screen bg-brand-white text-brand-ink-deep">
    <AppHeader />

    <main class="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <section class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-brand-dark-blue">Journal des Furmeets</h1>
        <p class="mt-3 text-brand-ink">
          Retrouve tous nos furmeets sous forme d'articles: ambiance, infos pratiques et souvenirs de la communauté.
        </p>
      </section>

      <section>
        <div v-if="isLoading" class="py-24 text-center text-brand-sky">
          Chargement des furmeets...
        </div>

        <div v-else-if="error" class="py-24 text-center text-red-500">
          Erreur lors du chargement des furmeets : {{ error.message || error }}
        </div>

        <div v-else>
          <div v-if="furmeets.length === 0" class="py-16 text-center text-brand-ink">
            Aucun furmeet publié pour le moment.
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="furmeet in furmeets"
              :key="furmeet.id"
              class="overflow-hidden rounded-3xl border border-brand-light-blue/50 bg-brand-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <NuxtLink :to="`/furmeet/${furmeet.id}`" class="block">
                <ImageWithFallback
                  :src="`/furmeet/thumbnail/${furmeet.id}.png`"
                  :fallback="'/furmeet/thumbnail/default.png'"
                  :alt="furmeet.title"
                  class="h-48 w-full object-cover"
                />

                <div class="p-5">
                  <p class="text-xs font-semibold uppercase tracking-wide text-brand-sky">
                    {{ formatDate(furmeet.publishedAt) }}
                  </p>
                  <h2 class="mt-2 text-xl font-semibold text-brand-dark-blue line-clamp-2">{{ furmeet.title }}</h2>
                  <p class="mt-3 text-sm leading-relaxed text-brand-ink line-clamp-4">
                    {{ furmeet.excerpt }}
                  </p>

                  <p class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                    Lire l'article
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </p>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";

type FurmeetApi = {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
};

type FurmeetPost = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

const { data, error, pending } = await useAPI<FurmeetApi[]>("/furmeet/");

const furmeets = computed<FurmeetPost[]>(() => {
  const raw = data.value ?? [];

  return raw
    .filter((item) => item.published ?? true)
    .map((item) => {
      const excerpt = item.description || item.content || "Article en cours de redaction.";
      const publishedAt = item.date || item.createdAt || item.updatedAt || new Date().toISOString();

      return {
        id: item.id,
        title: item.title,
        excerpt,
        publishedAt,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
});

const isLoading = computed(() => pending.value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

useSeoMeta({
  title: "Furmeets - Fur'N'Tours",
  description: "Tous les furmeets de l'association, presentes comme un journal d'articles.",
});
</script>
