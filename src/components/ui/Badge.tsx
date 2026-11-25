import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D1E16] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#E8E1DD] bg-[#FAF8F6] text-[#3D1E16]",
        secondary:
          "border-[#E8E1DD] bg-white text-[#6E5A54]",
        cinnamon:
          "border-[#3D1E16] bg-[#3D1E16] text-white",
        turmeric:
          "border-[#E8E1DD] bg-[#F4F0EC] text-[#3D1E16]",
        outline: "text-[#2B140E] border-[#E8E1DD] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
