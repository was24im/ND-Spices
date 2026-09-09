"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
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
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SpiceLevelBadge } from "@/components/product/SpiceLevelBadge";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const images = product.images.length > 0 ? product.images : [{ id: "fallback", url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d", alt: product.name, isPrimary: true, order: 1 }];
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-spice-muted">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Spices</Link>
        <span>/</span>
        <span className="text-spice-dark font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-cream-300 shadow-spice-sm">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              fill
              priority
              className="object-cover transition-all duration-300"
            />
            {/* Wishlist floating toggle */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
              aria-label="Wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted ? "fill-cinnamon-500 text-cinnamon-500" : "text-spice-muted hover:text-cinnamon-500"
                }`}
              />
            </button>
          </div>

          {/* Thumbnail list if multiple */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-primary shadow-spice-sm scale-105"
                      : "border-cream-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Origin & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              {product.origin}
            </span>
            <SpiceLevelBadge level={product.spiceLevel} />
            {product.organic && (
              <span className="text-xs font-semibold text-primary-800 bg-primary-100 px-3 py-1 rounded-full">
                100% Certified Organic
              </span>
            )}
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-spice-dark tracking-tight">
              {product.name}
            </h1>
            {product.scientificName && (
              <p className="text-xs italic text-spice-muted mt-1">
                Botanical Name: {product.scientificName}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-spice-dark">{product.rating || 4.9}</span>
            <span className="text-xs text-spice-muted">({product.reviewCount || 120} verified chef reviews)</span>
          </div>

          {/* Pricing & MRP */}
          <div className="rounded-2xl bg-cream-200/70 p-4 border border-cream-300 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-black text-spice-dark">
                {formatPrice(activeVariant.price)}
              </span>
              {activeVariant.mrp > activeVariant.price && (
                <span className="text-sm text-spice-muted line-through font-medium">
                  {formatPrice(activeVariant.mrp)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="rounded-full bg-cinnamon-500 text-white text-xs font-bold px-2.5 py-1">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Weight Variant Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-spice-muted">
              Select Package & Weight
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((variant, idx) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    selectedVariantIndex === idx
                      ? "border-primary bg-primary-50/80 shadow-spice-sm"
                      : "border-cream-300 bg-white hover:bg-cream-100"
                  }`}
                >
                  <p className="text-xs font-bold text-spice-dark">{variant.weight}</p>
                  <p className="text-xs font-semibold text-primary mt-0.5">{formatPrice(variant.price)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Cart Action */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center rounded-xl border border-cream-300 bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 rounded-lg hover:bg-cream-200 text-spice-dark font-bold flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-bold text-spice-dark">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-9 w-9 rounded-lg hover:bg-cream-200 text-spice-dark font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold text-white transition-all shadow-spice-md active:scale-[0.99] ${
                addedAnimation
                  ? "bg-secondary-600"
                  : "bg-primary hover:bg-primary-600 hover:shadow-saffron-glow"
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

          {/* Aroma & Terroir Characteristics */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cream-300 text-xs">
            {product.aromaProfile && (
              <div className="rounded-xl bg-white border border-cream-300 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-spice-muted">Aroma Terroir</span>
                <p className="font-semibold text-spice-dark">{product.aromaProfile}</p>
              </div>
            )}
            {product.harvestSeason && (
              <div className="rounded-xl bg-white border border-cream-300 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-spice-muted">Harvest Season</span>
                <p className="font-semibold text-spice-dark">{product.harvestSeason}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-serif text-base font-bold text-spice-dark">About This Harvest</h3>
            <p className="text-xs sm:text-sm text-spice-muted leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      <div className="pt-12 border-t border-cream-300">
        <h2 className="font-serif text-2xl font-bold text-spice-dark mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
