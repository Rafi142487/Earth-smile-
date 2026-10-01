import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Package, ArrowRight, ShieldCheck, HelpCircle, FileText, CornerDownLeft, ExternalLink } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/products';
import { FAQS_DATA } from '../../data/faqs';

interface SiteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
  onSelectProduct?: (slug: string) => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'refund' | 'cookies' | 'deletion') => void;
}

interface SearchItem {
  id: string;
  category: 'Products' | 'Branding & Specs' | 'B2B Wholesale' | 'Sustainability' | 'FAQs & Policies' | 'Quick Actions';
  title: string;
  snippet: string;
  action: () => void;
  badge?: string;
}

export const SiteSearchModal: React.FC<SiteSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenEnquiry,
  onOpenBrandingStudio,
  onSelectProduct,
  onOpenLegal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle keyboard shortcut Esc and arrow keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const scrollTo = (elementId: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Compile full searchable catalog items
  const allItems: SearchItem[] = [
    // Core Products
    ...INITIAL_PRODUCTS.map(p => ({
      id: `prod-${p.id}`,
      category: 'Products' as const,
      title: p.name,
      snippet: `${p.shortDescription} • Price: ${p.price} • MOQ: ${p.moq} ${p.moqUnit}`,
      badge: 'Product',
      action: () => {
        onClose();
        if (onSelectProduct) {
          onSelectProduct(p.slug);
        } else {
          scrollTo('products');
        }
      },
    })),

    // Live Custom Branding
    {
      id: 'branding-studio',
      category: 'Branding & Specs' as const,
      title: 'Live Laser Logo Studio & 3D Mockup',
      snippet: 'Type your brand name or upload clinic logo to inspect real-time laser engraving proof on bamboo toothbrushes and tongue cleaners.',
      badge: 'Interactive',
      action: () => {
        onClose();
        onOpenBrandingStudio();
      },
    },
    {
      id: 'laser-spec',
      category: 'Branding & Specs' as const,
      title: 'Industrial CO2 Laser Engraving Specifications',
      snippet: '±0.05mm precision alignment, permanent carbonized burn mark without chemical inks or synthetic dyes.',
      badge: 'Specs',
      action: () => scrollTo('custom-branding'),
    },
    {
      id: 'packaging-custom',
      category: 'Branding & Specs' as const,
      title: 'Biodegradable Kraft Box Custom Packaging',
      snippet: 'Individual post-consumer recycled kraft boxes with custom soy-ink printing and euro hang tabs for retail display.',
      badge: 'Packaging',
      action: () => scrollTo('product-details'),
    },

    // B2B Wholesale
    {
      id: 'b2b-dental',
      category: 'B2B Wholesale' as const,
      title: 'Dental Practices & Orthodontic Clinic Supply',
      snippet: 'Branded dental hygiene tools for patient welcome kits and clinic giveaways. MOQ 100 units with free laser setup.',
      badge: 'Clinic B2B',
      action: () => scrollTo('b2b'),
    },
    {
      id: 'b2b-hotel',
      category: 'B2B Wholesale' as const,
      title: 'Luxury Boutique Hotels & Eco-Resort Amenities',
      snippet: 'Zero-plastic guest bathroom toothbrushes in sealed compostable kraft sleeves with your hospitality logo.',
      badge: 'Hospitality',
      action: () => scrollTo('b2b'),
    },
    {
      id: 'b2b-corporate',
      category: 'B2B Wholesale' as const,
      title: 'Corporate Gifting & Annual ESG Programs',
      snippet: 'Executive employee onboarding packages and sustainability milestone kits in debossed gift boxes.',
      badge: 'Corporate',
      action: () => scrollTo('b2b'),
    },

    // Sustainability & Standards
    {
      id: 'moso-bamboo',
      category: 'Sustainability' as const,
      title: '100% Organic Moso Bamboo (Phyllostachys edulis)',
      snippet: 'Panda-friendly, pesticide-free wild harvested bamboo with natural microbial resistance and 180-day home compostability.',
      badge: 'Material',
      action: () => scrollTo('sustainability'),
    },
    {
      id: 'quality-trust',
      category: 'Sustainability' as const,
      title: '220°C Thermal Carbonization & Pull-Force Testing',
      snippet: 'Dry-steam heat carbonization prevents bathroom water absorption, bristle pull-force mechanical stress tested.',
      badge: 'Quality',
      action: () => scrollTo('why-us'),
    },

    // FAQs
    ...FAQS_DATA.slice(0, 6).map(f => ({
      id: f.id,
      category: 'FAQs & Policies' as const,
      title: f.question,
      snippet: f.answer,
      badge: 'FAQ',
      action: () => scrollTo('faq'),
    })),

    // Quick Actions & Policies
    {
      id: 'action-quote',
      category: 'Quick Actions' as const,
      title: 'Request Commercial Wholesale Quotation',
      snippet: 'Submit your product requirements, volume, and custom engraving specs for an instant price matrix.',
      badge: 'Quick Action',
      action: () => {
        onClose();
        onOpenEnquiry();
      },
    },
    {
      id: 'policy-privacy',
      category: 'FAQs & Policies' as const,
      title: 'Privacy Policy & Data Security',
      snippet: 'Learn how Earth Smile safeguards your business data under GDPR & Indian Digital Personal Data Protection Act (DPDP).',
      badge: 'Legal',
      action: () => {
        onClose();
        onOpenLegal?.('privacy');
      },
    },
    {
      id: 'policy-terms',
      category: 'FAQs & Policies' as const,
      title: 'Terms of Service & Commercial B2B Agreement',
      snippet: 'Clear terms on minimum orders, pre-production sample approvals, delivery timelines, and payment structures.',
      badge: 'Legal',
      action: () => {
        onClose();
        onOpenLegal?.('terms');
      },
    },
    {
      id: 'policy-refund',
      category: 'FAQs & Policies' as const,
      title: 'Refund & Quality Replacement Policy',
      snippet: 'Guaranteed 7-day replacement protocol for manufacturing or laser engraving defects with pre-dispatch QC proofing.',
      badge: 'Legal',
      action: () => {
        onClose();
        onOpenLegal?.('refund');
      },
    },
    {
      id: 'policy-cookies',
      category: 'FAQs & Policies' as const,
      title: 'Cookie Policy & Local Storage Transparency',
      snippet: 'Zero third-party tracking cookies. We only use local preferences for dark mode, cart/quote drafts, and 3D logo previews.',
      badge: 'Legal',
      action: () => {
        onClose();
        onOpenLegal?.('cookies');
      },
    },
    {
      id: 'policy-deletion',
      category: 'Quick Actions' as const,
      title: 'Request Data Deletion (Right to be Forgotten)',
      snippet: 'Submit a self-serve request to permanently wipe your quotation enquiries and contact details from our database.',
      badge: 'Data Rights',
      action: () => {
        onClose();
        onOpenLegal?.('deletion');
      },
    },
  ];

  // Filter items by query
  const filtered = query.trim()
    ? allItems.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.snippet.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        );
      })
    : allItems.slice(0, 8); // Top recommendations when blank

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search and Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#121E17] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#243B2E] overflow-hidden flex flex-col max-h-[80vh] text-[#1C1F1D] dark:text-[#E2ECE5] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDownNav}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-[#243B2E] bg-stone-50/70 dark:bg-[#16261E]/70">
          <Search className="w-5 h-5 text-stone-400 dark:text-stone-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search products, laser specs, wholesale tiers, certifications, FAQs..."
            aria-label="Search site"
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs px-2 py-1 rounded cursor-pointer mr-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search modal"
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-stone-100 dark:divide-stone-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-500 dark:text-stone-400 space-y-2">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try searching for "Toothbrush", "Tongue Cleaner", "MOQ", "Laser branding", or "Refunds".
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#192E22] text-white shadow-sm'
                      : 'hover:bg-stone-100/80 dark:hover:bg-[#1A2E23]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-[#BD7B3C] border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {item.category}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-emerald-500/30 text-emerald-200'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-[#192E22] dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p
                      className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-stone-200' : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {item.snippet}
                    </p>
                  </div>

                  <div className="pt-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-white text-[#192E22]'
                          : 'text-stone-400 group-hover:text-stone-700'
                      }`}
                    >
                      <span>Jump</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-[#101A14] border-t border-stone-200 dark:border-[#243B2E] text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-[10px] shadow-2xs">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-[10px] shadow-2xs">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-[10px] shadow-2xs">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-[10px] shadow-2xs">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>

          <div className="text-[10px] font-mono text-stone-400">
            Earth Smile Enterprise Catalog
          </div>
        </div>
      </div>
    </div>
  );
};
