import React, { useState } from 'react';
import { ProductVisual } from '../common/ProductVisual';
import { CombinedEssentialsDisplay } from './CombinedEssentialsDisplay';
import { Check, ArrowRight, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface ProductShowcaseProps {
  products: Product[];
  onOpenEnquiry: (productName?: string) => void;
  onSelectProduct: (productSlug: string) => void;
  onOpenBrandingStudio: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  onOpenEnquiry,
  onSelectProduct,
  onOpenBrandingStudio,
}) => {
  // Ensure the 3 real products are ordered: Tongue Cleaner, Toothbrush, Combo
  const orderedSlugs = ['bamboo-tongue-cleaner', 'bamboo-toothbrush', 'bamboo-dental-combo'];
  const showcaseProducts = orderedSlugs
    .map(slug => products.find(p => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  const comboProduct = products.find(p => p.slug === 'bamboo-dental-combo');
  const toothbrushProduct = products.find(p => p.slug === 'bamboo-toothbrush');
  const cleanerProduct = products.find(p => p.slug === 'bamboo-tongue-cleaner');

  return (
    <section id="products" className="py-24 bg-[#F5F5EE] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header as strictly specified */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Earth Smile Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            Simple Essentials. Thoughtfully Made.
          </h2>
          <p className="text-base sm:text-lg text-[#525B55] leading-relaxed">
            Crafted strictly from certified organic Moso bamboo. No plastics, no chemical coatings, no fabricated claims.
          </p>
        </div>

        {/* 3 Real Product Offerings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {showcaseProducts.map((product, idx) => {
            const isCombo = product.slug === 'bamboo-dental-combo';
            return (
              <div
                key={product.id}
                className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                  isCombo
                    ? 'border-[#BD7B3C]/50 ring-1 ring-[#BD7B3C]/20 shadow-md'
                    : 'border-[#E4E3DA] hover:border-[#192E22]/40 shadow-xs'
                }`}
              >
                <div>
                  {/* Lead Product Image Frame */}
                  <div
                    onClick={() => onSelectProduct(product.slug)}
                    className="relative bg-[#FAF9F5] p-3 cursor-pointer overflow-hidden"
                  >
                    <ProductVisual
                      type={
                        product.slug.includes('toothbrush')
                          ? 'toothbrush'
                          : product.slug.includes('cleaner')
                          ? 'tongue-cleaner'
                          : 'combo'
                      }
                      imageUrl={product.images[0]?.url}
                      alt={product.name}
                      aspectRatio="4:3"
                      enable3DTilt={true}
                      showCustomBranding={true}
                      customLogoText="EARTH SMILE"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Custom Branding Availability Badge */}
                    {product.customBrandingAvailable && (
                      <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#2E4A37] border border-[#DDDCD3] shadow-xs">
                        Custom Branding Available
                      </div>
                    )}

                    {/* Special indicator for Combo Together */}
                    {isCombo && (
                      <div className="absolute top-5 left-5 bg-[#192E22] text-white px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                        Toothbrush & Cleaner Together
                      </div>
                    )}
                  </div>

                  {/* Product Metadata & Info */}
                  <div className="p-6 pb-2">
                    <div className="flex items-center justify-between text-xs text-[#6B736E] mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[#2D5A3C]">
                        {product.categoryLabel}
                      </span>
                      <span className="font-mono text-[#BD7B3C] font-semibold">
                        MOQ: {product.moq} {product.moqUnit}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product.slug)}
                      className="font-serif text-xl sm:text-2xl font-semibold text-[#142018] group-hover:text-[#BD7B3C] transition-colors cursor-pointer mb-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#545C56] leading-relaxed mb-5 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    {/* Key Features List */}
                    <div className="space-y-2 mb-6">
                      {product.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#39403B]">
                          <Check className="w-3.5 h-3.5 text-[#2E5B3C] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Section */}
                <div className="p-6 pt-0 border-t border-[#F2F1EA] mt-4">
                  <div className="flex items-center justify-between pt-4 mb-4">
                    <div>
                      <span className="text-[11px] text-[#78827C] block">Pricing Guidance</span>
                      <span className="text-xs font-semibold text-[#142018]">
                        Request a Quote
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product.slug)}
                      className="text-xs font-semibold text-[#192E22] hover:text-[#BD7B3C] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Specifications</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onOpenEnquiry(product.name)}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all text-center cursor-pointer shadow-xs"
                    >
                      GET A QUOTE
                    </button>

                    <a
                      href={buildWhatsAppUrl({
                        productName: product.name,
                        quantity: product.moq,
                        customBranding: true,
                        customQuery: `Hi Earth Smile, I want to enquire about ${product.name} with custom laser branding.`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 text-xs font-semibold text-[#192E22] bg-[#EAF2EC] hover:bg-[#DDEADA] border border-[#CCDDCF] rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#2E5B3C]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified 'Combined Essentials' Display Component */}
        <CombinedEssentialsDisplay
          comboProduct={comboProduct}
          toothbrushProduct={toothbrushProduct}
          cleanerProduct={cleanerProduct}
          onOpenEnquiry={onOpenEnquiry}
          onSelectProduct={onSelectProduct}
          onOpenBrandingStudio={onOpenBrandingStudio}
        />
      </div>
    </section>
  );
};
