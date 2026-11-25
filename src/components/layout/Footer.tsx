"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_SETTINGS } from "@/lib/cms";
import { useTranslation } from "@/store/useLanguageStore";
import { Logo } from "../ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t, isHindi } = useTranslation();
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

  const whatsappCleanNumber = (settings.whatsappNumber || "+918047524652").replace(/\D/g, "");

  return (
    <footer className="bg-[#2B140E] text-white border-t border-[#3D1E16]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Summary */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="sm" href="/" inverted />
            <p className="text-xs text-[#D5C8C1] leading-relaxed max-w-sm">
              {t("footer.brandDesc")}
            </p>
            <div className="pt-1">
              <LanguageSwitcher variant="compact" inverted />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D5C8C1]">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/#origins" className="hover:text-white transition-colors">
                  {isHindi ? "हमारी उत्पत्ति" : "Our Origins"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t("nav.allSpices")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  {t("nav.basket")}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  {t("nav.orderHistory")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Contact & Compliance */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D5C8C1]">
              {t("footer.contactSupport")}
            </h4>
            <div className="space-y-1.5 text-xs text-white/80 leading-relaxed">
              <p>{settings.address}</p>
              <p>{settings.contactPhone}</p>
              <p>{settings.contactEmail}</p>
              {settings.isWhatsappEnabled && (
                <p className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
                      "Hello ND Spices! I would like to inquire about your spices."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block underline underline-offset-4 text-white hover:text-[#D5C8C1]"
                  >
                    {t("home.whatsappCta")}
                  </a>
                </p>
              )}
            </div>
            <div className="pt-2 text-[11px] text-[#A9938A] space-y-0.5">
              <p>{t("footer.fssaiLicense")}</p>
              <p>{t("footer.gstin")}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A9938A]">
          <p>{t("footer.allRightsReserved")}</p>
          <p>Nagaur, Rajasthan · India</p>
        </div>
      </div>
    </footer>
  );
}
