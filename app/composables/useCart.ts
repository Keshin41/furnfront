import type { CartItem } from "~/types/cart";
import type { Product } from "~/types/product";

const STORAGE_KEY = "furn-cart";

const items = ref<CartItem[]>([]);
let hydrated = false;

type CartStockRefreshResult = {
  ok: boolean;
  issues: string[];
};

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

  function addItem(item: Omit<CartItem, "quantity">): boolean {
    const existing = items.value.find((i) => i.skuId === item.skuId);

    const maxAllowed = item.trackStock ? Math.max(item.stock ?? 0, 0) : Infinity;

    if (maxAllowed <= 0) {
      return false;
    }

    if (existing) {
      const existingMaxAllowed = existing.trackStock
        ? Math.max(existing.stock ?? 0, 0)
        : maxAllowed;

      if (existing.quantity >= existingMaxAllowed) {
        return false;
      }

      existing.quantity += 1;
      existing.stock = item.stock;
      existing.trackStock = item.trackStock;
    } else {
      items.value.push({ ...item, quantity: 1 });
    }
    persist();
    return true;
  }

  function removeItem(skuId: string) {
    items.value = items.value.filter((i) => i.skuId !== skuId);
    persist();
  }

  function updateQuantity(skuId: string, quantity: number): boolean {
    if (quantity <= 0) {
      removeItem(skuId);
      return true;
    }
    const item = items.value.find((i) => i.skuId === skuId);
    if (item) {
      const maxAllowed = item.trackStock ? Math.max(item.stock ?? 0, 0) : Infinity;
      if (quantity > maxAllowed) {
        return false;
      }

      item.quantity = quantity;
      persist();
      return true;
    }

    return false;
  }

  function clearCart() {
    items.value = [];
    persist();
  }

  async function refreshStock(): Promise<CartStockRefreshResult> {
    if (!items.value.length) {
      return { ok: true, issues: [] };
    }

    const { $api } = useNuxtApp();
    const issues: string[] = [];
    let changed = false;

    const productIds = [...new Set(items.value.map((item) => item.productId))];
    const settled = await Promise.allSettled(
      productIds.map((productId) =>
        ($api as typeof $fetch)<Product>(`/product/${productId}`),
      ),
    );

    const productById = new Map<string, Product>();
    settled.forEach((result, index) => {
      const productId = productIds[index];
      if (!productId) {
        return;
      }

      if (result.status === "fulfilled" && result.value) {
        productById.set(productId, result.value);
      } else {
        issues.push(`Impossible de vérifier le stock pour un produit du panier.`);
      }
    });

    const nextItems: CartItem[] = [];
    for (const item of items.value) {
      const product = productById.get(item.productId);
      if (!product) {
        nextItems.push(item);
        continue;
      }

      const sku = product.skus.find((skuItem) => skuItem.id === item.skuId);
      if (!sku) {
        issues.push(`${item.productName} (${item.variantLabel}) n'est plus disponible et a été retiré du panier.`);
        changed = true;
        continue;
      }

      const maxAllowed = sku.trackStock ? Math.max(sku.stock, 0) : Infinity;
      const nextQuantity = Math.min(item.quantity, maxAllowed);

      if (item.trackStock !== sku.trackStock || item.stock !== sku.stock) {
        changed = true;
      }

      if (nextQuantity <= 0) {
        issues.push(`${item.productName} (${item.variantLabel}) est en rupture et a été retiré du panier.`);
        changed = true;
        continue;
      }

      if (nextQuantity !== item.quantity) {
        issues.push(`${item.productName} (${item.variantLabel}) a été ajusté à ${nextQuantity} exemplaire(s).`);
        changed = true;
      }

      nextItems.push({
        ...item,
        quantity: nextQuantity,
        trackStock: sku.trackStock,
        stock: sku.stock,
      });
    }

    if (changed) {
      items.value = nextItems;
      persist();
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  }

  return {
    items,
    total,
    count,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshStock,
  };
};
