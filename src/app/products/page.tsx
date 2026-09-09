"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListRow } from "@/components/product/ProductListRow";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>("all");
  const [selectedWeight, setSelectedWeight] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const weights = ["100g", "250g", "500g", "1kg"];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Category
      if (selectedCategory !== "all") {
        const catObj = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj && product.categoryId !== catObj.id) return false;
      }

      // 2. Spice Level
      if (selectedSpiceLevel !== "all" && product.spiceLevel !== selectedSpiceLevel) {
        return false;
      }

      // 3. Weight / Variant
      if (selectedWeight !== "all") {
        const hasWeight = product.variants.some((v) =>
          v.weight.toLowerCase().includes(selectedWeight.toLowerCase())
        );
        if (!hasWeight) return false;
      }

      // 4. Max Price (checks lowest variant price)
      const lowestPrice = Math.min(...product.variants.map((v) => v.price));
      if (lowestPrice > maxPrice) return false;

      // 5. Min Rating
      if (minRating > 0 && (product.rating || 5.0) < minRating) return false;

      // 6. Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.origin.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matches) return false;
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
  }, [
    selectedCategory,
    selectedSpiceLevel,
    selectedWeight,
    maxPrice,
    minRating,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSpiceLevel("all");
    setSelectedWeight("all");
    setMaxPrice(3000);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSpiceLevel !== "all" ||
    selectedWeight !== "all" ||
    maxPrice < 3000 ||
    minRating > 0 ||
    searchQuery !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cinnamon via-primary to-cardamom p-6 sm:p-10 text-white shadow-spice-md">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-turmeric-300" />
            100% Single-Origin Pure Aromatics
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
            Artisanal Indian Spice Vault
          </h1>
          <p className="text-xs sm:text-sm text-cream-200">
            Handpicked whole pods, stone-ground powders, and rare Kashmiri saffron packed at source.
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6 bg-white p-5 sm:p-6 rounded-3xl border border-cream-300 shadow-spice-sm">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-charcoal">
              <Filter className="h-4 w-4 text-cinnamon" />
              <span>Filter Harvests</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-cinnamon hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-cinnamon text-white font-bold"
                    : "text-charcoal hover:bg-cream-100"
                }`}
              >
                <span>All Spices</span>
                <span>{MOCK_PRODUCTS.length}</span>
              </button>
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-cinnamon text-white font-bold"
                      : "text-charcoal hover:bg-cream-100"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div className="space-y-2 border-t border-cream-200 pt-4">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-muted-foreground">
                Max Price
              </label>
              <span className="font-display font-extrabold text-charcoal">
                Up to ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cinnamon cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>₹150</span>
              <span>₹3,000+</span>
            </div>
          </div>

          {/* 3. Weight / Package Size */}
          <div className="space-y-2 border-t border-cream-200 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Package Weight
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedWeight("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  selectedWeight === "all"
                    ? "bg-cardamom text-white"
                    : "bg-cream-200 text-charcoal hover:bg-cream-300"
                }`}
              >
                Any
              </button>
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    selectedWeight === w
                      ? "bg-cardamom text-white"
                      : "bg-cream-200 text-charcoal hover:bg-cream-300"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Minimum Rating Filter */}
          <div className="space-y-2 border-t border-cream-200 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium ${
                    minRating === rating
                      ? "bg-cream-300 font-bold text-charcoal"
                      : "hover:bg-cream-100 text-charcoal"
                  }`}
                >
                  <div className="flex items-center gap-1 text-turmeric">
                    {rating === 0 ? (
                      <span className="text-charcoal font-semibold">All Ratings</span>
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-charcoal">{rating}★ & above</span>
                      </>
                    )}
                  </div>
                  {minRating === rating && <Check className="h-3.5 w-3.5 text-cardamom" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Listing Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Control Bar: Search input, Sort, View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-4 border-b border-cream-300">
            {/* Search query display */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search within harvests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-charcoal placeholder:text-muted-foreground focus:border-cinnamon focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              {/* Sort Select */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-charcoal focus:border-cinnamon focus:outline-none"
                >
                  <option value="featured">Featured Harvests</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center rounded-xl border border-cream-300 bg-white p-1 shadow-xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-cinnamon text-white" : "text-muted-foreground hover:text-charcoal"
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-cinnamon text-white" : "text-muted-foreground hover:text-charcoal"
                  }`}
                  aria-label="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Results Counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong>{filteredProducts.length}</strong> single-origin products
            </span>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-cinnamon font-bold hover:underline">
                Clear all active filters
              </button>
            )}
          </div>

          {/* Products List/Grid Display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-cream-300 bg-white p-8 space-y-4 shadow-spice-sm">
              <h3 className="font-serif text-xl font-bold text-charcoal">No Spices Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We couldn't find any spices matching your filters. Try widening your price range or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListRow key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading spice harvests...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
