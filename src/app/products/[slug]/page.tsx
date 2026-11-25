"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useTranslation } from "@/store/useLanguageStore";
import { ProductCard } from "@/components/product/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";
import { ProductType } from "@/types";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { t, isHindi } = useTranslation();

  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(() => {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  });

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"origin" | "aroma" | "health" | "recipes">("origin");
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products?search=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.products?.length > 0) {
          const match = data.data.products.find((p: any) => p.slug === slug);
          if (match) {
            const formatted: ProductType = {
              id: match.id,
              name: match.name,
              nameHi: match.nameHi,
              slug: match.slug,
              description: match.description,
              descriptionHi: match.descriptionHi,
              origin: match.origin,
              originHi: match.originHi,
              spiceLevel: match.spiceLevel || "MEDIUM",
              organic: true,
              featured: match.isFeatured,
              bestseller: match.isFeatured,
              categoryId: match.categoryId,
              rating: match.rating || 4.9,
              reviewCount: match.numReviews || 120,
              images: match.images?.map((url: string, i: number) => ({
                id: `${match.id}-${i}`,
                url,
                alt: match.name,
                isPrimary: i === 0,
                order: i + 1,
              })) || [{ id: "fallback", url: "/images/categories/whole-red-chilli.jpg", isPrimary: true, order: 1 }],
              variants: match.variants?.map((v: any) => ({
                id: v.id,
                productId: match.id,
                weight: v.weight,
                weightGrams: parseInt(v.weight) || 100,
                price: Number(v.price),
                mrp: v.discountedPrice ? Number(v.discountedPrice) : Math.round(Number(v.price) * 1.25),
                stock: v.stockQuantity || 100,
                sku: v.sku,
              })) || [],
            };
            setCurrentProduct(formatted);
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  const product = currentProduct || MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const displayName = isHindi && (product as any).nameHi ? (product as any).nameHi : product.name;
  const displayDesc = isHindi && (product as any).descriptionHi ? (product as any).descriptionHi : product.description;
  const displayOrigin = isHindi && (product as any).originHi ? (product as any).originHi : product.origin;

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const images =
    product.images.length > 0
      ? product.images
      : [{ id: "fallback", url: "/images/categories/whole-red-chilli.jpg", alt: displayName, isPrimary: true, order: 1 }];
  const currentImage = images[selectedImageIndex] || images[0];
  const isWishlisted = isInWishlist(product.id);

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        nameHi: (product as any).nameHi || product.name,
        slug: product.slug,
        weight: activeVariant.weight,
        weightGrams: activeVariant.weightGrams,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        image: images[0].url,
        origin: product.origin || "India",
        originHi: (product as any).originHi || product.origin || "भारत",
      },
      quantity
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const stockCount = activeVariant.stock || 25;

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Minimal Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6E5A54]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#2B140E] transition-colors">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2B140E] transition-colors">
            {t("nav.allSpices")}
          </Link>
          <span>/</span>
          <span className="text-[#2B140E] font-medium truncate">{displayName}</span>
        </nav>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Image Gallery */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F6] border border-[#E8E1DD]">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || displayName}
                fill
                priority
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 border border-[#E8E1DD] hover:border-[#3D1E16]"
                aria-label="Wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-[#3D1E16] text-[#3D1E16]" : "text-[#6E5A54]"}`}
                />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border transition-colors ${
                      selectedImageIndex === idx
                        ? "border-[#3D1E16]"
                        : "border-[#E8E1DD] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt || displayName} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2 border-b border-[#E8E1DD] pb-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#6E5A54]">
                {displayOrigin}
              </p>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B140E] leading-tight">
                {displayName}
              </h1>
              <p className="text-sm text-[#6E5A54] leading-relaxed pt-1">{displayDesc}</p>
            </div>

            {/* Pricing & Stock */}
            <div className="flex items-baseline justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold text-[#2B140E]">
                    {formatPrice(activeVariant.price)}
                  </span>
                  {activeVariant.mrp > activeVariant.price && (
                    <span className="text-sm text-[#6E5A54] line-through">
                      {formatPrice(activeVariant.mrp)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6E5A54]">
                  {t("pdp.inclusiveOfTaxes")} · {isHindi ? "₹499 से अधिक पर मुफ्त डिलीवरी" : "Free shipping over ₹499"}
                </p>
              </div>
              <span className="text-xs font-medium text-[#3D1E16] border border-[#E8E1DD] bg-[#FAF8F6] px-2.5 py-1 rounded-md">
                {stockCount > 0 ? t("catalog.inStock") : t("catalog.outOfStock")}
              </span>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#2B140E]">{t("pdp.selectSize")}</span>
                <span className="text-[#6E5A54] font-mono text-[11px]">SKU: {activeVariant.sku}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`rounded-lg border p-2.5 text-left transition-colors ${
                      selectedVariantIndex === idx
                        ? "border-[#3D1E16] bg-[#3D1E16] text-white"
                        : "border-[#E8E1DD] bg-white text-[#2B140E] hover:bg-[#FAF8F6]"
                    }`}
                  >
                    <p className="text-xs font-medium">{variant.weight}</p>
                    <p className={`text-xs font-bold mt-0.5 ${selectedVariantIndex === idx ? "text-white" : "text-[#3D1E16]"}`}>
                      {formatPrice(variant.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-[#E8E1DD] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 text-[#2B140E] hover:bg-[#FAF8F6] font-medium"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#2B140E]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 text-[#2B140E] hover:bg-[#FAF8F6] font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] py-2.5 px-5 text-sm font-medium text-white transition-colors"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t("pdp.addedToBasket")}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        {t("catalog.addToBasket")} · {formatPrice(activeVariant.price * quantity)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-lg border border-[#3D1E16] bg-white hover:bg-[#FAF8F6] py-2.5 px-5 text-sm font-medium text-[#3D1E16] transition-colors"
              >
                {t("catalog.buyNow")}
              </button>
            </div>
          </div>
        </div>

        {/* Clean Specification Tabs */}
        <section className="rounded-xl border border-[#E8E1DD] bg-[#FAF8F6] p-6 sm:p-8 space-y-5">
          <div className="flex border-b border-[#E8E1DD] overflow-x-auto gap-6">
            {[
              { id: "origin", label: t("pdp.tabOrigin") },
              { id: "aroma", label: t("pdp.tabUsage") },
              { id: "health", label: t("pdp.tabHealth") },
              { id: "recipes", label: t("pdp.tabLabReport") },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs sm:text-sm font-medium border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-[#3D1E16] text-[#2B140E] font-semibold"
                    : "border-transparent text-[#6E5A54] hover:text-[#2B140E]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed space-y-3">
            {activeTab === "origin" && (
              <div className="space-y-4">
                <p>{displayDesc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-lg border border-[#E8E1DD] bg-white p-3.5">
                    <span className="font-semibold text-xs text-[#2B140E]">
                      {isHindi ? "फसल वर्ष" : "Harvest"}
                    </span>
                    <p className="text-xs text-[#6E5A54] mt-0.5">{product.harvestSeason || "Fresh Crop"}</p>
                  </div>
                  <div className="rounded-lg border border-[#E8E1DD] bg-white p-3.5">
                    <span className="font-semibold text-xs text-[#2B140E]">
                      {isHindi ? "उत्पत्ति क्षेत्र" : "Origin"}
                    </span>
                    <p className="text-xs text-[#6E5A54] mt-0.5">{displayOrigin}</p>
                  </div>
                  <div className="rounded-lg border border-[#E8E1DD] bg-white p-3.5">
                    <span className="font-semibold text-xs text-[#2B140E]">
                      {isHindi ? "प्रसंस्करण" : "Processing"}
                    </span>
                    <p className="text-xs text-[#6E5A54] mt-0.5">
                      {isHindi ? "प्राकृतिक रूप से सुखाया व पैक" : "Cleaned & Cold Milled"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "aroma" && (
              <p>
                {isHindi
                  ? `प्राकृतिक सुगंध: ${product.aromaProfile || "विशिष्ट सोंधी महक और प्राकृतिक तेल"}। धीमी पिसाई द्वारा प्राकृतिक तेल सुरक्षित।`
                  : `Volatile essential oils profile: ${product.aromaProfile || "Rich natural terpenes"}. Milled at low temperatures to preserve essential oil density.`}
              </p>
            )}

            {activeTab === "health" && (
              <p>
                {isHindi
                  ? "रसायनों, कृत्रिम रंगों और स्टार्च से पूर्णतः मुक्त।"
                  : "Zero chemical additives, artificial food dyes, or starch fillers."}
              </p>
            )}

            {activeTab === "recipes" && (
              <p>
                {isHindi
                  ? "शुद्ध भारतीय व्यंजनों और तड़के के लिए उपयुक्त। एयरटाइट डिब्बे में रखें।"
                  : "Ideal for everyday Indian cooking and tempering. Store in an airtight container away from direct moisture."}
              </p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="pt-6 border-t border-[#E8E1DD]">
          <ProductReviews
            productId={product.id}
            productName={displayName}
            initialRating={product.rating || 4.9}
            initialNumReviews={product.reviewCount || 120}
          />
        </section>

        {/* Related Products */}
        <section className="pt-6 border-t border-[#E8E1DD] space-y-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B140E]">
            {t("pdp.relatedTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
