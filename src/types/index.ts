export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  material: string;
  bristleType?: string;
  colorHex?: string;
  inStock: boolean;
  priceEstimate?: string;
}

export interface ProductBrandingOption {
  type: 'laser_engraving' | 'embossing' | 'color_pad_print' | 'custom_box';
  name: string;
  description: string;
  minimumQuantity: number;
  setupTimeDays: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'bamboo-toothbrushes' | 'bamboo-tongue-cleaners' | 'bamboo-combos' | 'tongue-cleaners' | 'dental-combos' | string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  price: string;
  priceNumeric: number;
  moq: number; // Minimum Order Quantity
  moqUnit: string;
  material: string;
  size: string;
  weight?: string;
  status: 'available' | 'low-stock' | 'pre-order';
  featured: boolean;
  customBrandingAvailable: boolean;
  brandingOptions: ProductBrandingOption[];
  features: string[];
  specifications: Record<string, string>;
  packagingDetails: string;
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  variants: ProductVariant[];
  faqs?: { question: string; answer: string }[];
  tags: string[];
}

export interface LeadEnquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  productId?: string;
  productName: string;
  quantity: number;
  customBranding: boolean;
  brandingDetails?: string;
  message: string;
  leadSource: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'archived';
  adminNotes?: string;
  estimatedValue?: number;
  utmParams?: Record<string, string>;
  consentGiven?: boolean;
  ageVerified?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  itemCount?: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  customBrandingOnly: boolean;
  sortBy: 'featured' | 'name-asc' | 'moq-asc' | 'price-asc';
}
