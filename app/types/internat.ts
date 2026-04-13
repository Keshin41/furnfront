export type InternatBasketItem = {
  name: string,
  unitPrice: string,
  quantity: number
};

export type InternatBasket = InternatBasketItem[];

export type InternatOrder = {
  paymentIntent: string;
  basket: InternatBasket;
};

export type InternatTicketListItem = {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  skuCode: string;
  productName: string;
  unitPrice: string;
  drap: boolean;
  goodies: boolean;
};
