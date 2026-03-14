import type { AdminOrder, AdminProduct, AdminCustomer, SalesDataPoint } from "@aurum/shared/library";

export const salesData: SalesDataPoint[] = [
  { month: "Jul", revenue: 28400, orders: 142 },
  { month: "Aug", revenue: 34200, orders: 178 },
  { month: "Sep", revenue: 31800, orders: 156 },
  { month: "Oct", revenue: 42600, orders: 210 },
  { month: "Nov", revenue: 56800, orders: 298 },
  { month: "Dec", revenue: 68200, orders: 356 },
  { month: "Jan", revenue: 45600, orders: 234 },
  { month: "Feb", revenue: 52400, orders: 267 },
  { month: "Mar", revenue: 48900, orders: 245 },
];

export const adminOrders: AdminOrder[] = [
  { id: "ORD-7291", customer: "Victoria Laurent", email: "victoria@email.com", items: 3, total: 2840, status: "delivered", date: "2026-03-12", paymentMethod: "Credit Card" },
  { id: "ORD-7290", customer: "Alexander Chen", email: "alex.chen@email.com", items: 1, total: 890, status: "shipped", date: "2026-03-12", paymentMethod: "PayPal", trackingNumber: "TRK-889234" },
  { id: "ORD-7289", customer: "Sophia Blackwood", email: "sophia.b@email.com", items: 2, total: 1650, status: "processing", date: "2026-03-11", paymentMethod: "Credit Card" },
  { id: "ORD-7288", customer: "James Moretti", email: "j.moretti@email.com", items: 4, total: 3420, status: "pending", date: "2026-03-11", paymentMethod: "Apple Pay" },
  { id: "ORD-7287", customer: "Elena Vasquez", email: "elena.v@email.com", items: 1, total: 560, status: "cancelled", date: "2026-03-10", paymentMethod: "Credit Card" },
  { id: "ORD-7286", customer: "Marcus Webb", email: "m.webb@email.com", items: 2, total: 1780, status: "delivered", date: "2026-03-10", paymentMethod: "Credit Card" },
  { id: "ORD-7285", customer: "Isabelle Fontaine", email: "isabelle.f@email.com", items: 3, total: 4200, status: "shipped", date: "2026-03-09", paymentMethod: "PayPal", trackingNumber: "TRK-887412" },
  { id: "ORD-7284", customer: "David Kim", email: "d.kim@email.com", items: 1, total: 720, status: "delivered", date: "2026-03-09", paymentMethod: "Apple Pay" },
  { id: "ORD-7283", customer: "Charlotte Dubois", email: "c.dubois@email.com", items: 5, total: 5890, status: "processing", date: "2026-03-08", paymentMethod: "Credit Card" },
  { id: "ORD-7282", customer: "Robert Tanaka", email: "r.tanaka@email.com", items: 2, total: 1340, status: "pending", date: "2026-03-08", paymentMethod: "PayPal" },
];

export const adminProducts: AdminProduct[] = [
  { id: "PRD-001", name: "Midnight Chronograph", category: "Watches", price: 890, stock: 24, sku: "WCH-MC-001", status: "active", sales: 142, image: "/product-watch.jpg" },
  { id: "PRD-002", name: "Heritage Leather Tote", category: "Bags", price: 650, stock: 3, sku: "BAG-HLT-002", status: "active", sales: 98, image: "/product-bag.jpg" },
  { id: "PRD-003", name: "Obsidian Aviators", category: "Eyewear", price: 420, stock: 56, sku: "EYE-OA-003", status: "active", sales: 210, image: "/product-sunglasses.jpg" },
  { id: "PRD-004", name: "Artisan Leather Belt", category: "Accessories", price: 280, stock: 0, sku: "ACC-ALB-004", status: "active", sales: 87, image: "/product-belt.jpg" },
  { id: "PRD-005", name: "Silk Cashmere Scarf", category: "Accessories", price: 340, stock: 18, sku: "ACC-SCS-005", status: "active", sales: 156, image: "/product-scarf.jpg" },
  { id: "PRD-006", name: "Monaco Card Wallet", category: "Wallets", price: 190, stock: 42, sku: "WLT-MCW-006", status: "active", sales: 234, image: "/product-wallet.jpg" },
  { id: "PRD-007", name: "Platinum Cufflinks", category: "Accessories", price: 560, stock: 8, sku: "ACC-PC-007", status: "inactive", sales: 45, image: "/product-watch.jpg" },
  { id: "PRD-008", name: "Voyager Briefcase", category: "Bags", price: 980, stock: 12, sku: "BAG-VB-008", status: "active", sales: 67, image: "/product-bag.jpg" },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "CUS-001", name: "Victoria Laurent", email: "victoria@email.com", orders: 12, totalSpent: 14580, joined: "2025-06-15", status: "active", avatar: "VL" },
  { id: "CUS-002", name: "Alexander Chen", email: "alex.chen@email.com", orders: 8, totalSpent: 9240, joined: "2025-07-22", status: "active", avatar: "AC" },
  { id: "CUS-003", name: "Sophia Blackwood", email: "sophia.b@email.com", orders: 15, totalSpent: 21340, joined: "2025-05-10", status: "active", avatar: "SB" },
  { id: "CUS-004", name: "James Moretti", email: "j.moretti@email.com", orders: 6, totalSpent: 7890, joined: "2025-08-03", status: "active", avatar: "JM" },
  { id: "CUS-005", name: "Elena Vasquez", email: "elena.v@email.com", orders: 3, totalSpent: 2140, joined: "2025-11-18", status: "blocked", avatar: "EV" },
  { id: "CUS-006", name: "Marcus Webb", email: "m.webb@email.com", orders: 9, totalSpent: 11670, joined: "2025-06-28", status: "active", avatar: "MW" },
  { id: "CUS-007", name: "Isabelle Fontaine", email: "isabelle.f@email.com", orders: 22, totalSpent: 34560, joined: "2025-04-05", status: "active", avatar: "IF" },
  { id: "CUS-008", name: "David Kim", email: "d.kim@email.com", orders: 4, totalSpent: 3890, joined: "2025-10-12", status: "active", avatar: "DK" },
];

export const topSellingProducts = [
  { name: "Monaco Card Wallet", sales: 234, revenue: 44460 },
  { name: "Obsidian Aviators", sales: 210, revenue: 88200 },
  { name: "Silk Cashmere Scarf", sales: 156, revenue: 53040 },
  { name: "Midnight Chronograph", sales: 142, revenue: 126380 },
  { name: "Heritage Leather Tote", sales: 98, revenue: 63700 },
];

export const lowStockProducts = adminProducts.filter((p) => p.stock <= 5);
