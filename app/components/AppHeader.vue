<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

/**
 * Détection route active (équivalent Inertia)
 */
const isCurrentRoute = (targetUrl: string) => {
  const currentUrl = route.path;

  if (currentUrl.startsWith("/boutique/panier") && targetUrl === "/boutique") {
    return true;
  }

  if (targetUrl === "/") return currentUrl === "/";

  return currentUrl.startsWith(targetUrl);
};

const activeItemStyles = (url: string) =>
  isCurrentRoute(url)
    ? "text-yellow font-semibold"
    : "text-blue hover:text-blue";

/**
 * Navigation principale
 */
const mainNavItems = ref<NavigationMenuItem[]>([
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "C'est quoi un furry ?", href: "/explication" },
  { label: "Furmeets", href: "/furmeets" },
  { label: "Contact", href: "/contact" },
]);
</script>

<template>
  <div
    class="sticky top-0 z-50 w-full bg-[#111827]/80 backdrop-blur-md will-change-transform"
  >
    <div
      class="relative border-b-2 border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
    >
      <div
        class="mx-auto flex h-22 items-center justify-center px-4 md:max-w-7xl"
      >
        <!-- Cart Button (Mobile) -->
        <div class="absolute right-4 lg:hidden">
          <CartButton />
        </div>

        <!-- Desktop Menu -->
        <div
          class="hidden h-full lg:flex lg:items-center lg:gap-8 lg:flex-1 lg:justify-between"
        >
          <div class="flex items-center gap-8">
            <!-- Logo & Titre -->
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-blue">Fur N Tours</span>
              <span class="text-s text-light-blue">Association</span>
            </div>

            <!-- Navigation -->
            <UNavigationMenu
              :items="mainNavItems"
              class="flex h-full items-stretch"
            />
          </div>

          <!-- Cart Button (Desktop) -->
          <CartButton />
        </div>
      </div>
    </div>
  </div>
</template>
