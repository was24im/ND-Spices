"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Copy,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Filter,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

interface MediaAssetItem {
  id: string;
  title: string;
  url: string;
  type: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = ["all", "products", "banners", "homepage", "logos", "terroirs"];

export default function MediaManagerPage() {
  const { addToast } = useToastStore();
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Add Asset Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: "",
    url: "",
    category: "products",
    type: "IMAGE",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast(`Media asset "${newAsset.title}" added!`, "success");
      setIsModalOpen(false);
      setNewAsset({
        title: "",
        url: "",
        category: "products",
        type: "IMAGE",
      });
      fetchMedia();
    } catch (err: any) {
      addToast(err.message || "Failed to add media", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string, title: string) => {
    if (!confirm(`Delete media asset "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast(`Asset "${title}" deleted.`, "info");
        fetchMedia();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to delete asset", "error");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast("Image URL copied to clipboard!", "info");
  };

  const filteredAssets = assets.filter((a) => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Centralized Media &amp; Asset Library
            </h1>
            <span className="rounded-full bg-cream-200 text-charcoal px-3 py-1 text-xs font-bold">
              {assets.length} Assets
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage high-resolution photography, harvest terroirs, banners, and logos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cinnamon px-5 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 shadow-spice-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Media Asset
        </button>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2 text-xs focus:border-cinnamon focus:outline-none focus:ring-1 focus:ring-cinnamon shadow-spice-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-charcoal text-white shadow-spice-sm"
                  : "bg-white text-muted-foreground border border-cream-300 hover:border-cinnamon hover:text-cinnamon"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading asset library from Neon DB...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <ImageIcon className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No media assets found</h3>
          <p className="text-xs text-muted-foreground">
            Register image URLs to use across products, hero banners, and terroir stories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-spice-sm hover:border-cinnamon-300 transition-all flex flex-col"
            >
              <div className="relative aspect-square w-full bg-cream-100 overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 rounded-md bg-charcoal/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  {asset.category}
                </span>
              </div>

              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-serif text-xs font-bold text-charcoal truncate">
                    {asset.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground block truncate font-mono">
                    {asset.url}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                  <button
                    onClick={() => copyUrl(asset.url)}
                    className="inline-flex items-center gap-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal px-2 py-1 text-[11px] font-bold transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy URL</span>
                  </button>

                  <button
                    onClick={() => handleDeleteAsset(asset.id, asset.title)}
                    className="p-1 text-muted-foreground hover:text-red-600 rounded-md"
                    title="Delete asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
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
              <span className="rounded-full bg-cinnamon-100 text-cinnamon text-[10px] font-bold px-3 py-1">
                Asset Vault
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-charcoal mt-2">
                Register Media Asset
              </h2>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Pods Macro Shot"
                  value={newAsset.title}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Image / Media URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newAsset.url}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Category</label>
                <select
                  value={newAsset.category}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                >
                  <option value="products">Products</option>
                  <option value="banners">Banners</option>
                  <option value="homepage">Homepage Hero</option>
                  <option value="logos">Logos &amp; Icons</option>
                  <option value="terroirs">Terroirs &amp; Estates</option>
                </select>
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
                  {submitting ? "Saving..." : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
