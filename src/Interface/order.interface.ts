export interface OrderProduct {
  _id: string;
  title: string;
  imageCover: string;
}

export interface OrderCartItem {
  _id: string;
  count: number;
  price: number;
  product: OrderProduct;
}

export interface UserOrder {
  _id: string;
  cartItems: OrderCartItem[];
  paymentMethodType: string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  createdAt?: string;
}

export interface UserOrdersResponse {
  results?: number;
  data: UserOrder[];
}
