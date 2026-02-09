<script setup lang="ts">
</script>

<template>
    <AppShell variant="header" class="flex min-h-screen flex-col overflow-visible bg-dark">
        <AdminHeader />
        <AppContent class="flex-1 py-8">
            <slot />
        </AppContent>
    </AppShell>
</template>
