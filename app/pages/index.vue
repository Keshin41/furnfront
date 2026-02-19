<template>
  <div class="min-h-screen bg-brand-white text-slate-900">
    <AppHeader />
    <main>
      <section
        class="relative grid min-h-[calc(100vh-var(--ui-header-height))] items-center overflow-hidden text-white">

        <HeroBackgroundCarousel />

        <div class="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div class="my-auto">
            <p class="text-l font-semibold uppercase tracking-[0.3em] text-white/70">Association furry</p>
            <h1 class="text-8xl font-bold leading-tight md:text-6xl">
              Fur'N'Tours
            </h1>
            <p class="mt-4 max-w-xl text-xl text-white/85 font-family-sans">
              Fur'N'Tours est une association dynamique qui organise des événements tous les deuxieme week-end du mois
              pour les passionnés de la culture furry.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <UButton class="rounded-full bg-brand-dark-blue px-6 py-3 text-white shadow-lg" size="lg">
                Decouvrir les furmeets
              </UButton>
              <UButton class="rounded-full border-2 border-white/70 px-6 py-3 text-white" size="lg" variant="ghost">
                Voir le reseau
              </UButton>
            </div>
          </div>
          <div class="relative grid gap-6 my-auto">
            <div class="relative mx-auto h-115 w-90">
              <div class="absolute inset-0 rounded-full bg-linear-to-b from-brand-light-blue/90 to-transparent"></div>
              <div class="absolute inset-6 rounded-[36px] bg-linear-to-b from-brand-green to-brand-green/85 shadow-xl">
                <img src="assets/img/mascote.png" alt="Furn Fest 2026">
              </div>
              <div class="absolute -top-2 left-6 h-3 w-3 rounded-full bg-white"></div>
              <div class="absolute top-10 right-5 h-2.5 w-2.5 rounded-full bg-white"></div>
              <div class="absolute bottom-6 left-4 h-2.5 w-2.5 rounded-full bg-white"></div>
            </div>
          </div>
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
          <UCard v-for="meet in furmeetsList" :key="meet.id" class="overflow-hidden rounded-3xl">
            <div class="h-44 rounded-2xl bg-cover bg-center"
              :style="{ backgroundImage: `url(/furmeet/thumbnail/${meet.id}.png), url(/furmeet/thumbnail/default.png)` }">
            </div>
            <div class="px-2 pb-4 pt-4">
              <h3 class="text-lg font-semibold">{{ meet.title }}</h3>
              <p class="mt-2 text-sm text-slate-500">{{ meet.description }}</p>
              <div class="mt-4 flex items-center justify-between text-xs font-semibold text-brand-blue">
                <span>{{ meet.place }}</span>
                <span>{{ meet.date }}</span>
              </div>
            </div>
          </UCard>
        </div>
        <div class="mt-8 flex justify-center">
          <UButton class="rounded-full bg-brand-blue px-6 py-3 text-white" size="lg">
            Voir tous les furmeets
          </UButton>
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
              <UButton 
                to="/about" 
                class="rounded-full bg-brand-yellow px-8 py-3 text-brand-green font-semibold shadow-lg hover:bg-white/90" 
                size="lg"
              >
                En savoir plus
              </UButton>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <div class="relative h-110 w-78">
              <div class="absolute inset-0 rounded-full bg-linear-to-b from-brand-light-blue/30 to-transparent"></div>
              <div class="absolute inset-6 rounded-[36px] bg-linear-to-b from-brand-yellow to-brand-mango shadow-xl">
                <img src="assets/img/mascote.png" alt="Mascotte Fur'N'Tours" class="h-full w-full object-contain">
              </div>
              <div class="absolute -top-2 left-8 h-3 w-3 rounded-full bg-white"></div>
              <div class="absolute top-16 right-6 h-2.5 w-2.5 rounded-full bg-white"></div>
              <div class="absolute bottom-10 left-6 h-2.5 w-2.5 rounded-full bg-white"></div>
            </div>
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
            <UButton class="rounded-full bg-white px-8 py-3 text-brand-dark-blue font-semibold shadow-lg hover:bg-white/90 mx-auto" size="lg">
              Envoyer le message
            </UButton>
          </form>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { Furmeet } from "~/types/furmeet";

type FurmeetCard = {
  id: string;
  title: string;
  description: string;
  place: string;
  date: string;
  tone?: string;
  imageUrl?: string;
};

const defaultFurmeets: FurmeetCard[] = [
  {
    id: "local-1",
    title: "Sortie au parc",
    description: "Balade photo et pique-nique artistique.",
    place: "Tours",
    date: "Samedi",
    tone: "bg-linear-to-br from-brand-yellow to-brand-mango",
  },
  {
    id: "local-2",
    title: "Atelier craft",
    description: "Couture et accessoires pour fursona.",
    place: "Atelier Creatif",
    date: "Dimanche",
    tone: "bg-linear-to-br from-brand-light-blue to-brand-blue",
  },
  {
    id: "local-3",
    title: "Soiree jeux",
    description: "Jeux de societe, quiz et chill.",
    place: "Maison associative",
    date: "Vendredi",
    tone: "bg-linear-to-br from-brand-blue to-brand-green",
  },
];

const { data: furmeets, error } = await useAPI<Furmeet[] | { data: Furmeet[] }>("/furmeet/")
watchEffect(() => {
  console.log("error:", error.value)
})
const furmeetsList = computed<FurmeetCard[]>(() => {
  const response = furmeets.value ?? [];
  const items = Array.isArray(response) ? response : response.data ?? [];
  if (!items.length) {
    return defaultFurmeets;
  }
  return items.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    place: "Tours",
    date: new Date(item.date).toLocaleDateString("fr-FR"),
    tone: defaultFurmeets[index % defaultFurmeets.length]?.tone,
  }));
});
</script>
