"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Percent,
  CheckCircle2,
  X,
  RotateCcw,
  Copy,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

interface CouponFormData {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  validUntil: string;
  usageLimit: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const { addToast } = useToastStore();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderAmount: 499,
    maxDiscount: 200,
    validUntil: "2026-12-31",
    usageLimit: 500,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create coupon");
      }

      addToast(`Promo Code "${formData.code}" created successfully!`, "success");
      setIsModalOpen(false);
      setFormData({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderAmount: 499,
        maxDiscount: 200,
        validUntil: "2026-12-31",
        usageLimit: 500,
        isActive: true,
      });
      fetchCoupons();
    } catch (err: any) {
      addToast(err.message || "Failed to create coupon", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon code ${code}?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Coupon "${code}" deleted.`, "info");
        fetchCoupons();
      }
    } catch (err: any) {
      addToast(err.message || "Failed to delete coupon", "error");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast(`Code ${code} copied to clipboard!`, "info");
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Coupons &amp; Promotional Discounts
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {coupons.length} Promo Codes
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Create percentage discounts, fixed order credits, minimum order thresholds, and expiry caps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Promo Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading promotion engine data...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Tag className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No promotional coupons</h3>
          <p className="text-xs text-muted-foreground">
            Create your first promotional discount coupon for spice lovers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => {
            const isPercent = c.discountPercent != null;
            const discountDisplay = isPercent
              ? `${c.discountPercent}% Off`
              : `${formatPrice(Number(c.discountAmount || 0))} Flat Off`;

            return (
              <div
                key={c.id}
                className="relative overflow-hidden rounded-3xl border border-cream-300 bg-white p-6 shadow-spice-sm hover:border-cinnamon-300 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-turmeric-100 text-turmeric-800 flex items-center justify-center font-bold font-serif text-sm">
                      {isPercent ? `${c.discountPercent}%` : "₹"}
                    </div>
                    <div>
                      <button
                        onClick={() => copyCode(c.code)}
                        className="font-mono text-base font-extrabold text-charcoal hover:text-cinnamon flex items-center gap-1 group"
                      >
                        <span>{c.code}</span>
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <span className="text-[10px] text-muted-foreground">
                        {discountDisplay}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Delete coupon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-2xl bg-cream-100/60 p-3 text-xs space-y-1.5 border border-cream-200">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Min Order Spend:</span>
                    <span className="font-bold text-charcoal font-display">
                      {formatPrice(Number(c.minOrderValue || 0))}
                    </span>
                  </div>
                  {c.maxDiscount && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Max Savings Cap:</span>
                      <span className="font-bold text-charcoal font-display">
                        {formatPrice(Number(c.maxDiscount))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Usage Count:</span>
                    <span className="font-bold text-charcoal">
                      {c.usageCount || 0} / {c.usageLimit || "∞"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {c.expiresAt
                      ? `Expires ${new Date(c.expiresAt).toLocaleDateString("en-IN")}`
                      : "No Expiration Date"}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      c.isActive
                        ? "bg-cardamom-100 text-cardamom"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.isActive ? "Active in Checkout" : "Disabled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-turmeric-100 text-turmeric-800 text-[10px] font-bold px-3 py-1">
                Marketing &amp; Promotions
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-charcoal mt-2">
                Create Promo Coupon
              </h2>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HERITAGE20, KERALAFRESH"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountType: e.target.value as any,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Min Order Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minOrderAmount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Max Savings Cap (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.maxDiscount ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxDiscount: e.target.value ? parseFloat(e.target.value) : null,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, validUntil: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Usage Cap Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usageLimit: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-cream-300 px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm"
                >
                  {submitting ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
