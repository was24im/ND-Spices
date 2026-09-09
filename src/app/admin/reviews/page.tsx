"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string; images: string[] };
  user: { id: string; name: string; email: string };
}

export default function ReviewModerationPage() {
  const { addToast } = useToastStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (reviewId: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast(
        isApproved ? "Review approved for public display." : "Review hidden from storefront.",
        "success"
      );
      fetchReviews();
    } catch (err: any) {
      addToast(err.message || "Failed to update review status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this customer review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast("Review deleted.", "info");
        fetchReviews();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to delete review", "error");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "APPROVED") return r.isApproved;
    if (statusFilter === "PENDING") return !r.isApproved;
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Review Moderation &amp; Quality Control
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {reviews.length} Total Reviews
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Moderate customer harvest feedback, approve verified chef reviews, and prevent spam.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews by spice name, customer, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["ALL", "APPROVED", "PENDING"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-charcoal text-white shadow-spice-sm"
                  : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon"
              }`}
            >
              {st === "ALL" ? "All Reviews" : st === "APPROVED" ? "Approved Only" : "Hidden / Flagged"}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Star className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No reviews found</h3>
          <p className="text-xs text-muted-foreground">
            No customer ratings match the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const mainImage = rev.product?.images?.[0] || "/images/placeholder.jpg";
            return (
              <div
                key={rev.id}
                className={`rounded-3xl border p-6 bg-white shadow-spice-sm space-y-3 transition-all ${
                  rev.isApproved ? "border-cream-300" : "border-amber-300 bg-amber-50/20"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-cream-200 bg-cream-100 flex-shrink-0">
                      <Image
                        src={mainImage}
                        alt={rev.product?.name || "Spice"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${rev.product?.slug}`}
                        target="_blank"
                        className="font-serif font-bold text-charcoal hover:text-cinnamon text-sm"
                      >
                        {rev.product?.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        Reviewed by <strong>{rev.user?.name}</strong> ({rev.user?.email}) &bull;{" "}
                        {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-turmeric-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= rev.rating ? "fill-turmeric-500" : "text-cream-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {rev.isApproved ? (
                        <button
                          onClick={() => handleToggleApproval(rev.id, false)}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-2.5 py-1 text-xs font-bold hover:bg-amber-100"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Hide Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleApproval(rev.id, true)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold hover:bg-emerald-700 shadow-spice-sm"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Approve Review</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-charcoal bg-cream-100/60 p-3 rounded-2xl border border-cream-200">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-cardamom font-bold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified Harvest Purchase</span>
                      </span>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      rev.isApproved
                        ? "bg-cardamom-100 text-cardamom"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rev.isApproved ? "Publicly Visible" : "Pending Approval"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
