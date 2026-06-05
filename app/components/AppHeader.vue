<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import CartDrawer from "~/components/CartDrawer.vue";
import { HISTORY_URL } from "~/constants/urls";

const route = useRoute();

const SelectedClass =
  "text-brand-yellow font-bold underline decoration-2 underline-offset-4";

const isShopSection = computed(() => {
  return route.path.startsWith("/shop") || route.path.startsWith("/checkout");
});

const associationChildren = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    { label: "Histoire et objectifs", to: HISTORY_URL },
    { label: "Qu'est ce qu'un furry", to: "/furry" },
    { label: "Notre équipe", to: "/oups" },
    { label: "Nos évènements", to: "/oups" },
  ];

  return items.map((item) => {
    if (!item.to || item.to === "/oups") {
      return item;
    }

    const isActive =
      route.path === item.to || route.path.startsWith(`${item.to}/`);

    return {
      ...item,
      active: isActive,
      class: isActive ? SelectedClass : undefined,
    };
  });
});

const isAssociationSection = computed(() => {
  return associationChildren.value.some((item) => item.active);
});

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Notre association",
    active: isAssociationSection.value,
    class: isAssociationSection.value ? SelectedClass : undefined,
    children: associationChildren.value,
  },
  {
    label: "Nos évènements",
    to: "/furmeet",
    active: route.path.startsWith("/furmeet"),
    class: route.path.startsWith("/furmeet") ? SelectedClass : undefined,
  },
  {
    label: "Boutique",
    to: "/shop",
    active: isShopSection.value,
    class: isShopSection.value ? SelectedClass : undefined,
  },
  {
    label: "Internat JTF 2026",
    to: "/internat",
    active: route.path.startsWith("/internat"),
    class: route.path.startsWith("/internat") ? SelectedClass : undefined,
  },
]);

const navMenuUi = {
  link: "text-white text-xl hover:!text-brand-yellow hover:before:bg-brand-yellow/15 focus-visible:!text-brand-yellow data-[state=open]:!text-brand-yellow aria-[expanded=true]:!text-brand-yellow",
  viewport:
    "border border-white/10 bg-brand-blue/95 text-white shadow-2xl backdrop-blur-sm",
  arrow: "border-white/10 bg-brand-blue/95",
  content: "rounded-2xl p-2",
  childList: "gap-1",
  childLink:
    "app-header-nav-child-link rounded-lg before:!bg-transparent text-white hover:!text-brand-yellow hover:before:!bg-brand-yellow/15",
};

const mobileMenuProps = {
  direction: "right" as const,
  overlay: true,
  class:
    "w-full max-w-sm border-l border-white/10 bg-brand-blue text-white shadow-2xl",
};

const cartOpen = ref(false);
const { count } = useCart();
</script>

<template>
  <UHeader
    mode="drawer"
    :menu="mobileMenuProps"
    class="sticky top-0 z-20 bg-brand-blue text-white shadow-lg h-20"
  >
    <template #left>
      <ULink to="/">
        <SiteLogo variant="arrow" class="h-25" />
      </ULink>
    </template>
    <UNavigationMenu
      :items="navItems"
      color="neutral"
      variant="link"
      content-orientation="vertical"
      :ui="navMenuUi"
    />

    <template #body>
      <div class="flex h-full flex-col bg-brand-blue text-white">
        <div class="border-b border-white/10 px-6 pb-5 pt-6">
          <ULink to="/">
            <SiteLogo variant="arrow" class="h-25" />
          </ULink>
        </div>

        <div class="flex flex-1 flex-col gap-6 px-4 py-6">
          <UNavigationMenu
            :items="navItems"
            orientation="vertical"
            color="neutral"
            variant="link"
            content-orientation="vertical"
            :ui="navMenuUi"
          />
        </div>
      </div>
    </template>

    <template #right v-if="isShopSection">
      <UButton variant="ghost" @click="cartOpen = true" class="relative">
        <UIcon name="i-lucide-shopping-cart" class="text-white h-5 w-5" />
        <span
          v-if="count > 0"
          class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-blue"
          >{{ count }}</span
        >
      </UButton>
    </template>
  </UHeader>

  <CartDrawer v-model="cartOpen" />
</template>
