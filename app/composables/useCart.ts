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
        items.value = (JSON.parse(stored) as Partial<CartItem>[]).map((item) => ({
          lineId: item.lineId ?? item.skuId ?? crypto.randomUUID(),
          skuId: item.skuId ?? '',
          skuCode: item.skuCode ?? '',
          productId: item.productId ?? '',
          productName: item.productName ?? '',
          variantLabel: item.variantLabel ?? '',
          price: item.price ?? 0,
          imageUrl: item.imageUrl ?? null,
          quantity: item.quantity ?? 1,
          kind: item.kind ?? 'product',
          ticketDetails: item.ticketDetails,
        }));
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

  function addItem(item: Omit<CartItem, "quantity" | "lineId"> & { quantity?: number; lineId?: string }) {
    const nextItem: CartItem = {
      ...item,
      lineId: item.lineId ?? item.skuId,
      quantity: item.quantity ?? 1,
      kind: item.kind ?? 'product',
    };

    const canMerge = nextItem.kind !== 'internat-ticket';
    const existing = canMerge
      ? items.value.find((i) => i.kind !== 'internat-ticket' && i.skuId === nextItem.skuId)
      : undefined;

    if (existing) {
      existing.quantity += nextItem.quantity;
    } else {
      items.value.push(nextItem);
    }
    persist();
  }

  function removeItem(lineId: string) {
    items.value = items.value.filter((i) => i.lineId !== lineId);
    persist();
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    const item = items.value.find((i) => i.lineId === lineId);
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
