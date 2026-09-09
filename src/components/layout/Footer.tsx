"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, RefreshCw, Mail, Phone, MapPin, Heart, ExternalLink } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/cms";

export function Footer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#120F0D] text-[#FAF5EC] border-t border-[#2A221D]">
      {/* Heritage Quality Badges Bar */}
      <div className="border-b border-[#2A221D] bg-[#1A1512]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-secondary-900/60 border border-secondary-600/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">100% Single Origin</h4>
                <p className="text-xs text-[#C8B8A6] mt-0.5">Traceable directly to our grower partner estates.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-primary-900/60 border border-primary-600/40 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Cold Stone Ground</h4>
                <p className="text-xs text-[#C8B8A6] mt-0.5">Milled at ultra-low temperatures to lock aroma.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-cinnamon-900/60 border border-cinnamon-600/40 flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Aroma-Sealed Express</h4>
                <p className="text-xs text-[#C8B8A6] mt-0.5">Multi-barrier nitrogen-flushed packaging.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-yellow-400 shrink-0 shadow-inner">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Fresh Harvest Guarantee</h4>
                <p className="text-xs text-[#C8B8A6] mt-0.5">Zero adulteration, zero artificial colors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary via-cinnamon to-secondary flex items-center justify-center shadow-lg border border-white/10">
                <span className="text-white font-serif font-black text-xl tracking-wider">ND</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-wide">{settings.storeName}</h3>
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">
                  {settings.tagLine || "100% PURE HERITAGE SPICES & COLD STONE-GROUND AROMATICS"}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#C8B8A6] leading-relaxed max-w-sm">
              Celebrating pure Indian spice heritage. From the vibrant Red Chilli and Coriander farms of Rajasthan to the Western Ghats of Kerala, we deliver unadulterated stone-ground spices straight from estate and factory to kitchen.
            </p>
            <div className="space-y-2 text-xs text-[#D8C9B8] pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>{settings.contactPhone} (Mon - Sat, 9am - 7pm)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              {settings.fssaiNumber && (
                <div className="text-[11px] text-[#A69786] font-mono mt-2 bg-[#1A1512] px-3 py-1.5 rounded-lg border border-[#2A221D] inline-block">
                  FSSAI Lic No: <span className="text-white">{settings.fssaiNumber}</span> | GSTIN: <span className="text-white">{settings.gstNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3.5 tracking-wide">Our Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#C8B8A6]">
              <li>
                <Link href="/products?category=whole-spices" className="hover:text-yellow-400 transition-colors">
                  Whole Spices (Pods & Seeds)
                </Link>
              </li>
              <li>
                <Link href="/products?category=ground-spices" className="hover:text-yellow-400 transition-colors">
                  Cold Stone-Ground Powders
                </Link>
              </li>
              <li>
                <Link href="/products?category=ground-spices" className="hover:text-yellow-400 transition-colors">
                  Pure Red Chilli &amp; Turmeric
                </Link>
              </li>
              <li>
                <Link href="/products?category=heritage-blends" className="hover:text-yellow-400 transition-colors">
                  Artisanal Garam Masalas
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-400 transition-colors">
                  All Spices &amp; Bulk Supply
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3.5 tracking-wide">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#C8B8A6]">
              <li>
                <Link href="/account" className="hover:text-yellow-400 transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-400 transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-400 transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-400 transition-colors">
                  Quality &amp; Sourcing Promise
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3.5 tracking-wide">Spice Terroir Journal</h4>
            <p className="text-xs text-[#C8B8A6] mb-3.5 leading-relaxed">
              Subscribe to receive secret regional recipes, harvest updates, and seasonal 15% discount codes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl bg-[#1A1512] border border-[#3A3028] px-3.5 py-2.5 text-xs text-white placeholder:text-[#8E7E73] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-600 active:scale-[0.99] transition-all shadow-md"
              >
                Join the Spice Guild
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#2A221D] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E7E73] gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName} Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Handcrafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            <span>for authentic Indian gastronomy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
