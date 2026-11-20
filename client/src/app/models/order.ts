export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled" | "PaymentReceived" | "PaymentFailed";

export interface Order {
  id: number;
  buyer: string | null;
  orderDate: string | null;
  orderStatus: OrderStatus;
  subTotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderDetail {
  summary: Order;
  shippingAddress: ShippingAddress | null;
  items: { productId: number; name: string; pictureUrl: string; price: number | null; quantity: number }[];
}

export interface Checkout {
  basketId: string;
  shippingAddress: ShippingAddress;
  items: { productId: number; unitPrice: number; quantity: number }[];
}
