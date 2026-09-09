"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, Sparkles, ArrowRight, Flame } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? MOCK_PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  const popularSearches = [
    "Red Chilli Powder",
    "Alleppey Cardamom",
    "Coriander Powder",
    "Tellicherry Pepper",
    "Lakadong Turmeric",
    "Royal Garam Masala",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-cream-300 bg-[#FDFBF7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Header Bar */}
        <div className="flex items-center border-b border-cream-300 px-4 sm:px-6 py-4 bg-white">
          <Search className="h-5 w-5 text-cinnamon flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search single-origin spices, origins (e.g. Nagaur, Idukki, Cardamom)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onClose();
                router.push(`/products?search=${encodeURIComponent(query.trim())}`);
              }
            }}
            className="flex-1 bg-transparent text-sm sm:text-base text-charcoal placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-charcoal mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-cream-200 px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-cream-300"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-5">
          {query.trim() === "" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-turmeric" />
                <span>Popular Harvest Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs font-semibold text-charcoal hover:border-cinnamon hover:text-cinnamon transition-colors shadow-xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="font-serif text-base font-bold text-charcoal">No spices matching "{query}"</p>
              <p className="text-xs text-muted-foreground">
                Try searching for "Cardamom", "Red Chilli", "Turmeric", or "Pepper".
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Found {filteredProducts.length} single-origin products</span>
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="font-bold text-cinnamon hover:underline flex items-center gap-1"
                >
                  <span>View full results</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-cream-200 rounded-2xl border border-cream-300 bg-white overflow-hidden shadow-xs">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 hover:bg-cream-100/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                        <Image
                          src={product.images[0]?.url || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal group-hover:text-cinnamon transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3 text-cinnamon" />
                            {product.origin}
                          </span>
                          <span>•</span>
                          <span className="text-cardamom font-medium">{product.variants[0]?.weight}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-display font-extrabold text-sm text-charcoal">
                        {formatPrice(product.variants[0]?.price || 0)}
                      </p>
                      <span className="text-[10px] text-secondary font-bold">In Stock</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
