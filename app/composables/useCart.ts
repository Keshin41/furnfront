import type { CartItem } from "~/types/cart";

const STORAGE_KEY = "furn-cart";

const items = ref<CartItem[]>([]);
let hydrated = false;

function persist() {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
  }
}

function hydrate() {
  if (!hydrated && import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        items.value = JSON.parse(stored) as CartItem[];
      } catch {
        items.value = [];
      }
    }
    hydrated = true;
  }
}

export const useCart = () => {
  hydrate();

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  function addItem(item: Omit<CartItem, "quantity">) {
    const existing = items.value.find((i) => i.skuId === item.skuId);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.value.push({ ...item, quantity: 1 });
    }
    persist();
  }

  function removeItem(skuId: string) {
    items.value = items.value.filter((i) => i.skuId !== skuId);
    persist();
  }

  function updateQuantity(skuId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(skuId);
      return;
    }
    const item = items.value.find((i) => i.skuId === skuId);
    if (item) {
      item.quantity = quantity;
      persist();
    }
  }

  function clearCart() {
    items.value = [];
    persist();
  }

  return {
    items,
    total,
    count,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
