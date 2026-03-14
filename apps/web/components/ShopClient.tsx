"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories, brands } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

export function ShopClient({
  initialCategory,
  initialSearchQuery,
}: {
  initialCategory: string;
  initialSearchQuery: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const searchQuery = initialSearchQuery;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "All")
      result = result.filter((p) => p.category === activeCategory);
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);
    if (selectedBrands.length > 0)
      result = result.filter((p) => selectedBrands.includes(p.brand));

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
        return [...result].sort(
          (a, b) =>
            (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0)
        );
      default:
        return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [activeCategory, priceRange, minRating, selectedBrands, sortBy, searchQuery]);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                activeCategory === cat
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-20 bg-secondary border border-border text-foreground text-sm px-2 py-1.5 focus:outline-none focus:border-primary"
            placeholder="Min"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-20 bg-secondary border border-border text-foreground text-sm px-2 py-1.5 focus:outline-none focus:border-primary"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`block text-sm py-1 transition-colors ${
                minRating === r
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {r}+ Stars
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Brand
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-border accent-primary"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-4xl font-bold mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : "Shop All"}
        </h1>
        <p className="text-muted-foreground">{filtered.length} products</p>
      </motion.div>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden flex items-center gap-2 text-sm text-foreground border border-border px-4 py-2"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-secondary border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop filters */}
        <aside className="hidden md:block w-56 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setFiltersOpen(false)}
              aria-hidden
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-bold">Filters</span>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setPriceRange([0, 1000]);
                  setMinRating(0);
                  setSelectedBrands([]);
                }}
                className="text-primary text-sm mt-2 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
