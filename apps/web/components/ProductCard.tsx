"use client";

import { motion } from "framer-motion";
import { Plus, Heart, Star } from "lucide-react";
import type { Product } from "@aurum/shared/library";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const isWished = wishlist.includes(product.id);

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group hover-lift">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary rounded-sm mb-4">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1">{product.badge}</span>
          )}
          <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }} className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${isWished ? "bg-primary text-primary-foreground" : "bg-background/60 text-foreground opacity-0 group-hover:opacity-100"}`}>
            <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} />
          </button>
          <button onClick={(e) => { e.preventDefault(); addItem(product); }} className="absolute bottom-3 right-3 h-10 w-10 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </Link>
      <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">{product.category}</p>
      <Link href={`/product/${product.id}`}>
        <h3 className="font-display font-medium text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
      </Link>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-foreground font-medium">${product.price}</p>
        {product.originalPrice && <p className="text-muted-foreground text-sm line-through">${product.originalPrice}</p>}
      </div>
    </motion.div>
  );
}
