<script setup lang="ts">
import { useKonamiCode } from '~/composables/useKonamiCode';


interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

// Activer le code Konami sur toutes les pages
useKonamiCode();
</script>

<template>
    <AppShell variant="header" class="flex min-h-screen flex-col overflow-visible">
        <AppHeader :breadcrumbs="breadcrumbs" />
        <AppContent class="flex-1">
            <slot />
        </AppContent>
        <AppFooter />
    </AppShell>
</template>
