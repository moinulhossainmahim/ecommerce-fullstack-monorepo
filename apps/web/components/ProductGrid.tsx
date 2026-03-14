"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { products, categories } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? products.slice(0, 8) : products.filter((p) => p.category === activeCategory).slice(0, 8);

  return (
    <section id="collection" className="py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3">Curated Selection</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Products</h2>
        </motion.div>
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-sm tracking-wide transition-colors pb-1 border-b-2 ${activeCategory === cat ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
