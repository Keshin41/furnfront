export enum OrderStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  CASH_PENDING = "CASH_PENDING",
  CASH_PAID = "CASH_PAID",
}

export type OrderListDTO = {
  id: string;
  date: Date;
  amount: number;
  quantity: number;
  status: OrderStatus;
  buyer: string;
};

export type OrderItemDetailDTO = {
  id: string;
  quantity: number;
  unitPrice: number;
  sku: {
    id: string;
    skuCode: string;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  };
};

export type OrderDetailDTO = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentIntentId: string | null;
  buyer: {
    id: string;
    nickname: string;
    email: string;
  };
  items: OrderItemDetailDTO[];
  total: number;
};

export enum ManualOrderPaymentMethod {
  TPE = "TPE",
  CASH = "CASH",
}

export type CreateManualOrderPayload = {
  buyer: {
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    address?: string;
    postalCode?: string;
    city?: string;
  };
  items: {
    skuId: string;
    quantity: number;
  }[];
  paymentMethod: ManualOrderPaymentMethod;
  isPaid: boolean;
};
