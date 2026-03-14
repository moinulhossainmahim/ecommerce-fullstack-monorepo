"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-semibold">Your Bag ({items.length})</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center mt-12">
                  <p className="text-muted-foreground mb-4">Your bag is empty</p>
                  <button onClick={() => setIsOpen(false)} className="text-primary text-sm underline">Continue Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="h-24 w-20 bg-secondary rounded-sm overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-medium truncate">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.product.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="h-7 w-7 border border-border rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Minus className="h-3 w-3" /></button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="h-7 w-7 border border-border rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-3 w-3" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-foreground transition-colors self-start"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">${totalPrice.toFixed(2)}</span></div>
                <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full bg-secondary text-foreground py-3 text-sm font-medium tracking-wide uppercase text-center hover:bg-secondary/80 transition-colors">View Cart</Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="block w-full bg-primary text-primary-foreground py-3 text-sm font-medium tracking-wide uppercase text-center hover:bg-primary/90 transition-colors">Checkout</Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
