import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Starting ND Spices database seed...");

  // 1. Clean existing records in reverse dependency order
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

  // 2. Seed Users
  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const userPasswordHash = await bcrypt.hash("Customer@1234", 10);

  const admin = await prisma.user.create({
    data: {
      name: "ND Spices Administrator",
      email: "admin@ndspices.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: "+91 98450 12345",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "customer@ndspices.com",
      passwordHash: userPasswordHash,
      role: Role.USER,
      phone: "+91 98765 43210",
    },
  });

  console.log("👤 Created Admin and Customer users");

  // 3. Seed Addresses
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

  // 4. Seed Categories
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

  console.log("📂 Created 4 spice categories");

  // 5. Seed Products and Variants
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
      rating: 4.9,
      numReviews: 110,
      images: [
        "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Glass Jar with Grinder Cap", price: 199, discountedPrice: 179, stockQuantity: 120, sku: "ND-PEP-100G" },
        { weight: "250g Refill Pouch", price: 449, discountedPrice: 399, stockQuantity: 90, sku: "ND-PEP-250G" },
        { weight: "500g Kitchen Pack", price: 849, discountedPrice: 749, stockQuantity: 50, sku: "ND-PEP-500G" },
      ],
    },
    {
      name: "Lakadong Turmeric Powder (7.5%+ Curcumin)",
      slug: "lakadong-turmeric-powder-high-curcumin",
      categoryId: catGround.id,
      origin: "Jaintia Hills, Meghalaya",
      description: "Direct from indigenous tribal farmers in Lakadong. Naturally boasts an extraordinary 7.5% to 8.5% curcumin content. Rich amber hue and deep earthy therapeutic potency.",
      isFeatured: true,
      inStock: true,
      rating: 4.9,
      numReviews: 215,
      images: [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Tin", price: 189, discountedPrice: 169, stockQuantity: 140, sku: "ND-TUR-100G" },
        { weight: "250g Pack", price: 399, discountedPrice: 349, stockQuantity: 100, sku: "ND-TUR-250G" },
        { weight: "500g Value Pack", price: 749, discountedPrice: 649, stockQuantity: 60, sku: "ND-TUR-500G" },
      ],
    },
    {
      name: "True Ceylon Cinnamon Quills (Alba Grade)",
      slug: "true-ceylon-cinnamon-alba",
      categoryId: catWhole.id,
      origin: "Wayanad Biosphere, Kerala",
      description: "Paper-thin, layered quills of authentic botanical cinnamon. Ultra-low in coumarin with naturally sweet, fragrant woody notes.",
      isFeatured: false,
      inStock: true,
      rating: 4.8,
      numReviews: 76,
      images: [
        "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Pouch", price: 249, discountedPrice: 220, stockQuantity: 80, sku: "ND-CIN-100G" },
        { weight: "250g Kitchen Pack", price: 549, discountedPrice: 489, stockQuantity: 50, sku: "ND-CIN-250G" },
      ],
    },
    {
      name: "Guntur Sannam S4 Stemless Red Chili Powder",
      slug: "guntur-sannam-red-chili-powder",
      categoryId: catGround.id,
      origin: "Guntur, Andhra Pradesh",
      description: "Pure sun-dried S4 chilies cold pounded to retain capsaicin oils and vibrant scarlet hue. Bold fiery heat with authentic smoky flavor.",
      isFeatured: false,
      inStock: true,
      rating: 4.7,
      numReviews: 89,
      images: [
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "250g Pouch", price: 220, discountedPrice: 195, stockQuantity: 90, sku: "ND-CHI-250G" },
        { weight: "500g Pack", price: 410, discountedPrice: 360, stockQuantity: 65, sku: "ND-CHI-500G" },
      ],
    },
    {
      name: "Royal Shahi Garam Masala Blend",
      slug: "royal-shahi-garam-masala-blend",
      categoryId: catBlends.id,
      origin: "Delhi Durbar Heritage Recipe",
      description: "A 16-spice royal heirloom blend featuring green cardamom, black cardamom, mace, nutmeg, star anise, and roasted stone-flower. Transforms curries into banquet masterpieces.",
      isFeatured: true,
      inStock: true,
      rating: 5.0,
      numReviews: 165,
      images: [
        "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { weight: "100g Vintage Tin", price: 249, discountedPrice: 219, stockQuantity: 110, sku: "ND-GMS-100G" },
        { weight: "250g Refill Pack", price: 549, discountedPrice: 479, stockQuantity: 75, sku: "ND-GMS-250G" },
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
      },
    });
  }

  console.log("🌶️ Created Products, Variants, and Verified Reviews");

  // 6. Seed Coupons
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
