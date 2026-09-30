import React from 'react';
import { Building2, Stethoscope, Hotel, Gift, Store, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface B2BSectionProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
}

export const B2BSection: React.FC<B2BSectionProps> = ({ onOpenEnquiry, onOpenBrandingStudio }) => {
  const industries = [
    {
      icon: Stethoscope,
      title: 'Dental Practices & Orthodontic Clinics',
      desc: 'Provide patients with premium, zero-plastic oral hygiene tools branded with your clinical practice logo. Inspect your clinic crest laser-engraved on the bamboo handle before placing an order.',
      recommended: 'Bamboo Toothbrush & Bamboo Tongue Cleaner',
      moq: '100 units',
    },
    {
      icon: Hotel,
      title: 'Luxury Boutique Hotels & Eco-Resorts',
      desc: 'Completely eliminate plastic bathroom amenities with custom-branded Moso bamboo toothbrushes and tongue cleaners in biodegradable kraft packaging.',
      recommended: 'Bamboo Toothbrush + Bamboo Tongue Cleaner Duo',
      moq: '250 units',
    },
    {
      icon: Gift,
      title: 'Corporate Gifting & ESG Programs',
      desc: 'Meaningful employee onboarding kits, annual ESG wellness milestones, and eco-conscious client gifting in debossed recycled kraft gift boxes.',
      recommended: 'Bamboo Toothbrush + Tongue Cleaner Combination',
      moq: '50 sets',
    },
    {
      icon: Store,
      title: 'Eco Retailers, Pharmacies & Organic Stores',
      desc: 'High-turnover sustainable dental shelf products with barcode compliance, individual kraft hang-tab boxes, and reliable replenishment.',
      recommended: 'Bamboo Toothbrushes & Bamboo Tongue Cleaners',
      moq: '100 units',
    },
  ];

  return (
    <section id="b2b" className="py-24 bg-[#F5F5EE] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Institutional Bamboo Supply</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            Built for Businesses. Designed for Impact.
          </h2>
          <p className="text-base sm:text-lg text-[#525B55] leading-relaxed">
            From independent dental clinics to multi-property luxury resorts, Earth Smile delivers certified organic bamboo toothbrushes and bamboo tongue cleaners with pre-print digital logo proofing.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {industries.map((ind, idx) => {
            const IconComponent = ind.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E3E2D8] rounded-xl p-6 hover:border-[#192E22] transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#EBF2ED] text-[#1E3527] flex items-center justify-center mb-5">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#142018] mb-2">
                    {ind.title}
                  </h3>

                  <p className="text-xs text-[#555D57] leading-relaxed mb-6">
                    {ind.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EFE8] space-y-2 text-xs">
                  <div>
                    <span className="text-[#78827C] block text-[11px]">Recommended Offering:</span>
                    <span className="font-medium text-[#192E22] text-xs">{ind.recommended}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[#BD7B3C] font-mono font-semibold text-xs">Min: {ind.moq}</span>
                    <button
                      onClick={() => onOpenEnquiry(`${ind.title} - Bulk Bamboo Quote`)}
                      className="text-xs font-semibold text-[#192E22] hover:text-[#BD7B3C] transition-colors cursor-pointer"
                    >
                      Get Quote →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Volume Tier Table Banner */}
        <div className="bg-[#192E22] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#DE9B5E] font-mono font-semibold block mb-2">
              Wholesale Bamboo Supply & Pre-Print Approval
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium mb-4 tracking-tight">
              See Your Brand Logo on Bamboo Before You Place an Order
            </h3>
            <p className="text-sm sm:text-base text-[#D4DDD6] mb-8 leading-relaxed">
              We operate direct manufacturing with zero distributor middlemen. Preview your logo on our bamboo toothbrushes and bamboo tongue cleaners, request a pre-production sample, and coordinate with our WhatsApp team on +91 {EARTH_SMILE_PHONE}.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBrandingStudio}
                className="px-6 py-3.5 text-xs font-semibold text-[#192E22] bg-white hover:bg-[#F2F1EA] rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                <span>Test Your Logo on Bamboo Now</span>
              </button>

              <a
                href={buildWhatsAppUrl({
                  customQuery: 'Hi Earth Smile, I would like to enquire about wholesale bulk orders and custom branding for bamboo toothbrushes and tongue cleaners.',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-xs font-semibold text-white bg-[#284633] hover:bg-[#345942] border border-white/20 rounded-lg transition-all cursor-pointer flex items-center gap-2 hover-lift"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp: +91 {EARTH_SMILE_PHONE}</span>
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
