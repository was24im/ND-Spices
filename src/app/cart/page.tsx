"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
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

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const progress = getProgressToFreeShipping();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center text-spice-muted mx-auto">
          <ShoppingBag className="h-8 w-8 text-primary-400" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-spice-dark">Your basket is empty</h1>
        <p className="text-xs text-spice-muted">
          Explore single-origin, fresh-harvested spices direct from Kerala and Kashmir estates.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-600 shadow-spice-sm"
        >
          Explore Harvests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-spice-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
          Spice Basket ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Meter */}
          <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-spice-sm">
            <div className="flex items-center justify-between text-xs font-medium text-spice-dark mb-1.5">
              <span className="flex items-center gap-1.5 text-secondary-700">
                <Truck className="h-4 w-4" />
                {progress.remaining > 0 ? (
                  <>Add <strong className="text-primary-700">{formatPrice(progress.remaining)}</strong> more for <strong>FREE Delivery</strong></>
                ) : (
                  <span className="text-secondary-600 font-bold">🎉 You unlocked FREE Express Delivery</span>
                )}
              </span>
              <span className="text-xs font-semibold">{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream-300">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-cream-300 bg-white divide-y divide-cream-200 shadow-spice-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-spice-dark">
                      {item.name}
                    </h3>
                    <p className="text-xs text-secondary-600 font-medium mt-0.5">
                      {item.weight} • {item.origin}
                    </p>
                    <p className="text-xs font-bold text-spice-dark sm:hidden mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity */}
                  <div className="flex items-center rounded-xl border border-cream-300 bg-cream-100 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded text-spice-dark transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-spice-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded text-spice-dark transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-display font-bold text-base text-spice-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-spice-muted">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-spice-muted hover:text-cinnamon-500 p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-cream-300 bg-white p-5 sm:p-6 shadow-spice-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-spice-dark border-b border-cream-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-spice-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-spice-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-spice-dark">
                  {shipping === 0 ? (
                    <span className="text-secondary-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-spice-dark pt-3 border-t border-cream-200">
                <span>Total Amount</span>
                <span className="text-primary font-display text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-spice-md hover:bg-primary-600 hover:shadow-spice-lg transition-all active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-spice-muted pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
              <span>100% Guaranteed Purity & Safe Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
