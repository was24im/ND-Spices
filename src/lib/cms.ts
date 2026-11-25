import { prisma } from "@/lib/db";

export interface HeroContent {
  badgeText: string;
  badgeTextHi?: string;
  heading: string;
  headingHi?: string;
  headingHighlight: string;
  headingHighlightHi?: string;
  paragraph: string;
  paragraphHi?: string;
  primaryButtonText: string;
  primaryButtonTextHi?: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonTextHi?: string;
  secondaryButtonLink: string;
  heroImage: string;
  stat1Value: string;
  stat1Label: string;
  stat1LabelHi?: string;
  stat2Value: string;
  stat2Label: string;
  stat2LabelHi?: string;
  stat3Value: string;
  stat3Label: string;
  stat3LabelHi?: string;
}

export interface StoryContent {
  title: string;
  titleHi?: string;
  subtitle: string;
  subtitleHi?: string;
  paragraph: string;
  paragraphHi?: string;
  image: string;
}

export interface AnnouncementContent {
  marqueeText: string;
  marqueeTextHi?: string;
}

export const DEFAULT_HERO: HeroContent = {
  badgeText: "Direct From Rajasthan & Heritage Estates • Lab-Tested 100% Pure",
  badgeTextHi: "राजस्थान व प्रमुख खेतों से सीधा • लैब प्रमाणित 100% शुद्ध",
  heading: "Pure Indian Spices,",
  headingHi: "शुद्ध भारतीय मसाले,",
  headingHighlight: "Authentic Stone-Ground Purity.",
  headingHighlightHi: "पारंपरिक पत्थर पिसाई का असली स्वाद।",
  paragraph:
    "Harvested from certified Indian spice farms and stone-ground at low temperatures. Free from artificial colors, chemical preservatives, fillers, and adulterants.",
  paragraphHi:
    "प्रमाणित भारतीय खेतों से सीधे खरीदे गए और धीमी गति से पत्थर से पिसे मसाले। कृत्रिम रंगों, रसायनों, मिलावट और स्टार्च से पूरी तरह मुक्त।",
  primaryButtonText: "Shop Spice Varieties",
  primaryButtonTextHi: "मसालों की किस्में देखें",
  primaryButtonLink: "/products",
  secondaryButtonText: "Explore Pure Powders",
  secondaryButtonTextHi: "शुद्ध पिसे मसाले",
  secondaryButtonLink: "/products?category=red-chilli-powder",
  heroImage: "/images/hero/indian-spices-banner.jpg",
  stat1Value: "100%",
  stat1Label: "Pure & Unadulterated",
  stat1LabelHi: "पूर्णतः शुद्ध व बिना मिलावट",
  stat2Value: "₹30+",
  stat2Label: "Factory Direct Rates",
  stat2LabelHi: "सीधे फैक्ट्री दरें",
  stat3Value: "0%",
  stat3Label: "Added Colors / Starch",
  stat3LabelHi: "कृत्रिम रंग या स्टार्च",
};

export const DEFAULT_THEME = {
  id: "default-theme",
  logoUrl: "/images/branding/logo.svg" as string | null,
  faviconUrl: "/images/branding/logo-icon.svg" as string | null,
  primaryColor: "#3D1E16", // Rich Cola
  secondaryColor: "#562D22", // Warm Cola
  accentColor: "#78483B", // Caramel Cola
  backgroundColor: "#FFFFFF", // Crisp White
  textColor: "#2B140E", // Deep Cola
  fontFamily: "Playfair Display",
  borderRadius: "0.75rem",
  buttonStyle: "rounded",
  heroBannerUrl:
    "/images/hero/indian-spices-banner.jpg",
};

export const DEFAULT_SETTINGS = {
  id: "default-settings",
  storeName: "ND Spices",
  tagLine: "100% Pure Heritage Spices & Cold Stone-Ground Aromatics",
  contactEmail: "contact@ndspices.com",
  contactPhone: "+91 8047524652",
  address: "Sherani Jamat Khana Ke Paas, Noori Mohalla, Sherani Abad, Didwana Kuchaman, Nagaur, Rajasthan - 341302, India",
  gstNumber: "08AABCU9603R1ZM",
  fssaiNumber: "12221004000182",
  instagramUrl: "https://instagram.com/ndspices",
  facebookUrl: "https://facebook.com/ndspices",
  whatsappNumber: "+918047524652",
  isWhatsappEnabled: true,
  freeShippingMin: 499,
  flatShippingRate: 50,
  taxRatePercent: 5.0,
  isCodEnabled: true,
  isRazorpayEnabled: true,
  seoTitle: "ND Spices | Pure Red Chilli, Coriander & Turmeric Powders, Nagaur",
  seoDescription:
    "Manufacturer & supplier of 100% pure Red Chilli Powder, Coriander Powder, Coriander Seeds, and High Curcumin Turmeric Powder. Based in Nagaur, Rajasthan.",
  seoKeywords: "red chilli powder, coriander powder, coriander seeds, turmeric powder, pure spices nagaur rajasthan, nd spices",
  ogImageUrl:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200",
};

export async function getWebsiteContent(key: string, defaultFallback: any = {}) {
  try {
    const record = await prisma.websiteContent.findUnique({
      where: { key },
    });
    if (record && record.content) {
      return { ...defaultFallback, ...(record.content as any) };
    }
  } catch (error) {
    console.error(`Error fetching CMS content for key ${key}:`, error);
  }
  return defaultFallback;
}

export async function getThemeSettings() {
  try {
    const record = await prisma.themeSettings.findUnique({
      where: { id: "default-theme" },
    });
    if (record) return record;
  } catch (error) {
    console.error("Error fetching theme settings:", error);
  }
  return DEFAULT_THEME;
}

export async function getWebsiteSettings() {
  try {
    const record = await prisma.websiteSettings.findUnique({
      where: { id: "default-settings" },
    });
    if (record) return record;
  } catch (error) {
    console.error("Error fetching website settings:", error);
  }
  return DEFAULT_SETTINGS;
}
