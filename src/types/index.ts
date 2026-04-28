import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  description: PortableTextBlock[];
  price: number;
  images: Array<{
    asset: SanityImageSource;
    alt: string;
  }>;
  category?: Category;
  inStock: boolean;
  attributes: Array<{ key: string; value: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImageSource;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: SanityImageSource;
  slug: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "in_production"
  | "shipped"
  | "delivered";

export type DeliveryType = "warehouse" | "postomat" | "courier";
export type DeliveryCarrier = "novaposhta" | "ukrposhta";
export type UkrposhtaMethod = "post_office" | "courier";
export type MessengerType = "viber" | "telegram" | "whatsapp";

export interface Order {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    messenger: MessengerType;
  };
  delivery: {
    carrier: DeliveryCarrier;
    city: string;
    // Nova Poshta
    cityRef?: string;
    deliveryType?: DeliveryType;
    warehouseRef?: string;
    warehouseDescription?: string;
    // Ukrposhta
    postIndex?: string;
    deliveryMethod?: UkrposhtaMethod;
    streetAddress?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  createdAt: string;
}

export interface NPCity {
  ref: string;
  cityName: string;
  area: string;
  settlementType: string;
}

export interface NPWarehouse {
  ref: string;
  description: string;
  address: string;
}

export interface ProductReview {
  _id: string;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
}

