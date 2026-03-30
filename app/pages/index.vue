<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <AppHeader />
    <main>
      <section
        class="relative grid min-h-[calc(100vh-var(--ui-header-height))] items-center overflow-hidden text-white">

        <HeroBackgroundCarousel :photos="['/meet-shuffle.avif', '/meet-outdoor.jpg', '/meet-duck.jpg']" />

        <div class="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
          <!-- Contenu principal -->
          <div class="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div class="my-auto">
              <p class="text-l font-semibold uppercase tracking-[0.3em] text-white/70">Association furry</p>
              <h1 class="text-8xl font-bold leading-tight md:text-6xl">
                Fur'N'Tours
              </h1>
              <p class="mt-4 max-w-xl text-xl text-white/85 font-family-sans">
                Fur'N'Tours est une association dynamique qui organise des événements tous les deuxième  week-end du mois
                pour les passionnés de la culture furry.
              </p>
              <div class="mt-6 flex flex-wrap gap-3">
                <CustomButton
                  label="Découvrir les furmeets"
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

            <div class="relative grid gap-6 my-auto">
              <MascotFrame
                outer-bg="bg-linear-to-b from-brand-light-blue/90 to-transparent"
                inner-bg="bg-linear-to-b from-brand-green to-brand-green/85"
              />
            </div>
          </div>

          <!-- Annonce personnalisée -->
          <Transition name="fade" mode="out-in">
            <div v-if="currentAnnouncement" class="flex justify-center mt-8">
              <div class="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
                <div class="flex flex-wrap items-start gap-3">
                  <UIcon name="i-lucide-megaphone" class="h-5 w-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <h3 class="font-semibold text-xl text-white">{{ currentAnnouncement.title }}</h3>
                    <p class="mt-1 text-l text-white/90">{{ currentAnnouncement.message }}</p>
                  </div>
                  <CustomButton
                    v-if="currentAnnouncement.actionLabel && currentAnnouncement.actionUrl"
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

      <section class="mx-auto max-w-6xl px-6 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-brand-dark-blue">Nos furmeets</h2>
          <p class="mt-2 text-sm text-slate-500">
            Des rencontres cosy pour partager, apprendre et s'amuser ensemble.
          </p>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          
          <div v-if="furmeetsList.length === 0" class="col-span-full text-center text-slate-500">
            <UIcon name="i-lucide-calendar-x" class="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p class="text-lg font-medium">Aucun furmeet à venir pour le moment</p>
            <p class="text-sm mt-1">Restez à l'écoute de nos prochaines annonces !</p>
          </div>

          <UCard v-for="meet in furmeetsList" :key="meet.id" v-else class="overflow-hidden rounded-3xl">
            
            
            <ImageWithFallback
              :src="`/furmeet/thumbnail/${meet.id}.png`"
              :alt="meet.title"
              :fallback="`/furmeet/thumbnail/default.png`"
              class="rounded-2xl bg-cover bg-center"
            />
            <div class="px-2 pb-4 pt-4">
              <h3 class="text-lg font-semibold">{{ meet.title }}</h3>
              <p class="mt-2 text-sm text-slate-500">{{ meet.description }}</p>
              <div class="mt-4 flex items-center justify-between text-xs font-semibold text-brand-blue">
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

      <section class="mx-auto max-w-6xl px-6 pb-16">
        <div class="grid gap-8 rounded-3xl bg-brand-green p-10 text-white shadow-2xl md:grid-cols-[1.3fr_0.7fr]">
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl font-bold text-brand-yellow">Qu'est-ce qu'un furry ?</h2>
            <p class="mt-6 text-lg text-white/90">
              Le Furry est un mouvement culturel qui célèbre l'amour des animaux anthropomorphes - des créatures
              possédant à la fois des caractéristiques humaines et animales. Les furries partagent une passion pour
              l'art, la création de personnages et l'expression personnelle à travers des avatars uniques appelés
              <span class="font-semibold">fursonas</span>.
            </p>
            <p class="mt-4 text-base text-white/85">
              C'est une communauté mondiale, inclusive et créative qui se rassemble lors de conventions et d'événements
              pour célébrer l'imagination, la diversité et l'entraide. Des associations comme la nôtre organisent
              régulièrement des rencontres pour renforcer les liens au sein de la communauté française.
            </p>
            <div class="mt-8">
              <CustomButton
              to="/about"
              label="En savoir plus"
              bgClass="bg-brand-yellow"
              textClass="text-brand-green"
              hoverClass="hover:bg-white/90"
              size="lg"
            />
            </div>
          </div>
          <div class="flex items-center justify-center">
            <MascotFrame
              height="h-110"
              width="w-78"
            />
          </div>
        </div>
      </section>

      <section class="mx-auto">
        <div class="bg-linear-to-br from-brand-light-blue/20 to-brand-light-blue/15 p-10 text-white shadow-2xl md:p-16">
          <div class="text-center mb-10">
            <h2 class="text-4xl font-bold text-brand-dark-blue">Nous contacter</h2>
            <p class="mt-4 text-lg text-brand-dark-blue/90">
              Parle-nous de ton projet ou de ton envie de rejoindre la team !
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-3 mb-12">
            <div class="flex flex-col items-center text-center">
              <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
                <UIcon name="i-lucide-mail" class="h-6 w-6 text-brand-dark-blue" />
              </div>
              <p class="font-semibold text-lg text-brand-dark-blue">Email</p>
              <p class="text-sm text-brand-dark-blue/80">contact@furntours.fr</p>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
                <UIcon name="i-lucide-map-pin" class="h-6 w-6 text-brand-dark-blue" />
              </div>
              <p class="font-semibold text-lg text-brand-dark-blue">Localisation</p>
              <p class="text-sm text-brand-dark-blue/80">Tours, France</p>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="rounded-full bg-brand-blue/20 p-4 mb-3">
                <UIcon name="i-lucide-calendar" class="h-6 w-6 text-brand-dark-blue" />
              </div>
              <p class="font-semibold text-lg text-brand-dark-blue">Événements</p>
              <p class="text-sm text-brand-dark-blue/80">Chaque 2ème week-end du mois</p>
            </div>
          </div>

          <form class="grid gap-5 max-w-2xl mx-auto">
            <div class="grid gap-4 md:grid-cols-2">
              <UInput placeholder="Prénom" class="rounded-xl" size="lg" color="neutral" />
              <UInput placeholder="Nom" class="rounded-xl" size="lg" color="neutral" />
            </div>
            <UInput placeholder="Email" type="email" class="rounded-xl" size="lg" color="neutral" />
            <UInput placeholder="Pseudo (optionnel)" class="rounded-xl" size="lg" color="neutral" />
            <UTextarea placeholder="Ton message" class="rounded-xl" :rows="5" size="lg" color="neutral" />
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
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import CustomButton from "~/components/CustomButton.vue"
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Furmeet, FurmeetCard } from "~/types/furmeet";
import type { Announcement } from "~/types/announcement";

// API calls
const { data: furmeets } = await useAPI<Furmeet[] | { data: Furmeet[] }>("/furmeet/")
const { data: announcementData } = await useAPI<Announcement>("/announcement/current")

const router = useRouter()

// Computed properties
const furmeetsList = computed<FurmeetCard[]>(() => {
  const response = furmeets.value;
  if (!response) return [];

  const items = Array.isArray(response) ? response : response.data ?? [];
  if (!items.length) return [];

  return items.slice(0, 3).map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.description,
    date: new Date(item.date).toLocaleDateString("fr-FR"),
    imageURL: `/furmeet/thumbnail/${item.id}.png`,
  }));
});

const currentAnnouncement = computed<Announcement | null>(() => {
  const announcement = announcementData.value

  if (!announcement || !announcement.active) {
    return null
  }
  return announcement
})

// Methods
const onAnnouncementAction = () => {
  const url = currentAnnouncement.value?.actionUrl
  if (!url) return

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (import.meta.client) {
      window.open(url, "_blank")
    }
    return
  }

  router.push(url)
}
</script>
