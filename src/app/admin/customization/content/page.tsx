"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FileEdit,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { DEFAULT_HERO } from "@/lib/cms";

export default function HomepageContentEditorPage() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Forms
  const [heroForm, setHeroForm] = useState(DEFAULT_HERO);
  const [marqueeText, setMarqueeText] = useState(
    "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹499 ✦ FACTORY DIRECT PURE RED CHILLI & CORIANDER IN STOCK ✦ USE CODE: WELCOME10 FOR 10% OFF ✦ 100% ETHICALLY SOURCED FROM NAGAUR & ESTATES ✦"
  );
  const [storyForm, setStoryForm] = useState({
    title: "The Terroir of Single-Origin Purity",
    subtitle: "Why multi-estate blended supermarket spices lose their soul",
    paragraph:
      "Commercial grocery brands blend discarded residual crops and artificial colors. ND Spices partners directly with trusted farms in Nagaur, Rajasthan and Kerala's plantation estates to deliver unadulterated stone-ground purity.",
    image:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
  });

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
          setMarqueeText(data.contents["homepage.announcement"].marqueeText || marqueeText);
        }
        if (data.contents["homepage.story"]) {
          setStoryForm((prev) => ({ ...prev, ...data.contents["homepage.story"] }));
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

      addToast("Hero banner & content updated in Neon DB!", "success");
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
          content: { marqueeText },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Announcement marquee updated live!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update announcement", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "homepage.story",
          section: "story",
          content: storyForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addToast("Terroir story section saved!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update story", "error");
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
              Homepage CMS &amp; Content Customizer
            </h1>
            <span className="rounded-full bg-cardamom-100 text-cardamom px-3 py-1 text-xs font-bold">
              Database Driven
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Modify headings, hero copy, CTA buttons, images, and announcement banners without editing source code.
          </p>
        </div>

        <button
          onClick={fetchCmsContent}
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-bold text-charcoal hover:bg-cream-100 shadow-spice-sm"
        >
          <RotateCcw className="h-4 w-4 text-cinnamon" />
          <span>Reload from DB</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinnamon border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground">Fetching content configurations from Neon DB...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Hero Banner */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div>
                <span className="rounded-full bg-turmeric-100 text-turmeric-800 text-[10px] font-bold px-2.5 py-0.5">
                  Above-the-Fold
                </span>
                <h2 className="font-serif text-xl font-bold text-charcoal mt-1">
                  Homepage Hero Banner Section
                </h2>
              </div>
              <a
                href="/"
                target="_blank"
                className="text-xs font-bold text-cinnamon hover:underline flex items-center gap-1"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview Live Store</span>
              </a>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Top Badge Tagline
                </label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) =>
                    setHeroForm((prev) => ({ ...prev, badgeText: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Main Headline (First Line) *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroForm.heading}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, heading: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Headline Highlight (Italic Accent) *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroForm.headingHighlight}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, headingHighlight: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-bold text-cinnamon italic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Hero Description / Sub-Paragraph *
                </label>
                <textarea
                  rows={3}
                  required
                  value={heroForm.paragraph}
                  onChange={(e) =>
                    setHeroForm((prev) => ({ ...prev, paragraph: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
                />
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-cream-200 pt-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-charcoal">
                    Primary CTA Button (Text &amp; Link)
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
                  <label className="block text-xs font-bold text-charcoal">
                    Secondary CTA Button (Text &amp; Link)
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
                    placeholder="/products?category=masala-blends"
                    value={heroForm.secondaryButtonLink}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, secondaryButtonLink: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Hero Image URL & Preview */}
              <div className="border-t border-cream-200 pt-4">
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Hero Showcase Image URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={heroForm.heroImage}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, heroImage: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none"
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

              {/* Trust Indicators */}
              <div className="border-t border-cream-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal mb-1">
                    Trust Stat 1 (Value &amp; Label)
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
                  <label className="block text-[11px] font-bold text-charcoal mb-1">
                    Trust Stat 2 (Value &amp; Label)
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
                  <label className="block text-[11px] font-bold text-charcoal mb-1">
                    Trust Stat 3 (Value &amp; Label)
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

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cinnamon px-6 py-2.5 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving to Neon DB..." : "Save Hero Section"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Announcement Bar Marquee */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3">
              <span className="rounded-full bg-cardamom-100 text-cardamom text-[10px] font-bold px-2.5 py-0.5">
                Top Announcement Marquee
              </span>
              <h3 className="font-serif text-lg font-bold text-charcoal mt-1">
                Continuous Marquee Promo Ticker
              </h3>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Marquee Announcement Text
                </label>
                <textarea
                  rows={2}
                  required
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value)}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs focus:border-cinnamon focus:outline-none font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Announcement Marquee</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Terroir Story Section */}
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-4">
            <div className="border-b border-cream-200 pb-3">
              <span className="rounded-full bg-cream-200 text-charcoal text-[10px] font-bold px-2.5 py-0.5">
                Heritage Story Block
              </span>
              <h3 className="font-serif text-lg font-bold text-charcoal mt-1">
                Terroir of Single-Origin Purity Story
              </h3>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Story Title</label>
                  <input
                    type="text"
                    required
                    value={storyForm.title}
                    onChange={(e) => setStoryForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Story Subtitle</label>
                  <input
                    type="text"
                    required
                    value={storyForm.subtitle}
                    onChange={(e) =>
                      setStoryForm((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Story Narrative Paragraph
                </label>
                <textarea
                  rows={3}
                  required
                  value={storyForm.paragraph}
                  onChange={(e) =>
                    setStoryForm((prev) => ({ ...prev, paragraph: e.target.value }))
                  }
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Story Feature Image URL
                </label>
                <input
                  type="url"
                  required
                  value={storyForm.image}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full rounded-xl border border-cream-300 p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cinnamon px-6 py-2 text-xs font-bold text-white hover:bg-cinnamon-600 disabled:opacity-50 shadow-spice-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Heritage Story</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
