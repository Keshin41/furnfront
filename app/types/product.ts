export interface ProductSku {
  id: string;
  skuCode: string;
  priceOverride: string | null;
  stock: number;
  trackStock: boolean;
  imageUrl: string | null;
  options: ProductSkuOption[];
}

export interface ProductSkuOption {
  optionValue: ProductSkuOptionValue;
}

export interface ProductSkuOptionValue {
  id: string;
  value: string;
  optionType: {
    id: string;
    name: string;
  };
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
