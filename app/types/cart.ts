// Données nominatives attachées aux tickets internat et adhésions.
// Transmises à Stripe via les métadonnées du PaymentIntent pour la matérialisation post-paiement.
export interface CartTicketDetails {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  drap: boolean;
  goodies: boolean;
}

export interface CartItem {
  // Identifiant unique de la ligne dans le panier (UUID généré côté client).
  // Distinct de skuId pour permettre plusieurs lignes du même SKU (ex. tickets nominatifs).
  lineId: string;
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  // "product"        : article boutique standard, quantité modifiable, lignes fusionnables.
  // "internat-ticket": ticket nominatif, quantité fixe 1, pas de fusion.
  // "adhesion"       : adhésion nominative, quantité fixe 1, pas de fusion.
  kind?: "product" | "internat-ticket" | "adhesion";
  ticketDetails?: CartTicketDetails;
}
