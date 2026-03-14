"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useCart();
  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">
        Wishlist ({wishedProducts.length})
      </h2>
      {wishedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link
            href="/shop"
            className="text-primary text-sm underline mt-2 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
