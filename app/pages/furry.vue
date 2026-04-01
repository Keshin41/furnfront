<template>
  <div class="min-h-screen bg-brand-white text-brand-ink-deep">
    <main>
      <!-- Hero -->
      <section
        class="relative overflow-hidden bg-brand-blue py-20 text-brand-white"
      >
        <div class="pointer-events-none absolute inset-0 opacity-10">
          <div
            class="absolute -left-16 -top-16 h-96 w-96 rounded-full bg-brand-white blur-3xl"
          />
          <div
            class="absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-brand-yellow blur-3xl"
          />
        </div>
        <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p
            class="text-sm font-semibold uppercase tracking-widest text-brand-white/70"
          >
            Notre association
          </p>
          <h1 class="mt-3 text-5xl font-bold leading-tight md:text-6xl">
            Qu'est-ce que<br />le Furry ?
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-brand-white/85">
            Un mouvement culturel mondial qui célèbre la créativité,
            l'imaginaire et les animaux anthropomorphes.
          </p>
        </div>
      </section>

      <!-- Bloc intro + vidéo Arte -->
      <section class="mx-auto max-w-5xl px-6 py-16">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 class="mb-4 text-3xl font-semibold">
              Qu'est-ce que le Furry&nbsp;?
            </h2>
            <p class="mt-4 leading-relaxed text-brand-ink">
              Le Furry est un mouvement culturel qui célèbre l'amour des animaux
              anthropomorphes — des créatures mêlant caractéristiques humaines
              et animales. Les membres de cette communauté, appelés
              <strong>furries</strong>, partagent un intérêt commun pour la
              création artistique, l'imaginaire et l'expression personnelle à
              travers des personnages originaux souvent très colorés.
            </p>
            <p class="mt-4 leading-relaxed text-brand-ink">
              C'est avant tout un espace de
              <strong>créativité et de bienveillance</strong>, où chacun est
              libre d'exprimer son identité et son univers.
            </p>
          </div>

          <!-- Vidéo Arte -->
          <div class="overflow-hidden rounded-2xl shadow-lg">
            <div class="relative bg-brand-ink pb-[56.25%]">
              <iframe
                class="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/wDKs7EGogHU?feature=oembed"
                title="Arte – Le Furry Fandom"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              />
            </div>
            <p
              class="bg-brand-light-blue/40 px-4 py-2 text-center text-sm text-brand-ink"
            >
              🎬 Une superbe vidéo réalisée par Arte explique très bien le
              phénomène !
            </p>
          </div>
        </div>
      </section>

      <!-- Le Furry Fandom -->
      <section class="bg-brand-light-blue/30 py-16">
        <div class="mx-auto max-w-5xl px-6">
          <h2 class="mb-4 text-3xl font-semibold">Le Furry Fandom</h2>
          <p class="mt-4 max-w-3xl leading-relaxed text-brand-ink">
            Le <strong>Furry Fandom</strong> est la communauté qui s'est formée
            autour de cette passion pour les personnages anthropomorphes. Né à
            la croisée du dessin, de la littérature et de la science-fiction, ce
            mouvement s'étend aujourd'hui à de nombreuses formes d'art et de
            loisirs : illustration, écriture, jeux, costumes, musique, etc.
          </p>
          <p class="mt-4 max-w-3xl leading-relaxed text-brand-ink">
            Les furries se réunissent en ligne et lors d'événements pour
            partager leurs créations, échanger des idées et célébrer une
            imagination sans limites.
          </p>
        </div>
      </section>

      <!-- Fursona + Fursuit -->
      <section class="mx-auto max-w-5xl px-6 py-16">
        <div class="grid gap-8 md:grid-cols-2">
          <div
            class="rounded-2xl bg-brand-white p-8 shadow-md ring-1 ring-brand-light-blue"
          >
            <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark-blue/10 text-brand-dark-blue"
            >
              <UIcon name="i-lucide-user-round" class="h-6 w-6" />
            </div>
            <h3 class="text-2xl font-bold text-brand-dark-blue">
              Qu'est-ce qu'un fursona&nbsp;?
            </h3>
            <p class="mt-3 leading-relaxed text-brand-ink">
              Le <strong>fursona</strong> (contraction de <em>furry</em> et
              <em>persona</em>) est un avatar personnel créé par un membre du
              fandom pour représenter sa personnalité, ses valeurs ou simplement
              un personnage qu'il affectionne. Il peut s'agir d'un animal
              réaliste, d'une créature fantastique ou même d'un hybride venu
              d'un autre monde — tout dépend de l'imagination de son créateur !
            </p>
          </div>

          <div
            class="rounded-2xl bg-brand-white p-8 shadow-md ring-1 ring-brand-light-blue"
          >
            <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"
            >
              <UIcon name="i-lucide-shirt" class="h-6 w-6" />
            </div>
            <h3 class="text-2xl font-bold text-brand-green">
              Et une fursuit&nbsp;?
            </h3>
            <p class="mt-3 leading-relaxed text-brand-ink">
              Une <strong>fursuit</strong> est un costume confectionné pour
              incarner son fursona dans la vraie vie. Souvent très travaillées,
              ces tenues sont utilisées lors d'événements, de conventions ou de
              séances photo. Elles symbolisent la créativité et l'artisanat au
              cœur du fandom.
            </p>
          </div>
        </div>
      </section>

      <!-- Communauté mondiale -->
      <section class="bg-brand-ink py-16 text-brand-white">
        <div class="mx-auto max-w-5xl px-6">
          <h2 class="mb-4 text-3xl font-semibold text-brand-white">
            Une communauté mondiale et inclusive
          </h2>
          <p class="mt-4 max-w-3xl leading-relaxed text-brand-white/85">
            La communauté furry est présente partout dans le monde. Des
            conventions comme
            <strong>Anthrocon</strong> aux États-Unis,
            <strong>Eurofurence</strong> en Europe ou
            <strong>ConFuzzled</strong> au Royaume-Uni rassemblent chaque année
            des milliers de passionné·es pour célébrer la diversité et la
            créativité.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div
              v-for="conv in conventions"
              :key="conv.name"
              class="rounded-xl bg-brand-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-brand-white/15"
            >
              <p class="text-2xl font-bold text-brand-yellow">
                {{ conv.name }}
              </p>
              <p class="mt-1 text-sm text-brand-white/70">
                {{ conv.location }}
              </p>
              <ULink
                :to="conv.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-white underline decoration-brand-white/40 underline-offset-4 hover:text-brand-yellow"
              >
                Site officiel
                <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
              </ULink>
            </div>
          </div>
        </div>
      </section>

      <!-- En France -->
      <section class="bg-brand-light-blue/20 py-16">
        <div class="mx-auto max-w-5xl px-6">
          <div class="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <h2 class="mb-4 text-3xl font-semibold">En France 🇫🇷</h2>
              <p class="mt-4 leading-relaxed text-brand-ink">
                En France aussi, le fandom furry est très actif ! Plusieurs
                associations et groupes régionaux organisent des rencontres et
                des événements pour faire vivre la culture furry, comme la
                <strong>Normandifurs</strong>, la <strong>FBL</strong> ou la
                <strong>Fauntastic</strong>.
              </p>
              <p class="mt-4 leading-relaxed text-brand-ink">
                Notre association s'inscrit dans cette dynamique, en créant des
                espaces d'échange et de partage autour de cette passion commune.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <div
                  v-for="association in regionalAssociations"
                  :key="association.name"
                  class="rounded-xl bg-brand-white p-5 shadow-sm ring-1 ring-brand-blue/20 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p class="text-lg font-bold text-brand-blue">
                    {{ association.name }}
                  </p>
                  <p class="mt-2 text-sm text-brand-ink">
                    {{ association.region }}
                  </p>
                  <ULink
                    :to="association.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue underline decoration-brand-blue/40 underline-offset-4 hover:text-brand-dark-blue"
                  >
                    Découvrir {{ association.name }}
                    <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
                  </ULink>
                </div>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="rounded-2xl bg-brand-blue/10 p-6 text-center">
                <UIcon
                  name="i-lucide-map-pin"
                  class="mx-auto h-10 w-10 text-brand-blue"
                />
                <p class="mt-2 text-sm font-semibold text-brand-blue">
                  Tours & alentours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Rejoignez-nous -->
      <section class="bg-brand-yellow py-16">
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="mb-4 text-3xl font-semibold text-brand-amber">
            Rejoignez-nous !
          </h2>
          <p class="mt-4 text-lg leading-relaxed text-brand-amber">
            Participez à cette aventure où l'imagination n'a pas de frontières
            et où chaque personnalité trouve sa place, quelle que soit sa
            couleur de pelage !
          </p>
          <div class="mt-8">
            <CustomButton
              label="Adhérer à notre association"
              to="#"
              bg-class="bg-brand-dark-blue"
              text-class="text-white"
              size="xl"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Qu'est-ce que le Furry ? — Fur'N'Tours",
  description:
    "Découvrez le mouvement furry, le fandom, les fursonas et les fursuits. Une culture mondiale de créativité et de bienveillance.",
});

const conventions = [
  {
    name: "Anthrocon",
    location: "Pittsburgh, États-Unis",
    url: "https://www.anthrocon.org",
  },
  {
    name: "Eurofurence",
    location: "Hambourg, Allemagne",
    url: "https://www.eurofurence.org",
  },
  {
    name: "ConFuzzled",
    location: "Royaume-Uni",
    url: "https://www.confuzzled.org.uk",
  },
];

const regionalAssociations = [
  {
    name: "NormandiFurs",
    region: "Normandie",
    url: "https://www.normandifurs.fr",
  },
  {
    name: "FBL",
    region: "Grand Ouest",
    url: "https://fblacklight.org/",
  },
  {
    name: "Fauntastic",
    region: "France",
    url: "https://www.fauntastic.eu",
  },
];
</script>
