import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Sparkles, Lock, FileText, RefreshCw, Cookie, Trash2, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';
import { CopyButton } from '../common/CopyButton';
import { LegalTab } from '../legal/LegalModal';

interface FooterProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
  onOpenAdmin?: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenEnquiry,
  onOpenBrandingStudio,
  onOpenAdmin,
  onOpenLegal,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#142018] text-[#D8E0DA] pt-20 pb-12 border-t border-[#263D2E] no-print">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A4132]">
          {/* Brand Column (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-[#AAB8AE] leading-relaxed max-w-sm pt-2">
              Earth Smile manufactures certified organic Moso bamboo toothbrushes and handcrafted bamboo tongue cleaners for dental practices, boutique hotels, eco-resorts, and retail distributors worldwide.
            </p>

            {/* Corporate Registration Details */}
            <div className="pt-2 text-[11px] text-[#8FA596] space-y-1.5 border-t border-[#243B2E]">
              <div className="flex items-center justify-between">
                <span>Entity: <strong>Earth Smile Eco Innovations Pvt. Ltd.</strong></span>
              </div>
              <div>
                <span>Registered Office: Peenya 2nd Stage, Bengaluru, KA 560058</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-[#A5BBAE]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DE9B5E]" />
                <span>Zero Plastic Supply Chain • 100% Upfront Pricing Guarantee</span>
              </div>
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
                  Products & Catalog
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

          {/* Legal & Trust Column (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DE9B5E] font-mono">
              Legal, Trust & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#B5C2B9]">
              <li>
                <button
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3 h-3 text-[#8FA596]" />
                  <span>Privacy Policy (GDPR / DPDP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <FileText className="w-3 h-3 text-[#8FA596]" />
                  <span>Terms of Service (B2B Terms)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('refund')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <RefreshCw className="w-3 h-3 text-[#8FA596]" />
                  <span>Refund & Quality Replacement</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('cookies')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Cookie className="w-3 h-3 text-[#8FA596]" />
                  <span>Cookie Policy & Local Storage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('standards')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left text-emerald-400"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Verified Material Standards</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('deletion')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left text-red-400"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Request Data Deletion</span>
                </button>
              </li>
              <li className="pt-2 text-[10px] text-[#7F9485]">
                <span>Font Licenses: Inter & Cormorant (SIL OFL)</span>
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
                <div className="flex-1">
                  <span className="text-[10px] text-[#869A8C] block">Direct WhatsApp & Support:</span>
                  <div className="flex items-center justify-between">
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-white font-semibold hover:text-[#DE9B5E] transition-colors"
                    >
                      +91 {EARTH_SMILE_PHONE}
                    </a>
                    <CopyButton textToCopy={`+91${EARTH_SMILE_PHONE}`} label="Copy" size="sm" variant="ghost" className="text-stone-300" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#DE9B5E] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[10px] text-[#869A8C] block">Commercial Inquiries:</span>
                  <div className="flex items-center justify-between">
                    <a
                      href="mailto:contact@earthsmile.in"
                      className="text-white hover:text-[#DE9B5E] transition-colors font-mono"
                    >
                      contact@earthsmile.in
                    </a>
                    <CopyButton textToCopy="contact@earthsmile.in" label="Copy" size="sm" variant="ghost" className="text-stone-300" />
                  </div>
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
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#142018] bg-[#DE9B5E] hover:bg-[#E5AA72] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
              © {currentYear} <strong>Earth Smile Eco Innovations Pvt. Ltd.</strong> All rights reserved.
            </p>
            <p className="text-[11px] text-[#697D6E] mt-0.5">
              Verified for Q4 2026 • Certified Organic Moso Bamboo Oral Hygiene Solutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#55695C]">·</span>
            <button
              onClick={() => onOpenLegal?.('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-[#55695C]">·</span>
            <button
              onClick={() => onOpenLegal?.('cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
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
