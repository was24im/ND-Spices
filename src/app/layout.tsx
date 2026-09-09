import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ND Spices | 100% Single-Origin Pure Heritage Spices & Aromatics",
  description:
    "Direct from Indian plantation estates. Explore fresh Alleppey Green Cardamom, Kashmiri Mongra Saffron, Tellicherry Black Pepper, and stone-ground spices sealed for peak aromatic freshness.",
  keywords: [
    "ND Spices",
    "Single Origin Spices",
    "Indian Spices Online",
    "Alleppey Cardamom",
    "Kashmiri Saffron",
    "Tellicherry Black Pepper",
    "Lakadong Turmeric",
    "Organic Spices India",
  ],
  openGraph: {
    title: "ND Spices | Artisanal Indian Heritage Spices",
    description: "Farm-to-table pure spices with zero adulteration and peak essential oil preservation.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#FAF7F2] text-spice-dark selection:bg-primary-200 selection:text-primary-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
