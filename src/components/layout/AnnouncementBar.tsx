"use client";

import React from "react";
import { Sparkles, Leaf, Gift, Truck } from "lucide-react";

export function AnnouncementBar() {
  const marqueeItems = [
    { icon: Sparkles, text: "Festive Spice Offer: Use code WELCOME10 for 10% OFF your first order" },
    { icon: Truck, text: "Free Express Delivery across India on orders over ₹499" },
    { icon: Leaf, text: "100% Single-Origin Harvests direct from Idukki, Kashmir & Wayanad estates" },
    { icon: Gift, text: "Artisanal Wooden Gift Boxes now available for corporate & wedding hampers" },
  ];

  return (
    <div className="bg-cinnamon text-white text-[11px] sm:text-xs py-2 overflow-hidden border-b border-cinnamon-600 select-none">
      <div className="flex w-max animate-marquee space-x-10 items-center">
        {/* Repeating twice for seamless infinite loop */}
        {[...marqueeItems, ...marqueeItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2 flex-shrink-0 tracking-wide">
              <Icon className="h-3.5 w-3.5 text-turmeric-300 flex-shrink-0" />
              <span>{item.text}</span>
              <span className="text-turmeric-400 font-bold px-3">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
