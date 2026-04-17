<script lang="ts" setup>
const { status } = defineProps<{
  status: string;
}>();

const recap = computed(() => {
  switch (status) {
    case "success":
      return {
        icon: "i-heroicons-check-circle-20-solid",
        title: "Paiement réussi !",
        message: "Votre paiement a été effectué avec succès.",
        color: "green",
      };
    case "processing":
      return {
        icon: "i-heroicons-clock-20-solid",
        title: "Paiement en cours de traitement",
        message: "Votre paiement est en cours de traitement.",
        color: "yellow",
      };
    case "requires_payment_method":
      return {
        icon: "i-heroicons-x-circle-20-solid",
        title: "Paiement échoué",
        message:
          "Votre paiement a échoué. Veuillez réessayer avec un autre moyen de paiement.",
        color: "red",
      };
    case "canceled":
      return {
        icon: "i-heroicons-x-circle-20-solid",
        title: "Paiement annulé",
        message: "Le paiement a été annulé avant validation.",
        color: "red",
      };
    default:
      return {
        icon: "i-heroicons-exclamation-triangle-20-solid",
        title: "Statut de paiement inconnu",
        message:
          "Une erreur inconnue s'est produite lors du traitement de votre paiement.",
        color: "yellow",
      };
  }
});

const buttonOne = computed(() => {
  switch (status) {
    case "success":
    case "processing":
      return {
        text: "Continuer le shopping",
        link: "/shop",
      };
    case "requires_payment_method":
      return {
        text: "Réessayer le paiement",
        link: "/shop",
      };
    case "canceled":
      return {
        text: "Retour à l'accueil",
        link: "/",
      };
    default:
      return {
        text: "Retour à l'accueil",
        link: "/",
      };
  }
});

const buttonTwo = computed(() => {
  return {
    text: "Retourner à l'accueil",
    link: "/",
  };
});
</script>
<template>
  <section
    class="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white/90 px-8 py-16 shadow-sm backdrop-blur text-center md:px-16 md:py-20"
  >
    <div
      :class="`flex items-center justify-center rounded-full bg-${recap.color}-50 p-6 ring-12 ring-${recap.color}-100`"
    >
      <UIcon :name="recap.icon" :class="`size-16 text-${recap.color}-500`" />
    </div>

    <div class="space-y-3">
      <h2 class="text-3xl font-bold text-neutral-900">{{ recap.title }}</h2>
      <p class="text-base text-neutral-500 max-w-sm mx-auto">
        {{ recap.message }}
      </p>
    </div>

    <USeparator class="w-full" />

    <div class="flex w-full flex-col gap-3 sm:flex-row">
      <UButton v-if="buttonOne" :to="buttonOne.link" color="primary" size="xl" block>
        {{ buttonOne.text }}
      </UButton>
      <UButton v-if="buttonTwo"
        :to="buttonTwo.link"
        color="neutral"
        variant="soft"
        size="xl"
        block
      >
        {{ buttonTwo.text }}
      </UButton>
    </div>
  </section>
</template>
