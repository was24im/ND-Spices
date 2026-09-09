import React from "react";
import { ProductType } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductType[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <section className="py-8 sm:py-12">
      {(title || subtitle) && (
        <div className="mb-8 text-center max-w-2xl mx-auto px-4">
          {title && (
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-spice-dark tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-spice-muted leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="h-0.5 w-8 bg-primary rounded-full" />
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="h-0.5 w-8 bg-primary rounded-full" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
