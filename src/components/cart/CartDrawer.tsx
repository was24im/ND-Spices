"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    getProgressToFreeShipping,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const progress = getProgressToFreeShipping();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-spice-dark/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-spice-dark font-serif">Your Spice Basket</h2>
              <span className="rounded-full bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-0.5">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-1.5 text-spice-muted hover:bg-cream-200 hover:text-spice-dark transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-cream-200/90 border-b border-cream-300 px-5 py-3">
            <div className="flex items-center justify-between text-xs font-medium text-spice-dark mb-1.5">
              <span className="flex items-center gap-1.5 text-secondary-700">
                <Truck className="h-3.5 w-3.5" />
                {progress.remaining > 0 ? (
                  <>Add <strong className="text-primary-700">{formatPrice(progress.remaining)}</strong> more for <strong>FREE Delivery</strong></>
                ) : (
                  <span className="text-secondary-600 font-bold">🎉 Congratulations! You unlocked FREE Delivery</span>
                )}
              </span>
              <span className="text-xs font-semibold">{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream-400">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center text-spice-muted">
                  <ShoppingBag className="h-8 w-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-spice-dark">Your basket is empty</h3>
                  <p className="text-xs text-spice-muted mt-1 max-w-[240px]">
                    Experience single-origin, fresh-harvested spices direct from Indian plantations.
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-600 shadow-spice-sm"
                >
                  Explore Spice Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-cream-300/90 bg-white p-3 shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-spice-dark line-clamp-1 font-serif">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-spice-muted hover:text-cinnamon-500 p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-secondary-600 font-medium">
                        {item.weight} • {item.origin}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center rounded-lg border border-cream-300 bg-cream-100 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded text-spice-dark transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-spice-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded text-spice-dark transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-spice-dark font-display">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-cream-300 bg-white p-5 space-y-3">
              <div className="space-y-1.5 text-xs text-spice-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-spice-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-spice-dark">
                    {shipping === 0 ? (
                      <span className="text-secondary-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-spice-dark pt-2 border-t border-cream-200">
                  <span>Estimated Total</span>
                  <span className="text-primary font-display">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-spice-md hover:bg-primary-600 hover:shadow-saffron-glow transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-spice-muted pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                <span>100% Secure Checkout • Authentic Farm Sourced</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
