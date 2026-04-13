export type ShopOrderListItem = {
  id: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'CASH_PENDING' | 'CASH_PAID';
  createdAt: string;
  buyer: {
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
  };
  items: Array<{
    skuId: string;
    skuCode: string;
    productName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  totalPrice: string;
};