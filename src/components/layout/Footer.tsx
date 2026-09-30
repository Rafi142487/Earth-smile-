import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';

interface FooterProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEnquiry, onOpenBrandingStudio, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#142018] text-[#D8E0DA] pt-20 pb-12 border-t border-[#263D2E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A4132]">
          {/* Brand Column (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-[#AAB8AE] leading-relaxed max-w-sm pt-2">
              Earth Smile manufactures certified organic Moso bamboo toothbrushes and handcrafted bamboo tongue cleaners for clinics, boutique hotels, eco-resorts, and retail distributors worldwide. Preview your custom brand logo on the bamboo product before print.
            </p>

            <div className="pt-2 text-xs text-[#8FA596] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#DE9B5E]" />
              <span>100% Organic Moso Bamboo · Zero Plastic Supply Chain</span>
            </div>
          </div>

          {/* Quick Links (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DE9B5E] font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#B5C2B9]">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Earth Smile
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBrandingStudio}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <span>Custom Branding</span>
                  <Sparkles className="w-3 h-3 text-[#DE9B5E]" />
                </button>
              </li>
              <li>
                <a href="#b2b" className="hover:text-white transition-colors">
                  Business & Bulk
                </a>
              </li>
              <li>
                <a href="#product-details" className="hover:text-white transition-colors">
                  Product Details
                </a>
              </li>
              <li>
                <a href="#sustainability" className="hover:text-white transition-colors">
                  Sustainability Story
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Answered
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Pure Earth Smile Offerings (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DE9B5E] font-mono">
              Earth Smile Products
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B5C2B9]">
              <li>
                <a href="#products" className="hover:text-white transition-colors block">
                  <span className="font-medium text-white block">1. Bamboo Toothbrush</span>
                  <span className="text-[11px] text-[#86998C]">Ergonomic steam-carbonized Moso bamboo handle</span>
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors block">
                  <span className="font-medium text-white block">2. Bamboo Tongue Cleaner</span>
                  <span className="text-[11px] text-[#86998C]">100% organic with kraft packaging box</span>
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors block">
                  <span className="font-medium text-white block">3. Toothbrush + Cleaner Combo</span>
                  <span className="text-[11px] text-[#86998C]">Complete daily all-bamboo oral hygiene set</span>
                </a>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenBrandingStudio}
                  className="text-[11px] text-[#DE9B5E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Preview your logo before printing</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Procurement (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DE9B5E] font-mono">
              Procurement & WhatsApp Desk
            </h4>
            <div className="space-y-2.5 text-xs text-[#B5C2B9]">
              <div className="flex items-start gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#869A8C] block">Direct WhatsApp & Support:</span>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-white font-semibold hover:text-[#DE9B5E] transition-colors inline-block"
                  >
                    +91 {EARTH_SMILE_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#DE9B5E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#869A8C] block">Direct Call:</span>
                  <a
                    href={`tel:${EARTH_SMILE_PHONE}`}
                    className="font-mono text-white font-semibold hover:text-[#DE9B5E] transition-colors inline-block"
                  >
                    {EARTH_SMILE_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#DE9B5E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#869A8C] block">Commercial Inquiries:</span>
                  <a
                    href="mailto:contact@earthsmile.in"
                    className="text-white hover:text-[#DE9B5E] transition-colors"
                  >
                    contact@earthsmile.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DE9B5E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#869A8C] block">Fulfillment Hub:</span>
                  <span>Pan-India Supply & International Export Operations</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenEnquiry('Direct B2B Bamboo Procurement Proposal')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#142018] bg-[#DE9B5E] hover:bg-[#E5AA72] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Request B2B Quotation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lower Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F9485]">
          <div>
            <p>
              © {currentYear} <strong>EARTH SMILE</strong>. All rights reserved.
            </p>
            <p className="text-[11px] text-[#697D6E] mt-0.5">
              Eco-friendly dental-care products: Bamboo Toothbrushes, Bamboo Tongue Cleaners & Combos.
            </p>
          </div>

          <div className="flex items-center gap-5 text-[11px] flex-wrap justify-center sm:justify-end">
            <span className="text-[#8FA596]">
              WhatsApp: <strong>+91 {EARTH_SMILE_PHONE}</strong>
            </span>
            <span className="text-[#55695C]">·</span>
            <span className="text-[#8FA596]">
              100% Organic Moso Bamboo
            </span>
            <span className="text-[#55695C]">·</span>
            <a
              href="/admin"
              onClick={e => {
                e.preventDefault();
                onOpenAdmin?.();
              }}
              className="text-[#7F9485] hover:text-[#DE9B5E] transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Commercial Administrator Portal"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Staff Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
