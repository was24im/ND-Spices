"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, Sparkles, MapPin } from "lucide-react";
import { ProductType } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SpiceLevelBadge } from "./SpiceLevelBadge";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const primaryImage = product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d";
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscount(activeVariant.price, activeVariant.mrp);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      weight: activeVariant.weight,
      weightGrams: activeVariant.weightGrams,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      image: primaryImage,
      origin: product.origin,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-cream-300/80 bg-white p-3 sm:p-4 shadow-spice-sm hover:shadow-spice-md transition-all duration-300 hover:border-primary-200">
      {/* Top Badges & Wishlist */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-100">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {product.organic && (
            <Badge variant="secondary" className="bg-secondary-600/90 backdrop-blur-sm text-white border-0 text-[10px] px-2 py-0.5">
              100% Organic
            </Badge>
          )}
          {product.bestseller && (
            <Badge variant="default" className="bg-primary-500 text-white border-0 text-[10px] px-2 py-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </Badge>
          )}
          {discountPercent > 0 && (
            <span className="bg-cinnamon-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-cinnamon-500 text-cinnamon-500" : "text-spice-muted hover:text-cinnamon-500"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Origin & Spice Heat */}
          <div className="flex items-center justify-between text-xs text-spice-muted mb-1 gap-2">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 text-primary-500 flex-shrink-0" />
              {product.origin}
            </span>
            <SpiceLevelBadge level={product.spiceLevel} />
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-spice-dark line-clamp-1 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="mt-1 text-xs text-spice-muted line-clamp-2 leading-relaxed">
              {product.shortDesc}
            </p>
          )}

          {/* Weight Variant Pills */}
          {product.variants.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    selectedVariantIndex === idx
                      ? "bg-secondary-600 text-white shadow-xs"
                      : "bg-cream-200 text-spice-dark hover:bg-cream-300"
                  }`}
                >
                  {v.weight.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-spice-dark font-display">
                {formatPrice(activeVariant.price)}
              </span>
              {activeVariant.mrp > activeVariant.price && (
                <span className="text-xs text-spice-muted line-through">
                  {formatPrice(activeVariant.mrp)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-secondary-600 font-medium">In Stock • Fresh Harvest</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={activeVariant.stock <= 0}
            className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
              addedAnimation
                ? "bg-secondary-600 text-white"
                : "bg-primary text-white hover:bg-primary-600 shadow-spice-sm hover:shadow-spice-md"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
