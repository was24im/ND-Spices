import { PrismaClient, Role, MediaType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Starting clean ND Spices database seed (no dummy/mock data)...");

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

  // 3. Seed Default Website Settings & Theme Settings
  await prisma.websiteSettings.create({
    data: {
      id: "default-settings",
      storeName: "ND Spices",
      tagLine: "100% Pure Heritage Spices & Cold Stone-Ground Aromatics",
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
      seoTitle: "ND Spices | Pure Red Chilli, Coriander & Turmeric Powders, Nagaur",
      seoDescription: "Manufacturer & supplier of 100% pure Red Chilli Powder, Coriander Powder, Coriander Seeds, and High Curcumin Turmeric Powder. Based in Nagaur, Rajasthan.",
      seoKeywords: "red chilli powder, coriander powder, coriander seeds, turmeric powder, pure spices nagaur rajasthan, nd spices",
      ogImageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200",
    },
  });

  await prisma.themeSettings.create({
    data: {
      id: "default-theme",
      primaryColor: "#7B241C",
      secondaryColor: "#196F3D",
      accentColor: "#D4AC0D",
      backgroundColor: "#FDFBF7",
      textColor: "#1E1E1E",
      fontFamily: "Playfair Display",
      borderRadius: "1.5rem",
      buttonStyle: "pill",
      heroBannerUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
    },
  });

  // 4. Seed Website Content (CMS)
  await prisma.websiteContent.createMany({
    data: [
      {
        key: "homepage.hero",
        section: "hero",
        content: {
          badgeText: "Direct from Rajasthan Farms • Lab Tested 100% Pure",
          heading: "Pure Heritage Spices,",
          headingHighlight: "Authentic Stone-Ground Flavour.",
          paragraph: "Manufactured from selected stemless red chillies, machine-cleaned coriander seeds, and golden turmeric rhizomes. Free from artificial colors, chemical preservatives, and adulterants.",
          primaryButtonText: "Explore Spice Harvests",
          primaryButtonLink: "/products",
          secondaryButtonText: "B2B Bulk Inquiries",
          secondaryButtonLink: "/products?category=ground-spices",
          heroImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
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
          marqueeText: "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹499 ✦ PURE RED CHILLI & CORIANDER POWDER AT DIRECT FACTORY RATES ✦ USE CODE: WELCOME10 FOR 10% OFF ✦ B2B & BULK ORDERS WELCOME ✦",
        },
      },
      {
        key: "homepage.story",
        section: "story",
        content: {
          title: "Authentic Spice Heritage of Nagaur",
          subtitle: "Why unadulterated stone-ground spices make all the difference",
          paragraph: "Unlike commercial supermarket brands that extract precious volatile oils or blend artificial coloring, ND Spices processes pure, hand-selected spices with traditional care to preserve natural aroma, heat, and nutrition.",
          image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
        },
      },
    ],
  });

  console.log("🎨 Created Website Settings, Theme, and CMS Content");

  // 5. Seed Real Product Categories
  const catGround = await prisma.category.create({
    data: {
      name: "Pure Ground Powders",
      slug: "ground-spices",
      description: "100% Pure Red Chilli, Turmeric, and Coriander powders stone-ground below 35°C with zero colorants.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catWhole = await prisma.category.create({
    data: {
      name: "Whole Spices & Seeds",
      slug: "whole-spices",
      description: "Sun-cured Rajasthan whole coriander seeds, Wayanad Tellicherry black pepper, and high-elevation green cardamom.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catBlends = await prisma.category.create({
    data: {
      name: "Authentic Masala Blends",
      slug: "heritage-blends",
      description: "Traditional 18-spice slow-roasted garam masalas for rich curries and royal biryanis.",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
    },
  });

  // 6. Seed Actual Spice Catalog (with 0 fake reviews and clean ratings)
  const productsData = [
    {
      name: "Pure Red Chilli Powder (Lal Mirch Powder)",
      slug: "pure-red-chilli-powder",
      categoryId: catGround.id,
      origin: "Nagaur, Rajasthan",
      description: "Finely ground from selected stemless sun-dried red chillies of Rajasthan. Delivers an authentic vibrant red color and natural fiery warmth without any artificial color enhancers or fillers.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 35, discountedPrice: 30, stockQuantity: 150, sku: "ND-RC-100G" },
        { weight: "250g Pack", price: 75, discountedPrice: 70, stockQuantity: 100, sku: "ND-RC-250G" },
        { weight: "500g Pack", price: 140, discountedPrice: 130, stockQuantity: 80, sku: "ND-RC-500G" },
        { weight: "1kg Bulk Pack", price: 240, discountedPrice: 220, stockQuantity: 50, sku: "ND-RC-1KG" },
      ],
    },
    {
      name: "Pure Coriander Powder (Dhaniya Powder)",
      slug: "pure-coriander-powder",
      categoryId: catGround.id,
      origin: "Nagaur, Rajasthan",
      description: "Stone-ground from high-grade green coriander seeds of Rajasthan. Carefully cleaned and milled at gentle low temperatures to preserve natural volatile essential oils.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 30, discountedPrice: 25, stockQuantity: 180, sku: "ND-CP-100G" },
        { weight: "250g Pack", price: 65, discountedPrice: 60, stockQuantity: 120, sku: "ND-CP-250G" },
        { weight: "500g Pack", price: 120, discountedPrice: 110, stockQuantity: 90, sku: "ND-CP-500G" },
        { weight: "1kg Bulk Pack", price: 200, discountedPrice: 180, stockQuantity: 60, sku: "ND-CP-1KG" },
      ],
    },
    {
      name: "Pure Turmeric Powder (High Curcumin Haldi)",
      slug: "pure-turmeric-powder",
      categoryId: catGround.id,
      origin: "Nagaur, Rajasthan",
      description: "Finely milled pure golden turmeric rhizomes containing high natural curcumin levels. Zero lead chromate, chalk, or chemical coloring.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 35, discountedPrice: 30, stockQuantity: 160, sku: "ND-TP-100G" },
        { weight: "250g Pack", price: 80, discountedPrice: 75, stockQuantity: 110, sku: "ND-TP-250G" },
        { weight: "500g Pack", price: 150, discountedPrice: 140, stockQuantity: 75, sku: "ND-TP-500G" },
        { weight: "1kg Bulk Pack", price: 260, discountedPrice: 240, stockQuantity: 55, sku: "ND-TP-1KG" },
      ],
    },
    {
      name: "Whole Coriander Seeds (Sabut Dhaniya)",
      slug: "whole-coriander-seeds",
      categoryId: catWhole.id,
      origin: "Nagaur, Rajasthan",
      description: "Sun-cured, machine cleaned, premium bold green coriander seeds with high volatile oil concentration. Perfect for roasting and fresh tempering.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 35, discountedPrice: 30, stockQuantity: 120, sku: "ND-CS-100G" },
        { weight: "250g Pack", price: 75, discountedPrice: 70, stockQuantity: 80, sku: "ND-CS-250G" },
        { weight: "500g Pack", price: 140, discountedPrice: 130, stockQuantity: 60, sku: "ND-CS-500G" },
        { weight: "1kg Bulk Pack", price: 240, discountedPrice: 220, stockQuantity: 40, sku: "ND-CS-1KG" },
      ],
    },
    {
      name: "Alleppey Green Cardamom (8mm+ Extra Bold)",
      slug: "alleppey-green-cardamom-jumbo",
      categoryId: catWhole.id,
      origin: "Idukki Hills, Kerala",
      description: "Handpicked from mist-covered plantations at 3,500ft elevation. Graded at 8mm+ diameter, packed with dark resinous seeds overflowing with sweet herbal fragrance.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Glass Jar", price: 349, discountedPrice: 319, stockQuantity: 60, sku: "ND-CRD-100G" },
        { weight: "250g Aroma Pack", price: 799, discountedPrice: 729, stockQuantity: 40, sku: "ND-CRD-250G" },
        { weight: "500g Value Pack", price: 1499, discountedPrice: 1349, stockQuantity: 25, sku: "ND-CRD-500G" },
      ],
    },
    {
      name: "Tellicherry Black Pepper (Garbled Extra Bold)",
      slug: "tellicherry-black-pepper-tgseb",
      categoryId: catWhole.id,
      origin: "Wayanad, Kerala",
      description: "Sun-cured Tellicherry extra bold whole black peppercorns (TGSEB) with high natural piperine content.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 120, discountedPrice: 110, stockQuantity: 80, sku: "ND-BP-100G" },
        { weight: "250g Pack", price: 280, discountedPrice: 260, stockQuantity: 50, sku: "ND-BP-250G" },
        { weight: "500g Pack", price: 520, discountedPrice: 480, stockQuantity: 35, sku: "ND-BP-500G" },
        { weight: "1kg Bulk Pack", price: 950, discountedPrice: 890, stockQuantity: 25, sku: "ND-BP-1KG" },
      ],
    },
    {
      name: "Royal Heritage Garam Masala (18-Spice Blend)",
      slug: "royal-heritage-garam-masala",
      categoryId: catBlends.id,
      origin: "Nagaur, Rajasthan",
      description: "Authentic 18-spice slow-roasted artisanal garam masala. Balanced with stone-ground coriander, cardamom, cloves, cinnamon, mace, and cumin.",
      isFeatured: true,
      inStock: true,
      rating: 0,
      numReviews: 0,
      images: [
        "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pack", price: 60, discountedPrice: 50, stockQuantity: 90, sku: "ND-GM-100G" },
        { weight: "250g Pack", price: 140, discountedPrice: 125, stockQuantity: 65, sku: "ND-GM-250G" },
        { weight: "500g Pack", price: 260, discountedPrice: 235, stockQuantity: 45, sku: "ND-GM-500G" },
        { weight: "1kg Bulk Pack", price: 490, discountedPrice: 440, stockQuantity: 30, sku: "ND-GM-1KG" },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, ...prodFields } = p;
    await prisma.product.create({
      data: {
        ...prodFields,
        variants: {
          create: variants.map((v) => ({
            weight: v.weight,
            price: v.price as any,
            discountedPrice: (v.discountedPrice || null) as any,
            stockQuantity: v.stockQuantity,
            sku: v.sku,
          })),
        },
      },
    });
  }

  console.log(`📦 Seeded ${productsData.length} Real Catalog Products`);

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

  console.log("✨ ND Spices database clean seed complete: 0 dummy leads, 0 dummy invoices, 0 dummy reviews!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
