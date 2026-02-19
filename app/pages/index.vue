<script setup lang="ts"></script>
<template>
  <div>
    <HomeSlideshow
      :photos="['/meet-shuffle.avif', '/meet-outdoor.jpg', '/meet-duck.jpg']"
    />
    <UCard class="mx-4 my-6 bg-[#227175]">
      <div class="flex">
        <div class="flex-col flex-1 p-4">
          <CurvyTitle class="text-[#FFEE88]">
            C'est quoi le Furry Fandom ?
          </CurvyTitle>
          <div class="text-white">
            Le Furry Fandom est une sous-culture née de l'engouement pour les
            personnages anthropomorphes.
            <br />
            Il englobe diverses formes d'art, de loisirs et de créations,
            notamment des dessins, des histoires, des jeux, et bien plus encore.
            Les furries se rassemblent pour partager leur passion, créant ainsi
            une communauté inclusive et créative.
            <br />
            C'est quoi un "fursona" ?
            <br />
            Un « fursona » est une contraction des mots « furry » et « persona
            ». Il s'agit d'un avatar personnel créé par un membre de la
            communauté furry pour représenter sa propre identité au sein de
            cette culture. Les fursonas peuvent être aussi variés que
            l'imagination le permet, allant des créatures fantastiques aux
            animaux réalistes.
          </div>
        </div>
        <div class="">
          <img src="/mascot.jpg" alt="Mascotte de l'asso" class="h-150 mx-16" />
        </div>
      </div>
    </UCard>
  </div>
</template>
