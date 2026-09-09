import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DynamicThemeProvider } from "@/components/providers/DynamicThemeProvider";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ToastContainer } from "@/components/ui/Toast";

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
    "Direct from Indian heritage estates and Nagaur spice mills. Explore pure Red Chilli Powder, High-Curcumin Turmeric, Tellicherry Black Pepper, Alleppey Green Cardamom, and stone-ground spices sealed for peak aromatic freshness.",
  keywords: [
    "ND Spices",
    "Single Origin Spices",
    "Indian Spices Online",
    "Alleppey Cardamom",
    "Nagaur Red Chilli Powder",
    "Tellicherry Black Pepper",
    "Lakadong Turmeric",
    "Pure Coriander Powder",
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
      <body className="min-h-screen flex flex-col antialiased bg-[#FDFBF7] text-charcoal selection:bg-cinnamon-200 selection:text-cinnamon-900 pb-16 lg:pb-0">
        <AuthProvider>
          <DynamicThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <MobileBottomNav />
            <ToastContainer />
          </DynamicThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
