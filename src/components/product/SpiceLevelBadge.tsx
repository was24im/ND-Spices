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
    MILD: {
      flames: 1,
      text: "Mild Heat",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    MEDIUM: {
      flames: 2,
      text: "Medium Spicy",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    HOT: {
      flames: 3,
      text: "Pungent & Hot",
      color: "text-red-600 bg-red-50 border-red-200",
    },
    EXTRA_HOT: {
      flames: 4,
      text: "Fiery Extra Hot",
      color: "text-rose-700 bg-rose-50 border-rose-300 font-bold",
    },
  }[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border",
        config.color,
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
