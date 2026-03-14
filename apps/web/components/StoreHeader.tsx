"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, Heart, User, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { label: "All Products", href: "/shop" },
  { label: "Electronics", href: "/shop?category=Electronics" },
  { label: "Fashion", href: "/shop?category=Fashion" },
  { label: "Home", href: "/shop?category=Home" },
  { label: "Beauty", href: "/shop?category=Beauty" },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function StoreHeader() {
  const { totalItems, setIsOpen, wishlist } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const shopRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center text-xs tracking-widest uppercase py-2 font-medium">
        Free shipping on orders over $250 — Spring Sale Live
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <div ref={shopRef} className="relative">
              <button
                onMouseEnter={() => setShopOpen(true)}
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-1 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    onMouseLeave={() => setShopOpen(false)}
                    className="absolute left-0 top-full pt-2"
                  >
                    <div className="min-w-[180px] rounded-sm border border-border bg-card py-2 shadow-lg">
                      {categories.map((cat) => (
                        <Link
                          key={cat.label}
                          href={cat.href}
                          onClick={() => setShopOpen(false)}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="font-display text-xl font-bold tracking-[0.2em] text-foreground uppercase absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            Aurum
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account/wishlist" className="relative text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border overflow-hidden">
              <form onSubmit={handleSearch} className="container py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-secondary text-foreground pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-display font-bold tracking-[0.15em] uppercase">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex flex-col p-6 gap-1">
                <div className="py-2">
                  <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Shop</span>
                  <div className="mt-2 flex flex-col gap-1 pl-2 border-l border-border">
                    {categories.map((cat) => (
                      <Link key={cat.label} href={cat.href} onClick={() => setMobileMenuOpen(false)} className="text-sm text-foreground/80 hover:text-foreground transition-colors py-1.5">
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2">
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2">Account</Link>
                <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2">Wishlist</Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
