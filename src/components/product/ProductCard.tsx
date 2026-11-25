"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { ProductType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useTranslation } from "@/store/useLanguageStore";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, isHindi } = useTranslation();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const primaryImage = product.images[0]?.url || "/images/categories/whole-red-chilli.jpg";
  const isWishlisted = isInWishlist(product.id);

  const displayName = isHindi && (product as any).nameHi ? (product as any).nameHi : product.name;
  const displayOrigin = isHindi && (product as any).originHi ? (product as any).originHi : product.origin;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      nameHi: (product as any).nameHi || product.name,
      slug: product.slug,
      weight: activeVariant.weight,
      weightGrams: activeVariant.weightGrams,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      image: primaryImage,
      origin: product.origin || "India",
      originHi: (product as any).originHi || product.origin || "भारत",
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
    <div className="group flex flex-col rounded-xl border border-[#E8E1DD] bg-white p-3.5 transition-colors hover:border-[#3D1E16]/50">
      {/* Clean Square Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FAF8F6]">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>

        {/* Minimal Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 border border-[#E8E1DD] transition-colors hover:border-[#3D1E16]"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isWishlisted ? "fill-[#3D1E16] text-[#3D1E16]" : "text-[#6E5A54]"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between pt-3 space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] text-[#6E5A54] truncate">{displayOrigin}</p>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif font-semibold text-sm sm:text-base text-[#2B140E] group-hover:underline underline-offset-4 line-clamp-1">
              {displayName}
            </h3>
          </Link>
        </div>

        {/* Minimal Pack Size Selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {product.variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariantIndex(i);
                }}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors border ${
                  selectedVariantIndex === i
                    ? "bg-[#3D1E16] text-white border-[#3D1E16]"
                    : "bg-white text-[#2B140E] border-[#E8E1DD] hover:bg-[#FAF8F6]"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}

        {/* Price & Minimal Add Button */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#E8E1DD]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[#2B140E]">
              {formatPrice(activeVariant.price)}
            </span>
            {activeVariant.mrp && activeVariant.mrp > activeVariant.price && (
              <span className="text-[11px] text-[#6E5A54] line-through">
                {formatPrice(activeVariant.mrp)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              addedAnimation
                ? "bg-[#2B140E] text-white"
                : "bg-[#3D1E16] text-white hover:bg-[#2B140E]"
            }`}
            aria-label="Add spice to basket"
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isHindi ? "जोड़ा गया" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("catalog.addToBasket")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
