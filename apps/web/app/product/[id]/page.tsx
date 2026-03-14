"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Minus, Plus, Heart, ShoppingBag, ChevronLeft } from "lucide-react";
import { products, mockReviews } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import StoreFooter from "@/components/StoreFooter";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === id);
  const { addItem, wishlist, toggleWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Product not found</h1>
        <Link href="/shop" className="text-primary underline">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const isWished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
  };

  return (
    <>
      <div className="container py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="h-4 w-4" /> Back to Shop
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square overflow-hidden bg-secondary rounded-sm mb-4">
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`h-20 w-20 overflow-hidden rounded-sm border-2 ${activeImage === i ? "border-primary" : "border-border"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-display font-bold">${product.price}</span>
              {product.originalPrice && <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            <div className={`text-sm mb-6 ${product.inStock ? "text-green-500" : "text-destructive"}`}>{product.inStock ? "● In Stock" : "● Out of Stock"}</div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"><Minus className="h-4 w-4" /></button>
                <span className="h-10 w-12 flex items-center justify-center text-sm border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product.id)} className={`h-[52px] w-[52px] border flex items-center justify-center transition-colors ${isWished ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"}`}>
                <Heart className="h-5 w-5" fill={isWished ? "currentColor" : "none"} />
              </button>
            </div>
            <Link href="/checkout" className="block w-full text-center bg-foreground text-background py-4 text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors mb-8">
              Buy Now
            </Link>
            {product.specifications && (
              <div className="border-t border-border pt-8">
                <h3 className="font-display font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
        {/* Reviews */}
        <section className="mb-24">
          <h2 className="font-display text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.author}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-foreground/80">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
      <StoreFooter />
    </>
  );
}
