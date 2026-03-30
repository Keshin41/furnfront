<script setup lang="ts">
const discoverLinks = [
  { label: "Furmeets", to: "#" },
  { label: "Boutique", to: "/shop" },
  { label: "Qu'est-ce qu'un furry ?", to: "#" },
  { label: "Histoire de l'association", to: "#" },
  { label: "Reseau", to: "#" },
];

const legalLinks = [
  { label: "CGU", to: "#" },
  { label: "RGPD", to: "#" },
  { label: "Statut", to: "#" },
  { label: "Reglement interieur", to: "#" },
];
</script>

<template>
  <UFooter class="bg-brand-light-blue" :ui="{ bottom: 'pt-0 lg:pt-0' }">
    <template #left>
      <div class="grid place-items-center rounded-2xl">
        <SiteLogo variant="arrow" class="w-80" />
      </div>
    </template>

    <template #right>
      <div class="grid gap-6 text-sm lg:mr-[8vw] md:grid-cols-2  sm:mr-0">
        <div class="mx-8">
          <p class="mb-2 font-semibold">Decouvrir</p>
          <UButton v-for="link in discoverLinks" :key="link.label" :to="link.to" variant="ghost" size="xs"
            class="px-0! grid text-slate-700 hover:text-brand-dark-blue">
            {{ link.label }}
          </UButton>
        </div>

        <div class="mx-8">
          <p class="mb-2 font-semibold">Legal</p>
          <UButton v-for="link in legalLinks" :key="link.label" :to="link.to" variant="ghost" size="xs"
            class="px-0! grid text-slate-700 hover:text-brand-dark-blue">
            {{ link.label }}
          </UButton>
        </div>
      </div>
    </template>

    <template #bottom>
      <p class="flex justify-center text-sm text-gray-500">© 2025 Fur'N'Tours. All rights reserved.</p>
    </template>

  </UFooter>
</template>
