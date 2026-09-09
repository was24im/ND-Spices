"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Save,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

export default function AdminInventoryPage() {
  const { addToast } = useToastStore();
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "LOW" | "OUT">("ALL");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.success) {
        setVariants(data.variants || []);
      }
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (variantId: string, newQty: number) => {
    if (newQty < 0) return;
    setSavingId(variantId);

    // Optimistic UI update
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, stockQuantity: newQty } : v))
    );

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stockQuantity: newQty }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update stock");
      }

      addToast("Stock quantity updated.", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update stock", "error");
      fetchInventory(); // rollback
    } finally {
      setSavingId(null);
    }
  };

  const lowStockCount = variants.filter((v) => v.stockQuantity > 0 && v.stockQuantity < 20).length;
  const outOfStockCount = variants.filter((v) => v.stockQuantity === 0).length;

  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.weight.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (stockFilter === "LOW") return v.stockQuantity > 0 && v.stockQuantity < 20;
    if (stockFilter === "OUT") return v.stockQuantity === 0;
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Real-Time Stock &amp; Inventory Hub
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {variants.length} SKUs Tracked
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time warehouse stock units with instantaneous inline adjustments.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStockFilter("ALL")}
          className={`rounded-2xl border p-4 text-left transition-all shadow-spice-sm ${
            stockFilter === "ALL"
              ? "border-charcoal bg-charcoal text-white"
              : "border-cream-300 bg-white hover:border-cream-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total SKUs</span>
            <Boxes className="h-4 w-4" />
          </div>
          <p className="font-display text-2xl font-black">{variants.length}</p>
          <span className="text-[11px] opacity-80">All package sizes &amp; weights</span>
        </button>

        <button
          onClick={() => setStockFilter("LOW")}
          className={`rounded-2xl border p-4 text-left transition-all shadow-spice-sm ${
            stockFilter === "LOW"
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-amber-200 bg-amber-50/70 hover:border-amber-300 text-amber-900"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warning</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="font-display text-2xl font-black">{lowStockCount}</p>
          <span className="text-[11px] opacity-80">&lt; 20 units remaining (Restock soon)</span>
        </button>

        <button
          onClick={() => setStockFilter("OUT")}
          className={`rounded-2xl border p-4 text-left transition-all shadow-spice-sm ${
            stockFilter === "OUT"
              ? "border-red-600 bg-red-600 text-white"
              : "border-red-200 bg-red-50/70 hover:border-red-300 text-red-900"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <p className="font-display text-2xl font-black">{outOfStockCount}</p>
          <span className="text-[11px] opacity-80">Requires harvest replenishment</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by SKU code, spice harvest name, or package weight..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
        />
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Syncing warehouse SKU stock levels...</p>
        </div>
      ) : filteredVariants.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Boxes className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No SKUs match criteria</h3>
          <p className="text-xs text-muted-foreground">
            Clear your search filter or view all SKUs.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-spice-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Spice Product</th>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Pack Weight</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Health</th>
                  <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredVariants.map((variant) => {
                  const product = variant.product;
                  const mainImage = product?.images?.[0] || "/images/placeholder.jpg";
                  const isLow = variant.stockQuantity > 0 && variant.stockQuantity < 20;
                  const isOut = variant.stockQuantity === 0;

                  return (
                    <tr key={variant.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-cream-200 bg-cream-100">
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
                              {product?.name || "Spice Product"}
                            </Link>
                            <p className="text-[10px] text-muted-foreground">
                              {product?.category?.name || "Category"} &bull; {product?.origin}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                        {variant.sku}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-charcoal">
                        {variant.weight}
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-charcoal">
                        {formatPrice(Number(variant.price))}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            isOut
                              ? "bg-red-50 border-red-200 text-red-700"
                              : isLow
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {isOut ? (
                            <AlertCircle className="h-3 w-3" />
                          ) : isLow ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          <span>
                            {isOut
                              ? "Out of Stock"
                              : isLow
                              ? `Low Stock (${variant.stockQuantity} left)`
                              : `In Stock (${variant.stockQuantity} units)`}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-cream-100 border border-cream-300 rounded-xl p-1">
                          <button
                            onClick={() =>
                              handleUpdateStock(variant.id, Math.max(0, variant.stockQuantity - 1))
                            }
                            disabled={variant.stockQuantity === 0 || savingId === variant.id}
                            className="p-1 rounded-lg bg-white border border-cream-200 text-charcoal hover:bg-cream-200 disabled:opacity-40"
                            title="Decrement stock by 1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={variant.stockQuantity}
                            onChange={(e) =>
                              handleUpdateStock(
                                variant.id,
                                Math.max(0, parseInt(e.target.value) || 0)
                              )
                            }
                            className="w-14 text-center font-bold text-xs bg-transparent focus:outline-none"
                          />

                          <button
                            onClick={() =>
                              handleUpdateStock(variant.id, variant.stockQuantity + 5)
                            }
                            disabled={savingId === variant.id}
                            className="px-1.5 py-1 rounded-lg bg-white border border-cream-200 text-charcoal hover:bg-cream-200 text-[10px] font-bold"
                            title="Quick restock +5 units"
                          >
                            +5
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateStock(variant.id, variant.stockQuantity + 20)
                            }
                            disabled={savingId === variant.id}
                            className="px-1.5 py-1 rounded-lg bg-cardamom text-white hover:bg-cardamom-600 text-[10px] font-bold"
                            title="Quick restock +20 units"
                          >
                            +20
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
