"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  Truck,
  CreditCard,
  MessageCircle,
  Search,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { DEFAULT_SETTINGS } from "@/lib/cms";

export default function SuperAdminSettingsPage() {
  const { addToast } = useToastStore();
  const [settingsForm, setSettingsForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettingsForm((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Website & business settings saved to Neon DB!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update settings", "error");
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
              Global Website &amp; Business Settings
            </h1>
            <span className="rounded-full bg-cardamom-100 text-cardamom px-3 py-1 text-xs font-bold">
              Neon DB
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure business identity, shipping thresholds, tax rates, payment toggles, WhatsApp widgets, and SEO metadata.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Reload</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Loading configurations from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Section 1: Business Identity & Compliance */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3 flex items-center gap-2">
              <Building className="h-5 w-5 text-cinnamon" />
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Business Details &amp; Compliance (GSTIN / FSSAI)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, storeName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagLine}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, tagLine: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  GSTIN Tax Number
                </label>
                <input
                  type="text"
                  value={settingsForm.gstNumber}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, gstNumber: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  FSSAI Food License Number
                </label>
                <input
                  type="text"
                  value={settingsForm.fssaiNumber}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, fssaiNumber: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={settingsForm.contactPhone}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, contactPhone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Estate Hub Physical Address
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping, Taxes & Payments */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-cardamom" />
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Shipping Rates &amp; Payment Toggles
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Free Shipping Minimum Order (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.freeShippingMin}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      freeShippingMin: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Standard Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.flatShippingRate}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      flatShippingRate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  GST Tax Rate (% Default)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.taxRatePercent}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      taxRatePercent: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                />
              </div>
            </div>

            {/* Payment toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.isRazorpayEnabled}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      isRazorpayEnabled: e.target.checked,
                    }))
                  }
                  className="rounded text-cinnamon focus:ring-cinnamon h-4 w-4"
                />
                <div>
                  <span className="font-bold text-xs text-charcoal block">
                    Razorpay Online Gateway (UPI, Cards, Netbanking)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Instant automated online settlements.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.isCodEnabled}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, isCodEnabled: e.target.checked }))
                  }
                  className="rounded text-cinnamon focus:ring-cinnamon h-4 w-4"
                />
                <div>
                  <span className="font-bold text-xs text-charcoal block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Pay upon doorstep courier delivery.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: WhatsApp Widget */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <h2 className="font-serif text-lg font-bold text-charcoal">
                WhatsApp Live Customer Chat Support
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  WhatsApp Support Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  placeholder="+919845012345"
                  value={settingsForm.whatsappNumber || ""}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.isWhatsappEnabled}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        isWhatsappEnabled: e.target.checked,
                      }))
                    }
                    className="rounded text-cinnamon focus:ring-cinnamon h-4 w-4"
                  />
                  <span className="text-xs font-bold text-charcoal">
                    Enable Floating WhatsApp Chat Widget
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Global SEO & OpenGraph Metadata */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-turmeric-800" />
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Search Engine Optimization (SEO) &amp; Social Meta Tags
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Default Browser Title Tag *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.seoTitle}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, seoTitle: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.seoDescription}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, seoDescription: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Search Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.seoKeywords}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, seoKeywords: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Social Sharing OpenGraph Image URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.ogImageUrl || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, ogImageUrl: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                  />
                </div>
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
              <span>{saving ? "Saving Configurations..." : "Save All Settings to Neon DB"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
