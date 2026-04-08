<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <UMain>
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>
