export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
