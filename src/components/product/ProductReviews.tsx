"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  initialRating?: number;
  initialNumReviews?: number;
}

export default function ProductReviews({
  productId,
  productName,
  initialRating = 4.9,
  initialNumReviews = 0,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const { addToast } = useToastStore();

  const [reviews, setReviews] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalReviews: initialNumReviews,
    averageRating: initialRating,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      addToast("Please sign in to share your spice review.", "warning");
      return;
    }

    if (!comment.trim()) {
      addToast("Please write a few words about your experience.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      addToast("Your review has been submitted successfully!", "success");
      setComment("");
      setIsModalOpen(false);
      fetchReviews();
    } catch (err: any) {
      addToast(err.message || "Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    addToast("Thank you for your feedback!", "info");
  };

  const filteredReviews = selectedStarFilter
    ? reviews.filter((r) => r.rating === selectedStarFilter)
    : reviews;

  return (
    <div id="reviews" className="space-y-8 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
            Customer Reviews &amp; Ratings
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real taste reviews from verified culinary chefs and spice enthusiasts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Write a Review
        </button>
      </div>

      {/* Aggregate Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm">
        {/* Big Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-cream-200">
          <div className="font-serif text-5xl sm:text-6xl font-extrabold text-charcoal font-display">
            {metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "5.0"}
          </div>
          <div className="flex items-center gap-1 mt-2 text-turmeric-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(metrics.averageRating)
                    ? "fill-turmeric-500 text-turmeric-500"
                    : "text-cream-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-2">
            Based on <strong>{metrics.totalReviews || reviews.length}</strong> verified reviews
          </p>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cardamom-100 text-cardamom text-[11px] font-bold px-3 py-1 mt-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            98% Recommend This Harvest
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2 p-2 sm:p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-bold text-charcoal">Rating Breakdown</span>
            {selectedStarFilter && (
              <button
                onClick={() => setSelectedStarFilter(null)}
                className="text-cinnamon font-bold hover:underline"
              >
                Clear filter ({selectedStarFilter}★)
              </button>
            )}
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = metrics.breakdown[star] || 0;
            const percentage =
              metrics.totalReviews > 0 ? (count / metrics.totalReviews) * 100 : star === 5 ? 85 : 15;

            return (
              <button
                key={star}
                onClick={() =>
                  setSelectedStarFilter(selectedStarFilter === star ? null : star)
                }
                className={`w-full flex items-center gap-3 group text-left rounded-lg px-2 py-1 transition-colors ${
                  selectedStarFilter === star ? "bg-cream-200" : "hover:bg-cream-100"
                }`}
              >
                <div className="flex items-center gap-1 w-12 text-xs font-bold text-charcoal">
                  <span>{star}</span>
                  <Star className="h-3.5 w-3.5 fill-turmeric-500 text-turmeric-500" />
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full bg-turmeric-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-10 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading authentic customer reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-10 text-center space-y-3">
          <MessageSquare className="h-10 w-10 text-cream-400 mx-auto" />
          <h4 className="font-serif text-base font-bold text-charcoal">
            {selectedStarFilter
              ? `No ${selectedStarFilter}-star reviews yet`
              : "No reviews yet for this harvest"}
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Be the first to share your aroma profile, culinary pairing, and freshness verdict!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-cinnamon px-5 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm"
          >
            Review This Spice
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const votes = helpfulVotes[rev.id] || 0;
            return (
              <div
                key={rev.id}
                className="rounded-3xl border border-cream-200 bg-white p-6 shadow-spice-sm space-y-3 hover:border-cream-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-cinnamon-100 text-cinnamon font-bold flex items-center justify-center text-xs">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-charcoal">
                          {rev.user?.name || "Verified Customer"}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cardamom-50 border border-cardamom-200 text-cardamom text-[10px] font-bold px-2 py-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified Harvest Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-turmeric-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= rev.rating
                            ? "fill-turmeric-500 text-turmeric-500"
                            : "text-cream-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-cream-100 text-xs text-muted-foreground">
                  <span className="text-[11px]">Heritage single-origin batch</span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cream-200 px-3 py-1 hover:bg-cream-100 hover:text-charcoal transition-colors font-medium text-[11px]"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>Helpful ({votes > 0 ? votes : "0"})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-cinnamon-100 text-cinnamon text-[10px] font-bold px-3 py-1">
                Authentic Feedback
              </span>
              <h3 className="font-serif text-xl font-extrabold text-charcoal mt-2">
                Review {productName}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Rate your aroma, potency, and culinary experience with this harvest.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          s <= (hoverRating || rating)
                            ? "fill-turmeric-500 text-turmeric-500"
                            : "text-cream-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-charcoal ml-2">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Your Spice Notes &amp; Review
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the aroma intensity, freshness, how you used it (e.g. Biryani, Chai, Curry), and overall verdict..."
                  className="w-full rounded-xl border border-cream-300 p-3 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-cream-300 px-4 py-2.5 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cinnamon px-6 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
