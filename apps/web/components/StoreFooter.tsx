"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { sonnerToast } from "@aurum/shared/ui";

export default function StoreFooter() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      sonnerToast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer id="contact" className="border-t border-border py-16">
      <div className="container">
        <div className="text-center mb-16 pb-16 border-b border-border">
          <h3 className="font-display text-3xl font-bold mb-3">Stay in the Loop</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Subscribe for early access to new collections, exclusive offers, and style inspiration.</p>
          <form onSubmit={handleNewsletter} className="flex max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 bg-secondary text-foreground text-sm px-4 py-3 border border-border focus:outline-none focus:border-primary transition-colors" />
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors">Subscribe</button>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-lg font-bold tracking-[0.15em] uppercase mb-4">Aurum</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">Timeless luxury accessories crafted with precision and intention.</p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Shop by Category</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-foreground/70 hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Electronics" className="text-foreground/70 hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link href="/shop?category=Fashion" className="text-foreground/70 hover:text-foreground transition-colors">Fashion</Link></li>
              <li><Link href="/shop?category=Home" className="text-foreground/70 hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/shop?category=Beauty" className="text-foreground/70 hover:text-foreground transition-colors">Beauty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="text-foreground/70 hover:text-foreground transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="text-foreground/70 hover:text-foreground transition-colors">Order History</Link></li>
              <li><Link href="/account/wishlist" className="text-foreground/70 hover:text-foreground transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="text-foreground/70 hover:text-foreground transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-foreground/70 hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">© 2026 Aurum. All rights reserved.</div>
      </div>
    </footer>
  );
}
