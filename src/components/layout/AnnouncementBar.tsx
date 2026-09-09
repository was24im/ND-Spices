import React from "react";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-cinnamon-500 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-cream-200">
          <span>🌿 Single-Origin Harvests direct from Idukki, Kashmir & Wayanad</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 w-full md:w-auto text-center">
          <Sparkles className="w-3.5 h-3.5 text-turmeric-300" />
          <span>
            Free Express Shipping across India on all orders over <strong>₹499</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-cream-200">
          <span>📞 Support: +91 98450 12345</span>
        </div>
      </div>
    </div>
  );
}
