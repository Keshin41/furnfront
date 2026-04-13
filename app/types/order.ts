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
