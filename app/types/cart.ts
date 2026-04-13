export interface CartTicketDetails {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  drap: boolean;
  goodies: boolean;
}

export interface CartItem {
  lineId: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  kind?: "product" | "internat-ticket" | "adhesion";
  ticketDetails?: CartTicketDetails;
}
