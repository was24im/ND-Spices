export type SpiceLevelType = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT' | 'NONE';

export interface ProductVariantType {
  id: string;
  productId: string;
  weight: string; // e.g. "50g", "100g", "250g", "500g", "1kg"
  weightGrams: number;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
}

export interface ProductImageType {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured?: boolean;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  scientificName?: string;
  description: string;
  shortDesc?: string;
  origin: string; // e.g. "Idukki, Kerala", "Wayanad", "Kashmir"
  spiceLevel: SpiceLevelType;
  organic: boolean;
  featured: boolean;
  bestseller: boolean;
  harvestSeason?: string;
  aromaProfile?: string;
  categoryId: string;
  category?: CategoryType;
  variants: ProductVariantType[];
  images: ProductImageType[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItemType {
  id: string; // composite key: productId + variantId
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  weight: string;
  weightGrams: number;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  origin: string;
}

export interface ShippingAddressType {
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
