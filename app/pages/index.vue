<script setup lang="ts">
import CustomButton from "~/components/CustomButton.vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Announcement } from "~/types/announcement";
import type { Furmeet, FurmeetCard } from "~/types/furmeet";

// API calls
const { data: furmeets } = await useAPI<Furmeet[]>("/event/");
const { data: announcementData } = await useAPI<Announcement>(
  "/announcement/current",
);

const router = useRouter();

const toTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatMeetDate = (value?: string | null) => {
  if (!value) return "Date a venir";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date a venir";
  }

  return parsed.toLocaleDateString("fr-FR");
};

// Computed properties
const furmeetsList = computed<FurmeetCard[]>(() => {
  const items = furmeets.value ?? [];
  if (!items.length) return [];

  return items
    .filter((item) => item.published)
    .sort(
      (a, b) =>
        toTimestamp(b.eventDate ?? b.createdAt) -
        toTimestamp(a.eventDate ?? a.createdAt),
    )
    .slice(0, 3)
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      description: item.description || "Programme a venir.",
      date: formatMeetDate(item.eventDate ?? item.createdAt),
      imageURL: `/furmeet/thumbnail/${item.id}.png`,
    }));
});

const currentAnnouncement = computed<Announcement | null>(() => {
  const announcement = announcementData.value;

  if (!announcement || !announcement.active) {
    return null;
  }
  return announcement;
});

// Methods
const onAnnouncementAction = () => {
  const url = currentAnnouncement.value?.actionUrl;
  if (!url) return;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (import.meta.client) {
      window.open(url, "_blank");
    }
    return;
  }

  router.push(url);
};
</script>

<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <section
      class="relative grid min-h-[calc(100vh-var(--ui-header-height))] items-center overflow-hidden text-white"
    >
      <HeroBackgroundCarousel
        :photos="['/meet-shuffle.avif', '/meet-outdoor.jpg', '/meet-duck.jpg']"
      />

      <div
        class="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <!-- Contenu principal -->
        <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <div class="my-auto">
            <p
              class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 sm:tracking-[0.3em]"
            >
              Association furry
            </p>
            <h1
              class="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Fur'N'Tours
            </h1>
            <p
              class="mt-4 max-w-xl text-base text-white/85 font-family-sans sm:text-lg md:text-xl"
            >
              Fur'N'Tours est une association dynamique qui organise des
              événements un samedi par mois pour les passionnés de la culture
              furry.
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CustomButton
                label="Découvrir les furmeets"
                to="/furmeet"
                bgClass="bg-brand-dark-blue"
                textClass="text-white"
                size="lg"
              />
              <CustomButton
                label="Voir le réseau"
                bgClass="border-2 border-white/70 bg-transparent"
                textClass="text-white"
                size="lg"
              />
            </div>
          </div>

          <div
            class="relative grid gap-6 my-auto max-w-xs sm:max-w-sm lg:max-w-none mx-auto"
          >
            <MascotFrame
              outer-bg="bg-linear-to-b from-brand-light-blue/90 to-transparent"
              inner-bg="bg-linear-to-b from-brand-green to-brand-green/85"
            />
          </div>
        </div>

        <!-- Annonce personnalisée -->
        <Transition name="fade" mode="out-in">
          <div
            v-if="currentAnnouncement"
            class="flex justify-center mt-6 sm:mt-8"
          >
            <div
              class="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-4 shadow-xl sm:px-6"
            >
              <div
                class="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap"
              >
                <UIcon
                  name="i-lucide-megaphone"
                  class="h-5 w-5 text-brand-yellow shrink-0 mt-0.5"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-white sm:text-xl">
                    {{ currentAnnouncement.title }}
                  </h3>
                  <p class="mt-1 text-sm text-white/90 sm:text-base">
                    {{ currentAnnouncement.message }}
                  </p>
                </div>
                <CustomButton
                  v-if="
                    currentAnnouncement.actionLabel &&
                    currentAnnouncement.actionUrl
                  "
                  :label="currentAnnouncement.actionLabel"
                  bgClass="bg-brand-yellow"
                  textClass="text-black"
                  size="xl"
                  class="px-4 my-auto"
                  @click="onAnnouncementAction"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-brand-dark-blue sm:text-3xl">
          Nos furmeets
        </h2>
      </div>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <div
          v-if="furmeetsList.length === 0"
          class="col-span-full text-center text-slate-500"
        >
          <UIcon
            name="i-lucide-calendar-x"
            class="h-8 w-8 mx-auto mb-2 opacity-50"
          />
          <p class="text-lg font-medium">
            Aucun furmeet à venir pour le moment
          </p>
          <p class="text-sm mt-1">
            Restez à l'écoute de nos prochaines annonces !
          </p>
        </div>

        <UCard
          v-for="meet in furmeetsList"
          :key="meet.id"
          v-else
          class="overflow-hidden rounded-3xl"
        >
          <ImageWithFallback
            :src="`/furmeet/thumbnail/${meet.id}.png`"
            :alt="meet.title"
            :fallback="`/furmeet/thumbnail/default.png`"
            class="h-44 w-full rounded-2xl bg-cover bg-center object-cover sm:h-48"
          />
          <div class="px-2 pb-4 pt-4">
            <h3 class="text-lg font-semibold text-brand-ink">
              {{ meet.title }}
            </h3>
            <p class="mt-2 text-sm text-slate-500">{{ meet.description }}</p>
            <div
              class="mt-4 flex items-center justify-between text-xs font-semibold text-brand-blue"
            >
              <span>{{ meet.date }}</span>
            </div>
          </div>
        </UCard>
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <CustomButton
          to="/furmeet"
          label="Voir tous les furmeets"
          bgClass="bg-brand-blue"
          textClass="text-white"
          size="lg"
        />
        <CustomButton
          to="/shop"
          label="Découvrir la boutique"
          bgClass="bg-brand-green"
          textClass="text-white"
          size="lg"
        />
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div
        class="grid gap-8 rounded-3xl bg-brand-green p-5 text-white shadow-2xl sm:p-8 md:grid-cols-[1.3fr_0.7fr] md:p-10"
      >
        <div class="flex flex-col justify-center">
          <h2 class="text-3xl font-bold text-brand-yellow sm:text-4xl">
            Qu'est-ce qu'un furry ?
          </h2>
          <p class="mt-6 text-base text-white/90 sm:text-lg">
            Le mouvement furry se caractérise par un intérêt pour des animaux
            anthropomorphiques, ayant des caractéristiques humaines comme la
            parole, le style de vie, la bipédie, etc. Les membres de cette
            communauté sont appelés furries et ont pour intérêt commun la
            création artistique, l'imaginaire, ou encore l'expression de soi à
            travers des personnages originaux et souvent colorés.
          </p>
          <p class="mt-4 text-sm text-white/85 sm:text-base">
            C'est une communauté mondiale, inclusive et créative qui se
            rassemble lors de conventions et d'événements pour célébrer
            l'imagination, la diversité et l'entraide. Des associations comme la
            nôtre organisent régulièrement des rencontres pour renforcer les
            liens au sein de la communauté française.
          </p>
          <div class="mt-8">
            <CustomButton
              to="/furry"
              label="En savoir plus"
              bg-class="bg-brand-yellow"
              text-class="text-brand-green"
              hover-class="hover:bg-white/90"
              size="lg"
            />
          </div>
        </div>
        <div class="flex items-center justify-center">
          <MascotFrame
            height="h-80 sm:h-96 lg:h-110"
            width="w-56 sm:w-64 lg:w-78"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto">
      <div
        class="bg-linear-to-br from-brand-light-blue/20 to-brand-light-blue/15 p-5 text-white shadow-2xl sm:p-8 md:p-16"
      >
        <div class="text-center mb-8 sm:mb-10">
          <h2 class="text-3xl font-bold text-brand-dark-blue sm:text-4xl">
            Nous contacter
          </h2>
          <p class="mt-4 text-base text-brand-dark-blue/90 sm:text-lg">
            Parle-nous de ton projet ou de ton envie de rejoindre la team !
          </p>
        </div>

        <div class="grid gap-6 sm:gap-8 md:grid-cols-3 mb-10 sm:mb-12">
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
              <UIcon
                name="i-lucide-mail"
                class="h-6 w-6 text-brand-dark-blue"
              />
            </div>
            <p class="font-semibold text-base text-brand-dark-blue sm:text-lg">
              Email
            </p>
            <p class="text-sm text-brand-dark-blue/80">contact@furntours.fr</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
              <UIcon
                name="i-lucide-map-pin"
                class="h-6 w-6 text-brand-dark-blue"
              />
            </div>
            <p class="font-semibold text-base text-brand-dark-blue sm:text-lg">
              Localisation
            </p>
            <p class="text-sm text-brand-dark-blue/80">Tours, France</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
              <UIcon
                name="i-lucide-calendar"
                class="h-6 w-6 text-brand-dark-blue"
              />
            </div>
            <p class="font-semibold text-base text-brand-dark-blue sm:text-lg">
              Événements
            </p>
            <p class="text-sm text-brand-dark-blue/80">
              Chaque 2ème week-end du mois
            </p>
          </div>
        </div>

        <form class="grid gap-4 sm:gap-5 max-w-2xl mx-auto">
          <div class="grid gap-4 md:grid-cols-2">
            <UInput
              placeholder="Prénom"
              class="rounded-xl"
              size="lg"
              color="neutral"
            />
            <UInput
              placeholder="Nom"
              class="rounded-xl"
              size="lg"
              color="neutral"
            />
          </div>
          <UInput
            placeholder="Email"
            type="email"
            class="rounded-xl"
            size="lg"
            color="neutral"
          />
          <UInput
            placeholder="Pseudo (optionnel)"
            class="rounded-xl"
            size="lg"
            color="neutral"
          />
          <UTextarea
            placeholder="Ton message"
            class="rounded-xl"
            :rows="5"
            size="lg"
            color="neutral"
          />
          <CustomButton
            label="Envoyer le message"
            bgClass="bg-white"
            textClass="text-brand-dark-blue"
            size="lg"
            class="mx-auto"
          />
        </form>
      </div>
    </section>
  </div>
</template>
