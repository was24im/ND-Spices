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
  Tag,
  Check,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { useTranslation } from "@/store/useLanguageStore";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { isHindi, dict } = useTranslation();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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
        setCouponError(data.error || (isHindi ? "अमान्य प्रोमो कोड" : "Invalid promo code"));
      } else {
        setAppliedCoupon(data.coupon);
        setCouponInput("");
      }
    } catch (e) {
      setCouponError(isHindi ? "कूपन सत्यापित करने में त्रुटि" : "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const { addToast } = useToastStore();

  const handlePlaceOrder = async () => {
    // Validate address
    let shippingPayload: any = null;

    if (selectedAddressId !== "new" && savedAddresses.length > 0) {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId);
      if (selected) {
        shippingPayload = {
          fullName: selected.fullName,
          email: addressForm.email || session?.user?.email || "customer@ndspices.com",
          phone: selected.phone,
          street: selected.street,
          city: selected.city,
          state: selected.state,
          postalCode: selected.postalCode,
          country: selected.country || "India",
        };
      }
    }

    if (!shippingPayload) {
      if (
        !addressForm.fullName ||
        !addressForm.phone ||
        !addressForm.street ||
        !addressForm.city ||
        !addressForm.postalCode
      ) {
        addToast(
          isHindi
            ? "कृपया डिलीवरी पते के सभी आवश्यक फ़ील्ड भरें"
            : "Please fill in all required shipping address fields",
          "error"
        );
        setCurrentStep(1);
        return;
      }

      shippingPayload = {
        fullName: addressForm.fullName,
        email: addressForm.email || session?.user?.email || "guest@ndspices.com",
        phone: addressForm.phone,
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        country: "India",
      };
    }

    setIsProcessing(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.price,
      }));

      const payload = {
        items: orderItems,
        shippingAddress: shippingPayload,
        paymentMethod,
        deliveryOption,
        couponCode: appliedCoupon?.code,
        discountAmount,
        subtotal,
        shippingFee,
        totalAmount: finalAmount,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process order.");
      }

      setOrderSuccess(data.orderNumber);
      clearCart();
      addToast(
        isHindi
          ? `ऑर्डर #${data.orderNumber} सफलतापूर्वक दर्ज हुआ!`
          : `Order #${data.orderNumber} placed successfully!`,
        "success"
      );
    } catch (err: any) {
      console.error("Order error:", err);
      addToast(
        err.message || (isHindi ? "ऑर्डर दर्ज करने में त्रुटि" : "Failed to place order. Please try again."),
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <span className="rounded-full bg-secondary/10 text-secondary text-xs font-bold px-3 py-1">
            {isHindi ? "ऑर्डर की पुष्टि हुई • ताज़ा पैक" : "Order Confirmed & Sealed"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-spice-dark">
            {isHindi ? "एनडी स्पाइसेस चुनने के लिए धन्यवाद!" : "Thank you for choosing ND Spices!"}
          </h1>
          <p className="text-sm text-spice-muted max-w-md mx-auto">
            {isHindi ? (
              <>ऑर्डर <strong>#{orderSuccess}</strong> दर्ज कर लिया गया है। हम आपके शुद्ध मसाले तैयार कर रहे हैं।</>
            ) : (
              <>Order <strong>#{orderSuccess}</strong> is placed. We are preparing your single-origin Indian spices.</>
            )}
          </p>
        </div>

        <div className="rounded-3xl border border-cream-300 bg-white p-6 text-left max-w-md mx-auto space-y-3 shadow-sm">
          <h3 className="font-serif text-sm font-bold text-spice-dark border-b border-cream-200 pb-2">
            {isHindi ? "ऑर्डर विवरण" : "Dispatch Details"}
          </h3>
          <p className="text-xs text-spice-muted">
            <strong>{isHindi ? "भुगतान विधि:" : "Payment Method:"}</strong>{" "}
            {paymentMethod === "RAZORPAY"
              ? isHindi
                ? "ऑनलाइन भुगतान (Razorpay)"
                : "Razorpay Gateway (Online)"
              : isHindi
              ? "कैश ऑन डिलीवरी (COD)"
              : "Cash on Delivery (COD)"}
          </p>
          <p className="text-xs text-spice-muted">
            <strong>{isHindi ? "डिलीवरी प्रकार:" : "Delivery Speed:"}</strong>{" "}
            {deliveryOption === "express"
              ? isHindi
                ? "प्राथमिकता एक्सप्रेस (24-48 घंटे)"
                : "Express Priority (24-48 hrs)"
              : isHindi
              ? "मानक एक्सप्रेस (3-5 दिन)"
              : "Standard Express (3-5 days)"}
          </p>
          <p className="text-xs text-spice-muted">
            <strong>{isHindi ? "कुल भुगतान:" : "Total Paid:"}</strong>{" "}
            <span className="font-bold text-spice-dark font-display">{formatPrice(finalAmount)}</span>
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/products"
            className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-sm transition-all"
          >
            {isHindi ? "और मसाले देखें" : "Continue Exploring Spices"}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-spice-dark">{dict.cart.emptyTitle}</h2>
        <p className="text-xs text-spice-muted">{dict.cart.emptyDesc}</p>
        <Link
          href="/products"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-sm"
        >
          {dict.cart.startShopping}
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
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-spice-muted hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isHindi ? "वापस टोकरी पर जाएं" : "Return to Basket"}</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
            {dict.checkout.title}
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 1
                ? "bg-primary text-white shadow-xs"
                : "bg-cream-200 text-spice-dark hover:bg-cream-300"
            }`}
          >
            <span>1. {isHindi ? "पता" : "Address"}</span>
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 2
                ? "bg-primary text-white shadow-xs"
                : "bg-cream-200 text-spice-dark hover:bg-cream-300"
            }`}
          >
            <span>2. {isHindi ? "डिलीवरी" : "Delivery"}</span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentStep === 3
                ? "bg-primary text-white shadow-xs"
                : "bg-cream-200 text-spice-dark hover:bg-cream-300"
            }`}
          >
            <span>3. {isHindi ? "भुगतान" : "Payment"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold text-spice-dark">
                  1. {dict.checkout.shippingAddress}
                </h2>
              </div>

              {/* Saved Address Selection */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-spice-muted">
                    {isHindi ? "सहेजे गए पते चुनें" : "Choose Saved Address"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-cream-300 hover:bg-cream-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="addressSelect"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <span className="font-bold text-xs text-spice-dark">{addr.fullName}</span>
                        </div>
                        <p className="text-xs text-spice-muted mt-1.5 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressId("new")}
                    className={`text-xs font-bold ${
                      selectedAddressId === "new" ? "text-primary underline" : "text-spice-muted hover:text-spice-dark"
                    }`}
                  >
                    + {isHindi ? "नया पता जोड़ें" : "Ship to a different address"}
                  </button>
                </div>
              )}

              {/* Manual Form if new address */}
              {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {dict.checkout.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {isHindi ? "ईमेल आईडी *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {dict.checkout.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {dict.checkout.street} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No, Apartment, Street name"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {dict.checkout.city} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru / Jaipur"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      {dict.checkout.pincode} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560038"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full rounded-xl border border-cream-300 px-3.5 py-2 text-xs sm:text-sm text-spice-dark focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-sm"
                >
                  <span>{isHindi ? "डिलीवरी विकल्प पर जाएं" : "Continue to Delivery Speed"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Option */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold text-spice-dark">
                  2. {isHindi ? "डिलीवरी का प्रकार चुनें" : "Select Delivery Option"}
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    deliveryOption === "standard"
                      ? "border-primary bg-primary/5 shadow-xs"
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
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-spice-dark">
                        {isHindi ? "मानक ग्राउंड एक्सप्रेस (3-5 दिन)" : "Standard Ground Express (3-5 Days)"}
                      </p>
                      <p className="text-[11px] text-spice-muted mt-0.5">
                        {isHindi
                          ? "₹499 से अधिक के ऑर्डर पर मुफ्त • सुरक्षित पैकेजिंग"
                          : "Free on orders above ₹499 • Fully insured transit"}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-spice-dark">
                    {baseShipping === 0 ? (isHindi ? "मुफ्त" : "FREE") : formatPrice(60)}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    deliveryOption === "express"
                      ? "border-primary bg-primary/5 shadow-xs"
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
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-spice-dark">
                          {isHindi ? "प्राथमिकता एयर कूरियर (24-48 घंटे)" : "Priority Air Courier (24-48 Hours)"}
                        </p>
                        <span className="rounded-full bg-accent/20 text-spice-dark text-[10px] font-bold px-2 py-0.5">
                          {isHindi ? "तीव्रतम" : "Fastest"}
                        </span>
                      </div>
                      <p className="text-[11px] text-spice-muted mt-0.5">
                        {isHindi
                          ? "फैक्ट्री वेयरहाउस से सीधे प्राथमिकता प्रेषण"
                          : "Guaranteed priority packing directly at harvest warehouse"}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-primary">
                    +{formatPrice(120)}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-spice-muted hover:text-spice-dark"
                >
                  {isHindi ? "वापस पते पर जाएं" : "Back to Address"}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-dark shadow-sm"
                >
                  <span>{isHindi ? "भुगतान विधि पर जाएं" : "Continue to Payment"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {currentStep === 3 && (
            <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Lock className="h-5 w-5 text-secondary" />
                <h2 className="font-serif text-lg font-bold text-spice-dark">
                  3. {dict.checkout.paymentMode}
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-primary bg-primary/5 shadow-xs"
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
                          {dict.checkout.onlinePayment}
                        </p>
                        <span className="rounded-full bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5">
                          {isHindi ? "तत्काल" : "Instant"}
                        </span>
                      </div>
                      <p className="text-[11px] text-spice-muted mt-0.5">
                        {dict.checkout.secureNotice}
                      </p>
                    </div>
                  </div>
                  <CreditCard className="h-5 w-5 text-primary hidden sm:block" />
                </label>

                <label
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5 shadow-xs"
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
                        {dict.checkout.codPayment}
                      </p>
                      <p className="text-[11px] text-spice-muted mt-0.5">
                        {isHindi
                          ? "घर पर डिलीवरी के समय नकद या UPI द्वारा भुगतान करें।"
                          : "Pay cash or UPI upon delivery at your doorstep."}
                      </p>
                    </div>
                  </div>
                  <Banknote className="h-5 w-5 text-secondary hidden sm:block" />
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-spice-muted hover:text-spice-dark"
                >
                  {isHindi ? "वापस डिलीवरी पर जाएं" : "Back to Delivery"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Order Summary & Coupon Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-base font-bold text-spice-dark border-b border-cream-200 pb-3">
              {dict.cart.orderSummary} ({items.reduce((s, i) => s + i.quantity, 0)} {isHindi ? "मसाले" : "items"})
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-spice-dark truncate font-serif">
                      {isHindi && item.nameHi ? item.nameHi : item.name}
                    </p>
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

            {/* Coupon Engine Input */}
            <div className="border-t border-cream-200 pt-4 space-y-2">
              <label className="block text-xs font-bold text-spice-dark flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>{dict.cart.couponCode}</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-secondary/10 border border-secondary/20 p-2.5 text-xs text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>
                      <strong>{appliedCoupon.code}</strong> {isHindi ? "लागू (-" : "applied (-"}
                      {formatPrice(appliedCoupon.discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-secondary/20 rounded text-secondary"
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
                    className="flex-1 rounded-xl border border-cream-300 px-3 py-2 text-xs uppercase text-spice-dark focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {couponLoading ? "..." : dict.cart.apply}
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
            <div className="border-t border-cream-200 pt-3 space-y-2 text-xs text-spice-muted">
              <div className="flex justify-between">
                <span>{dict.cart.subtotal}</span>
                <span className="font-semibold text-spice-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{dict.cart.shipping}</span>
                <span className="font-semibold text-spice-dark">
                  {shippingFee === 0 ? (
                    <span className="text-secondary font-bold">{dict.cart.freeShipping}</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>{isHindi ? "कूपन छूट" : "Coupon Savings"} ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-spice-dark pt-2 border-t border-cream-200">
                <span>{dict.cart.total}</span>
                <span className="text-primary font-display text-xl">{formatPrice(finalAmount)}</span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-white hover:bg-primary-dark shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing
                ? isHindi
                  ? "ऑर्डर की पुष्टि की जा रही है..."
                  : "Authorizing Secure Order..."
                : `${dict.checkout.placeOrder} • ${formatPrice(finalAmount)}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-spice-muted pt-1">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>
                {isHindi
                  ? "256-बिट SSL सुरक्षित चेकआउट • 100% शुद्धता गारंटी"
                  : "SSL 256-Bit Encrypted • Farm Guaranteed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
