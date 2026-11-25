"use client";

import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "compact" | "minimal";
  inverted?: boolean;
}

export function LanguageSwitcher({
  className = "",
  variant = "pill",
  inverted = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore();

  if (variant === "minimal" || variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`px-1.5 py-0.5 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[#3D1E16] ${
            language === "en"
              ? inverted
                ? "text-white font-semibold underline underline-offset-4"
                : "text-[#2B140E] font-semibold underline underline-offset-4"
              : inverted
              ? "text-white/70 hover:text-white"
              : "text-[#6E5A54] hover:text-[#2B140E]"
          }`}
          aria-label="Switch to English"
        >
          English
        </button>
        <span className={inverted ? "text-white/40" : "text-[#D5C8C1]"} aria-hidden="true">
          |
        </span>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          aria-pressed={language === "hi"}
          className={`px-1.5 py-0.5 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[#3D1E16] ${
            language === "hi"
              ? inverted
                ? "text-white font-semibold underline underline-offset-4"
                : "text-[#2B140E] font-semibold underline underline-offset-4"
              : inverted
              ? "text-white/70 hover:text-white"
              : "text-[#6E5A54] hover:text-[#2B140E]"
          }`}
          aria-label="हिंदी में बदलें"
        >
          हिंदी
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border p-0.5 text-xs ${
        inverted
          ? "border-white/20 bg-white/10"
          : "border-[#E8E1DD] bg-[#FAF8F6]"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
          language === "en"
            ? inverted
              ? "bg-white text-[#2B140E] font-semibold"
              : "bg-[#3D1E16] text-white font-semibold"
            : inverted
            ? "text-white/80 hover:text-white"
            : "text-[#6E5A54] hover:text-[#2B140E]"
        }`}
        aria-label="Switch to English"
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
          language === "hi"
            ? inverted
              ? "bg-white text-[#2B140E] font-semibold"
              : "bg-[#3D1E16] text-white font-semibold"
            : inverted
            ? "text-white/80 hover:text-white"
            : "text-[#6E5A54] hover:text-[#2B140E]"
        }`}
        aria-label="हिंदी भाषा चुनें"
      >
        हिंदी
      </button>
    </div>
  );
}
