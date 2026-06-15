<script setup lang="ts"></script>
<template>
  <h1 class="border-0 text-primary text-5xl font-bold mb-2">Internat 2026</h1>

  <UAlert
    color="error"
    variant="subtle"
    title="Inscriptions close"
    icon="heroicons:exclamation-triangle"
    description="La période d'inscription est fermée depuis le 15/06. Pour toute information ou demande au sujet de l'internat, merci de contacter un membre du staff."
  />

  <UCard class="flex-1 mt-4">
    <template #header>
      <h2>1 lit au sein de l’internat du Lycée Choiseul</h2>
    </template>
    <p><strong>55 € pour le week-end, incluant :</strong></p>
    <ul class="list-disc pl-5">
      <li>2 nuits (vendredi et samedi)</li>
      <li>2 petits-déjeuners (samedi et dimanche matin)</li>
      <li>Frais d’adhésion à l’association</li>
      <li>
        Un bracelet d’accès. Le bracelet est obligatoire pour pénétrer dans
        l’internat.
      </li>
    </ul>
    <br />
    <p>
      <em
        ><strong>
          L'internat est réservé aux adhérents de l'association, donc ce pack
          contient automatiquement une adhésion à l'association !
        </strong>
      </em>
    </p>
    <br />
    <p>
      Les membres déjà adhérents se voient proposer 10€ de réduction sur le prix
      de l’internat, pour cela renseignez l’adresse mail utilisée lors de votre
      adhésion.
    </p>
    <br />
    <p>
      <strong>
        6 lits individuels par chambre. Vous pouvez demander à être regroupés
        avec des proches dans une même chambre.
      </strong>
      Pour cela demander à @BluePawOwO sur Telegram.
    </p>
    <br />
    <p>
      <strong>Linge fournit :</strong> Drap. Pensez à prendre votre couette et
      votre oreiller !
    </p>
    <br />
    <p class="text-primary">
      <strong><u>Petit-déjeuner (à titre indicatif) :</u></strong>
    </p>
    <ul class="list-disc pl-5">
      <li>
        <strong>Boissons :</strong> café, chocolat en poudre, thé, lait, jus
        d’orange/pomme
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
        <strong>Dimanche :</strong> départ et fermeture définitive de l’internat
        à 11h. Pensez à emporter vos affaires personnelles.
      </li>
    </ul>
    <p class="text-primary">
      <strong><u>Options :</u></strong>
    </p>
    <ul class="list-disc pl-5">
      <li>
        <strong>7€ - Pack Confort :</strong> Pour 7€ supplémentaires,
        l’association vous fournit une couette et un oreiller. Plus la peine de
        transporter les vôtres !
      </li>
      <li>
        <strong>14€ - Pack Goodies :</strong> L’association vous remet un sac
        contenant un exemplaire de chaque goodies 2026 (1 écocup, 1 porte clé
        flamme, 1 sticker de chaque modèle)
      </li>
    </ul>
    <p>Pour toute question, n’hésitez pas à rejoindre notre canal Telegram.</p>
    <br />
    <p>Aucun remboursement ne sera émis par l'association.</p>
    <br />
    <p>
      Le règlement intérieur s'applique à l'internat, par conséquent les mineurs
      sont interdits.
    </p>
    <br />
    <UButton
      to="/reglement_internat_2026.pdf"
      target="_blank"
      size="xl"
      class="text-white"
      >Règlement de l'internat</UButton
    >
  </UCard>
</template>
