"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, RefreshCw, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-spice-dark text-cream-200 border-t border-spice-charcoal">
      {/* Heritage Quality Badges */}
      <div className="border-b border-white/10 bg-spice-charcoal/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary-600/30 flex items-center justify-center text-secondary-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">100% Single Origin</h4>
                <p className="text-xs text-cream-400 mt-0.5">Traceable directly to our grower partner estates.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary-600/30 flex items-center justify-center text-primary-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Cold Stone Ground</h4>
                <p className="text-xs text-cream-400 mt-0.5">Milled at ultra-low temperatures to lock aroma.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-cinnamon-600/30 flex items-center justify-center text-cinnamon-300">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Aroma-Sealed Express</h4>
                <p className="text-xs text-cream-400 mt-0.5">Multi-barrier nitrogen-flushed packaging.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-turmeric-600/30 flex items-center justify-center text-turmeric-300">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">Fresh Harvest Guarantee</h4>
                <p className="text-xs text-cream-400 mt-0.5">Zero adulteration, zero artificial colors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-cinnamon to-secondary flex items-center justify-center shadow-md">
                <span className="text-white font-serif font-black text-lg">ND</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">ND Spices</h3>
                <p className="text-[10px] uppercase font-semibold text-secondary-400 tracking-wider">
                  Pure Heritage Aromatics
                </p>
              </div>
            </div>
            <p className="text-xs text-cream-400 leading-relaxed max-w-sm">
              Celebrating the authentic spice terroir of India. From the pristine cardamom hills of Idukki to the royal saffron fields of Kashmir, we deliver unadulterated luxury aromatics straight from soil to kitchen.
            </p>
            <div className="space-y-1.5 text-xs text-cream-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary-400" />
                <span>Spice Estate Route, Idukki District, Kerala - 685565</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary-400" />
                <span>+91 98450 12345 (Mon - Sat, 9am - 7pm)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary-400" />
                <span>support@ndspices.com</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">Our Collections</h4>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <Link href="/products?category=whole-spices" className="hover:text-primary-300 transition-colors">
                  Whole Spices (Pods & Seeds)
                </Link>
              </li>
              <li>
                <Link href="/products?category=ground-spices" className="hover:text-primary-300 transition-colors">
                  Cold Stone-Ground Powders
                </Link>
              </li>
              <li>
                <Link href="/products?category=exotics-and-saffron" className="hover:text-primary-300 transition-colors">
                  Kashmiri Mongra Saffron
                </Link>
              </li>
              <li>
                <Link href="/products?category=heritage-blends" className="hover:text-primary-300 transition-colors">
                  Artisanal Garam Masalas
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  Gift Boxes & Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">Customer Care</h4>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <Link href="/checkout" className="hover:text-primary-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  Bulk & B2B Inquiries
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-300 transition-colors">
                  Laboratory Test Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">Spice Terroir Journal</h4>
            <p className="text-xs text-cream-400 mb-3 leading-relaxed">
              Subscribe to receive secret regional recipes, harvest updates, and seasonal 15% discount codes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg bg-spice-charcoal border border-white/20 px-3 py-2 text-xs text-white placeholder:text-cream-400 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-white hover:bg-primary-600 transition-colors shadow-sm"
              >
                Join the Spice Guild
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {new Date().getFullYear()} ND Spices Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <Heart className="h-3 w-3 text-cinnamon-400 fill-current" />
            <span>for authentic Indian gastronomy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
