"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/store/useLanguageStore";
import { DEFAULT_SETTINGS } from "@/lib/cms";

const ORIGINS = [
  {
    code: "01",
    regionEn: "Nagaur, Rajasthan",
    regionHi: "नागौर, राजस्थान",
    spicesEn: "Kasuri Methi & Jeera (Cumin)",
    spicesHi: "कसूरी मेथी और जीरा",
    descEn:
      "Home to our processing facility. Nagaur's arid mineral-rich soil produces intensely aromatic sun-dried fenugreek leaves and machine-cleaned cumin seeds.",
    descHi:
      "हमारा मुख्य प्रसंस्करण केंद्र। नागौर की शुष्क व खनिज-समृद्ध मिट्टी से प्राप्त सुगंधित कसूरी मेथी और मशीन से साफ किया हुआ शुद्ध जीरा।",
  },
  {
    code: "02",
    regionEn: "Guntur, Byadgi & Kashmir",
    regionHi: "गुंटूर, ब्याडगी और कश्मीर",
    spicesEn: "Whole Red Chilli & Chilli Powders",
    spicesHi: "साबुत लाल मिर्च और मिर्च पाउडर",
    descEn:
      "Single-origin whole pods—Kashmiri Dabi, Byadgi 2043, Teja, Siginta, DD, Armour, and Saniya—sourced directly at harvest for natural color and heat.",
    descHi:
      "कश्मीरी डाबी, ब्याडगी 2043, तेजा, सिगिटा, डीडी, आर्मर और सानिया जैसी प्रामाणिक लाल मिर्च फसल के समय सीधे किसानों से प्राप्त।",
  },
  {
    code: "03",
    regionEn: "Kota & Baran Belt",
    regionHi: "कोटा और बारां क्षेत्र",
    spicesEn: "Coriander Seeds & Powders",
    spicesHi: "साबुत धनिया और धनिया पाउडर",
    descEn:
      "Bold Eigle, Scooter, Double Perrote, and Badami coriander varieties prized for clean citrus-warmth and high volatile essential oil retention.",
    descHi:
      "ईगल, स्कूटर, डबल तोता और बादामी धनिया की बेहतरीन किस्में, जिनमें प्राकृतिक सुगंधित तेल भरपूर मात्रा में सुरक्षित रहता है।",
  },
  {
    code: "04",
    regionEn: "Sangli, Erode & Nizamabad",
    regionHi: "सांगली, इरोड और निज़ामाबाद",
    spicesEn: "Turmeric Finger & Powders",
    spicesHi: "हल्दी गांठ और हल्दी पाउडर",
    descEn:
      "Traditional high-curcumin Nizama Badi, Sangli, and Erode turmeric fingers, naturally cured and cold stone-ground with zero added dyes.",
    descHi:
      "निज़ामाबादी, सांगली और इरोड की उच्च करक्यूमिन वाली हल्दी गांठ, बिना किसी कृत्रिम रंग के धीमी पिसाई द्वारा तैयार।",
  },
];

export default function HomePage() {
  const { isHindi } = useTranslation();
  const [cmsHero, setCmsHero] = useState<any>(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.contents?.["homepage.hero"]) {
          setCmsHero(data.contents["homepage.hero"]);
        }
      })
      .catch(() => {});

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const whatsappNumber = (settings.whatsappNumber || "+918047524652").replace(/\D/g, "");

  return (
    <div className="bg-white text-[#2B140E]">
      {/* 1. Company Introduction */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E5A54]">
              {isHindi ? "नागौर, राजस्थान · स्थापित विरासत" : "Nagaur, Rajasthan · Heritage Spice House"}
            </p>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B140E] tracking-tight leading-[1.15]">
              {isHindi
                ? cmsHero?.headingHi
                  ? `${cmsHero.headingHi} ${cmsHero.headingHighlightHi || ""}`.trim()
                  : "एनडी स्पाइसेस — अपने मूल क्षेत्र से शुद्ध भारतीय मसाले।"
                : cmsHero?.heading
                ? `${cmsHero.heading} ${cmsHero.headingHighlight || ""}`.trim()
                : "ND Spices — Authentic spices, true to their Indian origin."}
            </h1>

            <p className="text-sm sm:text-base text-[#6E5A54] leading-relaxed max-w-xl">
              {isHindi
                ? cmsHero?.paragraphHi ||
                  "एनडी स्पाइसेस नागौर, राजस्थान स्थित एक प्रमुख मसाला निर्माता व आपूर्तिकर्ता कंपनी है। हम भारत के प्रसिद्ध मसाला क्षेत्रों से सीधे साबुत फसल प्राप्त कर, धीमी पत्थर पिसाई द्वारा बिना किसी मिलावट के शुद्ध मसाले तैयार करते हैं।"
                : cmsHero?.paragraph ||
                  "ND Spices is a Nagaur-based manufacturer and supplier of single-origin whole spices and cold stone-ground powders. We source directly from India's historic growing belts and mill slowly at low temperatures with zero artificial colors or fillers."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={cmsHero?.primaryButtonLink || "/products"}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] text-white px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <span>{isHindi ? "हमारे मसाले देखें" : "Explore Our Spices"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#origins"
                className="inline-flex items-center rounded-lg border border-[#E8E1DD] bg-white hover:bg-[#FAF8F6] text-[#2B140E] px-5 py-2.5 text-sm font-medium transition-colors"
              >
                {isHindi ? "उत्पत्ति व स्रोत जानें" : "Our Origins"}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E8E1DD] bg-[#FAF8F6]">
              <Image
                src={cmsHero?.heroImage || "/images/hero/indian-spices-banner.jpg"}
                alt={isHindi ? "एनडी स्पाइसेस के शुद्ध भारतीय मसाले" : "ND Spices single-origin Indian spices"}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sourcing Origins */}
      <section id="origins" className="bg-[#FAF8F6] border-y border-[#E8E1DD] py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E5A54]">
              {isHindi ? "स्रोत एवं उत्पत्ति" : "Provenance & Sourcing"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B140E]">
              {isHindi ? "भारत के प्रमुख मसाला क्षेत्रों से सीधी खरीद" : "Where Our Spices Come From"}
            </h2>
            <p className="text-sm text-[#6E5A54]">
              {isHindi
                ? "हर मसाला अपने विशेष भौगोलिक क्षेत्र से चुना जाता है ताकि असली स्वाद, रंग और प्राकृतिक तेल बरकरार रहे।"
                : "Each spice variety is procured directly from the Indian region renowned for its soil, climate, and natural essential oil profile."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORIGINS.map((item) => (
              <div
                key={item.code}
                className="rounded-xl border border-[#E8E1DD] bg-white p-6 sm:p-7 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E8E1DD] pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#3D1E16]">
                    {isHindi ? item.regionHi : item.regionEn}
                  </span>
                  <span className="text-xs font-mono text-[#6E5A54]">{item.code}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2B140E]">
                  {isHindi ? item.spicesHi : item.spicesEn}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed">
                  {isHindi ? item.descHi : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Heritage & Standards */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E5A54]">
              {isHindi ? "हमारी कार्यप्रणाली" : "About ND Spices"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B140E]">
              {isHindi ? "शुद्धता, पारदर्शिता और पारंपरिक प्रसंस्करण" : "Built on Pure Processing & Direct Origin"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E8E1DD] pt-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#3D1E16]">
                {isHindi ? "01 · सीधी फसल खरीद" : "01 · Single-Origin Procurement"}
              </p>
              <p className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed">
                {isHindi
                  ? "बिना किसी मिश्रण के प्रत्येक मसाला सीधे उसके मूल उत्पादक क्षेत्र और मंडी से खरीदा जाता है।"
                  : "We avoid multi-grade market blending, procuring harvest lots straight from trusted growing regions across Rajasthan, Andhra, Karnataka, and Maharashtra."}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#3D1E16]">
                {isHindi ? "02 · धीमी ठंडी पिसाई" : "02 · Low-Temperature Milling"}
              </p>
              <p className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed">
                {isHindi
                  ? "तेज गर्मी से मसालों की महक नष्ट होती है; इसलिए हम धीमी व कम तापमान वाली पिसाई करते हैं।"
                  : "High-speed commercial grinding burns volatile oils. Our controlled low-temperature stone grinding locks in authentic aroma and deep natural color."}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#3D1E16]">
                {isHindi ? "03 · प्रमाणित शुद्धता" : "03 · Certified & Unadulterated"}
              </p>
              <p className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed">
                {isHindi
                  ? "100% कृत्रिम रंग, स्टार्च और रसायनों से मुक्त। FSSAI एवं GST द्वारा पूर्णतः प्रमाणित।"
                  : "Zero synthetic dyes, starch fillers, or preservatives. Operated under FSSAI license 12221004000182 with full batch accountability."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Company Contact & Factory Details */}
      <section id="contact" className="bg-[#FAF8F6] border-t border-[#E8E1DD] py-14 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-[#E8E1DD] bg-white p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E5A54]">
                {isHindi ? "कंपनी विवरण एवं संपर्क" : "Company Details & Enquiries"}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#2B140E]">
                {isHindi ? "एनडी स्पाइसेस, नागौर" : "ND Spices Facility"}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5A54] leading-relaxed max-w-md">
                {isHindi
                  ? "खुदरा, थोक (B2B) आपूर्ति या मसालों की गुणवत्ता के बारे में जानकारी के लिए सीधे हमारे कार्यालय से संपर्क करें।"
                  : "Reach out directly to our processing unit in Nagaur for retail orders, wholesale bulk trade, or origin inquiries."}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "Hello ND Spices! I would like to inquire about your spices and company supply."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-[#3D1E16] hover:bg-[#2B140E] text-white px-4 py-2 text-xs font-medium transition-colors"
                >
                  {isHindi ? "व्हाट्सएप पर संपर्क करें" : "WhatsApp Enquiry"}
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-lg border border-[#E8E1DD] bg-white hover:bg-[#FAF8F6] text-[#2B140E] px-4 py-2 text-xs font-medium transition-colors"
                >
                  {isHindi ? "सभी उत्पाद सूची देखें" : "Browse Spice Catalog"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs border-t lg:border-t-0 lg:border-l border-[#E8E1DD] pt-6 lg:pt-0 lg:pl-8">
              <div className="space-y-1">
                <p className="font-semibold text-[#2B140E]">
                  {isHindi ? "पंजीकृत पता" : "Registered Unit"}
                </p>
                <p className="text-[#6E5A54] leading-relaxed">{settings.address}</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#2B140E]">
                    {isHindi ? "फ़ोन व ईमेल" : "Phone & Email"}
                  </p>
                  <p className="text-[#6E5A54]">{settings.contactPhone}</p>
                  <p className="text-[#6E5A54]">{settings.contactEmail}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-semibold text-[#2B140E]">
                    {isHindi ? "लाइसेंस व पंजीकरण" : "Compliance"}
                  </p>
                  <p className="text-[#6E5A54]">FSSAI: {settings.fssaiNumber}</p>
                  <p className="text-[#6E5A54]">GSTIN: {settings.gstNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
