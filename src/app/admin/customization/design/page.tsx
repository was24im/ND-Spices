"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Palette,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle2,
  Type,
  Square,
  CircleDot,
  Brush,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { DEFAULT_THEME } from "@/lib/cms";

export default function ThemeDesignEditorPage() {
  const { addToast } = useToastStore();
  const [themeForm, setThemeForm] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/theme");
      const data = await res.json();
      if (data.success && data.theme) {
        setThemeForm((prev) => ({ ...prev, ...data.theme }));
      }
    } catch (err) {
      console.error("Failed to load theme:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Brand design & theme settings saved to Neon DB!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update theme", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Theme &amp; Brand Design Customizer
            </h1>
            <span className="rounded-full bg-cardamom-100 text-cardamom px-3 py-1 text-xs font-bold">
              Dynamic Neon DB Theme
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Customize primary spice palette, typography font pairings, border radii, logo, and button styles.
          </p>
        </div>

        <button
          onClick={fetchTheme}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Reset from DB</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading brand palette from Neon DB...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveTheme} className="space-y-8">
          {/* Section 1: Brand Colors Palette */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
            <div className="border-b border-cream-200 pb-4">
              <span className="rounded-full bg-turmeric-100 text-turmeric-800 text-[10px] font-bold px-2.5 py-0.5">
                Earthy Spice Palette
              </span>
              <h2 className="font-serif text-xl font-bold text-charcoal mt-1">
                Curated Color Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Primary Cinnamon */}
              <div className="space-y-2 rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <label className="block text-xs font-bold text-charcoal">
                  Primary Brand Color (Deep Cinnamon / Red Spice)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeForm.primaryColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, primaryColor: e.target.value }))
                    }
                    className="h-10 w-12 rounded-lg border border-cream-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={themeForm.primaryColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, primaryColor: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-cream-300 p-2 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div
                  className="h-6 w-full rounded-lg text-[10px] font-bold text-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: themeForm.primaryColor }}
                >
                  Primary Brand Swatch
                </div>
              </div>

              {/* Secondary Cardamom */}
              <div className="space-y-2 rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <label className="block text-xs font-bold text-charcoal">
                  Secondary Color (Cardamom Green)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeForm.secondaryColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, secondaryColor: e.target.value }))
                    }
                    className="h-10 w-12 rounded-lg border border-cream-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={themeForm.secondaryColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, secondaryColor: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-cream-300 p-2 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div
                  className="h-6 w-full rounded-lg text-[10px] font-bold text-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: themeForm.secondaryColor }}
                >
                  Secondary Herbal Swatch
                </div>
              </div>

              {/* Accent Turmeric */}
              <div className="space-y-2 rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <label className="block text-xs font-bold text-charcoal">
                  Accent Color (Golden Turmeric)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeForm.accentColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="h-10 w-12 rounded-lg border border-cream-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={themeForm.accentColor}
                    onChange={(e) =>
                      setThemeForm((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-cream-300 p-2 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div
                  className="h-6 w-full rounded-lg text-[10px] font-bold text-charcoal flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: themeForm.accentColor }}
                >
                  Accent Gold Swatch
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Typography & Structure */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
            <div className="border-b border-cream-200 pb-4">
              <span className="rounded-full bg-cream-200 text-charcoal text-[10px] font-bold px-2.5 py-0.5">
                Typography &amp; Shapes
              </span>
              <h2 className="font-serif text-xl font-bold text-charcoal mt-1">
                Fonts, Border Radius &amp; Button Styling
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Font Family Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal">
                  Heading Typography Font
                </label>
                <select
                  value={themeForm.fontFamily}
                  onChange={(e) =>
                    setThemeForm((prev) => ({ ...prev, fontFamily: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-serif font-bold text-charcoal focus:outline-none"
                >
                  <option value="Playfair Display">Playfair Display (Royal Serif)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Artisanal)</option>
                  <option value="Merriweather">Merriweather (Classic Editorial)</option>
                  <option value="Outfit">Outfit (Modern Sans-Serif)</option>
                  <option value="Inter">Inter (Clean Crisp UI)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Applied to store titles, spice names, and hero headlines.
                </p>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal">
                  Card &amp; Container Corner Radius
                </label>
                <select
                  value={themeForm.borderRadius}
                  onChange={(e) =>
                    setThemeForm((prev) => ({ ...prev, borderRadius: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold text-charcoal focus:outline-none"
                >
                  <option value="1.5rem">Organic Curved (rounded-3xl: 24px)</option>
                  <option value="1rem">Modern Rounded (rounded-2xl: 16px)</option>
                  <option value="0.5rem">Subtle Rounded (rounded-lg: 8px)</option>
                  <option value="0rem">Heritage Sharp (rounded-none: 0px)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Affects product cards, review boxes, and modals.
                </p>
              </div>

              {/* Button Style */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal">
                  Button Pill vs Box Style
                </label>
                <select
                  value={themeForm.buttonStyle}
                  onChange={(e) =>
                    setThemeForm((prev) => ({ ...prev, buttonStyle: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold text-charcoal focus:outline-none"
                >
                  <option value="pill">Pill Shape (Full Rounded)</option>
                  <option value="rounded">Rounded Box (Medium Radius)</option>
                  <option value="sharp">Sharp Heritage Box</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Styling of Add to Cart, Buy Now, and Hero CTAs.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Logos & Brand Assets */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
            <div className="border-b border-cream-200 pb-4">
              <span className="rounded-full bg-cardamom-100 text-cardamom text-[10px] font-bold px-2.5 py-0.5">
                Brand Imagery
              </span>
              <h2 className="font-serif text-xl font-bold text-charcoal mt-1">
                Logos &amp; Icons
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Custom Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://.../logo.png"
                  value={themeForm.logoUrl || ""}
                  onChange={(e) =>
                    setThemeForm((prev) => ({
                      ...prev,
                      logoUrl: e.target.value ? e.target.value : null,
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Leave blank to use the ND Spices monogram crest.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Custom Favicon URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://.../favicon.ico"
                  value={themeForm.faviconUrl || ""}
                  onChange={(e) =>
                    setThemeForm((prev) => ({
                      ...prev,
                      faviconUrl: e.target.value ? e.target.value : null,
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cinnamon px-8 py-3 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Theme Settings..." : "Save Brand Theme to Neon DB"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
