export type TicketBasketItemDetails = {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  drap: boolean;
  goodies: boolean;
};

export type BasketItem = {
  skuId: string;
  quantity: number;
  ticketDetails?: TicketBasketItemDetails;
};

export type Basket = BasketItem[];

export type Order = {
  user: {
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postalCode: string;
    nickname: string;
  };
  basket: Basket;
};
