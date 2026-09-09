import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Award, Flame, Leaf, CheckCircle2, Star, Truck, Check, Store } from "lucide-react";
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
        origin: p.origin || "Nagaur, Rajasthan",
        grade: "Grade A1 Export Quality",
        description: p.description,
        rating: p.rating,
        reviewCount: p.numReviews,
        bestseller: p.isFeatured,
        harvestSeason: "Winter 2024 Fresh Harvest",
        aromaProfile: "Rich, authentic, fragrant",
        images:
          p.images && p.images.length > 0
            ? p.images.map((imgUrl, i) => ({
                id: `${p.id}-${i}`,
                url: imgUrl,
                alt: p.name,
                isPrimary: i === 0,
                order: i + 1,
              }))
            : [
                {
                  id: `${p.id}-default`,
                  url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
                  alt: p.name,
                  isPrimary: true,
                  order: 1,
                },
              ],
        variants: p.variants.map((v) => ({
          id: v.id,
          productId: p.id,
          weight: v.weight,
          weightGrams: parseInt(v.weight) || 100,
          price: Number(v.price),
          mrp: v.discountedPrice ? Number(v.discountedPrice) : Math.round(Number(v.price) * 1.2),
          stock: v.stockQuantity,
          sku: v.sku,
        })),
      })) as any;
    }

    const dbCategories = await prisma.category.findMany({
      take: 3,
    });
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories as any;
    }
  } catch (error) {
    console.error("Database fetch fallback:", error);
  }

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* Dynamic Hero Section - Powered by Neon DB CMS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE4] to-[#FAF7F2] pt-8 sm:pt-16 pb-16 sm:pb-20 border-b border-cream-300">
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-secondary-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {hero.badgeText && (
                <div className="inline-flex items-center gap-2 rounded-full border border-secondary-300 bg-secondary-50 px-4 py-1.5 text-xs font-bold text-secondary-800 shadow-xs">
                  <Leaf className="h-3.5 w-3.5 text-secondary-600" />
                  <span>{hero.badgeText}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.12]">
                {hero.heading}{" "}
                <span className="text-cinnamon italic block sm:inline">{hero.headingHighlight}</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {hero.paragraph}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href={hero.primaryButtonLink || "/products"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-cinnamon-600 text-white font-bold text-sm shadow-spice-md transition-all active:scale-[0.99]">
                    <span>{hero.primaryButtonText || "Explore Pure Spices"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={hero.secondaryButtonLink || "/products?category=ground-spices"} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-charcoal border-cream-400 bg-white hover:bg-cream-100 text-sm font-semibold shadow-xs">
                    <Sparkles className="h-4 w-4 text-turmeric-600 mr-1.5" />
                    {hero.secondaryButtonText || "Stone-Ground Powders"}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-300 text-left max-w-lg mx-auto lg:mx-0">
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-cream-200 shadow-xs">
                  <p className="font-display text-lg sm:text-2xl font-black text-charcoal">{hero.stat1Value || "100%"}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{hero.stat1Label || "Pure & Unadulterated"}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-cream-200 shadow-xs">
                  <p className="font-display text-lg sm:text-2xl font-black text-cinnamon">{hero.stat2Value || "₹30+"}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{hero.stat2Label || "Factory Direct Rates"}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-cream-200 shadow-xs">
                  <p className="font-display text-lg sm:text-2xl font-black text-charcoal">{hero.stat3Value || "0%"}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{hero.stat3Label || "Added Colors"}</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Image & Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-cream-100">
                <Image
                  src={hero.heroImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85"}
                  alt="Pure Stone-Ground Rajasthan Spices"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                {/* Floating Quality Badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl border border-cream-200">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-cinnamon flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-charcoal">Pure & Lab Certified</h4>
                      <p className="text-[11px] text-muted-foreground">Cold stone-ground with zero lead chromate or fillers.</p>
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-cream-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cinnamon">
              Direct Factory Catalog
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-0.5">
              Explore Pure Spice Collections
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select stone-ground pure powders, whole fragrant seeds, or traditional masala blends.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs sm:text-sm font-bold text-cinnamon hover:text-cinnamon-700 flex items-center gap-1 group bg-cream-100 hover:bg-cream-200 px-4 py-2 rounded-xl border border-cream-300 transition-colors"
          >
            <span>View All Spices</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-72 overflow-hidden rounded-3xl border border-cream-300 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-95"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              <div className="relative z-10 text-white space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-turmeric/90 text-charcoal font-bold text-[10px] uppercase tracking-wider">
                  Direct Harvest
                </span>
                <h3 className="font-serif text-2xl font-bold">{cat.name}</h3>
                <p className="text-xs text-cream-200 line-clamp-2 opacity-90 leading-relaxed">
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
          title="Factory Direct Bestsellers"
          subtitle="Unadulterated single-origin spices chosen by chefs, households, and catering businesses across India."
        />
      </section>

      {/* Artisanal Heritage Process Spotlight */}
      <section className="bg-charcoal text-cream-200 py-16 sm:py-20 border-y border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-turmeric">
              The ND Spices Quality Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white mt-2">
              From Rajasthan Soil to Gourmet Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-cream-300/80 mt-2">
              We eliminate middlemen and chemical enhancers with our clean 3-step stone-ground protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#242424] border border-white/10 rounded-3xl p-7 relative space-y-3 hover:border-cinnamon/40 transition-colors">
              <span className="font-display font-black text-5xl text-white/10 absolute top-5 right-6">
                01
              </span>
              <div className="h-12 w-12 rounded-2xl bg-cinnamon/20 border border-cinnamon/30 flex items-center justify-center text-cinnamon mb-2">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Handpicked Whole Harvest</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Cleaned stemless red chillies, machine-graded bold coriander seeds, and high-curcumin turmeric rhizomes from verified farms.
              </p>
            </div>

            <div className="bg-[#242424] border border-white/10 rounded-3xl p-7 relative space-y-3 hover:border-cardamom/40 transition-colors">
              <span className="font-display font-black text-5xl text-white/10 absolute top-5 right-6">
                02
              </span>
              <div className="h-12 w-12 rounded-2xl bg-cardamom/20 border border-cardamom/30 flex items-center justify-center text-cardamom mb-2">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Low-RPM Cold Stone Grinding</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Traditional stone chakki mills operate below 35°C to preserve natural volatile essential oils and rich colors without burning.
              </p>
            </div>

            <div className="bg-[#242424] border border-white/10 rounded-3xl p-7 relative space-y-3 hover:border-turmeric/40 transition-colors">
              <span className="font-display font-black text-5xl text-white/10 absolute top-5 right-6">
                03
              </span>
              <div className="h-12 w-12 rounded-2xl bg-turmeric/20 border border-turmeric/30 flex items-center justify-center text-turmeric mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Aroma-Sealed Fresh Packaging</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Heavy-gauge barrier pouches and jars sealed immediately at the factory to guarantee authentic flavor and freshness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-cinnamon">
            Verified Customer Reviews
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Trusted by Cooks & Caterers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Read what home cooks and culinary businesses say about ND Spices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic">
              "The Pure Red Chilli Powder from ND Spices gives our gravies a rich natural crimson color without any sharp chemical aftertaste. Authentic Rajasthan quality!"
            </p>
            <div className="pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-charcoal">Chef Arvind Raghavan</p>
              <p className="text-[11px] text-muted-foreground">Executive Chef, Bengaluru</p>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic">
              "The High Curcumin Turmeric Powder is visibly deeper in golden hue and aroma. Clean, pure, and absolutely unadulterated."
            </p>
            <div className="pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-charcoal">Pooja Nambiar</p>
              <p className="text-[11px] text-muted-foreground">Holistic Nutritionist, Mumbai</p>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex text-turmeric">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic">
              "The stone-ground Coriander Powder and Seeds have an unforgettable sweet fragrance. You notice the difference immediately upon opening the pack."
            </p>
            <div className="pt-3 border-t border-cream-200">
              <p className="text-xs font-bold text-charcoal">Ramesh Sharma</p>
              <p className="text-[11px] text-muted-foreground">Wholesale Buyer, Didwana</p>
            </div>
          </div>
        </div>
      </section>

      {/* B2B & Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cinnamon via-cinnamon-800 to-charcoal rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              B2B & Bulk Supply
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold">
              Looking for Wholesale Spices in Bulk?
            </h3>
            <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
              We supply 25kg, 50kg, and 100kg+ commercial lots of pure Red Chilli, Coriander, and Turmeric powders directly to restaurants, caterers, and wholesalers at direct factory rates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="https://wa.me/918047524652?text=Hello%20ND%20Spices%2C%20I%20am%20interested%20in%20wholesale%20bulk%20spice%20orders."
              target="_blank"
              className="px-6 py-3.5 bg-turmeric hover:bg-turmeric-400 text-charcoal font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all text-center"
            >
              WhatsApp Wholesale Team
            </Link>
            <Link
              href="/products"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all text-center"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
