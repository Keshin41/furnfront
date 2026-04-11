<script setup lang="ts">
import ImageWithFallback from "~/components/ImageWithFallback.vue";

const open = defineModel<boolean>({ default: false });
const { items, total, removeItem, updateQuantity, clearCart } = useCart();

const handleGoToCheckout = () => {
  open.value = false;
  navigateTo("/checkout");
};
</script>

<template>
  <USlideover v-model:open="open" side="right">
    <template #content>
      <div class="flex h-full flex-col">
        <div
          class="flex items-center justify-between border-b border-slate-100 px-5 py-4"
        >
          <h2 class="text-lg font-bold text-brand-dark-blue">Mon panier</h2>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            @click="open = false"
          />
        </div>

        <div
          v-if="items.length === 0"
          class="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400"
        >
          <UIcon name="i-lucide-shopping-cart" class="h-12 w-12 opacity-30" />
          <p class="text-sm">Ton panier est vide.</p>
        </div>

        <ul
          v-else
          class="flex-1 overflow-y-auto divide-y divide-slate-100 px-5"
        >
          <li v-for="item in items" :key="item.skuId" class="flex gap-4 py-4">
            <ImageWithFallback
              :src="item.imageUrl"
              :alt="item.productName"
              class="h-16 w-16 shrink-0 rounded-2xl object-cover border border-slate-100"
            />

            <div class="flex flex-1 flex-col gap-1">
              <span class="font-semibold text-brand-dark-blue leading-tight">{{
                item.productName
              }}</span>
              <span v-if="item.variantLabel" class="text-xs text-slate-400">{{
                item.variantLabel
              }}</span>
              <span class="text-sm font-bold text-brand-blue"
                >{{ (item.price * item.quantity).toFixed(2) }} €</span
              >

              <div class="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                  @click="updateQuantity(item.skuId, item.quantity - 1)"
                >
                  −
                </button>
                <span class="w-5 text-center text-sm font-medium">{{
                  item.quantity
                }}</span>
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                  @click="updateQuantity(item.skuId, item.quantity + 1)"
                >
                  +
                </button>
                <button
                  type="button"
                  class="ml-auto text-xs text-red-400 hover:text-red-600"
                  @click="removeItem(item.skuId)"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div
          v-if="items.length > 0"
          class="border-t border-slate-100 px-5 py-4 space-y-3"
        >
          <div class="flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span class="text-brand-blue">{{ total.toFixed(2) }} €</span>
          </div>
          <UButton
            block
            label="Commander"
            color="primary"
            size="lg"
            @click="handleGoToCheckout()"
          />
          <UButton
            block
            label="Vider le panier"
            variant="outline"
            color="neutral"
            size="sm"
            @click="clearCart()"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>
