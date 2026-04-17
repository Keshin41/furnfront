<script setup lang="ts">
import CustomButton from "~/components/CustomButton.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type {
  Furmeet,
  FurmeetActivity,
  FurmeetActivityType,
} from "~/types/furmeet";

type FurmeetApi = Furmeet & { content?: string | null };

const route = useRoute();
const id = route.params.id as string;

const hasHtmlTags = (value?: string | null) => /<[^>]+>/.test(value ?? "");

const toHtmlContent = (value?: string | null) => {
  if (!value?.trim()) {
    return "";
  }

  if (hasHtmlTags(value)) {
    return value;
  }

  const escaped = value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  return escaped
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br />")}</p>`)
    .join("");
};

const { data, error, pending } = await useAPI<FurmeetApi | null>(
  `/event/${id}`,
);

const furmeet = computed(() => {
  const item = data.value;
  if (!item || item.published === false) {
    return null;
  }

  return {
    ...item,
    eventDate: item.eventDate || item.createdAt || new Date().toISOString(),
    opened: item.opened ?? false,
    eventActivities: [...(item.eventActivities ?? [])].sort(sortActivities),
    body:
      item.content ||
      item.description ||
      item.eventActivities
        ?.map((activity) => `${activity.title}\n${activity.description}`)
        .join("\n\n") ||
      "Article en cours de redaction.",
  };
});

const loading = computed(() => pending.value);

const sortActivities = (a: FurmeetActivity, b: FurmeetActivity) => {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return new Date(a.date).getTime() - new Date(b.date).getTime();
};

const activityTypeLabel = (type?: FurmeetActivityType) => {
  if (type === "ACTIVITY") return "Activite";
  if (type === "RESTAURANT") return "Restaurant";
  if (type === "BAR") return "Bar";
  return "Etape";
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
</script>

<template>
  <div class="min-h-screen bg-brand-white text-brand-ink-deep">
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

      <article
        v-else
        class="overflow-hidden rounded-3xl border border-brand-light-blue/50 bg-brand-white shadow-sm"
      >
        <ImageWithFallback
          :src="furmeet.imageUrl || `/furmeet/thumbnail/${furmeet.id}.png`"
          :fallback="'/furmeet/thumbnail/default.png'"
          :alt="furmeet.title"
          class="h-72 w-full object-cover"
        />

        <div class="p-6 md:p-8">
          <div class="mb-4 flex flex-wrap gap-2">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                furmeet.opened
                  ? 'bg-brand-green/15 text-brand-green'
                  : 'bg-brand-ink/10 text-brand-ink'
              "
            >
              {{
                furmeet.opened
                  ? "Inscriptions ouvertes"
                  : "Inscriptions fermées"
              }}
            </span>
          </div>

          <p
            class="text-xs font-semibold uppercase tracking-wide text-brand-sky"
          >
            {{ formatDate(furmeet.eventDate) }}
          </p>
          <h1 class="mt-2 text-4xl font-bold text-brand-dark-blue">
            {{ furmeet.title }}
          </h1>

          <div class="mt-6 rounded-2xl bg-brand-light-blue/25 p-4 text-brand-ink">
            <div
              v-if="furmeet.description"
              class="tiptap-render text-sm leading-relaxed"
              v-html="toHtmlContent(furmeet.description)"
            />
            <p v-else>Aucune description courte pour cet article.</p>
          </div>

          <div class="mt-8">
            <h2 class="text-2xl font-bold text-brand-dark-blue">
              Programme de la meet
            </h2>
            <div
              v-if="furmeet.eventActivities.length === 0"
              class="mt-4 rounded-2xl bg-brand-light-blue/20 p-4 text-brand-ink"
            >
              Le programme détaillé n'est pas encore disponible.
            </div>

            <ol v-else class="mt-6 space-y-4">
              <li
                v-for="activity in furmeet.eventActivities"
                :key="
                  activity.id ??
                  `${activity.order}-${activity.date}-${activity.title}`
                "
                class="rounded-2xl border border-brand-light-blue/50 bg-brand-white p-4"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue"
                  >
                    {{ activityTypeLabel(activity.type) }}
                  </span>
                  <span
                    class="text-xs font-semibold uppercase tracking-wide text-brand-sky"
                  >
                    {{ formatDateTime(activity.date) }}
                  </span>
                </div>
                <h3 class="mt-2 text-lg font-semibold text-brand-dark-blue">
                  {{ activity.title }}
                </h3>
                <div
                  v-if="activity.description"
                  class="tiptap-render mt-2 text-sm leading-relaxed text-brand-ink"
                  v-html="toHtmlContent(activity.description)"
                />
              </li>
            </ol>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
.tiptap-render :deep(p + p) {
  margin-top: 0.6rem;
}

.tiptap-render :deep(h1) {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-brand-dark-blue);
}

.tiptap-render :deep(h2) {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-brand-dark-blue);
}

.tiptap-render :deep(h3) {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-brand-dark-blue);
}

.tiptap-render :deep(ul),
.tiptap-render :deep(ol) {
  margin-top: 0.45rem;
  padding-left: 1.2rem;
}

.tiptap-render :deep(ul) {
  list-style: disc;
}

.tiptap-render :deep(ol) {
  list-style: decimal;
}
</style>