"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import StoreFooter from "@/components/StoreFooter";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const shipping = totalPrice > 250 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  return (
    <>
      <div className="container py-12 min-h-[60vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold mb-10"
        >
          Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-flex bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="hidden sm:grid grid-cols-12 text-xs text-muted-foreground tracking-[0.15em] uppercase pb-4 border-b border-border">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 border-b border-border"
                >
                  <div className="sm:col-span-6 flex items-center gap-4">
                    <div className="h-24 w-20 bg-secondary rounded-sm overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/product/${item.product.id}`}
                        className="font-display text-sm font-medium hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">{item.product.category}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-center text-sm">${item.product.price}</div>
                  <div className="sm:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="h-8 w-10 flex items-center justify-center text-sm border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-3 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="sm:col-span-2 text-right text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 sticky top-24">
                <h2 className="font-display text-lg font-semibold mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (est.)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-display font-semibold text-lg border-t border-border pt-4 mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide uppercase text-center hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="block text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
    </>
  );
}
