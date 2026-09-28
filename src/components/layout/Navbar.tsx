import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Menu, X, ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';

interface NavbarProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onOpenBrandingStudio,
  activeSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Why Earth Smile', href: '#why-us' },
    { label: 'Custom Branding', href: '#custom-branding' },
    { label: 'Business & Bulk', href: '#b2b' },
    { label: 'Product Details', href: '#product-details' },
    { label: 'Sustainability', href: '#sustainability' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E8E7DF] py-3.5 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4">
          <BrandLogo
            variant="dark"
            size="md"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-[#464E48]">
          {navLinks.map(link => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className={`relative py-1 transition-colors duration-200 hover:text-[#192E22] ${
                  isActive ? 'text-[#192E22] font-semibold' : ''
                } ${link.label === 'Custom Branding' ? 'text-[#BD7B3C] font-semibold flex items-center gap-1' : ''}`}
              >
                {link.label === 'Custom Branding' && <Sparkles className="w-3 h-3 text-[#BD7B3C]" />}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BD7B3C] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Direct WhatsApp Callout */}
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#2A3F32] hover:text-[#192E22] font-mono tabular-nums bg-[#EEF4EF] hover:bg-[#E2EDE4] rounded-lg transition-colors border border-[#D5E4D8]"
            title="Direct WhatsApp Inquiries"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#2E7D4E]" />
            <span>{EARTH_SMILE_PHONE}</span>
          </a>

          {/* Primary CTA */}
          <button
            onClick={() => onOpenEnquiry()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] active:scale-98 rounded-lg transition-all duration-200 whitespace-nowrap shadow-xs cursor-pointer"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#192E22] hover:bg-[#F2F1EA] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FBFBF9] border-b border-[#E8E7DF] px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[#2A312D] hover:text-[#BD7B3C] py-2 border-b border-[#F0EFE8] flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.label === 'Custom Branding' && (
                  <span className="text-[11px] bg-[#F7EFE6] text-[#BD7B3C] px-2 py-0.5 rounded font-mono">
                    Live Proofing
                  </span>
                )}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrandingStudio();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#192E22] bg-[#EAF2EC] border border-[#CCDDCF] rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                <span>See Your Logo on Bamboo</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3 text-center text-xs font-semibold text-white bg-[#192E22] rounded-lg shadow-sm cursor-pointer"
              >
                Request Commercial Quotation
              </button>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-center text-xs font-semibold text-[#192E22] bg-[#F4F3ED] border border-[#DDDCD3] rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2E7D4E]" />
                <span>WhatsApp: {EARTH_SMILE_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
