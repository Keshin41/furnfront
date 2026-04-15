export type InternatBasketItem = {
  name: string;
  unitPrice: string;
  quantity: number;
};

export type InternatBasket = InternatBasketItem[];

export type InternatOrder = {
  paymentIntent: string;
  basket: InternatBasket;
};

export type TicketListDto = {
  email: string;
  nickname: string;
  date: Date;
  goodies: boolean;
  duvet: boolean;
};
