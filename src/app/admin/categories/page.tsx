"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

interface CategoryItem {
  id: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  description?: string | null;
  descriptionHi?: string | null;
  image?: string | null;
  displayOrder?: number;
  order?: number;
  _count?: {
    products: number;
  };
}

const IMAGE_PRESETS = [
  { label: "Whole Red Chilli", url: "/images/categories/whole-red-chilli.jpg" },
  { label: "Red Chilli Powder", url: "/images/categories/red-chilli-powder.jpg" },
  { label: "Coriander Seeds", url: "/images/categories/coriander-seeds.jpg" },
  { label: "Coriander Powder", url: "/images/categories/coriander-powder.jpg" },
  { label: "Turmeric Finger", url: "/images/categories/turmeric-finger.jpg" },
  { label: "Turmeric Powder", url: "/images/categories/turmeric-powder.jpg" },
  { label: "Kasuri Methi", url: "/images/categories/kasuri-methi.jpg" },
  { label: "Jeera", url: "/images/categories/jeera.jpg" },
];

export default function AdminCategoriesPage() {
  const { addToast } = useToastStore();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    nameHi: "",
    slug: "",
    description: "",
    descriptionHi: "",
    image: "/images/categories/whole-red-chilli.jpg",
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      addToast("Failed to fetch categories from database", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      nameHi: "",
      slug: "",
      description: "",
      descriptionHi: "",
      image: "/images/categories/whole-red-chilli.jpg",
      order: categories.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameHi: category.nameHi || "",
      slug: category.slug,
      description: category.description || "",
      descriptionHi: category.descriptionHi || "",
      image: category.image || "/images/categories/whole-red-chilli.jpg",
      order: category.displayOrder ?? category.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = Boolean(editingCategory);
      const endpoint = "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...(isEdit ? { id: editingCategory?.id } : {}),
        name: formData.name,
        nameHi: formData.nameHi.trim() || null,
        slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        description: formData.description.trim() || null,
        descriptionHi: formData.descriptionHi.trim() || null,
        image: formData.image.trim() || null,
        order: Number(formData.order) || 0,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category");
      }

      addToast(
        isEdit ? "Category updated in Neon DB!" : "New spice category created!",
        "success"
      );
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      addToast(err.message || "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete category");
      }

      addToast(`Category "${name}" deleted from Neon DB`, "success");
      fetchCategories();
    } catch (err: any) {
      addToast(err.message || "Failed to delete category", "error");
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.nameHi && cat.nameHi.includes(q)) ||
      cat.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
              Categories &amp; Spice Lines
            </h1>
            <span className="rounded-full bg-secondary/10 text-secondary text-xs font-bold px-3 py-1">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-spice-muted mt-1">
            Organize Whole Red Chilli, Ground Powders, Coriander, Turmeric, Kasuri Methi, and Jeera varieties with English and Hindi titles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search & Stats Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-muted" />
          <input
            type="text"
            placeholder="Search by category name (English or हिंदी) or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs text-spice-dark placeholder:text-spice-muted/60 focus:border-primary focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-20 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-xs text-spice-muted">Loading categories from Neon DB...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-cream-300 bg-white p-12 text-center space-y-3">
          <FolderTree className="h-10 w-10 text-spice-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-spice-dark">No categories found</h3>
          <p className="text-xs text-spice-muted">
            {searchQuery ? "Try a different search query." : "Click Add New Category above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-2xl border border-cream-300 bg-white overflow-hidden shadow-xs hover:shadow-sm hover:border-primary/40 transition-all"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-video w-full bg-cream-100 overflow-hidden">
                  <Image
                    src={cat.image || "/images/categories/whole-red-chilli.jpg"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-spice-dark/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5">
                      Order: {cat.displayOrder ?? cat.order ?? 0}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="rounded-full bg-secondary text-white text-[10px] font-bold px-2 py-0.5 shadow-xs">
                      {cat._count?.products || 0} Products
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-base font-bold text-spice-dark">
                        {cat.name}
                      </h3>
                      {cat.nameHi && (
                        <p className="text-xs font-bold text-primary">
                          {cat.nameHi}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-spice-muted font-mono">
                    /{cat.slug}
                  </p>

                  {cat.description && (
                    <p className="text-xs text-spice-muted line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  {cat.descriptionHi && (
                    <p className="text-xs text-spice-muted/80 line-clamp-1 italic">
                      {cat.descriptionHi}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-cream-200 bg-cream-50/50 p-3 flex items-center justify-between">
                <Link
                  href={`/products?category=${cat.slug}`}
                  target="_blank"
                  className="text-[11px] font-semibold text-spice-muted hover:text-primary flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>View in Store</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-spice-muted hover:bg-cream-200 hover:text-spice-dark transition-colors"
                    aria-label="Edit category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-spice-muted hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-spice-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-spice-dark">
                  {editingCategory ? "Edit Category" : "Add New Spice Category"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-spice-muted hover:bg-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whole Red Chilli"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                      }));
                    }}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">
                    हिंदी नाम (Hindi Name)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. साबुत लाल मिर्च"
                    value={formData.nameHi}
                    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="whole-red-chilli"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-mono text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-spice-dark mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-spice-dark focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  English Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of this spice category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  हिंदी विवरण (Hindi Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="इस मसाला श्रेणी का संक्षिप्त विवरण..."
                  value={formData.descriptionHi}
                  onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-spice-dark focus:border-primary focus:outline-none"
                />
              </div>

              {/* Image Input & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-spice-dark">
                  Category Image Path
                </label>
                <input
                  type="text"
                  placeholder="/images/categories/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-xl border border-cream-300 p-2 text-xs font-mono text-spice-dark focus:border-primary focus:outline-none"
                />

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-spice-muted uppercase tracking-wider">
                    Quick Category Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: p.url }))}
                        className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition-all ${
                          formData.image === p.url
                            ? "bg-primary text-white"
                            : "bg-cream-100 text-spice-dark hover:bg-cream-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-cream-300 px-4 py-2 text-xs font-semibold text-spice-muted hover:text-spice-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Saving to Neon DB..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
