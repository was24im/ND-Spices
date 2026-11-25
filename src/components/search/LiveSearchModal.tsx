"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "@/store/useLanguageStore";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const router = useRouter();
  const { isHindi, t } = useTranslation();
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
          ((p as any).nameHi && (p as any).nameHi.toLowerCase().includes(q)) ||
          p.origin.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  const popularSearches = [
    "Kashmiri Dabi",
    "Teja Red Chilli Powder",
    "Coriander Seeds",
    "Turmeric Finger",
    "Kasuri Methi",
    "Jeera",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-[#2B140E]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-xl border border-[#E8E1DD] bg-white shadow-spice-lg overflow-hidden">
        <div className="flex items-center border-b border-[#E8E1DD] px-4 py-3.5 bg-white">
          <Search className="h-4 w-4 text-[#6E5A54] flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onClose();
                router.push(`/products?search=${encodeURIComponent(query.trim())}`);
              }
            }}
            className="flex-1 bg-transparent text-sm text-[#2B140E] placeholder:text-[#6E5A54]/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[#6E5A54] hover:text-[#2B140E] mr-2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#E8E1DD] bg-[#FAF8F6] px-2 py-0.5 text-[11px] font-medium text-[#2B140E]"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4">
          {query.trim() === "" ? (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E5A54]">
                {isHindi ? "प्रमुख खोज" : "Popular Searches"}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-lg border border-[#E8E1DD] bg-[#FAF8F6] px-3 py-1.5 text-xs text-[#2B140E] hover:border-[#3D1E16] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 space-y-1">
              <p className="font-serif text-sm font-semibold text-[#2B140E]">
                {isHindi ? `"${query}" के लिए कोई मसाला नहीं मिला` : `No spices matching "${query}"`}
              </p>
              <p className="text-xs text-[#6E5A54]">
                {isHindi ? "लाल मिर्च, हल्दी, धनिया, जीरा खोजें।" : "Try searching for Red Chilli, Coriander, Turmeric, or Jeera."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E5A54]">
                <span>{filteredProducts.length} {isHindi ? "परिणाम" : "results"}</span>
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="font-medium text-[#3D1E16] hover:underline flex items-center gap-1"
                >
                  <span>{isHindi ? "सभी देखें" : "View all"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-[#E8E1DD] rounded-lg border border-[#E8E1DD] bg-white overflow-hidden">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 hover:bg-[#FAF8F6] transition-colors"
                  >
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[#FAF8F6] flex-shrink-0">
                      <Image
                        src={product.images[0]?.url || "/images/categories/whole-red-chilli.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[#2B140E] truncate">
                        {isHindi && (product as any).nameHi ? (product as any).nameHi : product.name}
                      </p>
                      <p className="text-[11px] text-[#6E5A54] truncate">
                        {isHindi && (product as any).originHi ? (product as any).originHi : product.origin}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#2B140E]">
                      {formatPrice(product.variants[0]?.price || 45)}
                    </span>
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
