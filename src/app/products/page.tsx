"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== "all") {
        const catObj = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj && product.categoryId !== catObj.id) return false;
      }

      // Spice level match
      if (selectedSpiceLevel !== "all" && product.spiceLevel !== selectedSpiceLevel) {
        return false;
      }

      // Search query
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.origin.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.variants[0].price - b.variants[0].price;
      }
      if (sortBy === "price-desc") {
        return b.variants[0].price - a.variants[0].price;
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedSpiceLevel, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cinnamon-500 via-primary to-secondary p-6 sm:p-10 text-white shadow-spice-md mb-8">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-turmeric-300" />
            100% Unadulterated Heritage Harvests
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
            Artisanal Indian Spice Vault
          </h1>
          <p className="text-xs sm:text-sm text-cream-200">
            Handpicked whole pods, cold stone-ground spice powders, and pristine Kashmiri saffron packed at origin.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-6 border-b border-cream-300">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-muted" />
          <input
            type="text"
            placeholder="Search spices, origins (e.g. Cardamom, Idukki, Saffron)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-spice-dark placeholder:text-spice-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-spice-sm"
                : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
            }`}
          >
            All Spices
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white shadow-spice-sm"
                  : "bg-white border border-cream-300 text-spice-dark hover:bg-cream-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-spice-muted hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-spice-dark focus:border-primary focus:outline-none shadow-xs"
          >
            <option value="featured">Featured Harvests</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count & Product Grid */}
      <div className="pt-6">
        <div className="flex items-center justify-between text-xs text-spice-muted mb-6">
          <span>
            Showing <strong>{filteredProducts.length}</strong> single-origin products
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline font-semibold"
            >
              Clear search filter
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-cream-300 p-8 space-y-3">
            <h3 className="font-serif text-lg font-bold text-spice-dark">No spices found</h3>
            <p className="text-xs text-spice-muted max-w-sm mx-auto">
              We couldn't find any products matching your current filters. Try changing your search keywords or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSpiceLevel("all");
                setSearchQuery("");
              }}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-600 shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-spice-muted">
        Loading spice vaults...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
