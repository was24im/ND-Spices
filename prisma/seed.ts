import { PrismaClient, Role, MediaType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../src/lib/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Starting clean ND Spices database seed with official product catalog...");

  // 1. Clean existing records in reverse dependency order
  await prisma.leadNote.deleteMany().catch(() => {});
  await prisma.lead.deleteMany().catch(() => {});
  await prisma.invoiceItem.deleteMany().catch(() => {});
  await prisma.invoice.deleteMany().catch(() => {});
  await prisma.auditLog.deleteMany().catch(() => {});
  await prisma.mediaAsset.deleteMany().catch(() => {});
  await prisma.websiteContent.deleteMany().catch(() => {});
  await prisma.themeSettings.deleteMany().catch(() => {});
  await prisma.websiteSettings.deleteMany().catch(() => {});
  await prisma.review.deleteMany().catch(() => {});
  await prisma.wishlistItem.deleteMany().catch(() => {});
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.address.deleteMany().catch(() => {});
  await prisma.productVariant.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.coupon.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // 2. Seed Only Essential Backend Admin & Staff Accounts
  const superAdminPasswordHash = await bcrypt.hash("supersecretadminpassword", 10);
  const staffPasswordHash = await bcrypt.hash("Staff@1234", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "ND Spices Super Admin",
      email: "admin@ndspices.com",
      passwordHash: superAdminPasswordHash,
      role: Role.SUPER_ADMIN,
      phone: "+91 8047524652",
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Sohel Afroj (Sales & Operations)",
      email: "staff@ndspices.com",
      passwordHash: staffPasswordHash,
      role: Role.STAFF,
      phone: "+91 8047524652",
    },
  });

  console.log("👤 Initialized Super Admin and Staff accounts");

  // 3. Seed Default Website Settings & Theme Settings with New Brand Identity
  await prisma.websiteSettings.create({
    data: {
      id: "default-settings",
      storeName: "ND Spices",
      tagLine: "100% Pure Indian Heritage Spices & Cold Stone-Ground Aromatics",
      contactEmail: "contact@ndspices.com",
      contactPhone: "+91 8047524652",
      address: "Sherani Jamat Khana Ke Paas, Noori Mohalla, Sherani Abad, Didwana Kuchaman, Nagaur, Rajasthan - 341302, India",
      gstNumber: "08AABCU9603R1ZM",
      fssaiNumber: "12221004000182",
      whatsappNumber: "+918047524652",
      isWhatsappEnabled: true,
      freeShippingMin: 499 as any,
      flatShippingRate: 50 as any,
      taxRatePercent: 5.0,
      isCodEnabled: true,
      isRazorpayEnabled: true,
      seoTitle: "ND Spices | Pure Red Chilli, Coriander, Turmeric & Jeera, Nagaur",
      seoDescription: "Manufacturer & supplier of 100% pure Red Chilli, Coriander Seeds & Powder, High Curcumin Turmeric, Kasuri Methi, and Jeera. Based in Nagaur, Rajasthan.",
      seoKeywords: "red chilli, kashmiri dabi, byadgi 2043, teja red chilli, coriander seeds, turmeric finger, kasuri methi, jeera, nd spices",
      ogImageUrl: "/images/hero/indian-spices-banner.jpg",
    },
  });

  await prisma.themeSettings.create({
    data: {
      id: "default-theme",
      primaryColor: "#3D1E16", // Rich Cola
      secondaryColor: "#562D22", // Warm Cola
      accentColor: "#78483B", // Caramel Cola
      backgroundColor: "#FFFFFF",
      textColor: "#2B140E",
      fontFamily: "Playfair Display",
      borderRadius: "0.75rem",
      buttonStyle: "rounded",
      heroBannerUrl: "/images/hero/indian-spices-banner.jpg",
      logoUrl: "/images/branding/logo.svg",
      faviconUrl: "/images/branding/logo-icon.svg",
    },
  });

  // 4. Seed Website Content (CMS) with minimal company & origins copy
  await prisma.websiteContent.createMany({
    data: [
      {
        key: "homepage.hero",
        section: "hero",
        content: {
          badgeText: "Nagaur, Rajasthan · Heritage Spice House",
          badgeTextHi: "नागौर, राजस्थान · स्थापित विरासत",
          heading: "ND Spices — Authentic spices, true to their Indian origin.",
          headingHi: "एनडी स्पाइसेस — अपने मूल क्षेत्र से शुद्ध भारतीय मसाले।",
          headingHighlight: "",
          headingHighlightHi: "",
          paragraph:
            "ND Spices is a Nagaur-based manufacturer and supplier of single-origin whole spices and cold stone-ground powders. We source directly from India's historic growing belts and mill slowly at low temperatures with zero artificial colors or fillers.",
          paragraphHi:
            "एनडी स्पाइसेस नागौर, राजस्थान स्थित एक प्रमुख मसाला निर्माता व आपूर्तिकर्ता कंपनी है। हम भारत के प्रसिद्ध मसाला क्षेत्रों से सीधे साबुत फसल प्राप्त कर, धीमी पत्थर पिसाई द्वारा बिना किसी मिलावट के शुद्ध मसाले तैयार करते हैं।",
          primaryButtonText: "Explore Our Spices",
          primaryButtonTextHi: "हमारे मसाले देखें",
          primaryButtonLink: "/products",
          secondaryButtonText: "Our Origins",
          secondaryButtonTextHi: "उत्पत्ति व स्रोत जानें",
          secondaryButtonLink: "/#origins",
          heroImage: "/images/hero/indian-spices-banner.jpg",
          stat1Value: "100%",
          stat1Label: "Pure & Unadulterated",
          stat2Value: "₹30+",
          stat2Label: "Direct Factory Rates",
          stat3Value: "0%",
          stat3Label: "Added Colors / Starch",
        },
      },
      {
        key: "homepage.announcement",
        section: "banner",
        content: {
          marqueeText: "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹499 ✦ AUTHENTIC WHOLE RED CHILLI, CORIANDER, TURMERIC & KASURI METHI ✦ USE CODE: WELCOME10 FOR 10% OFF ✦ B2B WHOLESALE AVAILABLE ✦",
        },
      },
      {
        key: "homepage.story",
        section: "story",
        content: {
          title: "Authentic Spice Heritage of Nagaur & India",
          subtitle: "Why unadulterated stone-ground spices make all the difference",
          paragraph: "Unlike commercial supermarket brands that extract precious volatile oils or blend artificial coloring, ND Spices processes pure, hand-selected spices with traditional care to preserve natural aroma, heat, and nutrition.",
          image: "/images/categories/whole-red-chilli.jpg",
        },
      },
    ],
  });

  console.log("🎨 Created Website Settings, Theme, and CMS Content");

  // 5. Seed Real Categories
  const categoryMap = new Map<string, string>();

  for (let i = 0; i < MOCK_CATEGORIES.length; i++) {
    const cat = MOCK_CATEGORIES[i];
    const createdCat = await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        nameHi: cat.nameHi,
        slug: cat.slug,
        description: cat.description,
        descriptionHi: cat.descriptionHi,
        image: cat.image,
        displayOrder: i + 1,
      },
    });
    categoryMap.set(cat.id, createdCat.id);
  }

  console.log(`📁 Seeded ${MOCK_CATEGORIES.length} Real Categories`);

  // 6. Seed All 23 Product Varieties
  for (const p of MOCK_PRODUCTS) {
    const { variants, categoryId, id, ...prodFields } = p;
    const catDbId = categoryMap.get(categoryId) || categoryId;

    await prisma.product.create({
      data: {
        id,
        name: prodFields.name,
        nameHi: prodFields.nameHi,
        slug: prodFields.slug,
        description: prodFields.description,
        descriptionHi: prodFields.descriptionHi,
        origin: prodFields.origin,
        originHi: prodFields.originHi,
        categoryId: catDbId,
        isFeatured: prodFields.featured,
        inStock: true,
        isVisible: true,
        rating: prodFields.rating || 4.9,
        numReviews: prodFields.reviewCount || 0,
        images: prodFields.images.map((img) => img.url),
        variants: {
          create: variants.map((v) => ({
            weight: v.weight,
            price: v.price as any,
            discountedPrice: (v.mrp ? v.price : null) as any,
            stockQuantity: v.stock || 100,
            sku: v.sku,
          })),
        },
      },
    });
  }

  console.log(`📦 Seeded all ${MOCK_PRODUCTS.length} Official Catalog Products & Varieties`);

  // 7. Seed Real Promotional Coupon
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountPercent: 10.0,
      minOrderValue: 299 as any,
      maxDiscount: 150 as any,
      isActive: true,
      usageLimit: 1000,
    },
  });

  console.log("✨ ND Spices database complete seed successful!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
