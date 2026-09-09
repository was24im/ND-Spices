"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Calendar,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type OrderStatusType = "ALL" | "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatusType>("ALL");

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;
    return order.orderStatus === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            <Truck className="h-3.5 w-3.5 text-blue-600" />
            Shipped & In Transit
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Farm Packaged / Processing
          </span>
        );
      case "PLACED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1 text-xs font-bold text-charcoal border border-cream-400">
            <Package className="h-3.5 w-3.5 text-cinnamon" />
            Order Placed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            <AlertCircle className="h-3.5 w-3.5 text-red-600" />
            Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-muted-foreground">{status}</span>;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cinnamon border-t-transparent" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Loading Your Spice Orders...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-cream-200 text-cinnamon flex items-center justify-center mx-auto">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Sign in to view orders</h1>
        <p className="text-xs text-muted-foreground">
          Please log into your ND Spices account to view order history and track shipments.
        </p>
        <Link
          href="/login?callbackUrl=/orders"
          className="inline-block rounded-xl bg-cinnamon px-6 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50/50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link href="/" className="hover:text-cinnamon">
                Home
              </Link>
              <span>/</span>
              <Link href="/account" className="hover:text-cinnamon">
                Account
              </Link>
              <span>/</span>
              <span className="font-semibold text-charcoal">Order History</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-charcoal">My Spice Orders</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Track farm-to-kitchen shipments, review harvests, and download official invoices.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
          >
            Explore Harvests
          </Link>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(["ALL", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatusType[]).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-charcoal text-white shadow-spice-sm"
                    : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon hover:text-cinnamon"
                }`}
              >
                {filter === "ALL" ? "All Orders" : filter.charAt(0) + filter.slice(1).toLowerCase()}
                {filter === "ALL" && orders.length > 0 && ` (${orders.length})`}
              </button>
            )
          )}
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-4 shadow-spice-sm">
            <div className="h-16 w-16 rounded-full bg-cream-100 text-cinnamon flex items-center justify-center mx-auto">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">No orders found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {activeFilter === "ALL"
                ? "You have not placed any spice orders yet. Start your journey with our single-origin harvests."
                : `No orders currently match the status "${activeFilter}".`}
            </p>
            <Link
              href="/products"
              className="inline-block rounded-xl bg-cinnamon px-6 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
            >
              Browse Spice Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-spice-sm transition-all hover:border-cinnamon-300"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-200 bg-cream-100/50 p-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Order Number
                      </span>
                      <span className="font-mono font-bold text-charcoal">#{order.orderNumber}</span>
                    </div>
                    <div className="h-6 w-px bg-cream-300 hidden sm:block" />
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Date Placed
                      </span>
                      <span className="font-medium text-charcoal">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-cream-300 hidden sm:block" />
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Total Amount
                      </span>
                      <span className="font-bold text-charcoal font-display">
                        {formatPrice(Number(order.finalAmount))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-charcoal px-4 py-2 text-xs font-bold text-white hover:bg-charcoal/80 transition-all shadow-spice-sm"
                    >
                      <span>Track & Invoice</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 divide-y divide-cream-100">
                  {order.orderItems?.map((item: any) => {
                    const product = item.productVariant?.product;
                    const mainImage = product?.images?.[0] || "/images/placeholder.jpg";
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-cream-200 bg-cream-100">
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
                              className="font-serif text-sm font-bold text-charcoal hover:text-cinnamon transition-colors line-clamp-1"
                            >
                              {product?.name || "Single-Origin Spice"}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              Package: <span className="font-semibold">{item.productVariant?.weight}</span> &bull;
                              Qty: <span className="font-semibold">{item.quantity}</span>
                            </p>
                            <p className="text-xs font-bold text-charcoal font-display mt-0.5">
                              {formatPrice(Number(item.totalPrice))}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${product?.slug}`}
                            className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-cream-100 transition-colors"
                          >
                            Buy Again
                          </Link>
                          {order.orderStatus === "DELIVERED" && (
                            <Link
                              href={`/products/${product?.slug}#reviews`}
                              className="rounded-lg bg-turmeric-100 border border-turmeric-300 text-charcoal px-3 py-1.5 text-xs font-bold hover:bg-turmeric-200 transition-colors"
                            >
                              Write Review ★
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
