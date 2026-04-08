<script setup lang="ts">
const { items, total, count } = useCart();
</script>
<template>
  <div class="p-4 border rounded-lg">
    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
    <ul class="mb-4">
      <li
        v-for="item in items"
        :key="item.skuId"
        class="flex justify-between mb-2"
      >
        <span>{{ item.productName }} x {{ item.quantity }}</span>
        <span>{{ (item.price * item.quantity).toFixed(2) }} €</span>
      </li>
    </ul>
    <div class="flex justify-between font-bold text-lg">
      <span>Total ({{ count }} items):</span>
      <span>{{ total.toFixed(2) }} €</span>
    </div>
  </div>
</template>
