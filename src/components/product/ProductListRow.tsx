"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, MapPin, Sparkles, Star } from "lucide-react";
import { ProductType } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SpiceLevelBadge } from "./SpiceLevelBadge";
import { Badge } from "../ui/Badge";

interface ProductListRowProps {
  product: ProductType;
}

export function ProductListRow({ product }: ProductListRowProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const primaryImage = product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d";
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscount(activeVariant.price, activeVariant.mrp);

  const handleAddToCart = () => {
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

  return (
    <div className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-spice-sm hover:shadow-spice-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-square sm:h-44 sm:w-44 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md"
          aria-label="Wishlist"
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-cinnamon text-cinnamon" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Main Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-cinnamon" />
              {product.origin}
            </span>
            <SpiceLevelBadge level={product.spiceLevel} />
            {product.organic && (
              <span className="text-[10px] font-bold text-cardamom bg-cardamom-50 border border-cardamom-200 px-2 py-0.5 rounded-full">
                100% Organic
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal hover:text-cinnamon transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-charcoal">{product.rating || 4.9}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount || 95} reviews)</span>
          </div>

          {/* Weight options */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(idx)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedVariantIndex === idx
                    ? "bg-cardamom text-white"
                    : "bg-cream-200 text-charcoal hover:bg-cream-300"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-cream-200">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-black text-charcoal">
              {formatPrice(activeVariant.price)}
            </span>
            {activeVariant.mrp > activeVariant.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(activeVariant.mrp)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-full bg-cinnamon text-white text-[10px] font-bold px-2 py-0.5">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all shadow-spice-sm ${
              addedAnimation ? "bg-cardamom" : "bg-primary hover:bg-cinnamon-600"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Basket</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
