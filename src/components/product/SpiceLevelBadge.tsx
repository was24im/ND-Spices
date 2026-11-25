import React from "react";
import { Flame } from "lucide-react";
import { SpiceLevelType } from "@/types";
import { cn } from "@/lib/utils";

interface SpiceLevelBadgeProps {
  level: SpiceLevelType;
  className?: string;
  showText?: boolean;
}

export function SpiceLevelBadge({ level, className, showText = true }: SpiceLevelBadgeProps) {
  if (level === "NONE") return null;

  const config = {
    MILD: { flames: 1, text: "Mild Heat" },
    MEDIUM: { flames: 2, text: "Medium Spicy" },
    HOT: { flames: 3, text: "Pungent & Hot" },
    EXTRA_HOT: { flames: 4, text: "Fiery Extra Hot" },
  }[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs border border-[#E8E1DD] bg-[#FAF8F6] text-[#3D1E16]",
        className
      )}
      title={config.text}
    >
      <div className="flex items-center -space-x-0.5">
        {Array.from({ length: config.flames }).map((_, i) => (
          <Flame key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
      {showText && <span>{config.text}</span>}
    </div>
  );
}
