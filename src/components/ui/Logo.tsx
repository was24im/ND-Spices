import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "stacked";
  size?: "sm" | "md" | "lg";
  href?: string;
  inverted?: boolean;
}

export function Logo({
  className = "",
  variant = "full",
  size = "md",
  href = "/",
  inverted = false,
}: LogoProps) {
  const sizeMap = {
    sm: { iconSize: 28, text: "text-base", sub: "text-[8px]" },
    md: { iconSize: 34, text: "text-lg sm:text-xl", sub: "text-[9px]" },
    lg: { iconSize: 42, text: "text-xl sm:text-2xl", sub: "text-[10px]" },
  };

  const currentSize = sizeMap[size];
  const primaryFill = inverted ? "#FFFFFF" : "#3D1E16";
  const secondaryFill = inverted ? "#D5C8C1" : "#6E5A54";

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Geometric Cola & White Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-lg border overflow-hidden shrink-0 ${
          inverted
            ? "bg-[#3D1E16] border-white/25"
            : "bg-[#3D1E16] border-[#2B140E]"
        }`}
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full p-1.5" aria-hidden="true">
          <rect x="2" y="2" width="32" height="32" rx="6" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" />
          <path
            d="M18 7C14.5 11 13.5 15.5 15.5 20.5C17 17.5 19 16 21 15C21 11.5 19.5 8.5 18 7Z"
            fill="#FFFFFF"
          />
          <text
            x="18"
            y="29.5"
            fontFamily="Georgia, serif"
            fontSize="9"
            fontWeight="700"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="1.2"
          >
            ND
          </text>
        </svg>
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-serif font-bold tracking-tight ${currentSize.text}`}
            style={{ color: primaryFill }}
          >
            ND Spices
          </span>
          <span
            className={`font-sans font-medium tracking-[0.18em] uppercase mt-1 ${currentSize.sub}`}
            style={{ color: secondaryFill }}
          >
            Nagaur · India
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#3D1E16] rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
