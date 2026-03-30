export interface ProductSku {
  id: string;
  skuCode: string;
  priceOverride: string | null;
  stock: number;
  trackStock: boolean;
  imageUrl: string | null;
}

export interface ProductOptionValue {
  id: string;
  value: string;
}

export interface ProductOptionType {
  id: string;
  name: string;
  optionValues: ProductOptionValue[];
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  basePrice: string;
  category?: string | null;
  imageUrl?: string | null;
  virtual: boolean;
  skus: ProductSku[];
  optionTypes: ProductOptionType[];
}
