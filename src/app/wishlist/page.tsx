"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Sparkles, MapPin } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items: wishlistItems, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, setDrawerOpen } = useCartStore();

  const handleMoveToCart = (product: any) => {
    const activeVariant = product.variants[0];
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      weight: activeVariant.weight,
      weightGrams: activeVariant.weightGrams,
      price: activeVariant.price,
      mrp: activeVariant.mrp,
      image: product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
      origin: product.origin,
    });
    removeItem(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((product) => {
      const activeVariant = product.variants[0];
      addItem({
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        slug: product.slug,
        weight: activeVariant.weight,
        weightGrams: activeVariant.weightGrams,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        image: product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
        origin: product.origin,
      });
    });
    clearWishlist();
    setDrawerOpen(true);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center text-muted-foreground mx-auto">
          <Heart className="h-8 w-8 text-cinnamon" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Your Wishlist is Empty</h1>
        <p className="text-xs text-muted-foreground">
          Save your favorite pure spices, stone-ground powders, and authentic blends to track fresh batches.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-cinnamon px-6 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
        >
          Browse Spice Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-cinnamon transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
            Saved Spice Wishlist ({wishlistItems.length})
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearWishlist}
            className="rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-200"
          >
            Clear All
          </button>
          <button
            onClick={handleMoveAllToCart}
            className="flex items-center gap-2 rounded-xl bg-cinnamon px-5 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Move All to Basket</span>
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const variant = product.variants[0];
          return (
            <div
              key={product.id}
              className="rounded-3xl border border-cream-300 bg-white p-4 shadow-spice-sm hover:shadow-spice-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 mb-3">
                  <Image
                    src={product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs text-muted-foreground hover:text-cinnamon"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3 text-cinnamon" />
                  <span>{product.origin}</span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-serif text-base font-bold text-charcoal hover:text-cinnamon line-clamp-1 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-cardamom font-semibold mt-1">
                  {variant.weight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
                <span className="font-display text-xl font-extrabold text-charcoal">
                  {formatPrice(variant.price)}
                </span>
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Move to Basket</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
