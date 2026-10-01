import React, { useState } from 'react';
import {
  Stethoscope,
  Hotel,
  Gift,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Package,
  Truck,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface B2BSectionProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
}

export const B2BSection: React.FC<B2BSectionProps> = ({ onOpenEnquiry, onOpenBrandingStudio }) => {
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);

  const priceTiers = [
    { label: '200–499 pcs', subtext: 'Starter Bulk Tier', badge: 'MOQ Tier' },
    { label: '500–999 pcs', subtext: 'Commercial Volume Tier', badge: 'Popular' },
    { label: '1,000–4,999 pcs', subtext: 'Enterprise Wholesale Tier', badge: 'Best Value' },
    { label: '5,000+ pcs', subtext: 'Factory Production Direct', badge: 'Factory Quote' },
  ];

  const pricingProducts = [
    {
      emoji: '🪥',
      name: 'Bamboo Toothbrush',
      subtitle: 'Organic Moso bamboo with soft charcoal bio-bristles',
      rates: ['₹65/pc', '₹55/pc', '₹49/pc', 'Custom Quote'],
      highlights: '100% biodegradable handle, plastic-free',
      actionQuery: 'Bamboo Toothbrush (Bulk B2B Wholesale)',
    },
    {
      emoji: '👅',
      name: 'Bamboo Tongue Cleaner',
      subtitle: 'Curved ergonomic arch for natural breath freshening',
      rates: ['₹69/pc', '₹64/pc', '₹59/pc', 'Custom Quote'],
      highlights: 'Splinter-free beveled edge, zero metal',
      actionQuery: 'Bamboo Tongue Cleaner (Bulk B2B Wholesale)',
    },
    {
      emoji: '🌿',
      name: 'Complete Care Combo',
      subtitle: 'Bamboo Toothbrush + Bamboo Tongue Cleaner + Plantable Seed Balls',
      rates: ['₹129/pc', '₹109/pc', '₹99/pc', 'Custom Quote'],
      highlights: 'Turnkey gifting set in kraft presentation box',
      badge: 'B2B Top Choice',
      actionQuery: 'Complete Care Combo (Toothbrush + Tongue Cleaner + Seed Balls)',
    },
  ];

  const brandingCapabilities = [
    { title: 'Custom Logo Printing', desc: 'Permanent precision laser etching or food-grade organic ink on handles.' },
    { title: 'Custom Packaging', desc: 'Debossed recyclable kraft boxes, custom sleeves, or barcode-compliant retail packs.' },
    { title: 'Private Label', desc: 'Complete brand white-labeling for clinics, retail chains, and wellness brands.' },
    { title: 'Custom Product Branding', desc: 'Dual-surface branding on brush spines, scraper grips, and outer cartons.' },
    { title: 'Bulk & Corporate Orders', desc: 'Curated welcome kits for hotel amenities, corporate gifting, and ESG milestones.' },
    { title: 'Custom Quotations (5,000+ pcs)', desc: 'Direct factory pricing with scheduled monthly or quarterly dispatch runs.' },
  ];

  const industries = [
    {
      icon: Stethoscope,
      title: 'Dental Practices & Orthodontic Clinics',
      desc: 'Provide patients with premium, zero-plastic oral hygiene tools branded with your clinical practice logo. Inspect your clinic crest laser-engraved on the bamboo handle before placing an order.',
      recommended: 'Bamboo Toothbrush & Bamboo Tongue Cleaner',
      moq: '200 pcs',
    },
    {
      icon: Hotel,
      title: 'Luxury Boutique Hotels & Eco-Resorts',
      desc: 'Completely eliminate plastic bathroom amenities with custom-branded Moso bamboo toothbrushes and tongue cleaners in biodegradable kraft packaging.',
      recommended: 'Complete Care Combo in Kraft Presentation Box',
      moq: '200 pcs',
    },
    {
      icon: Gift,
      title: 'Corporate Gifting & ESG Programs',
      desc: 'Meaningful employee onboarding kits, annual ESG wellness milestones, and eco-conscious client gifting with plantable seed balls.',
      recommended: 'Complete Care Combo + Seed Balls Set',
      moq: '200 pcs',
    },
    {
      icon: Store,
      title: 'Eco Retailers, Pharmacies & Organic Stores',
      desc: 'High-turnover sustainable dental shelf products with barcode compliance, individual kraft hang-tab boxes, and reliable replenishment.',
      recommended: 'Bamboo Toothbrushes & Bamboo Tongue Cleaners',
      moq: '200 pcs',
    },
  ];

  return (
    <section id="b2b" className="py-24 bg-[#F5F5EE] dark:bg-[#101A14] border-b border-[#EAE9E1] dark:border-[#223528] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* ======================================================== */}
        {/* OFFICIAL B2B PRICE LIST MASTER HERO MODULE               */}
        {/* ======================================================== */}
        <div className="bg-white dark:bg-[#14231B] border border-[#DDD9CE] dark:border-[#274030] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm mb-20 relative overflow-hidden">
          {/* Subtle eco ambient gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Section Header */}
          <div className="max-w-3xl mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-semibold rounded-full mb-3 border border-emerald-300 dark:border-emerald-800">
              <span>🌱 Earth Smile — B2B Price List</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#142018] dark:text-white tracking-tight mb-3">
              Sustainable Products. Custom Branding. Bulk Pricing.
            </h2>
            
            <p className="text-sm sm:text-base text-[#525B55] dark:text-[#A7B8AB] leading-relaxed">
              Choose your quantity and get better pricing as your order volume increases. Direct from factory with zero distributor markup.
            </p>
          </div>

          {/* Desktop & Tablet Pricing Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E3E1D7] dark:border-[#2A4434] shadow-xs mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] dark:bg-[#182C22] text-[#4F5953] dark:text-[#BACBC0] font-mono text-xs uppercase tracking-wider border-b border-[#E3E1D7] dark:border-[#2A4434]">
                  <th className="py-4 px-5 font-semibold">Product</th>
                  <th className="py-4 px-4 text-center font-semibold bg-[#F2F1EA]/60 dark:bg-[#1B3126]/60">
                    <div>200–499 pcs</div>
                    <span className="text-[10px] font-normal text-[#8A958E] dark:text-[#889B8F] normal-case">MOQ Tier</span>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold">
                    <div>500–999 pcs</div>
                    <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400 normal-case">Volume Discount</span>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold bg-[#EAF2EC]/70 dark:bg-[#1E382A]/70 text-[#192E22] dark:text-emerald-300">
                    <div>1,000–4,999 pcs</div>
                    <span className="text-[10px] font-normal text-emerald-800 dark:text-emerald-400 normal-case">Wholesale Pro</span>
                  </th>
                  <th className="py-4 px-5 text-center font-semibold text-[#BD7B3C] dark:text-[#DE9B5E]">
                    <div>5,000+ pcs</div>
                    <span className="text-[10px] font-normal text-[#BD7B3C] dark:text-[#DE9B5E] normal-case">Factory Level</span>
                  </th>
                  <th className="py-4 px-4 text-right">Quick Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8DE] dark:divide-[#243B2C] text-xs sm:text-sm">
                {pricingProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F5] dark:hover:bg-[#17281F] transition-colors">
                    {/* Product Name & Details */}
                    <td className="py-5 px-5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0" role="img" aria-label={p.name}>{p.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm sm:text-base text-[#192E22] dark:text-white">
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="text-[10px] font-mono font-bold bg-[#DE9B5E]/20 text-[#8C521B] dark:text-[#DE9B5E] px-2 py-0.5 rounded-full border border-[#DE9B5E]/40">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#69746C] dark:text-[#9FB1A3] mt-0.5 max-w-sm line-clamp-1">
                            {p.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 200–499 pcs */}
                    <td className="py-5 px-4 text-center font-mono font-semibold text-[#192E22] dark:text-white bg-[#F2F1EA]/30 dark:bg-[#1B3126]/30">
                      <span className="text-base font-bold text-[#192E22] dark:text-white">{p.rates[0]}</span>
                    </td>

                    {/* 500–999 pcs */}
                    <td className="py-5 px-4 text-center font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                      <span className="text-base font-bold">{p.rates[1]}</span>
                    </td>

                    {/* 1,000–4,999 pcs */}
                    <td className="py-5 px-4 text-center font-mono font-semibold text-emerald-950 dark:text-emerald-200 bg-[#EAF2EC]/40 dark:bg-[#1E382A]/40">
                      <span className="text-base font-extrabold text-[#192E22] dark:text-emerald-300">{p.rates[2]}</span>
                    </td>

                    {/* 5,000+ pcs */}
                    <td className="py-5 px-5 text-center font-mono text-xs">
                      <span className="inline-block px-2.5 py-1 bg-[#F9F1E6] dark:bg-[#2C2317] text-[#9A6028] dark:text-[#E0A361] rounded-lg font-bold border border-[#E9D7C2] dark:border-[#423420]">
                        {p.rates[3]}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-5 px-4 text-right">
                      <button
                        onClick={() => onOpenEnquiry(p.actionQuery)}
                        className="py-2 px-3.5 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#264432] rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer hover:scale-102"
                      >
                        Enquire →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ======================================================== */}
          {/* COMPLETE CARE COMBO SPOTLIGHT BANNER                     */}
          {/* ======================================================== */}
          <div className="bg-[#FAF9F5] dark:bg-[#182C22] border-2 border-emerald-600/30 dark:border-emerald-500/30 rounded-2xl p-6 sm:p-8 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-800 dark:text-emerald-300">
                  Featured Eco-Solution
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Zero Single-Use Plastic
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#142018] dark:text-white">
                Complete Care Combo
              </h3>

              <div className="text-xs font-mono font-bold text-[#BD7B3C] dark:text-[#DE9B5E]">
                Bamboo Toothbrush + Bamboo Tongue Cleaner + Plantable Seed Balls
              </div>

              <p className="text-xs sm:text-sm text-[#525B55] dark:text-[#BACBC0] leading-relaxed max-w-2xl">
                A complete eco-friendly gifting and personal-care solution designed for brands, businesses, hotels, clinics, events and promotional campaigns. Each box comes with plantable seed balls to sprout native greenery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onOpenEnquiry('Complete Care Combo (Toothbrush + Tongue Cleaner + Seed Balls)')}
                className="w-full sm:w-auto py-3.5 px-6 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Request Combo Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBrandingStudio}
                className="w-full sm:w-auto py-3.5 px-5 text-xs font-semibold text-[#192E22] dark:text-white bg-white dark:bg-[#1E362A] border border-[#CCDDCF] dark:border-[#31563E] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                <span>Preview Logo on Combo</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CUSTOM BRANDING & MOQ & BULK POLICY ROW                  */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#EAE8DE] dark:border-[#223528]">
            {/* Column 1: Custom Branding Available */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#BD7B3C] dark:text-[#DE9B5E]">
                <Sparkles className="w-4 h-4" />
                <span>🎨 Custom Branding Available</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#48534C] dark:text-[#A7B8AB]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[#192E22] dark:text-white">Custom Logo Printing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[#192E22] dark:text-white">Custom Packaging & Kraft Boxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[#192E22] dark:text-white">Private Label Solutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[#192E22] dark:text-white">Custom Product Branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[#192E22] dark:text-white">Bulk & Corporate Orders</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Minimum Order Quantity (MOQ) */}
            <div className="space-y-3 p-4 bg-[#F8F7F0] dark:bg-[#16271D] rounded-xl border border-[#E5E3D8] dark:border-[#243D2D]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#192E22] dark:text-white">
                <Package className="w-4 h-4 text-[#BD7B3C]" />
                <span>📦 Minimum Order Quantity</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#192E22] dark:text-white">
                200 pieces per product / design
              </div>
              <p className="text-[11px] text-[#637067] dark:text-[#90A294] leading-relaxed">
                For custom branding, packaging and private-label orders, final pricing may vary depending on the product specifications, printing method, packaging and order quantity.
              </p>
            </div>

            {/* Column 3: Bulk Orders 5,000+ */}
            <div className="space-y-3 p-4 bg-[#192E22] text-white rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#DE9B5E]">
                  <Truck className="w-4 h-4" />
                  <span>🚚 Bulk Orders (5,000+ pcs)</span>
                </div>
                <p className="text-xs text-[#D8E4DB] mt-2 leading-relaxed">
                  Orders of <strong>5,000+ pieces</strong> are eligible for factory-level/custom quotations with tiered freight and scheduled dispatch.
                </p>
              </div>

              <button
                onClick={() => onOpenEnquiry('Factory Level Quote (5,000+ pcs)')}
                className="w-full mt-3 py-2 px-3 bg-[#DE9B5E] hover:bg-[#E5AA70] text-[#142018] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Request a Custom Quote →</span>
              </button>
            </div>
          </div>

          {/* Slogan & Verification Footer Note */}
          <div className="mt-8 pt-6 border-t border-[#EAE8DE] dark:border-[#223528] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6A786E] dark:text-[#889B8F]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Transparent B2B Wholesale Pricing • All products steam-carbonized organic Moso bamboo</span>
            </div>
            <div className="font-serif font-bold text-sm text-[#192E22] dark:text-[#E2ECE5] tracking-wide">
              Earth Smile® — Cleaner Smiles. Greener Tomorrow.
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INDUSTRY SECTOR CARDS                                     */}
        {/* ======================================================== */}
        <div className="mb-16">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#142018] dark:text-white tracking-tight mb-2">
              Built for Businesses. Designed for Impact.
            </h3>
            <p className="text-xs sm:text-sm text-[#525B55] dark:text-[#A7B8AB]">
              Tailored procurement packages for healthcare, hospitality, corporate programs, and conscious retail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const IconComponent = ind.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#14231B] border border-[#E3E2D8] dark:border-[#243B2C] rounded-xl p-6 hover:border-[#192E22] dark:hover:border-emerald-600 transition-colors duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#EBF2ED] dark:bg-[#1B3224] text-[#1E3527] dark:text-emerald-300 flex items-center justify-center mb-5">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <h4 className="font-serif text-base font-semibold text-[#142018] dark:text-white mb-2">
                      {ind.title}
                    </h4>

                    <p className="text-xs text-[#555D57] dark:text-[#9FB1A3] leading-relaxed mb-6">
                      {ind.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0EFE8] dark:border-[#1E3326] space-y-2 text-xs">
                    <div>
                      <span className="text-[#78827C] dark:text-stone-400 block text-[11px]">Recommended:</span>
                      <span className="font-medium text-[#192E22] dark:text-emerald-200 text-xs">{ind.recommended}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#BD7B3C] font-mono font-semibold text-xs">MOQ: {ind.moq}</span>
                      <button
                        onClick={() => onOpenEnquiry(`${ind.title} - Bulk B2B Quote`)}
                        className="text-xs font-semibold text-[#192E22] dark:text-white hover:text-[#BD7B3C] transition-colors cursor-pointer"
                      >
                        Get Quote →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PRE-PRINT PROOFING BOTTOM CALLOUT                         */}
        {/* ======================================================== */}
        <div className="bg-[#192E22] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#DE9B5E] font-mono font-semibold block mb-2">
              Wholesale Bamboo Supply & Pre-Print Approval
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium mb-4 tracking-tight">
              See Your Brand Logo on Bamboo Before You Place an Order
            </h3>
            <p className="text-sm sm:text-base text-[#D4DDD6] mb-8 leading-relaxed">
              We operate direct manufacturing with zero distributor middlemen. Preview your logo on our bamboo toothbrushes, tongue cleaners, and Complete Care Combos, request pre-production samples, and coordinate directly with our team.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBrandingStudio}
                className="px-6 py-3.5 text-xs font-semibold text-[#192E22] bg-white hover:bg-[#F2F1EA] rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                <span>Test Your Logo on Bamboo Now</span>
              </button>

              <button
                onClick={() => onOpenEnquiry('Direct B2B Bamboo Procurement Proposal (5,000+ pcs / Custom Quote)')}
                className="px-6 py-3.5 text-xs font-semibold text-white bg-[#284633] hover:bg-[#345942] border border-white/20 rounded-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Request Custom Quote →</span>
              </button>

              <a
                href={buildWhatsAppUrl({
                  customQuery: 'Hi Earth Smile, I reviewed your B2B Price List. I would like to request a quotation for custom branded bamboo products.',
                })}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
                className="w-11 h-11 shrink-0 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
              </a>
            </div>
          </div>

          {/* Subdued decorative ambient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#DE9B5E]/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
