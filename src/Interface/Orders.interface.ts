import type { eachProduct } from "@/Interface/Cart.interface";

export interface Order {
  _id: string;
  cartItems: OrderCartItem[];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface OrderCartItem {
  _id: string;
  count: number;
  price: number;
  product: eachProduct;
}
