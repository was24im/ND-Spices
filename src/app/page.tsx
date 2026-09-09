import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Award, Flame, Leaf, CheckCircle2, Star } from "lucide-react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { getWebsiteContent, DEFAULT_HERO, HeroContent } from "@/lib/cms";
import { prisma } from "@/lib/db";

export const revalidate = 0; // Fresh dynamic data on every request

export default async function HomePage() {
  const hero: HeroContent = await getWebsiteContent("homepage.hero", DEFAULT_HERO);

  // Fetch bestsellers from database if available, else mock data
  let bestsellers = MOCK_PRODUCTS.filter((p) => p.bestseller);
  let categories = MOCK_CATEGORIES;

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        variants: true,
      },
      take: 8,
    });

    if (dbProducts && dbProducts.length > 0) {
      bestsellers = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category.name,
        origin: p.origin || "Kerala, India",
        grade: "Grade A1 Export Quality",
        description: p.description,
        rating: p.rating,
        reviewCount: p.numReviews,
        bestseller: p.isFeatured,
        harvestDate: "Winter 2024",
        aromaProfile: "Rich, aromatic, intense",
        images: p.images && p.images.length > 0 ? p.images : ["/spices/cardamom.jpg"],
        variants: p.variants.map((v) => ({
          id: v.id,
          size: v.weight,
          price: Number(v.price),
          discountPrice: v.discountedPrice ? Number(v.discountedPrice) : undefined,
          stock: v.stockQuantity,
          sku: v.sku,
        })),
      })) as any;
    }

    const dbCategories = await prisma.category.findMany({
      take: 4,
    });
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories as any;
    }
  } catch (error) {
    console.error("Database fetch fallback:", error);
  }

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Dynamic Hero Section - Powered by Neon DB CMS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] pt-8 sm:pt-14 pb-16 border-b border-cream-300/80">
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-secondary-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {hero.badgeText && (
                <div className="inline-flex items-center gap-2 rounded-full border border-secondary-300 bg-secondary-50 px-3.5 py-1 text-xs font-semibold text-secondary-800 shadow-xs">
                  <Leaf className="h-3.5 w-3.5 text-secondary-600" />
                  <span>{hero.badgeText}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-spice-dark tracking-tight leading-[1.15]">
                {hero.heading}{" "}
                <span className="text-primary italic">{hero.headingHighlight}</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-spice-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {hero.paragraph}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href={hero.primaryButtonLink || "/products"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold text-sm shadow-spice-md hover:shadow-saffron-glow">
                    <span>{hero.primaryButtonText || "Explore Harvests"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={hero.secondaryButtonLink || "/products"} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-spice-dark border-cream-400 hover:bg-cream-200 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary mr-1.5" />
                    {hero.secondaryButtonText || "Specialty Spices"}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-300/80 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="font-display text-lg sm:text-2xl font-black text-spice-dark">{hero.stat1Value || "8mm+"}</p>
                  <p className="text-[11px] text-spice-muted">{hero.stat1Label || "Jumbo Pods"}</p>
                </div>
                <div>
                  <p className="font-display text-lg sm:text-2xl font-black text-spice-dark">{hero.stat2Value || "7.5%+"}</p>
                  <p className="text-[11px] text-spice-muted">{hero.stat2Label || "Curcumin"}</p>
                </div>
                <div>
                  <p className="font-display text-lg sm:text-2xl font-black text-spice-dark">{hero.stat3Value || "0%"}</p>
                  <p className="text-[11px] text-spice-muted">{hero.stat3Label || "Fillers"}</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Image & Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white shadow-spice-lg bg-cream-100">
                <Image
                  src={hero.heroImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85"}
                  alt="Artisanal Indian Spices Harvest"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spice-dark/70 via-transparent to-transparent" />

                {/* Floating Farm Badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl glass-panel p-4 shadow-spice-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-spice-dark">Lab Tested & Certified</h4>
                      <p className="text-[11px] text-spice-muted">Grade A1 certified for volatile oil concentration.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-spice-dark">
              Curated Spice Collections
            </h2>
            <p className="text-xs sm:text-sm text-spice-muted mt-1">
              Select pure whole spices, fragrant powders, or royal masalas.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-3 md:mt-0 text-xs sm:text-sm font-bold text-primary hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-64 overflow-hidden rounded-2xl border border-cream-300 bg-white p-5 shadow-spice-sm hover:shadow-spice-md transition-all duration-300 flex flex-col justify-end"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-spice-dark/85 via-spice-dark/30 to-transparent" />

              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-turmeric-300">
                  Direct Estate
                </span>
                <h3 className="font-serif text-xl font-bold">{cat.name}</h3>
                <p className="text-xs text-cream-200 line-clamp-2 opacity-90">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid
          products={bestsellers}
          title="Signature Harvest Bestsellers"
          subtitle="The most coveted aromatics chosen by master chefs and home gourmets across the nation."
        />
      </section>

      {/* Artisanal Heritage Process Spotlight */}
      <section className="bg-spice-dark text-cream-200 py-16 border-y border-spice-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-primary-400">
              The ND Spices Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-2">
              From Estate Soil to Gourmet Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-cream-400 mt-2">
              We eliminate intermediaries, processing our harvest through a clean 3-step quality protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-spice-charcoal/80 border border-white/10 rounded-2xl p-6 relative">
              <span className="font-display font-black text-4xl text-primary-400/40 absolute top-4 right-5">
                01
              </span>
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary-400 mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Estate Selection</h3>
              <p className="text-xs text-cream-400 mt-2 leading-relaxed">
                Handpicked only during peak season from verified high-altitude estates in Kerala and Kashmir known for optimal soil mineral profiles.
              </p>
            </div>

            <div className="bg-spice-charcoal/80 border border-white/10 rounded-2xl p-6 relative">
              <span className="font-display font-black text-4xl text-secondary-400/40 absolute top-4 right-5">
                02
              </span>
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-400 mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Low-RPM Stone Grinding</h3>
              <p className="text-xs text-cream-400 mt-2 leading-relaxed">
                Traditional cold stone mills ensure temperatures never exceed 35°C, preventing the evaporation of precious volatile essential oils.
              </p>
            </div>

            <div className="bg-spice-charcoal/80 border border-white/10 rounded-2xl p-6 relative">
              <span className="font-display font-black text-4xl text-turmeric-400/40 absolute top-4 right-5">
                03
              </span>
              <div className="h-12 w-12 rounded-xl bg-turmeric/20 flex items-center justify-center text-turmeric-400 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Aroma-Sealed Packs</h3>
              <p className="text-xs text-cream-400 mt-2 leading-relaxed">
                Packed in heavy-gauge barrier glass jars and nitrogen-flushed tins to guarantee farm-fresh aroma for up to 24 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-spice-dark">
            Celebrated by Culinary Experts
          </h2>
          <p className="text-xs sm:text-sm text-spice-muted mt-1">
            Read what passionate cooks and executive chefs say about ND Spices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-spice-sm">
            <div className="flex text-turmeric mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-spice-dark leading-relaxed italic">
              "The aroma of the Alleppey Jumbo Cardamom hit the room the moment I opened the tin. You cannot find this quality in regular supermarkets."
            </p>
            <div className="mt-4 pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-spice-dark">Chef Arvind Raghavan</p>
              <p className="text-[11px] text-spice-muted">Executive Chef, Bengaluru</p>
            </div>
          </div>

          <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-spice-sm">
            <div className="flex text-turmeric mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-spice-dark leading-relaxed italic">
              "The Lakadong Turmeric is visibly deeper in color and earthy fragrance. 7.5% curcumin makes a huge difference in my daily golden lattes."
            </p>
            <div className="mt-4 pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-spice-dark">Pooja Nambiar</p>
              <p className="text-[11px] text-spice-muted">Holistic Nutritionist, Mumbai</p>
            </div>
          </div>

          <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-spice-sm">
            <div className="flex text-turmeric mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-spice-dark leading-relaxed italic">
              "Kashmiri Mongra saffron from ND Spices is unmatchable. Just 3-4 strands gave my Biryani royal crimson-golden color and unmatched fragrance."
            </p>
            <div className="mt-4 pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-spice-dark">Tariq Merchant</p>
              <p className="text-[11px] text-spice-muted">Heritage Home Cook, Delhi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
