<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import CartDrawer from '~/components/CartDrawer.vue';

const navItems: NavigationMenuItem[] = [
    {
        label: "Notre association",
        children: [
            { label: "Histoire et objectifs", to: "#" },
            { label: "Qu'est ce qu'un furry", to: "#" },
            { label: "Notre équipe", to: "#" },
        ],
    },
    { label: "Reseau", to: "#" },
    { label: "Boutique", to: "/shop" },
    { label: "Contact", to: "#" },
];

const cartOpen = ref(false);
const { count } = useCart();
</script>

<template>
    <UHeader class="sticky top-0 z-20 bg-brand-blue text-white shadow-lg">
        <template #left>
            <ULink to="/">
                <SiteLogo variant="arrow" class="h-30" />
            </ULink>
        </template>
        <UNavigationMenu :items="navItems" content-orientation="vertical" :ui="{
            link: 'text-white hover:text-black text-xl ',
        }" />

        <template #right>
            <UButton variant="ghost" @click="cartOpen = true" class="relative">
                <UIcon name="i-lucide-shopping-cart" class="text-white h-5 w-5" />
                <span
                  v-if="count > 0"
                  class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-blue"
                >{{ count }}</span>
            </UButton>
        </template>
    </UHeader>

    <CartDrawer v-model="cartOpen" />
</template>
