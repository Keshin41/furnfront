export type BasketItem = {
  skuId: string;
  quantity: number;
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
