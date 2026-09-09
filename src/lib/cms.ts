import { prisma } from "@/lib/db";

export interface HeroContent {
  badgeText: string;
  heading: string;
  headingHighlight: string;
  paragraph: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImage: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface StoryContent {
  title: string;
  subtitle: string;
  paragraph: string;
  image: string;
}

export interface AnnouncementContent {
  marqueeText: string;
}

export const DEFAULT_HERO: HeroContent = {
  badgeText: "Winter 2024 Fresh Harvest Direct from Kerala & Kashmir",
  heading: "Single-Origin Spices,",
  headingHighlight: "Pure Heritage Aromatics.",
  paragraph:
    "Grown on multi-generational estates in Idukki, Wayanad, and Kashmir. Cold stone-ground and nitrogen sealed at the source to preserve rich essential oils, authentic heat, and unforgettable fragrance.",
  primaryButtonText: "Explore Harvests",
  primaryButtonLink: "/products",
  secondaryButtonText: "Kashmiri Saffron Vault",
  secondaryButtonLink: "/products?category=exotics-and-saffron",
  heroImage:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
  stat1Value: "8mm+",
  stat1Label: "Jumbo Green Pods",
  stat2Value: "7.5%+",
  stat2Label: "Natural Curcumin",
  stat3Value: "0%",
  stat3Label: "Fillers & Colors",
};

export const DEFAULT_THEME = {
  id: "default-theme",
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  primaryColor: "#7B241C",
  secondaryColor: "#196F3D",
  accentColor: "#D4AC0D",
  backgroundColor: "#FDFBF7",
  textColor: "#1E1E1E",
  fontFamily: "Playfair Display",
  borderRadius: "1.5rem",
  buttonStyle: "pill",
  heroBannerUrl:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
};

export const DEFAULT_SETTINGS = {
  id: "default-settings",
  storeName: "ND Spices",
  tagLine: "100% Single-Origin Pure Heritage Spices & Aromatics",
  contactEmail: "hello@ndspices.com",
  contactPhone: "+91 98450 12345",
  address: "Wayanad Estate Hub, Kerala 673121, India",
  gstNumber: "32AABCU9603R1ZM",
  fssaiNumber: "11321004000182",
  instagramUrl: "https://instagram.com/ndspices",
  facebookUrl: "https://facebook.com/ndspices",
  whatsappNumber: "+919845012345",
  isWhatsappEnabled: true,
  freeShippingMin: 499,
  flatShippingRate: 60,
  taxRatePercent: 5.0,
  isCodEnabled: true,
  isRazorpayEnabled: true,
  seoTitle: "ND Spices | 100% Single-Origin Pure Heritage Spices & Aromatics",
  seoDescription:
    "Single-origin pure Indian spices directly from Kerala and Kashmir estates. Cold stone-ground, lab-tested, unadulterated.",
  seoKeywords: "kashmiri saffron, green cardamom, wayanad black pepper, single origin spices",
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
