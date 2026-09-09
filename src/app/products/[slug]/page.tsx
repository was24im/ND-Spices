"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  Check,
  Star,
  Leaf,
  Clock,
  Award,
  Flame,
  Zap,
  Info,
  BookOpen,
  HeartPulse,
  Share2,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SpiceLevelBadge } from "@/components/product/SpiceLevelBadge";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"origin" | "aroma" | "health" | "recipes">("origin");
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: "fallback",
            url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
            alt: product.name,
            isPrimary: true,
            order: 1,
          },
        ];
  const currentImage = images[selectedImageIndex] || images[0];
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscount(activeVariant.price, activeVariant.mrp);

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        slug: product.slug,
        weight: activeVariant.weight,
        weightGrams: activeVariant.weightGrams,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        image: images[0].url,
        origin: product.origin,
      },
      quantity
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Dynamic stock indicator
  const stockCount = activeVariant.stock || 25;
  const isLowStock = stockCount <= 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-cinnamon transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-cinnamon transition-colors">
          Spices
        </Link>
        <span>/</span>
        <span className="text-charcoal font-medium truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-cream-300 shadow-spice-sm">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              fill
              priority
              className="object-cover transition-all duration-300 hover:scale-105"
            />

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-cinnamon text-cinnamon" : "text-muted-foreground hover:text-cinnamon"
                }`}
              />
            </button>

            {/* Harvest Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="rounded-full bg-cardamom/90 text-white text-[10px] font-bold px-2.5 py-0.5 backdrop-blur-md">
                100% Single Origin
              </span>
              {discountPercent > 0 && (
                <span className="rounded-full bg-cinnamon text-white text-[10px] font-bold px-2.5 py-0.5">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-cinnamon shadow-spice-sm scale-105"
                      : "border-cream-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Origin & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cardamom bg-cardamom-50 border border-cardamom-200 px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              {product.origin}
            </span>
            <SpiceLevelBadge level={product.spiceLevel} />
            {product.organic && (
              <span className="text-xs font-bold text-turmeric-800 bg-turmeric-100 px-3 py-1 rounded-full">
                🌿 Lab Certified Organic
              </span>
            )}
          </div>

          {/* Title & Botanical Info */}
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              {product.name}
            </h1>
            {product.scientificName && (
              <p className="text-xs italic text-muted-foreground mt-1">
                Botanical Classification: {product.scientificName}
              </p>
            )}
          </div>

          {/* Rating & Verified Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-charcoal">{product.rating || 4.9} / 5.0</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount || 120} verified chef reviews)</span>
          </div>

          {/* Pricing Display */}
          <div className="rounded-3xl bg-cream-200/80 p-5 border border-cream-300 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl font-black text-charcoal">
                  {formatPrice(activeVariant.price)}
                </span>
                {activeVariant.mrp > activeVariant.price && (
                  <span className="text-sm text-muted-foreground line-through font-medium">
                    {formatPrice(activeVariant.mrp)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-cardamom font-bold mt-1">
                Tax Included • Free express delivery on orders over ₹499
              </p>
            </div>

            {/* Stock status indicator */}
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  isLowStock ? "bg-amber-100 text-amber-800" : "bg-cardamom-100 text-cardamom-800"
                }`}
              >
                <Zap className="h-3 w-3 fill-current" />
                {isLowStock ? `Only ${stockCount} left!` : "Fresh In Stock"}
              </span>
            </div>
          </div>

          {/* Weight / Pack Variant Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-muted-foreground">
                Select Package & Weight
              </label>
              <span className="text-muted-foreground font-mono text-[11px]">SKU: {activeVariant.sku}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((variant, idx) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    selectedVariantIndex === idx
                      ? "border-cinnamon bg-cinnamon-50/70 shadow-spice-sm"
                      : "border-cream-300 bg-white hover:bg-cream-100"
                  }`}
                >
                  <p className="text-xs font-bold text-charcoal">{variant.weight}</p>
                  <p className="text-xs font-extrabold text-cinnamon mt-0.5 font-display">
                    {formatPrice(variant.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity, Add to Basket, Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center rounded-2xl border border-cream-300 bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-xl hover:bg-cream-200 text-charcoal font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-bold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-xl hover:bg-cream-200 text-charcoal font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Basket */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 text-sm font-bold text-white transition-all shadow-spice-md active:scale-[0.99] ${
                  addedAnimation ? "bg-cardamom" : "bg-primary hover:bg-cinnamon-600"
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Spice Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Basket ({formatPrice(activeVariant.price * quantity)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-cinnamon bg-white py-3 px-6 text-sm font-bold text-cinnamon hover:bg-cinnamon-50 transition-colors shadow-xs"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* Guaranteed Heritage Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cream-200 text-center">
            <div className="rounded-2xl bg-white border border-cream-300 p-2.5">
              <ShieldCheck className="h-4 w-4 text-cardamom mx-auto mb-1" />
              <p className="text-[10px] font-bold text-charcoal">Zero Adulteration</p>
            </div>
            <div className="rounded-2xl bg-white border border-cream-300 p-2.5">
              <Sparkles className="h-4 w-4 text-turmeric mx-auto mb-1" />
              <p className="text-[10px] font-bold text-charcoal">Cryo Stone Ground</p>
            </div>
            <div className="rounded-2xl bg-white border border-cream-300 p-2.5">
              <Truck className="h-4 w-4 text-cinnamon mx-auto mb-1" />
              <p className="text-[10px] font-bold text-charcoal">Aroma Sealed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed In-Depth Sections (Terroir, Aroma, Health, Recipes) */}
      <section className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-10 shadow-spice-sm space-y-6">
        {/* Tab Headers */}
        <div className="flex border-b border-cream-200 overflow-x-auto space-x-6">
          <button
            onClick={() => setActiveTab("origin")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex-shrink-0 ${
              activeTab === "origin"
                ? "border-cinnamon text-cinnamon"
                : "border-transparent text-muted-foreground hover:text-charcoal"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Origin & Estate Terroir</span>
          </button>

          <button
            onClick={() => setActiveTab("aroma")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex-shrink-0 ${
              activeTab === "aroma"
                ? "border-cinnamon text-cinnamon"
                : "border-transparent text-muted-foreground hover:text-charcoal"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Aroma & Flavor Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex-shrink-0 ${
              activeTab === "health"
                ? "border-cinnamon text-cinnamon"
                : "border-transparent text-muted-foreground hover:text-charcoal"
            }`}
          >
            <HeartPulse className="h-4 w-4" />
            <span>Health & Active Curcumin</span>
          </button>

          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex-shrink-0 ${
              activeTab === "recipes"
                ? "border-cinnamon text-cinnamon"
                : "border-transparent text-muted-foreground hover:text-charcoal"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Chef Usage & Recipes</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === "origin" && (
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <h3 className="font-serif text-lg font-bold text-charcoal">The Terroir of {product.origin}</h3>
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl bg-cream-100 p-4">
                  <span className="font-bold text-xs text-charcoal">Harvest Season</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.harvestSeason || "Winter 2024 Fresh Harvest"}</p>
                </div>
                <div className="rounded-2xl bg-cream-100 p-4">
                  <span className="font-bold text-xs text-charcoal">Elevation</span>
                  <p className="text-xs text-muted-foreground mt-0.5">3,200 - 4,500 ft Above Sea Level</p>
                </div>
                <div className="rounded-2xl bg-cream-100 p-4">
                  <span className="font-bold text-xs text-charcoal">Processing</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Sun-Cured & Nitrogen Flushed</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "aroma" && (
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <h3 className="font-serif text-lg font-bold text-charcoal">Essential Oil Concentration</h3>
              <p>
                Volatile aroma profile: <strong className="text-charcoal">{product.aromaProfile || "Rich, Pungent, Warm Terpenes"}</strong>.
                Unlike industrially processed grocery brands that extract essential oils before powdering, our whole and stone-ground spices contain 100% natural oil density.
              </p>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <h3 className="font-serif text-lg font-bold text-charcoal">Bioactive Therapeutic Compounds</h3>
              <p>
                Tested with zero chemical additives, heavy metals, or artificial color enhancers. Loaded with natural antioxidants, anti-inflammatory phytonutrients, and digestive stimulation enzymes.
              </p>
            </div>
          )}

          {activeTab === "recipes" && (
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <h3 className="font-serif text-lg font-bold text-charcoal">Culinary Pairings & Storage Recommendations</h3>
              <p>
                Best used freshly crushed or tempered in pure ghee / cold-pressed oils. Store in an airtight amber glass jar away from direct sunlight to preserve volatile notes for up to 24 months.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Spices Carousel */}
      <section className="pt-8 border-t border-cream-300">
        <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">
          Complementary Spice Terroirs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
