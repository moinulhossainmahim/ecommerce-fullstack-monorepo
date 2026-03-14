import type { Product, Review } from "@aurum/shared/library";

export const products: Product[] = [
  { id: "1", name: "Meridian Timepiece", price: 485, category: "Electronics", image: "/product-watch.jpg", images: ["/product-watch.jpg", "/product-wallet.jpg"], badge: "New", rating: 4.8, reviewCount: 124, brand: "Aurum", description: "A precision-crafted timepiece that blends modern technology with timeless elegance.", specifications: { "Movement": "Swiss Automatic", "Case": "316L Stainless Steel" }, inStock: true },
  { id: "2", name: "Atlas Leather Wallet", price: 195, originalPrice: 245, category: "Fashion", image: "/product-wallet.jpg", images: ["/product-wallet.jpg", "/product-belt.jpg"], rating: 4.5, reviewCount: 89, brand: "Aurum", inStock: true },
  { id: "3", name: "Noir Aviator Shades", price: 320, category: "Fashion", image: "/product-sunglasses.jpg", badge: "Bestseller", rating: 4.9, reviewCount: 256, brand: "Aurum", inStock: true },
  { id: "4", name: "Heritage Belt", price: 165, category: "Fashion", image: "/product-belt.jpg", rating: 4.3, reviewCount: 67, brand: "Aurum", inStock: true },
  { id: "5", name: "Voyager Messenger", price: 595, originalPrice: 750, category: "Fashion", image: "/product-bag.jpg", badge: "Limited", rating: 4.7, reviewCount: 43, brand: "Aurum", inStock: true },
  { id: "6", name: "Alpine Cashmere Scarf", price: 245, category: "Fashion", image: "/product-scarf.jpg", rating: 4.6, reviewCount: 91, brand: "Aurum", inStock: true },
  { id: "7", name: "Lumina Desk Lamp", price: 289, category: "Home", image: "/product-watch.jpg", badge: "New", rating: 4.4, reviewCount: 38, brand: "Luxe Living", inStock: true },
  { id: "8", name: "Velvet Rose Serum", price: 128, category: "Beauty", image: "/product-scarf.jpg", rating: 4.8, reviewCount: 312, brand: "Aura Beauty", inStock: true },
  { id: "9", name: "Wireless Studio Buds", price: 349, category: "Electronics", image: "/product-wallet.jpg", badge: "Popular", rating: 4.6, reviewCount: 198, brand: "SoundCraft", inStock: true },
  { id: "10", name: "Ceramic Pour-Over Set", price: 89, category: "Home", image: "/product-belt.jpg", rating: 4.2, reviewCount: 56, brand: "Luxe Living", inStock: false },
  { id: "11", name: "Matte Lip Collection", price: 68, category: "Beauty", image: "/product-sunglasses.jpg", rating: 4.7, reviewCount: 445, brand: "Aura Beauty", inStock: true },
  { id: "12", name: "Smart Home Hub", price: 199, originalPrice: 249, category: "Electronics", image: "/product-bag.jpg", badge: "Sale", rating: 4.1, reviewCount: 87, brand: "SoundCraft", inStock: true },
];

export const categories = ["All", "Electronics", "Fashion", "Home", "Beauty"];
export const brands = ["Aurum", "Luxe Living", "Aura Beauty", "SoundCraft"];
export const mockReviews: Review[] = [
  { id: "r1", author: "James K.", rating: 5, date: "2026-02-15", comment: "Absolutely stunning craftsmanship. Worth every penny." },
  { id: "r2", author: "Sarah M.", rating: 4, date: "2026-02-10", comment: "Beautiful product, delivery was fast." },
];
