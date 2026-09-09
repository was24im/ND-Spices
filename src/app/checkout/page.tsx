"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getShippingFee, getGrandTotal, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "Kerala",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock order creation flow
    setTimeout(() => {
      const generatedOrderNumber = `ND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderSuccess(generatedOrderNumber);
      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="rounded-full bg-secondary-100 text-secondary-800 text-xs font-bold px-3 py-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-spice-dark">
            Thank you for your order!
          </h1>
          <p className="text-sm text-spice-muted max-w-md mx-auto">
            Order <strong>#{orderSuccess}</strong> has been registered. Your authentic single-origin spices will be freshly packed and dispatched within 24 hours.
          </p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-6 text-left max-w-md mx-auto space-y-3 shadow-spice-sm">
          <h3 className="font-serif text-sm font-bold text-spice-dark">Delivery Snapshot</h3>
          <p className="text-xs text-spice-muted">
            <strong>Recipient:</strong> {formData.fullName || "Customer"} ({formData.phone || "+91 XXXXX XXXXX"})
          </p>
          <p className="text-xs text-spice-muted">
            <strong>Address:</strong> {formData.street || "Delivery Address"}, {formData.city || "City"}, {formData.state} - {formData.postalCode}
          </p>
          <p className="text-xs text-spice-muted">
            <strong>Payment:</strong> {paymentMethod === "RAZORPAY" ? "Razorpay Gateway (Online)" : "Cash on Delivery (COD)"}
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-600 shadow-spice-sm"
          >
            Continue Exploring Spices
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-spice-dark">Your basket is empty</h2>
        <p className="text-xs text-spice-muted">
          Add fresh-harvested artisanal spices to your basket before checking out.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-600 shadow-spice-sm"
        >
          Browse Spice Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-spice-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shopping</span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark mt-2">
          Express Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-cream-300 bg-white p-5 sm:p-6 shadow-spice-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-base font-bold text-spice-dark">
                1. Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="vikram@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Street Address & House / Flat No. *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House No, Apartment, Street name"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="e.g. 560001"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-cream-300 bg-white p-5 sm:p-6 shadow-spice-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Lock className="h-5 w-5 text-secondary" />
              <h2 className="font-serif text-base font-bold text-spice-dark">
                2. Select Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "RAZORPAY"
                    ? "border-primary bg-primary-50/50 shadow-xs"
                    : "border-cream-300 hover:bg-cream-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="RAZORPAY"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-spice-dark">
                        Razorpay Gateway (UPI, GPay, Cards, Netbanking)
                      </p>
                      <span className="rounded-full bg-secondary-100 text-secondary-800 text-[10px] font-bold px-2 py-0.5">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-spice-muted mt-0.5">
                      Secure encrypted transaction powered by Razorpay.
                    </p>
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-primary hidden sm:block" />
              </label>

              <label
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-primary bg-primary-50/50 shadow-xs"
                    : "border-cream-300 hover:bg-cream-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-spice-dark">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-[11px] text-spice-muted mt-0.5">
                      Pay cash or UPI upon delivery at your doorstep.
                    </p>
                  </div>
                </div>
                <Banknote className="h-5 w-5 text-secondary hidden sm:block" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-cream-300 bg-white p-5 sm:p-6 shadow-spice-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-spice-dark border-b border-cream-200 pb-3">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-spice-dark truncate font-serif">{item.name}</p>
                    <p className="text-spice-muted text-[11px]">
                      {item.weight} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-spice-dark font-display">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="border-t border-cream-200 pt-3 space-y-2 text-xs text-spice-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-spice-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-spice-dark">
                  {shipping === 0 ? (
                    <span className="text-secondary-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-spice-dark pt-2 border-t border-cream-200">
                <span>Total Amount</span>
                <span className="text-primary font-display text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-600 shadow-spice-md hover:shadow-saffron-glow transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? "Processing Secure Order..." : `Place Order • ${formatPrice(grandTotal)}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-spice-muted pt-1">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>SSL 256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
