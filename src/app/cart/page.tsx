"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslation } from "@/store/useLanguageStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
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

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <ShoppingBag className="h-9 w-9 text-[#A9938A] mx-auto" />
        <h1 className="font-serif text-2xl font-bold text-[#2B140E]">{dict.cart.emptyTitle}</h1>
        <p className="text-xs text-[#6E5A54]">{dict.cart.emptyDesc}</p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-[#3D1E16] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#2B140E]"
        >
          {dict.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E1DD] pb-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E5A54] hover:text-[#2B140E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{dict.cart.continueShopping}</span>
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2B140E]">
            {dict.cart.title} ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border border-[#E8E1DD] bg-[#FAF8F6] p-4">
              <div className="flex items-center justify-between text-xs text-[#2B140E] mb-1.5">
                <span>
                  {progress.remaining > 0 ? (
                    isHindi ? (
                      <>मुफ्त डिलीवरी के लिए <strong>{formatPrice(progress.remaining)}</strong> और जोड़ें</>
                    ) : (
                      <>Add <strong>{formatPrice(progress.remaining)}</strong> more for free delivery</>
                    )
                  ) : (
                    <span className="font-medium text-[#3D1E16]">
                      {isHindi ? "मुफ्त डिलीवरी लागू" : "Free Express Delivery Unlocked"}
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

            <div className="rounded-xl border border-[#E8E1DD] bg-white divide-y divide-[#E8E1DD] overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-[#FAF8F6] flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#2B140E]">
                        {isHindi && item.nameHi ? item.nameHi : item.name}
                      </h3>
                      <p className="text-xs text-[#6E5A54] mt-0.5">
                        {item.weight} · {isHindi && item.originHi ? item.originHi : item.origin}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    <div className="flex items-center rounded-lg border border-[#E8E1DD] bg-[#FAF8F6] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded text-[#2B140E]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-medium text-[#2B140E]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded text-[#2B140E]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-sm text-[#2B140E]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[#6E5A54] hover:text-[#2B140E] p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-xl border border-[#E8E1DD] bg-[#FAF8F6] p-5 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#2B140E] border-b border-[#E8E1DD] pb-3">
                {dict.cart.orderSummary}
              </h3>

              <div className="space-y-2 text-xs text-[#6E5A54]">
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
                <div className="flex justify-between text-base font-bold text-[#2B140E] pt-3 border-t border-[#E8E1DD]">
                  <span>{dict.cart.total}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] py-3 text-sm font-medium text-white transition-colors"
              >
                <span>{dict.cart.checkout}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
