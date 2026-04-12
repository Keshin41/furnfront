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
