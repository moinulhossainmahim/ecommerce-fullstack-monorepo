export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  brand: string;
  description?: string;
  specifications?: Record<string, string>;
  inStock?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: "active" | "inactive";
  sales: number;
  image: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: "active" | "blocked";
  avatar: string;
}

export interface SalesDataPoint {
  month: string;
  revenue: number;
  orders: number;
}
