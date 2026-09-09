"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Tag,
  Check,
  MapPin,
  X,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Address
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
  });

  // Step 2: Delivery Speed
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  // Step 4: Coupon Engine
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Order Submission
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Load saved addresses for logged-in user
  useEffect(() => {
    if (session?.user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: session.user?.name || "",
        email: session.user?.email || "",
      }));

      fetch("/api/user/address")
        .then((res) => res.json())
        .then((data) => {
          if (data?.addresses && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [session]);

  const subtotal = getSubtotal();
  const baseShipping = subtotal >= 499 || subtotal === 0 ? 0 : 60;
  const shippingFee = deliveryOption === "express" ? baseShipping + 120 : baseShipping;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid promo code");
      } else {
        setAppliedCoupon(data.coupon);
        setCouponInput("");
      }
    } catch (e) {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Mock live order registration
    setTimeout(() => {
      const orderNum = `ND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderSuccess(orderNum);
      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-cardamom-100 text-cardamom flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="rounded-full bg-cardamom-100 text-cardamom text-xs font-bold px-3 py-1">
            Order Confirmed & Farm Sealed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal">
            Thank you for choosing ND Spices!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Order <strong>#{orderSuccess}</strong> is placed. We are preparing fresh single-origin spices straight from Kerala and Kashmir.
          </p>
        </div>

        <div className="rounded-3xl border border-cream-300 bg-white p-6 text-left max-w-md mx-auto space-y-3 shadow-spice-sm">
          <h3 className="font-serif text-sm font-bold text-charcoal border-b border-cream-200 pb-2">
            Dispatch Details
          </h3>
          <p className="text-xs text-muted-foreground">
            <strong>Payment Method:</strong> {paymentMethod === "RAZORPAY" ? "Razorpay Gateway (Online)" : "Cash on Delivery (COD)"}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Delivery Speed:</strong> {deliveryOption === "express" ? "Express Priority (24-48 hrs)" : "Standard Express (3-5 days)"}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Total Paid:</strong> <span className="font-bold text-charcoal font-display">{formatPrice(finalAmount)}</span>
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href="/products"
            className="rounded-xl bg-cinnamon px-6 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
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
        <h2 className="font-serif text-2xl font-bold text-charcoal">Your spice basket is empty</h2>
        <p className="text-xs text-muted-foreground">
          Add single-origin spice harvests to your basket before checking out.
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
      {/* Checkout Progress Wizard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-cinnamon transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
            Express Checkout
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 1
                ? "bg-cinnamon text-white shadow-xs"
                : "bg-cream-200 text-charcoal hover:bg-cream-300"
            }`}
          >
            <span>1. Address</span>
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 2
                ? "bg-cinnamon text-white shadow-xs"
                : "bg-cream-200 text-charcoal hover:bg-cream-300"
            }`}
          >
            <span>2. Delivery</span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 3
                ? "bg-cinnamon text-white shadow-xs"
                : "bg-cream-200 text-charcoal hover:bg-cream-300"
            }`}
          >
            <span>3. Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <MapPin className="h-5 w-5 text-cinnamon" />
                <h2 className="font-serif text-lg font-bold text-charcoal">
                  1. Shipping & Delivery Address
                </h2>
              </div>

              {/* Saved Address Selection */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Choose Saved Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-cinnamon bg-cinnamon-50/50 shadow-xs"
                            : "border-cream-300 hover:bg-cream-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="addressSelect"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="h-4 w-4 text-cinnamon focus:ring-cinnamon"
                          />
                          <span className="font-bold text-xs text-charcoal">{addr.fullName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressId("new")}
                    className={`text-xs font-bold ${
                      selectedAddressId === "new" ? "text-cinnamon underline" : "text-muted-foreground hover:text-charcoal"
                    }`}
                  >
                    + Ship to a different address
                  </button>
                </div>
              )}

              {/* Manual Form if new address */}
              {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-charcoal mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@example.com"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-charcoal mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No, Apartment, Street name"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560038"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-cinnamon focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 rounded-xl bg-cinnamon px-6 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
                >
                  <span>Continue to Delivery Speed</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Option */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Truck className="h-5 w-5 text-cinnamon" />
                <h2 className="font-serif text-lg font-bold text-charcoal">
                  2. Select Delivery Option
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    deliveryOption === "standard"
                      ? "border-cinnamon bg-cinnamon-50/50 shadow-xs"
                      : "border-cream-300 hover:bg-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryOption === "standard"}
                      onChange={() => setDeliveryOption("standard")}
                      className="h-4 w-4 text-cinnamon focus:ring-cinnamon"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-charcoal">
                        Standard Ground Express (3-5 Days)
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Free on orders above ₹499 • Fully insured transit
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-charcoal">
                    {baseShipping === 0 ? "FREE" : formatPrice(60)}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    deliveryOption === "express"
                      ? "border-cinnamon bg-cinnamon-50/50 shadow-xs"
                      : "border-cream-300 hover:bg-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryOption === "express"}
                      onChange={() => setDeliveryOption("express")}
                      className="h-4 w-4 text-cinnamon focus:ring-cinnamon"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-charcoal">
                          Priority Air Courier (24-48 Hours)
                        </p>
                        <span className="rounded-full bg-turmeric-100 text-turmeric-800 text-[10px] font-bold px-2 py-0.5">
                          Fastest
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Guaranteed priority packing directly at harvest warehouse
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-cinnamon">
                    +{formatPrice(120)}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-muted-foreground hover:text-charcoal"
                >
                  Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 rounded-xl bg-cinnamon px-6 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {currentStep === 3 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Lock className="h-5 w-5 text-cardamom" />
                <h2 className="font-serif text-lg font-bold text-charcoal">
                  3. Select Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-cinnamon bg-cinnamon-50/50 shadow-xs"
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
                      className="h-4 w-4 text-cinnamon focus:ring-cinnamon"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-charcoal">
                          Razorpay Gateway (UPI, GPay, Cards, Netbanking)
                        </p>
                        <span className="rounded-full bg-cardamom-100 text-cardamom text-[10px] font-bold px-2 py-0.5">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Encrypted 256-bit SSL transaction powered by Razorpay.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="h-5 w-5 text-cinnamon hidden sm:block" />
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-cinnamon bg-cinnamon-50/50 shadow-xs"
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
                      className="h-4 w-4 text-cinnamon focus:ring-cinnamon"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-charcoal">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Pay cash or UPI upon delivery at your doorstep.
                      </p>
                    </div>
                  </div>
                  <Banknote className="h-5 w-5 text-cardamom hidden sm:block" />
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-muted-foreground hover:text-charcoal"
                >
                  Back to Delivery
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Order Summary & Coupon Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-spice-sm space-y-5">
            <h3 className="font-serif text-base font-bold text-charcoal border-b border-cream-200 pb-3">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-charcoal truncate font-serif">{item.name}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {item.weight} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-charcoal font-display">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Engine Input */}
            <div className="border-t border-cream-200 pt-4 space-y-2">
              <label className="block text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-cinnamon" />
                <span>Apply Promo Code</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-cardamom-50 border border-cardamom-200 p-2.5 text-xs text-cardamom">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>
                      <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(appliedCoupon.discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-cardamom-100 rounded text-cardamom"
                    aria-label="Remove coupon"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10, SPICEKING"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 rounded-xl border border-cream-300 px-3 py-2 text-xs uppercase text-charcoal focus:border-cinnamon focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="rounded-xl bg-cinnamon px-4 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-cream-200 pt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-cardamom font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-cardamom font-semibold">
                  <span>Coupon Savings ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-charcoal pt-2 border-t border-cream-200">
                <span>Final Amount</span>
                <span className="text-cinnamon font-display text-xl">{formatPrice(finalAmount)}</span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full rounded-2xl bg-cinnamon py-4 text-sm font-bold text-white hover:bg-cinnamon-600 shadow-spice-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? "Authorizing Secure Order..." : `Complete Order • ${formatPrice(finalAmount)}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-cardamom" />
              <span>SSL 256-Bit Encrypted • Farm Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
