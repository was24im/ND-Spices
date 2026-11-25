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

interface ProductListRowProps {
  product: ProductType;
}

export function ProductListRow({ product }: ProductListRowProps) {
  const { isHindi, t } = useTranslation();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const primaryImage = product.images[0]?.url || "/images/categories/whole-red-chilli.jpg";
  const isWishlisted = isInWishlist(product.id);

  const displayName = isHindi && (product as any).nameHi ? (product as any).nameHi : product.name;
  const displayDesc = isHindi && (product as any).descriptionHi ? (product as any).descriptionHi : product.description;
  const displayOrigin = isHindi && (product as any).originHi ? (product as any).originHi : product.origin;

  const handleAddToCart = () => {
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
      origin: product.origin,
      originHi: (product as any).originHi || product.origin,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5 rounded-xl border border-[#E8E1DD] bg-white p-4 transition-colors hover:border-[#3D1E16]/50">
      <div className="relative aspect-square sm:h-40 sm:w-40 flex-shrink-0 overflow-hidden rounded-lg bg-[#FAF8F6]">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image src={primaryImage} alt={displayName} fill className="object-cover" />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 border border-[#E8E1DD]"
          aria-label="Wishlist"
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-[#3D1E16] text-[#3D1E16]" : "text-[#6E5A54]"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <p className="text-xs text-[#6E5A54]">{displayOrigin}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg font-semibold text-[#2B140E] hover:underline underline-offset-4">
              {displayName}
            </h3>
          </Link>
          <p className="text-xs text-[#6E5A54] line-clamp-2 leading-relaxed">{displayDesc}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantIndex(idx)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                  selectedVariantIndex === idx
                    ? "bg-[#3D1E16] text-white border-[#3D1E16]"
                    : "bg-white text-[#2B140E] border-[#E8E1DD] hover:bg-[#FAF8F6]"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E8E1DD]">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#2B140E]">{formatPrice(activeVariant.price)}</span>
            {activeVariant.mrp > activeVariant.price && (
              <span className="text-xs text-[#6E5A54] line-through">{formatPrice(activeVariant.mrp)}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] px-4 py-2 text-xs font-medium text-white transition-colors"
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{isHindi ? "जोड़ा गया" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{t("catalog.addToBasket")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
