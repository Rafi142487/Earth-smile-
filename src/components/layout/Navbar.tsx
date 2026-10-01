import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Menu, X, ArrowUpRight, Sparkles, Lock, Keyboard, Search } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { ThemeToggle } from '../common/ThemeToggle';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';
import { LegalTab } from '../legal/LegalModal';

interface NavbarProps {
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
  onOpenAdmin?: () => void;
  onOpenShortcuts?: () => void;
  onOpenSearch?: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onOpenBrandingStudio,
  onOpenAdmin,
  onOpenShortcuts,
  onOpenSearch,
  onOpenLegal,
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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Global keyboard shortcuts (/ or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 no-print ${
        scrolled
          ? 'bg-[#FBFBF9]/95 dark:bg-[#0E1712]/95 backdrop-blur-md border-b border-[#E8E7DF] dark:border-[#23382D] py-3.5 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4">
          <BrandLogo
            variant="dark"
            size="md"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-[#464E48] dark:text-[#CBD8CE]">
          {navLinks.map(link => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className={`relative py-1 transition-colors duration-200 hover:text-[#192E22] dark:hover:text-white ${
                  isActive ? 'text-[#192E22] dark:text-white font-semibold' : ''
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
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Site Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-[#556059] dark:text-[#CBD8CE] hover:text-[#192E22] dark:hover:text-white bg-[#F3F2EB] dark:bg-[#1E3326] hover:bg-[#EAE8DD] dark:hover:bg-[#274432] rounded-lg transition-all border border-[#DDD9CE] dark:border-[#2C4A37] shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              title="Search Products, Specifications, FAQs (Shortcut: / or ⌘K)"
              aria-label="Search website"
            >
              <Search className="w-3.5 h-3.5 text-[#BD7B3C]" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline-block px-1 py-0.2 text-[10px] font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-500 dark:text-stone-400">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Direct WhatsApp Callout with official WhatsApp logo */}
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#1D3B28] dark:text-[#A8E2B9] hover:text-[#192E22] font-mono tabular-nums bg-[#E7F6EC] dark:bg-[#1A3324] hover:bg-[#D5EFE0] dark:hover:bg-[#234531] rounded-lg transition-all border border-[#C5E8D0] dark:border-[#2D5A3C] shadow-2xs hover:scale-102"
            title={`Direct WhatsApp Inquiries (+91 ${EARTH_SMILE_PHONE})`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
            <span>{EARTH_SMILE_PHONE}</span>
          </a>

          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="hidden lg:inline-flex p-2 rounded-lg text-[#556059] dark:text-[#A7D3B5] hover:text-[#192E22] dark:hover:text-white bg-[#F3F2EB] dark:bg-[#1E3326] hover:bg-[#EBE9E0] dark:hover:bg-[#274432] border border-[#DDD9CE] dark:border-[#2C4A37] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title="Keyboard Shortcuts (Press ?)"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4 text-[#BD7B3C]" />
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => onOpenEnquiry()}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-[#192E22] dark:bg-[#254231] hover:bg-[#254231] dark:hover:bg-[#2F523D] active:scale-98 rounded-lg transition-all duration-200 whitespace-nowrap shadow-xs hover:shadow-md cursor-pointer hover-lift focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#192E22] dark:text-[#E2ECE5] hover:bg-[#F2F1EA] dark:hover:bg-[#1A2C21] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative bg-[#FAF9F5] dark:bg-[#101C14] border-b border-[#E8E7DF] dark:border-[#243B2C] px-6 py-6 shadow-2xl max-h-[calc(100vh-65px)] overflow-y-auto animate-in slide-in-from-top-3 duration-250">
            {/* Mobile Search Button */}
            {onOpenSearch && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#16261E] border border-stone-200 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-300 flex items-center justify-between shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#BD7B3C]" />
                    <span>Search Products, Specs, FAQs...</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 dark:bg-stone-800 rounded">
                    /
                  </kbd>
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-[#2A312D] dark:text-[#E2ECE5] hover:text-[#BD7B3C] dark:hover:text-[#DE9B5E] py-2 border-b border-[#F0EFE8] dark:border-[#1E3125] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.label === 'Custom Branding' && (
                    <span className="text-[11px] bg-[#F7EFE6] dark:bg-[#2B2319] text-[#BD7B3C] px-2 py-0.5 rounded font-mono">
                      Live Proofing
                    </span>
                  )}
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBrandingStudio();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#192E22] dark:text-[#E2ECE5] bg-[#EAF2EC] dark:bg-[#1D3325] border border-[#CCDDCF] dark:border-[#2C4E37] rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                  <span>See Your Logo on Bamboo</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEnquiry();
                  }}
                  className="w-full py-3 text-center text-xs font-semibold text-white bg-[#192E22] dark:bg-[#254231] rounded-lg shadow-sm cursor-pointer"
                >
                  Request Commercial Quotation
                </button>

                {/* Mobile WhatsApp Action Button with authentic WhatsApp Icon */}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#142018] dark:text-white bg-[#E3F6EB] dark:bg-[#1B3525] border border-[#BDE8CB] dark:border-[#2B543A] rounded-lg flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Desk: {EARTH_SMILE_PHONE}</span>
                </a>

                {/* Mobile Shortcuts */}
                {onOpenShortcuts && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenShortcuts();
                      }}
                      className="w-full py-2 px-3 text-center text-xs font-medium text-[#4F5953] dark:text-[#CBD8CE] bg-white dark:bg-[#182A1F] border border-[#DDDCD3] dark:border-[#284131] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-[#BD7B3C]" />
                      <span>Keyboard Shortcuts (?)</span>
                    </button>
                  </div>
                )}

                {/* Mobile Legal links */}
                <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLegal?.('privacy');
                    }}
                    className="hover:underline"
                  >
                    Privacy
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLegal?.('terms');
                    }}
                    className="hover:underline"
                  >
                    Terms
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLegal?.('refund');
                    }}
                    className="hover:underline"
                  >
                    Refunds
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLegal?.('cookies');
                    }}
                    className="hover:underline"
                  >
                    Cookies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
