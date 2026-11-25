"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FileEdit,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Languages,
  Sparkles,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { DEFAULT_HERO, HeroContent } from "@/lib/cms";

export default function HomepageContentEditorPage() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"en" | "hi">("en");

  // Forms
  const [heroForm, setHeroForm] = useState<HeroContent>(DEFAULT_HERO);
  const [marqueeText, setMarqueeText] = useState(
    "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹499 ✦ FACTORY DIRECT PURE RED CHILLI & CORIANDER IN STOCK ✦ USE CODE: WELCOME10 FOR 10% OFF ✦ 100% ETHICALLY SOURCED FROM NAGAUR & ESTATES ✦"
  );
  const [marqueeTextHi, setMarqueeTextHi] = useState(
    "✦ ₹499 से अधिक के ऑर्डर पर मुफ्त एक्सप्रेस डिलीवरी ✦ सीधे फैक्ट्री से 100% शुद्ध लाल मिर्च और धनिया ✦ 10% छूट के लिए कोड WELCOME10 उपयोग करें ✦ 100% शुद्ध व मिलावट रहित ✦"
  );

  useEffect(() => {
    fetchCmsContent();
  }, []);

  const fetchCmsContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms");
      const data = await res.json();
      if (data.success && data.contents) {
        if (data.contents["homepage.hero"]) {
          setHeroForm((prev) => ({ ...prev, ...data.contents["homepage.hero"] }));
        }
        if (data.contents["homepage.announcement"]) {
          const ann = data.contents["homepage.announcement"];
          if (ann.marqueeText) setMarqueeText(ann.marqueeText);
          if (ann.marqueeTextHi) setMarqueeTextHi(ann.marqueeTextHi);
        }
      }
    } catch (err) {
      console.error("Failed to load CMS content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "homepage.hero",
          section: "hero",
          content: heroForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Hero banner & multilingual content updated in Neon DB!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update Hero content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "homepage.announcement",
          section: "banner",
          content: { marqueeText, marqueeTextHi },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Announcement ticker updated live for both languages!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update announcement", "error");
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
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
              Homepage CMS &amp; Content Customizer
            </h1>
            <span className="rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-bold">
              Bilingual &amp; Database Driven
            </span>
          </div>
          <p className="text-xs text-spice-muted mt-1">
            Modify headings, hero copy, CTA buttons, images, and announcement banners in English and Hindi without editing code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCmsContent}
            className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-spice-dark hover:bg-cream-100 shadow-sm"
          >
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>Reload from DB</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-sm"
          >
            <Eye className="h-4 w-4" />
            <span>View Live Store</span>
          </a>
        </div>
      </div>

      {/* Language Tab Switcher */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-cream-300 shadow-xs w-fit">
        <span className="text-xs font-bold text-spice-muted px-2 flex items-center gap-1.5">
          <Languages className="h-4 w-4 text-primary" />
          <span>Edit Language:</span>
        </span>
        <button
          onClick={() => setActiveLangTab("en")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeLangTab === "en"
              ? "bg-primary text-white shadow-xs"
              : "text-spice-dark hover:bg-cream-100"
          }`}
        >
          English Content
        </button>
        <button
          onClick={() => setActiveLangTab("hi")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeLangTab === "hi"
              ? "bg-primary text-white shadow-xs"
              : "text-spice-dark hover:bg-cream-100"
          }`}
        >
          हिंदी सामग्री (Hindi)
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-xs text-spice-muted">Fetching content configurations from Neon DB...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Hero Banner */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div>
                <span className="rounded-full bg-accent/20 text-spice-dark text-[10px] font-bold px-2.5 py-0.5">
                  Above-the-Fold
                </span>
                <h2 className="font-serif text-xl font-bold text-spice-dark mt-1">
                  Hero Banner ({activeLangTab === "en" ? "English" : "हिंदी"})
                </h2>
              </div>
              <span className="text-xs font-semibold text-secondary">
                {activeLangTab === "en" ? "Editing English Version" : "हिंदी संस्करण संपादन"}
              </span>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4">
              {activeLangTab === "en" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      Top Badge Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={heroForm.badgeText}
                      onChange={(e) =>
                        setHeroForm((prev) => ({ ...prev, badgeText: e.target.value }))
                      }
                      className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-spice-dark mb-1">
                        Main Headline (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={heroForm.heading}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, heading: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-spice-dark mb-1">
                        Headline Highlight (Italic Accent) *
                      </label>
                      <input
                        type="text"
                        required
                        value={heroForm.headingHighlight}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, headingHighlight: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-bold text-primary italic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      Hero Description / Sub-Paragraph (English) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={heroForm.paragraph}
                      onChange={(e) =>
                        setHeroForm((prev) => ({ ...prev, paragraph: e.target.value }))
                      }
                      className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* CTA Buttons EN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-cream-200 pt-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-spice-dark">
                        Primary CTA Button (Label &amp; Link)
                      </label>
                      <input
                        type="text"
                        placeholder="Button Label"
                        value={heroForm.primaryButtonText}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, primaryButtonText: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="/products"
                        value={heroForm.primaryButtonLink}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, primaryButtonLink: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-spice-dark">
                        Secondary CTA Button (Label &amp; Link)
                      </label>
                      <input
                        type="text"
                        placeholder="Button Label"
                        value={heroForm.secondaryButtonText}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, secondaryButtonText: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="/products?category=red-chilli-powder"
                        value={heroForm.secondaryButtonLink}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, secondaryButtonLink: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Trust Stats EN */}
                  <div className="border-t border-cream-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        Trust Stat 1 (Value &amp; English Label)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat1Value}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat1Value: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={heroForm.stat1Label}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat1Label: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        Trust Stat 2 (Value &amp; English Label)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat2Value}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat2Value: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={heroForm.stat2Label}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat2Label: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        Trust Stat 3 (Value &amp; English Label)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat3Value}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat3Value: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={heroForm.stat3Label}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat3Label: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs mt-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      शीर्ष टैगलाइन बैज (Hindi Badge)
                    </label>
                    <input
                      type="text"
                      value={heroForm.badgeTextHi || ""}
                      onChange={(e) =>
                        setHeroForm((prev) => ({ ...prev, badgeTextHi: e.target.value }))
                      }
                      className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-spice-dark mb-1">
                        मुख्य शीर्षक (Hindi Headline) *
                      </label>
                      <input
                        type="text"
                        value={heroForm.headingHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, headingHi: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-spice-dark mb-1">
                        हाईलाइट शीर्षक (Hindi Highlight) *
                      </label>
                      <input
                        type="text"
                        value={heroForm.headingHighlightHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, headingHighlightHi: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-bold text-primary italic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-spice-dark mb-1">
                      विवरण / सब-पैराग्राफ (Hindi Subheading) *
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.paragraphHi || ""}
                      onChange={(e) =>
                        setHeroForm((prev) => ({ ...prev, paragraphHi: e.target.value }))
                      }
                      className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* CTA Buttons HI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-cream-200 pt-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-spice-dark">
                        प्राथमिक बटन लेबल (Primary CTA Hindi)
                      </label>
                      <input
                        type="text"
                        value={heroForm.primaryButtonTextHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, primaryButtonTextHi: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-spice-dark">
                        द्वितीयक बटन लेबल (Secondary CTA Hindi)
                      </label>
                      <input
                        type="text"
                        value={heroForm.secondaryButtonTextHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, secondaryButtonTextHi: e.target.value }))
                        }
                        className="w-full rounded-xl border border-cream-300 p-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Trust Stats HI */}
                  <div className="border-t border-cream-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        विश्वास सांख्यिकी 1 लेबल (Hindi)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat1LabelHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat1LabelHi: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        विश्वास सांख्यिकी 2 लेबल (Hindi)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat2LabelHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat2LabelHi: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-spice-dark mb-1">
                        विश्वास सांख्यिकी 3 लेबल (Hindi)
                      </label>
                      <input
                        type="text"
                        value={heroForm.stat3LabelHi || ""}
                        onChange={(e) =>
                          setHeroForm((prev) => ({ ...prev, stat3LabelHi: e.target.value }))
                        }
                        className="w-full rounded-lg border border-cream-300 p-1.5 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Shared Hero Image */}
              <div className="border-t border-cream-200 pt-4">
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Hero Showcase Image Path / URL (Shared Across Languages)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={heroForm.heroImage}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, heroImage: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none"
                  />
                  {heroForm.heroImage && (
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-cream-300 flex-shrink-0">
                      <Image
                        src={heroForm.heroImage}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50 shadow-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving to Neon DB..." : "Save Hero Section (All Languages)"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Announcement Bar Marquee */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-cream-200 pb-3">
              <span className="rounded-full bg-secondary/10 text-secondary text-[10px] font-bold px-2.5 py-0.5">
                Top Announcement Marquee
              </span>
              <h3 className="font-serif text-lg font-bold text-spice-dark mt-1">
                Continuous Marquee Promo Ticker (Bilingual)
              </h3>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  Marquee Announcement Text (English)
                </label>
                <textarea
                  rows={2}
                  required
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-spice-dark mb-1">
                  घोषणा पट्टी टेक्स्ट (Hindi Marquee)
                </label>
                <textarea
                  rows={2}
                  value={marqueeTextHi}
                  onChange={(e) => setMarqueeTextHi(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-primary focus:outline-none font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50 shadow-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Updating..." : "Save Announcement Ticker"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
