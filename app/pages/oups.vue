<template>
  <main class="min-h-[calc(100vh-var(--ui-header-height))] bg-brand-white px-4 py-12 sm:px-6 sm:py-16">
    <section class="mx-auto max-w-4xl">
      <div class="rounded-3xl border border-brand-light-blue/50 bg-white p-6 shadow-sm sm:p-10">
        <p
          class="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-ice px-4 py-1 text-xs font-semibold tracking-[0.18em] text-brand-ink uppercase"
        >
          <UIcon name="i-lucide-wrench" class="h-4 w-4" />
          En cours de developpement
        </p>

        <h1 class="font-bold text-4xl text-brand-ink-deep sm:text-5xl">
          Oups, cette page n'est pas encore prete
        </h1>

        <p class="mt-4 max-w-2xl text-base text-brand-ink/80 sm:text-lg">
          Cette section arrive bientot. En attendant, vous pouvez continuer votre
          navigation depuis les pages deja disponibles.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <UButton to="/" size="xl" color="primary">
            Retour a l'accueil
          </UButton>
          <UButton to="/shop" size="xl" color="neutral" variant="soft">
            Aller au shop
          </UButton>
          <UButton to="/furmeet" size="xl" color="neutral" variant="ghost">
            Voir les furmeets
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>