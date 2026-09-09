import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus, LeadStatus, InvoiceStatus, MediaType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Starting ND Spices database seed...");

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

  // 2. Seed Users: Super Admin, Staff, and Customer
  const superAdminPasswordHash = await bcrypt.hash("supersecretadminpassword", 10);
  const staffPasswordHash = await bcrypt.hash("Staff@1234", 10);
  const userPasswordHash = await bcrypt.hash("Customer@1234", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "ND Spices Super Admin",
      email: "admin@ndspices.com",
      passwordHash: superAdminPasswordHash,
      role: Role.SUPER_ADMIN,
      phone: "+91 98450 12345",
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Vikram Mehta (Sales & Billing)",
      email: "staff@ndspices.com",
      passwordHash: staffPasswordHash,
      role: Role.STAFF,
      phone: "+91 98110 54321",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "customer@ndspices.com",
      passwordHash: userPasswordHash,
      role: Role.CUSTOMER,
      phone: "+91 98765 43210",
    },
  });

  console.log("👤 Created Super Admin, Staff, and Customer users");

  // 3. Seed Default Website Settings & Theme Settings
  await prisma.websiteSettings.create({
    data: {
      id: "default-settings",
      storeName: "ND Spices",
      tagLine: "100% Single-Origin Pure Heritage Spices & Aromatics",
      contactEmail: "hello@ndspices.com",
      contactPhone: "+91 98450 12345",
      address: "Wayanad Estate Hub, Kerala 673121, India",
      gstNumber: "32AABCU9603R1ZM",
      fssaiNumber: "11321004000182",
      whatsappNumber: "+919845012345",
      isWhatsappEnabled: true,
      freeShippingMin: 499 as any,
      flatShippingRate: 60 as any,
      taxRatePercent: 5.0,
      isCodEnabled: true,
      isRazorpayEnabled: true,
      seoTitle: "ND Spices | 100% Single-Origin Pure Heritage Spices & Aromatics",
      seoDescription: "Single-origin pure Indian spices directly from Kerala and Kashmir estates. Cold stone-ground, lab-tested, unadulterated.",
      seoKeywords: "kashmiri saffron, green cardamom, wayanad black pepper, single origin spices",
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
          badgeText: "Winter 2024 Fresh Harvest Direct from Kerala & Kashmir",
          heading: "Single-Origin Spices,",
          headingHighlight: "Pure Heritage Aromatics.",
          paragraph: "Grown on multi-generational estates in Idukki, Wayanad, and Kashmir. Cold stone-ground and nitrogen sealed at the source to preserve rich essential oils, authentic heat, and unforgettable fragrance.",
          primaryButtonText: "Explore Harvests",
          primaryButtonLink: "/products",
          secondaryButtonText: "Kashmiri Saffron Vault",
          secondaryButtonLink: "/products?category=exotics-and-saffron",
          heroImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
          stat1Value: "8mm+",
          stat1Label: "Jumbo Green Pods",
          stat2Value: "7.5%+",
          stat2Label: "Natural Curcumin",
          stat3Value: "0%",
          stat3Label: "Fillers & Colors",
        },
      },
      {
        key: "homepage.announcement",
        section: "banner",
        content: {
          marqueeText: "✦ FREE EXPRESS DELIVERY ON ORDERS OVER ₹499 ✦ NEW WINTER HARVEST KASHMIRI MOGRA SAFFRON IN STOCK ✦ USE CODE: WELCOME10 FOR 10% OFF ✦ 100% ETHICALLY SOURCED DIRECT FROM FARMS ✦",
        },
      },
      {
        key: "homepage.story",
        section: "story",
        content: {
          title: "The Terroir of Single-Origin Purity",
          subtitle: "Why multi-estate blended supermarket spices lose their soul",
          paragraph: "Commercial grocery brands blend discarded residual crops from dozens of undisclosed industrial farms. ND Spices partners exclusively with dedicated family estates in Kerala's rainforest hills and Kashmir's alpine valleys to deliver unblended purity.",
          image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
        },
      },
    ],
  });

  console.log("🎨 Created Website Settings, Theme, and CMS Content");

  // 5. Seed Addresses
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Aarav Sharma",
      street: "Flat 402, Royal Palms Residency, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      phone: "+91 98765 43210",
      isDefault: true,
    },
  });

  // 6. Seed Categories
  const catWhole = await prisma.category.create({
    data: {
      name: "Whole Spices",
      slug: "whole-spices",
      description: "Sun-dried, unadulterated whole pods, seeds, and barks overflowing with volatile aromatic oils.",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catGround = await prisma.category.create({
    data: {
      name: "Cold Stone-Ground Powders",
      slug: "ground-spices",
      description: "Milled on traditional slow stone chakki mills below 35°C to protect delicate essential aroma compounds.",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catExotic = await prisma.category.create({
    data: {
      name: "Exotics & Saffron",
      slug: "exotics-and-saffron",
      description: "Pristine Grade-A1 Kashmiri Mongra saffron, high-elevation mace blades, and rare botanicals.",
      image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catBlends = await prisma.category.create({
    data: {
      name: "Heritage Masalas",
      slug: "heritage-blends",
      description: "Generational secret spice recipes roasted in brass urlis for royal curries, biryanis, and chai.",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
    },
  });

  // 7. Seed Products and Variants
  const productsData = [
    {
      name: "Alleppey Green Cardamom (8mm+ Jumbo Pods)",
      slug: "alleppey-green-cardamom-jumbo",
      categoryId: catWhole.id,
      origin: "Idukki Hills, Kerala",
      description: "Handpicked from mist-covered plantations at 3,500ft elevation. Graded at 8mm+ diameter, packed with dark resinous seeds overflowing with intense cineole and sweet herbal eucalyptus fragrance.",
      isFeatured: true,
      inStock: true,
      rating: 4.9,
      numReviews: 142,
      images: [
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Glass Jar", price: 349, discountedPrice: 319, stockQuantity: 100, sku: "ND-CRD-100G" },
        { weight: "250g Aroma Pouch", price: 799, discountedPrice: 729, stockQuantity: 60, sku: "ND-CRD-250G" },
        { weight: "500g Value Pack", price: 1499, discountedPrice: 1349, stockQuantity: 30, sku: "ND-CRD-500G" },
      ],
    },
    {
      name: "Kashmiri Mongra Saffron (Grade A1)",
      slug: "kashmiri-mongra-saffron-grade-a1",
      categoryId: catExotic.id,
      origin: "Pampore, Kashmir",
      description: "100% pure crimson stigmas harvested from the high plateaus of Pampore. Unbroken threads rich in safranal and crocin for radiant golden tint and intoxicating floral honey aroma.",
      isFeatured: true,
      inStock: true,
      rating: 5.0,
      numReviews: 98,
      images: [
        "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "1g Royal Acrylic Box", price: 499, discountedPrice: 449, stockQuantity: 150, sku: "ND-SAF-1G" },
        { weight: "2g Collectors Tin", price: 949, discountedPrice: 849, stockQuantity: 80, sku: "ND-SAF-2G" },
        { weight: "5g Heritage Vault", price: 2199, discountedPrice: 1999, stockQuantity: 40, sku: "ND-SAF-5G" },
      ],
    },
    {
      name: "Tellicherry Garbled Extra Bold Black Pepper (TGSEB)",
      slug: "tellicherry-black-pepper-tgseb",
      categoryId: catWhole.id,
      origin: "Thalassery, Malabar Coast",
      description: "The crown jewel of peppercorns. Only the top 10% largest, fully ripened 4.75mm+ berries qualify as TGSEB. Delivers rich warmth paired with complex citrus and cedarwood nuances.",
      isFeatured: true,
      inStock: true,
      rating: 4.8,
      numReviews: 115,
      images: [
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "150g Glass Grinder Jar", price: 280, discountedPrice: 250, stockQuantity: 85, sku: "ND-PEP-150G" },
        { weight: "500g Chef Pack", price: 699, discountedPrice: 629, stockQuantity: 50, sku: "ND-PEP-500G" },
      ],
    },
    {
      name: "Lakadong Turmeric Powder (7.5%+ High Curcumin)",
      slug: "lakadong-high-curcumin-turmeric-powder",
      categoryId: catGround.id,
      origin: "Jaintia Hills, Meghalaya",
      description: "World-renowned Lakadong rhizomes boasting an astounding 7.5% - 8.2% natural curcumin content. Intense earthy sweetness and potent bioactive therapeutic power.",
      isFeatured: true,
      inStock: true,
      rating: 4.9,
      numReviews: 210,
      images: [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "200g Eco Tin", price: 249, discountedPrice: 220, stockQuantity: 120, sku: "ND-TUR-200G" },
        { weight: "500g Foil Pouch", price: 499, discountedPrice: 449, stockQuantity: 70, sku: "ND-TUR-500G" },
      ],
    },
  ];

  for (const item of productsData) {
    const { variants, ...prod } = item;
    const createdProduct = await prisma.product.create({
      data: prod,
    });

    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          ...v,
          productId: createdProduct.id,
        },
      });
    }

    // Add a verified review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        comment: `Outstanding freshness and aroma. The single-origin difference in this ${prod.name} is evident right away!`,
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });
  }

  // 8. Seed Sample Leads (CRM)
  const lead1 = await prisma.lead.create({
    data: {
      name: "Chef Rajesh Kapoor",
      email: "rajesh@thegrandculinary.com",
      phone: "+91 98200 44556",
      company: "The Grand Heritage Bistro",
      source: "Wholesale Contact Form",
      status: LeadStatus.QUALIFIED,
      spiceInterest: "Bulk Grade-A1 Saffron & 8mm Green Cardamom",
      estimatedValue: 75000 as any,
      assignedToId: staff.id,
    },
  });

  await prisma.leadNote.create({
    data: {
      leadId: lead1.id,
      authorId: staff.id,
      note: "Spoke with Executive Chef Rajesh. Requested sample batches of 100g Saffron and 500g Cardamom for kitchen testing.",
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Pooja Singhania",
      email: "pooja@artisanalteahouse.in",
      phone: "+91 99100 88776",
      company: "Artisanal Chai & Botanicals",
      source: "WhatsApp Inquiry",
      status: LeadStatus.NEW,
      spiceInterest: "Tellicherry Black Pepper & Lakadong Turmeric",
      estimatedValue: 32000 as any,
      assignedToId: staff.id,
    },
  });

  console.log("📋 Created sample CRM Leads & Notes");

  // 9. Seed Sample Invoices (Billing)
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2024-001",
      customerName: "The Grand Heritage Bistro (Attn: Chef Rajesh)",
      customerEmail: "rajesh@thegrandculinary.com",
      customerPhone: "+91 98200 44556",
      billingAddress: "45 MG Road, Fort Heritage District, Mumbai, MH 400001",
      subtotal: 50000 as any,
      taxPercent: 5.0,
      taxAmount: 2500 as any,
      discountAmount: 2500 as any,
      finalAmount: 50000 as any,
      status: InvoiceStatus.ISSUED,
      paymentMethod: "Bank Transfer (NEFT/RTGS)",
      notes: "Commercial spice wholesale order - 30 days payment term.",
      createdById: staff.id,
      items: {
        create: [
          {
            description: "Kashmiri Mongra Saffron (Grade A1) - 50g Wholesale Pack",
            quantity: 2,
            unitPrice: 18000 as any,
            totalPrice: 36000 as any,
          },
          {
            description: "Alleppey Green Cardamom (8mm+ Jumbo Pods) - 5kg Bulk Pack",
            quantity: 1,
            unitPrice: 14000 as any,
            totalPrice: 14000 as any,
          },
        ],
      },
    },
  });

  console.log("🧾 Created sample Billing Invoice");

  // 10. Seed Media Assets
  await prisma.mediaAsset.createMany({
    data: [
      {
        title: "Kashmiri Saffron Harvest",
        url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
        type: MediaType.BANNER,
        category: "banners",
      },
      {
        title: "Alleppey Green Cardamom Pods",
        url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
        type: MediaType.IMAGE,
        category: "products",
      },
      {
        title: "Artisanal Spice Mortar Hero",
        url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
        type: MediaType.IMAGE,
        category: "homepage",
      },
    ],
  });

  // 11. Seed Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        discountPercent: 10,
        minOrderValue: 499,
        maxDiscount: 150,
        isActive: true,
        usageLimit: 500,
      },
      {
        code: "SPICEKING",
        discountAmount: 150,
        minOrderValue: 999,
        isActive: true,
        usageLimit: 200,
      },
      {
        code: "FREESHIP",
        discountAmount: 60,
        minOrderValue: 299,
        isActive: true,
        usageLimit: 1000,
      },
    ],
  });

  console.log("🎟️ Created active promotional coupons");
  console.log("✨ ND Spices database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
