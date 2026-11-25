"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";
import { useTranslation } from "@/store/useLanguageStore";
import { ProductType } from "@/types";

function ProductsContent() {
  const { t, isHindi } = useTranslation();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [catalogProducts, setCatalogProducts] = useState<ProductType[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.products?.length > 0) {
          const dbProducts: ProductType[] = resData.data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            nameHi: p.nameHi,
            slug: p.slug,
            description: p.description,
            descriptionHi: p.descriptionHi,
            origin: p.origin,
            originHi: p.originHi,
            spiceLevel: p.spiceLevel || "MEDIUM",
            organic: true,
            featured: p.isFeatured ?? true,
            bestseller: p.isFeatured ?? true,
            categoryId: p.categoryId,
            rating: p.rating || 4.9,
            reviewCount: p.numReviews || 120,
            images: p.images && p.images.length > 0
              ? p.images.map((url: string, i: number) => ({
                  id: `${p.id}-${i}`,
                  url,
                  alt: p.name,
                  isPrimary: i === 0,
                  order: i + 1,
                }))
              : [{ id: `${p.id}-default`, url: "/images/categories/whole-red-chilli.jpg", isPrimary: true, order: 1 }],
            variants: p.variants && p.variants.length > 0
              ? p.variants.map((v: any) => ({
                  id: v.id,
                  productId: p.id,
                  weight: v.weight,
                  weightGrams: parseInt(v.weight) || 100,
                  price: Number(v.price),
                  mrp: v.discountedPrice ? Number(v.discountedPrice) : Math.round(Number(v.price) * 1.25),
                  stock: v.stockQuantity || 100,
                  sku: v.sku,
                }))
              : [
                  { id: `${p.id}-v1`, productId: p.id, weight: "100g", weightGrams: 100, price: 45, mrp: 60, stock: 100, sku: `${p.slug}-100g` },
                ],
          }));

          setCatalogProducts(dbProducts);
          if (resData.data.categories?.length > 0) {
            setCategories(resData.data.categories);
          }
        }
      })
      .catch(() => {});
  }, []);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [selectedWeight, setSelectedWeight] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const weights = ["50g", "100g", "250g", "500g", "1kg"];

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((product) => {
        if (selectedCategory !== "all") {
          const catObj = categories.find((c) => c.slug === selectedCategory);
          if (catObj && product.categoryId !== catObj.id && (product as any).categoryId !== selectedCategory) {
            return false;
          }
        }

        if (selectedWeight !== "all") {
          const hasWeight = product.variants.some((v) =>
            v.weight.toLowerCase().includes(selectedWeight.toLowerCase())
          );
          if (!hasWeight) return false;
        }

        const lowestPrice = Math.min(...product.variants.map((v) => v.price));
        if (lowestPrice > maxPrice) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            ((product as any).nameHi && (product as any).nameHi.toLowerCase().includes(q)) ||
            product.origin.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.variants[0].price - b.variants[0].price;
        if (sortBy === "price-desc") return b.variants[0].price - a.variants[0].price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [catalogProducts, categories, selectedCategory, selectedWeight, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedWeight("all");
    setMaxPrice(1000);
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedWeight !== "all" ||
    maxPrice < 1000 ||
    searchQuery !== "";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* Minimal Header */}
        <div className="border-b border-[#E8E1DD] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E5A54]">
              {isHindi ? "संपूर्ण उत्पाद संग्रह" : "Spice Collection"}
            </p>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B140E]">
              {t("catalog.title")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5A54] max-w-xl">
              {t("catalog.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-[#E8E1DD] px-3.5 py-2 text-xs font-medium text-[#2B140E]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t("catalog.filters")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Minimal Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 rounded-xl border border-[#E8E1DD] bg-[#FAF8F6] p-5 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between border-b border-[#E8E1DD] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B140E]">
                {t("catalog.filters")}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#3D1E16] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t("catalog.resetFilters")}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6E5A54]" />
              <input
                type="text"
                placeholder={isHindi ? "मसाला खोजें..." : "Search spice..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#E8E1DD] bg-white text-[#2B140E] placeholder:text-[#6E5A54]/70 focus:outline-none focus:border-[#3D1E16]"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#2B140E] mb-2">{t("catalog.category")}</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#3D1E16] text-white font-medium"
                    : "text-[#2B140E] hover:bg-white"
                }`}
              >
                {t("catalog.allCategories")} ({catalogProducts.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-[#3D1E16] text-white font-medium"
                      : "text-[#2B140E] hover:bg-white"
                  }`}
                >
                  {isHindi && cat.nameHi ? cat.nameHi : cat.name}
                </button>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#E8E1DD] pt-4">
              <p className="text-xs font-semibold text-[#2B140E]">{t("catalog.packagingSize")}</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedWeight("all")}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    selectedWeight === "all"
                      ? "bg-[#3D1E16] text-white border-[#3D1E16]"
                      : "bg-white text-[#2B140E] border-[#E8E1DD]"
                  }`}
                >
                  {t("catalog.allSizes")}
                </button>
                {weights.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWeight(w)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      selectedWeight === w
                        ? "bg-[#3D1E16] text-white border-[#3D1E16]"
                        : "bg-white text-[#2B140E] border-[#E8E1DD]"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[#E8E1DD] pt-4">
              <div className="flex justify-between items-center text-xs font-semibold text-[#2B140E]">
                <span>{t("catalog.priceRange")}</span>
                <span>Up to ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#3D1E16]"
              />
              <div className="flex justify-between text-[10px] text-[#6E5A54]">
                <span>₹50</span>
                <span>₹1000</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E1DD] pb-3 text-xs">
              <span className="text-[#6E5A54]">
                <strong className="text-[#2B140E]">{filteredProducts.length}</strong> {t("catalog.showingResults")}
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-[#6E5A54] hidden sm:inline">
                  {t("catalog.sortBy")}:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-[#E8E1DD] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2B140E] focus:outline-none focus:border-[#3D1E16]"
                >
                  <option value="featured">{t("catalog.sortFeatured")}</option>
                  <option value="price-asc">{t("catalog.sortPriceLow")}</option>
                  <option value="price-desc">{t("catalog.sortPriceHigh")}</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-[#E8E1DD] bg-[#FAF8F6] p-8 space-y-3">
                <h3 className="font-serif text-lg font-semibold text-[#2B140E]">
                  {isHindi ? "कोई मसाला नहीं मिला" : "No Spices Found"}
                </h3>
                <p className="text-xs text-[#6E5A54]">
                  {isHindi
                    ? "कृपया फ़िल्टर रीसेट करें या कोई भिन्न कीवर्ड खोजें।"
                    : "Try clearing your filters or searching for another variety."}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg bg-[#3D1E16] px-4 py-2 text-xs font-medium text-white hover:bg-[#2B140E]"
                >
                  {t("catalog.resetFilters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#6E5A54]">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
