<template>
  <div class="min-h-screen bg-brand-white text-brand-ink-deep">
    <main class="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <section class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-brand-dark-blue">Liste des meets</h1>
        <p class="mt-3 text-brand-ink">
          Retrouve toutes les infos sur nos meets.
        </p>
      </section>

      <section>
        <div v-if="isLoading" class="py-24 text-center text-brand-sky">
          Chargement des meets...
        </div>

        <div v-else-if="error" class="py-24 text-center text-red-500">
          Erreur lors du chargement des meets : {{ error.message || error }}
        </div>

        <div v-else>
          <div
            v-if="furmeets.length === 0"
            class="py-16 text-center text-brand-ink"
          >
            Aucun meet publiée pour le moment.
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
                  <div class="mb-3 flex flex-wrap gap-2">
                    <span
                      v-if="furmeet.opened !== undefined && furmeet.opened"
                      class="rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="
                        furmeet.opened
                          ? 'bg-brand-green/15 text-brand-green'
                          : 'bg-brand-ink/10 text-brand-ink'
                      "
                    >
                      Inscriptions ouvertes
                    </span>
                  </div>

                  <p
                    class="text-xs font-semibold uppercase tracking-wide text-brand-sky"
                  >
                    {{ formatDate(furmeet.eventDate) }}
                  </p>
                  <h2
                    class="mt-2 text-xl font-semibold text-brand-dark-blue line-clamp-2"
                  >
                    {{ furmeet.title }}
                  </h2>
                  <p
                    class="mt-3 text-sm leading-relaxed text-brand-ink line-clamp-4"
                  >
                    {{ furmeet.excerpt }}
                  </p>

                  <p
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue"
                  >
                    Voir la meet
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </p>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Furmeet, FurmeetActivity } from "~/types/furmeet";

type FurmeetPost = {
  id: string;
  title: string;
  excerpt: string;
  eventDate: string;
  opened: boolean;
  activitiesCount: number;
  firstActivityTitle: string;
};

const { data, error, pending } = await useAPI<Furmeet[]>("/event/");

const furmeets = computed<FurmeetPost[]>(() => {
  const raw = data.value ?? [];

  return raw
    .filter((item) => item.published)
    .map((item) => {
      const excerpt = item.description || "Article en cours de redaction.";
      const eventDate =
        item.eventDate || item.createdAt || new Date().toISOString();
      const activities = [...(item.eventActivities ?? [])].sort(sortActivities);
      const firstActivity = activities[0]?.title ?? "Programme a venir";

      return {
        id: item.id,
        title: item.title,
        excerpt,
        eventDate,
        opened: item.opened ?? false,
        activitiesCount: activities.length,
        firstActivityTitle: firstActivity,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );
});

const sortActivities = (a: FurmeetActivity, b: FurmeetActivity) => {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return new Date(a.date).getTime() - new Date(b.date).getTime();
};

const isLoading = computed(() => pending.value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
</script>
