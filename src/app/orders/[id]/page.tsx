"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ArrowLeft,
  MapPin,
  CreditCard,
  Download,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const STAGES = [
  { key: "PLACED", label: "Order Placed", desc: "Harvest verified & queued" },
  { key: "PROCESSING", label: "Farm Packaged", desc: "Sealed at Kerala estate" },
  { key: "SHIPPED", label: "In Transit", desc: "Handed to courier partner" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Arriving at your doorstep" },
  { key: "DELIVERED", label: "Delivered", desc: "Delivered & fresh" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case "PLACED":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cinnamon border-t-transparent" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Retrieving Order Details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Order Not Found</h1>
        <p className="text-xs text-muted-foreground">
          We could not locate order details for <strong>#{orderId}</strong>.
        </p>
        <Link
          href="/orders"
          className="inline-block rounded-xl bg-cinnamon px-6 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStageIdx = getStageIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "CANCELLED";

  return (
    <div className="min-h-screen bg-cream-50/50 py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 print:p-0">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-cinnamon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm transition-all"
            >
              <Printer className="h-4 w-4 text-cinnamon" />
              Print / Save Invoice
            </button>
            <Link
              href="/products"
              className="rounded-xl bg-cinnamon px-4 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
            >
              Shop More Spices
            </Link>
          </div>
        </div>

        {/* Order Header Card */}
        <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm print:border-none print:shadow-none print:p-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-200 pb-6">
            <div>
              <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                Official Tax Invoice
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal mt-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Total Amount Paid
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal font-display">
                {formatPrice(Number(order.finalAmount))}
              </span>
              <span className="block text-[11px] font-medium text-cardamom mt-0.5">
                Payment: {order.paymentMethod === "RAZORPAY" ? "Paid via Razorpay" : "Cash on Delivery (COD)"}
              </span>
            </div>
          </div>

          {/* Visual Progress Tracker (Hide in print) */}
          {!isCancelled && (
            <div className="pt-8 pb-4 print:hidden">
              <h3 className="font-serif text-sm font-bold text-charcoal mb-6">
                Live Shipment Tracker
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-6 right-6 hidden sm:block h-1 bg-cream-200 -z-0">
                  <div
                    className="h-full bg-cardamom transition-all duration-500"
                    style={{
                      width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div
                        key={stage.key}
                        className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                      >
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                            isCompleted
                              ? "bg-cardamom text-white ring-4 ring-cardamom-100"
                              : "bg-cream-200 text-muted-foreground border border-cream-300"
                          } ${isCurrent ? "animate-pulse" : ""}`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                        </div>
                        <div className="text-left sm:text-center">
                          <p
                            className={`text-xs font-bold ${
                              isCompleted ? "text-charcoal" : "text-muted-foreground"
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground hidden sm:block">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking info note */}
              <div className="mt-8 rounded-2xl bg-cream-100/70 p-4 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-cinnamon flex-shrink-0" />
                  <div>
                    <p className="font-bold text-charcoal">
                      Carrier: BlueDart Express &bull; Tracking ID:{" "}
                      <span className="font-mono text-cinnamon font-bold">
                        ND-BLD{order.orderNumber.replace(/[^0-9]/g, "")}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Single-origin harvest hermetically sealed at Wayanad Estate Hub.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-cardamom-100 text-cardamom font-bold px-3 py-1 text-[11px]">
                  Estimated Delivery: 2-3 Business Days
                </span>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="my-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs text-red-700">
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-[11px] mt-1">
                If payment was already deducted, your refund will be credited to your original payment method in 3-5 business days.
              </p>
            </div>
          )}

          {/* Itemized Products Table */}
          <div className="mt-8 border-t border-cream-200 pt-6">
            <h3 className="font-serif text-sm font-bold text-charcoal mb-4">
              Harvest Items Ordered
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-200 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                    <th className="pb-3">Product & Origin</th>
                    <th className="pb-3 text-center">Package Size</th>
                    <th className="pb-3 text-center">Quantity</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {order.orderItems?.map((item: any) => {
                    const product = item.productVariant?.product;
                    const mainImage = product?.images?.[0] || "/images/placeholder.jpg";
                    return (
                      <tr key={item.id} className="hover:bg-cream-50/50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-cream-200 bg-cream-100 print:hidden">
                              <Image
                                src={mainImage}
                                alt={product?.name || "Spice Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/products/${product?.slug}`}
                                className="font-serif font-bold text-charcoal hover:text-cinnamon transition-colors"
                              >
                                {product?.name || "Pure Spice Harvest"}
                              </Link>
                              <p className="text-[11px] text-muted-foreground">
                                Origin: {product?.origin || "Kerala, India"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center font-medium">{item.productVariant?.weight}</td>
                        <td className="py-4 text-center font-bold">{item.quantity}</td>
                        <td className="py-4 text-right font-display text-muted-foreground">
                          {formatPrice(Number(item.unitPrice))}
                        </td>
                        <td className="py-4 text-right font-bold text-charcoal font-display">
                          {formatPrice(Number(item.totalPrice))}
                        </td>
                        <td className="py-4 text-right print:hidden">
                          <Link
                            href={`/products/${product?.slug}#reviews`}
                            className="inline-flex items-center gap-1 rounded-lg bg-turmeric-100 border border-turmeric-300 text-charcoal px-2.5 py-1 text-[11px] font-bold hover:bg-turmeric-200 transition-colors"
                          >
                            <Star className="h-3 w-3 text-turmeric-700 fill-turmeric-600" />
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing & Billing Summary */}
          <div className="mt-8 border-t border-cream-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Shipping Destination
                </h4>
                <div className="rounded-2xl border border-cream-200 bg-cream-100/40 p-4 text-xs space-y-1">
                  <p className="font-bold text-charcoal">
                    {order.user?.name || "Valued Spice Connoisseur"}
                  </p>
                  <p className="text-muted-foreground">
                    {order.user?.email} &bull; {order.user?.phone || "+91 98765 43210"}
                  </p>
                  <p className="text-muted-foreground">
                    Standard Express &bull; Verified Farm Delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-cardamom text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>100% Single-Origin Pure Harvest Guarantee</span>
              </div>
            </div>

            {/* Financial Totals */}
            <div className="rounded-2xl bg-cream-100/60 p-4 sm:p-6 border border-cream-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold font-display text-charcoal">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>

              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-cardamom font-medium">
                  <span>Promotional Discount</span>
                  <span className="font-bold font-display">
                    -{formatPrice(Number(order.discountAmount))}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping & Heritage Packaging</span>
                <span className="font-bold font-display text-charcoal">
                  {Number(order.shippingFee) === 0 ? "FREE" : formatPrice(Number(order.shippingFee))}
                </span>
              </div>

              <div className="border-t border-cream-300 pt-2.5 flex justify-between text-sm font-bold text-charcoal">
                <span>Grand Total</span>
                <span className="font-serif text-lg text-cinnamon font-display">
                  {formatPrice(Number(order.finalAmount))}
                </span>
              </div>

              <div className="pt-2 text-[10px] text-muted-foreground text-right">
                All prices inclusive of applicable GST (Goods and Services Tax).
              </div>
            </div>
          </div>

          {/* Invoice Print Footer */}
          <div className="mt-12 hidden print:block border-t border-cream-300 pt-6 text-center text-xs text-muted-foreground">
            <p className="font-bold text-charcoal">ND Spices Heritage Pvt. Ltd.</p>
            <p>Single-Origin Spice Estates: Wayanad, Idukki (Kerala) &amp; Pampore (Kashmir)</p>
            <p>GSTIN: 32AABCU9603R1ZM &bull; FSSAI Lic: 11321004000182</p>
            <p className="text-[10px] mt-2">Thank you for supporting ethical, single-origin Indian spice farming.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
