"use client";

import { motion } from "framer-motion";
import { Monitor, Shirt, Home, Sparkles } from "lucide-react";
import Link from "next/link";

const categoryItems = [
  { name: "Electronics", icon: Monitor, href: "/shop?category=Electronics" },
  { name: "Fashion", icon: Shirt, href: "/shop?category=Fashion" },
  { name: "Home", icon: Home, href: "/shop?category=Home" },
  { name: "Beauty", icon: Sparkles, href: "/shop?category=Beauty" },
];

export default function CategoryIcons() {
  return (
    <section className="py-16 border-b border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryItems.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={cat.href} className="flex flex-col items-center gap-4 p-8 rounded-sm bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary transition-all group">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium tracking-wide">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
