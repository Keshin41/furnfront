<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import z from "zod";

defineProps<{
  onSubmit: (event: FormSubmitEvent<Schema>) => void;
}>();

const optionChambre = ref<RadioGroupItem[]>([
  {
    label: "Non",
    value: false,
  },
  {
    label: "Oui",
    description: "7€ supplémentaires",
    value: true,
  },
]);

const optionGoodies = ref<RadioGroupItem[]>([
  {
    label: "Non",
    value: false,
  },
  {
    label: "Oui",
    description: "14€ supplémentaires",
    value: true,
  },
]);

const active = ref<string | number>("0");

const tabs = computed(() =>
  state.items.map((_, i) => ({
    label: `Ticket n°${i + 1}`,
    index: i,
  })),
);

const innerSchema = z.object({
  surname: z.string().min(2, "2 caractères minimums"),
  firstname: z.string().min(2, "2 caractères minimums"),
  nickname: z.string().min(2, "2 caractères minimums"),
  email: z.email("Format invalide"),
  drap: z.boolean(),
  goodies: z.boolean(),
});

const schema = z.object({
  items: z.array(innerSchema),
});

type InnerSchema = z.output<typeof innerSchema>;
type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  items: [
    {
      surname: "",
      firstname: "",
      nickname: "",
      email: "",
      drap: false,
      goodies: false,
    },
  ],
});

const ticketCount = computed({
  get: () => state.items.length,
  set: (newVal: number) => {
    active.value = "0";
    const current = state.items.length;
    if (newVal > current) {
      state.items.push({
        surname: "",
        firstname: "",
        nickname: "",
        email: "",
        drap: false,
        goodies: false,
      });
    } else {
      state.items.splice(newVal);
    }
  },
});
</script>
<template>
  <h1 class="border-0 text-primary text-5xl font-bold mb-2">Internat 2026</h1>

  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="flex flex-col gap-4">
        <UFormField
          label="Nombre de billets"
          orientation="horizontal"
          class="shrink-0 justify-center"
        >
          <UInputNumber
            :min="1"
            :max="4"
            :default-value="1"
            orientation="vertical"
            v-model="ticketCount"
          />
        </UFormField>
        <UCard class="flex-1">
          <template #header>
            <h2>1 lit au sein de l’internat du Lycée Choiseul</h2>
          </template>
          <p><strong>55 € pour le week-end, incluant :</strong></p>
          <ul class="list-disc pl-5">
            <li>2 nuits (vendredi et samedi)</li>
            <li>2 petits-déjeuners (samedi et dimanche matin)</li>
            <li>Frais d’adhésion à l’association</li>
            <li>
              Un bracelet d’accès. Le bracelet est obligatoire pour pénétrer
              dans l’internat.
            </li>
          </ul>
          <br />
          <p>
            <em
              ><strong>
                Il est nécessaire d’être adhérent à l’association pour
                participer à l'internat. Les membres déjà adhérents se voient
                proposer 10€ de réduction sur le prix de l’internat, pour cela
                renseignez l’adresse mail utilisée lors de votre adhésion.
              </strong>
            </em>
          </p>
          <br />
          <p>
            <strong>
              6 lits individuels par chambre. Vous pouvez demander à être
              regroupés avec des proches dans une même chambre.
            </strong>
          </p>
          <br />
          <p>
            <strong>Linge :</strong> Drap, oreiller. Pensez à prendre votre
            couette !
          </p>
          <br />
          <p class="text-primary">
            <strong><u>Petit-déjeuner (à titre indicatif) :</u></strong>
          </p>
          <ul class="list-disc pl-5">
            <li>
              <strong>Boissons :</strong> café, chocolat en poudre, thé, lait,
              jus d’orange/pomme
            </li>
            <li>
              <strong>Nourriture :</strong> viennoiseries, céréales, confitures
              (fraise, abricot), brioche
            </li>
          </ul>
          <p class="text-primary">
            <strong><u>Horaires d’accueil :</u></strong>
          </p>
          <ul class="list-disc pl-5">
            <li>
              <strong>Vendredi :</strong> dès 19h (Arrivée anticipée possible,
              veuillez prévenir).
            </li>
            <li>
              <strong>Samedi :</strong> fermé de 11h à 17h pour permettre la
              participation au festival.
            </li>
            <li>
              <strong>Dimanche :</strong> départ et fermeture définitive de
              l’internat à 11h. Pensez à emporter vos affaires personnelles.
            </li>
          </ul>
          <p class="text-primary">
            <strong><u>Options :</u></strong>
          </p>
          <ul class="list-disc pl-5">
            <li>
              <strong>7€ - Pack Confort :</strong> Pour 7€ supplémentaires,
              l’association vous fournit une couette. Plus la peine de
              transporter la vôtre !
            </li>
            <li>
              <strong>14€ - Pack Goodies :</strong> L’association vous remet un
              sac contenant un exemplaire de chaque goodies 2026 (1 écocup, 1
              porte clé flamme, 1 sticker de chaque modèle)
            </li>
          </ul>
          <p>
            Pour toute question, n’hésitez pas à rejoindre notre canal Telegram.
          </p>
        </UCard>
      </div>
      <div>
        <UTabs v-model="active" :items="tabs" :ui="{ label: 'text-white', trigger: 'data-[state=inactive]:bg-brand-blue/30' }">
          <template #content="{ item }">
            <UCard>
              <UForm :name="`items.${item.index}`" :schema="innerSchema" nested>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UFormField label="Nom" name="surname" required>
                    <UInput v-model="state.items[item.index]!.surname" />
                  </UFormField>
                  <UFormField label="Prénom" name="firstname" required>
                    <UInput v-model="state.items[item.index]!.firstname" />
                  </UFormField>
                  <UFormField label="Pseudo" name="nickname" required>
                    <UInput v-model="state.items[item.index]!.nickname" />
                  </UFormField>
                  <UFormField label="Email" name="email" required>
                    <UInput v-model="state.items[item.index]!.email" />
                  </UFormField>
                  <UFormField
                    label="Option couette"
                    name="optionRoom"
                    required
                    class="col-span-2"
                  >
                    <URadioGroup
                      variant="table"
                      :items="optionChambre"
                      :model-value="state.items[item.index]!.drap"
                      @update:model-value="
                        (val) => {
                          if (val != null)
                            state.items[item.index]!.drap = val as boolean;
                        }
                      "
                    />
                  </UFormField>
                  <UFormField
                    label="Pack goodies"
                    name="optionRoom"
                    required
                    class="col-span-2"
                  >
                    <URadioGroup
                      variant="table"
                      :items="optionGoodies"
                      :model-value="state.items[item.index]!.goodies"
                      @update:model-value="
                        (val) => {
                          if (val != null)
                            state.items[item.index]!.goodies = val as boolean;
                        }
                      "
                    />
                  </UFormField>
                </div>
              </UForm>
            </UCard>
          </template>
        </UTabs>
            <div class="my-4 flex justify-center">
      <UButton class="w-full justify-center text-white sm:w-auto" type="submit" size="xl">
        Valider
      </UButton>
    </div>
      </div>
    </div>

  </UForm>
</template>
