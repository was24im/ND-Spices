"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowUpDown,
  ImageIcon,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { formatPrice } from "@/lib/utils";

interface VariantForm {
  id?: string;
  weight: string;
  price: number;
  discountedPrice?: number | null;
  stockQuantity: number;
  sku: string;
}

interface ProductForm {
  id?: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  descriptionHi: string;
  categoryId: string;
  origin: string;
  originHi: string;
  images: string[];
  isFeatured: boolean;
  inStock: boolean;
  variants: VariantForm[];
}

const DEFAULT_FORM: ProductForm = {
  name: "",
  nameHi: "",
  slug: "",
  description: "",
  descriptionHi: "",
  categoryId: "",
  origin: "Nagaur, Rajasthan",
  originHi: "नागौर, राजस्थान",
  images: ["/images/categories/whole-red-chilli.jpg"],
  isFeatured: false,
  inStock: true,
  variants: [
    { weight: "100g", price: 45, discountedPrice: null, stockQuantity: 100, sku: "ND-NEW-100G" },
    { weight: "250g", price: 105, discountedPrice: null, stockQuantity: 80, sku: "ND-NEW-250G" },
    { weight: "500g", price: 200, discountedPrice: null, stockQuantity: 50, sku: "ND-NEW-500G" },
    { weight: "1kg", price: 380, discountedPrice: null, stockQuantity: 30, sku: "ND-NEW-1KG" },
  ],
};

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

export default function AdminProductsPage() {
  const { addToast } = useToastStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductForm>(DEFAULT_FORM);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      ...DEFAULT_FORM,
      categoryId: categories[0]?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      nameHi: product.nameHi || "",
      slug: product.slug,
      description: product.description,
      descriptionHi: product.descriptionHi || "",
      categoryId: product.categoryId,
      origin: product.origin,
      originHi: product.originHi || "",
      images: product.images || [],
      isFeatured: product.isFeatured,
      inStock: product.inStock,
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        weight: v.weight,
        price: Number(v.price),
        discountedPrice: v.discountedPrice ? Number(v.discountedPrice) : null,
        stockQuantity: v.stockQuantity,
        sku: v.sku,
      })) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Product "${name}" deleted.`, "info");
        fetchProducts();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to delete product", "error");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      addToast(
        isEditing ? "Spice product updated successfully!" : "New spice product registered!",
        "success"
      );
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      addToast(err.message || "Failed to save product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          weight: "1kg",
          price: 450,
          discountedPrice: null,
          stockQuantity: 30,
          sku: `ND-${formData.name.toUpperCase().slice(0, 3)}-1KG`,
        },
      ],
    }));
  };

  const removeVariantRow = (index: number) => {
    if (formData.variants.length <= 1) {
      addToast("A product must have at least one weight variant.", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameHi && p.nameHi.includes(searchTerm)) ||
      p.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Spice Catalog &amp; Varieties
            </h1>
            <span className="rounded-full bg-[#FEE2E2] text-[#C5221F] px-3 py-1 text-xs font-bold border border-[#FECACA]">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Super Admin catalog control: manage bilingual content, prices, packaging weights, images, and live stock.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5221F] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#B91C1C] shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Spice Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search spice by English name, Hindi name, or origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-[#C5221F] focus:outline-none focus:ring-1 focus:ring-[#C5221F] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-xs font-bold text-charcoal focus:border-[#C5221F] focus:outline-none shadow-xs"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.nameHi ? `(${cat.nameHi})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5221F] border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading catalog from Neon PostgreSQL...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-300 bg-white p-12 text-center space-y-3">
          <Package className="h-10 w-10 text-cream-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal">No spices found</h3>
          <p className="text-xs text-muted-foreground">
            No spice products match your search query or filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/60 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Spice Variety &amp; Hindi</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Origin</th>
                  <th className="py-3.5 px-4">Packaging Sizes &amp; Stock</th>
                  <th className="py-3.5 px-4">Price Range</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredProducts.map((product) => {
                  const prices = product.variants?.map((v: any) => Number(v.price)) || [0];
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const primaryImg = product.images?.[0] || "/images/categories/whole-red-chilli.jpg";

                  return (
                    <tr key={product.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-cream-300">
                            <Image
                              src={primaryImg}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-charcoal text-xs">{product.name}</p>
                            {product.nameHi && (
                              <p className="text-[11px] text-[#2E7D32] font-semibold">{product.nameHi}</p>
                            )}
                            <p className="text-[10px] text-muted-foreground font-mono">slug: {product.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[10px] font-bold text-charcoal">
                          {product.category?.name || "General Spice"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-xs text-charcoal font-medium">{product.origin}</span>
                        {product.originHi && (
                          <span className="block text-[10px] text-muted-foreground">{product.originHi}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {product.variants?.map((v: any) => (
                            <span
                              key={v.id}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                                v.stockQuantity > 10
                                  ? "bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]"
                                  : "bg-amber-50 border-amber-200 text-amber-700"
                              }`}
                            >
                              {v.weight} ({v.stockQuantity} in stock)
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-charcoal">
                        {minPrice === maxPrice
                          ? formatPrice(minPrice)
                          : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            product.inStock
                              ? "bg-[#2E7D32]/10 text-[#2E7D32]"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "Active Stock" : "Archived"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-cream-300 text-muted-foreground hover:text-charcoal hover:bg-cream-100"
                            title="View PDP"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg border border-cream-300 text-blue-600 hover:bg-blue-50"
                            title="Edit product, sizes & translations"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 rounded-lg border border-cream-300 text-red-600 hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-charcoal p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-full bg-[#FEE2E2] text-[#C5221F] text-[10px] font-bold px-3 py-1 border border-[#FECACA]">
                {isEditing ? "Edit Spice Variety" : "Add New Spice Variety"}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-charcoal mt-2">
                {isEditing ? `Update ${formData.name}` : "Create Spice Variety"}
              </h2>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* English & Hindi Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name,
                        slug: isEditing ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      }));
                    }}
                    placeholder="e.g. Kashmiri Dabi Whole Red Chilli"
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Product Name (हिंदी) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameHi}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nameHi: e.target.value }))
                    }
                    placeholder="उदा. कश्मीरी डाबी साबुत लाल मिर्च"
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="kashmiri-dabi"
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.nameHi ? `(${c.nameHi})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Origin (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, origin: e.target.value }))
                    }
                    placeholder="e.g. Pampore, Kashmir"
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Origin (हिंदी)
                  </label>
                  <input
                    type="text"
                    value={formData.originHi}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, originHi: e.target.value }))
                    }
                    placeholder="उदा. पाम्पोर, कश्मीर"
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Product Description (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe aroma, pungency, sun-curing, culinary applications..."
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Product Description (हिंदी)
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionHi}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, descriptionHi: e.target.value }))
                  }
                  placeholder="उत्पाद की सुगंध, तीखापन, पिसाई और विशेषता का हिंदी विवरण लिखें..."
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-[#C5221F] focus:outline-none"
                />
              </div>

              {/* Multi-Image URL Input & Presets */}
              <div className="space-y-2 border-t border-cream-200 pt-3">
                <label className="block text-xs font-bold text-charcoal">
                  Product Photograph URLs
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/products/... or https://..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-cream-300 p-2 text-xs focus:border-[#C5221F] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrlInput.trim()) {
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, imageUrlInput.trim()],
                        }));
                        setImageUrlInput("");
                      }
                    }}
                    className="rounded-xl bg-charcoal text-white px-3 py-2 text-xs font-bold hover:bg-black"
                  >
                    Add URL
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-muted-foreground font-semibold">Quick Presets:</span>
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: [preset.url, ...prev.images.filter((img) => img !== preset.url)],
                        }));
                      }}
                      className="px-2 py-0.5 rounded-lg border border-cream-300 bg-cream-100 hover:bg-cream-200 text-[10px] font-bold text-charcoal"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Selected Images Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-xl border border-cream-200 bg-cream-50 px-2.5 py-1 text-[11px]"
                    >
                      <span className="truncate max-w-[220px] font-mono">{img}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 ml-1 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants Builder (Weight, Prices, Stock, SKU) */}
              <div className="border-t border-cream-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal">
                      Package Sizes &amp; Prices
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Define packaging sizes (e.g. 100g, 250g, 500g, 1kg), price, stock units, and SKUs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="inline-flex items-center gap-1 rounded-xl border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-cream-200"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#C5221F]" />
                    <span>Add Size</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 p-2.5 text-xs"
                    >
                      <div className="w-24">
                        <label className="text-[10px] text-muted-foreground block font-bold mb-0.5">Size/Weight</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 100g"
                          value={variant.weight}
                          onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                          className="w-full rounded-lg border border-cream-300 p-1.5 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] text-muted-foreground block font-bold mb-0.5">Price (₹)</label>
                        <input
                          type="number"
                          required
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(idx, "price", parseFloat(e.target.value) || 0)
                          }
                          className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold text-[#C5221F]"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] text-muted-foreground block font-bold mb-0.5">Sale (₹)</label>
                        <input
                          type="number"
                          placeholder="Sale Price"
                          value={variant.discountedPrice || ""}
                          onChange={(e) =>
                            updateVariant(
                              idx,
                              "discountedPrice",
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          className="w-full rounded-lg border border-cream-300 p-1.5 text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-muted-foreground block font-bold mb-0.5">Stock</label>
                        <input
                          type="number"
                          required
                          placeholder="Stock"
                          value={variant.stockQuantity}
                          onChange={(e) =>
                            updateVariant(idx, "stockQuantity", parseInt(e.target.value) || 0)
                          }
                          className="w-full rounded-lg border border-cream-300 p-1.5 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-[10px] text-muted-foreground block font-bold mb-0.5">SKU</label>
                        <input
                          type="text"
                          required
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                          className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 mt-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="rounded text-[#C5221F] focus:ring-[#C5221F] h-4 w-4"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, inStock: e.target.checked }))
                    }
                    className="rounded text-[#C5221F] focus:ring-[#C5221F] h-4 w-4"
                  />
                  <span>Active Stock for Online Orders</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-cream-300 px-5 py-2 text-xs font-bold text-charcoal hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#C5221F] px-6 py-2 text-xs font-bold text-white hover:bg-[#B91C1C] disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Saving to Neon DB..." : isEditing ? "Save Changes" : "Create Spice Variety"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
