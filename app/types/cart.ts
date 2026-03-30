export interface CartItem {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}
