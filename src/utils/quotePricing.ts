import { LeadEnquiry } from '../types';

export interface QuotePricingCalculation {
  productName: string;
  quantity: number;
  catalogPrice: number;
  unitRate: number;
  volumeDiscountPercent: number;
  brandingRate: number;
  effectiveRate: number;
  subtotal: number;
  grandTotal: number;
  tierName: string;
  dispatchTimeline: string;
  referenceCode: string;
  isCustomQuoteTier?: boolean;
}

/**
 * Official Earth Smile B2B Price Matrix
 * MOQ: 200 pcs per product/design
 * 
 * | Product                   | 200–499 pcs | 500–999 pcs | 1,000–4,999 pcs | 5,000+ pcs   |
 * | Bamboo Toothbrush         | ₹65/pc      | ₹55/pc      | ₹49/pc          | Custom Quote |
 * | Bamboo Tongue Cleaner     | ₹69/pc      | ₹64/pc      | ₹59/pc          | Custom Quote |
 * | Complete Care Combo       | ₹129/pc     | ₹109/pc     | ₹99/pc          | Custom Quote |
 */
export function calculateQuotePricing(lead: Partial<LeadEnquiry>): QuotePricingCalculation {
  const rawQty = Number(lead.quantity) || 200;
  const quantity = Math.max(1, rawQty);
  const pName = (lead.productName || 'Bamboo Toothbrush').toLowerCase();

  // Determine Product Category
  let productType: 'brush' | 'cleaner' | 'combo' = 'brush';
  let catalogPrice = 65;

  if (pName.includes('tongue cleaner') || pName.includes('cleaner') || pName.includes('scraper')) {
    productType = 'cleaner';
    catalogPrice = 69;
  } else if (
    pName.includes('combo') ||
    pName.includes('complete care') ||
    pName.includes('duo') ||
    pName.includes('pair') ||
    pName.includes('seed')
  ) {
    productType = 'combo';
    catalogPrice = 129;
  } else {
    productType = 'brush';
    catalogPrice = 65;
  }

  // Determine Official Tier and Unit Rate
  let unitRate = catalogPrice;
  let tierName = '200–499 pcs Tier';
  let isCustomQuoteTier = false;

  if (quantity >= 5000) {
    // 5,000+ pcs: Factory-level Custom Quote (eligible for factory pricing ~15% below 1k tier)
    isCustomQuoteTier = true;
    tierName = '5,000+ pcs Factory Tier (Custom Quote)';
    if (productType === 'brush') unitRate = 42;
    else if (productType === 'cleaner') unitRate = 52;
    else unitRate = 89;
  } else if (quantity >= 1000) {
    // 1,000–4,999 pcs
    tierName = '1,000–4,999 pcs Bulk Tier';
    if (productType === 'brush') unitRate = 49;
    else if (productType === 'cleaner') unitRate = 59;
    else unitRate = 99;
  } else if (quantity >= 500) {
    // 500–999 pcs
    tierName = '500–999 pcs Volume Tier';
    if (productType === 'brush') unitRate = 55;
    else if (productType === 'cleaner') unitRate = 64;
    else unitRate = 109;
  } else {
    // 200–499 pcs (Standard MOQ)
    tierName = quantity < 200 ? 'Under MOQ (Standard Base Rate)' : '200–499 pcs Tier';
    if (productType === 'brush') unitRate = 65;
    else if (productType === 'cleaner') unitRate = 69;
    else unitRate = 129;
  }

  const volumeDiscountPercent = Math.max(0, Math.round(((catalogPrice - unitRate) / catalogPrice) * 100));

  // Custom logo laser branding surcharge
  let brandingRate = 0;
  if (lead.customBranding) {
    brandingRate = quantity >= 1000 ? 2 : quantity >= 500 ? 3 : 4;
  }

  const effectiveRate = unitRate + brandingRate;
  const subtotal = effectiveRate * quantity;
  const grandTotal = subtotal;

  // Dispatch timeline based on volume
  let dispatchTimeline = '3-5 Business Days';
  if (quantity >= 5000) {
    dispatchTimeline = '7-12 Business Days (Factory Direct Batch)';
  } else if (quantity >= 1000) {
    dispatchTimeline = '5-7 Business Days (Priority Bulk Production)';
  } else if (lead.customBranding) {
    dispatchTimeline = '3-4 Business Days (Laser Etching Included)';
  }

  // Human readable reference code
  const idStr = String(lead.id || '');
  const suffix = idStr.includes('-') ? idStr.split('-').pop() || '101' : idStr.slice(-4) || '101';
  const referenceCode = `ES-Q${suffix.toUpperCase().slice(0, 5)}`;

  return {
    productName: lead.productName || (productType === 'combo' ? 'Complete Care Combo' : productType === 'cleaner' ? 'Bamboo Tongue Cleaner' : 'Bamboo Toothbrush'),
    quantity,
    catalogPrice,
    unitRate,
    volumeDiscountPercent,
    brandingRate,
    effectiveRate,
    subtotal,
    grandTotal,
    tierName,
    dispatchTimeline,
    referenceCode,
    isCustomQuoteTier,
  };
}
