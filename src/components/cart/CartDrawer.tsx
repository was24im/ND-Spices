"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslation } from "@/store/useLanguageStore";
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

  const { isHindi, dict } = useTranslation();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const progress = getProgressToFreeShipping();

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
      <div
        className="absolute inset-0 bg-[#2B140E]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-white shadow-2xl border-l border-[#E8E1DD] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E1DD] px-5 py-4 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#3D1E16]" />
              <h2 className="text-base font-semibold text-[#2B140E]">
                {dict.cart.title} ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-1.5 text-[#6E5A54] hover:bg-[#FAF8F6] hover:text-[#2B140E]"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Minimal Free Shipping Bar */}
          <div className="bg-[#FAF8F6] border-b border-[#E8E1DD] px-5 py-3">
            <div className="flex items-center justify-between text-xs text-[#2B140E] mb-1.5">
              <span>
                {progress.remaining > 0 ? (
                  isHindi ? (
                    <>मुफ्त डिलीवरी के लिए <strong>{formatPrice(progress.remaining)}</strong> और जोड़ें</>
                  ) : (
                    <>Add <strong>{formatPrice(progress.remaining)}</strong> for free delivery</>
                  )
                ) : (
                  <span className="font-medium text-[#3D1E16]">
                    {isHindi ? "मुफ्त डिलीवरी लागू" : "Free Delivery Unlocked"}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#6E5A54]">{progress.percentage}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8E1DD]">
              <div
                className="h-full bg-[#3D1E16] transition-all duration-300 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="h-8 w-8 text-[#A9938A]" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#2B140E]">
                    {dict.cart.emptyTitle}
                  </h3>
                  <p className="text-xs text-[#6E5A54] mt-1 max-w-[240px]">
                    {dict.cart.emptyDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg bg-[#3D1E16] px-4 py-2 text-xs font-medium text-white hover:bg-[#2B140E]"
                >
                  {dict.cart.startShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-[#E8E1DD] bg-white p-3"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#FAF8F6]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-medium text-[#2B140E] line-clamp-1">
                          {isHindi && item.nameHi ? item.nameHi : item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#6E5A54] hover:text-[#2B140E] p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6E5A54]">
                        {item.weight} · {isHindi && item.originHi ? item.originHi : item.origin}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-md border border-[#E8E1DD] bg-[#FAF8F6]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#2B140E] hover:bg-white rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-[#2B140E]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#2B140E] hover:bg-white rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#2B140E]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#E8E1DD] bg-[#FAF8F6] p-5 space-y-3">
              <div className="space-y-1.5 text-xs text-[#6E5A54]">
                <div className="flex justify-between">
                  <span>{dict.cart.subtotal}</span>
                  <span className="font-medium text-[#2B140E]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{dict.cart.shipping}</span>
                  <span className="font-medium text-[#2B140E]">
                    {shipping === 0 ? dict.cart.freeShipping : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2B140E] pt-2 border-t border-[#E8E1DD]">
                  <span>{dict.cart.total}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] py-3 text-sm font-medium text-white transition-colors"
              >
                <span>{dict.cart.checkout}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
