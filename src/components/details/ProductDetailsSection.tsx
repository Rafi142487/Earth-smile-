import React, { useState } from 'react';
import { Product } from '../../types';
import { Check, ShieldCheck, Sparkles, Box, FileText, ArrowRight, Layers } from 'lucide-react';
import { ProductVisual } from '../common/ProductVisual';

interface ProductDetailsSectionProps {
  products: Product[];
  onOpenEnquiry: (productName?: string) => void;
  onOpenBrandingStudio: () => void;
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  products,
  onOpenEnquiry,
  onOpenBrandingStudio,
}) => {
  const [activeSlug, setActiveSlug] = useState<string>('bamboo-dental-combo');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const activeProduct = products.find(p => p.slug === activeSlug) || products[0];

  if (!activeProduct) return null;

  const handleSelectSlug = (slug: string) => {
    setActiveSlug(slug);
    setActiveImageIndex(0);
  };

  return (
    <section id="product-details" className="py-24 bg-[#FBFBF9] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Technical Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            Product Details & Material Architecture
          </h2>
          <p className="text-base sm:text-lg text-[#525B55] leading-relaxed">
            Every millimeter of Earth Smile bamboo oral care is designed for anatomical comfort, bacteriological safety, and 100% natural compostability.
          </p>
        </div>

        {/* 3 Product Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F2F1EA] border border-[#DDDCD3] rounded-xl mb-10 max-w-2xl">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectSlug(p.slug)}
              className={`flex-1 py-2.5 px-4 text-xs font-medium rounded-lg transition-all text-center cursor-pointer whitespace-nowrap ${
                activeSlug === p.slug
                  ? 'bg-white text-[#192E22] font-semibold shadow-xs'
                  : 'text-[#616B65] hover:text-[#192E22]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Active Product Deep Dive Layout */}
        <div className="bg-white border border-[#E3E2D8] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <ProductVisual
                type={
                  activeProduct.slug.includes('toothbrush')
                    ? 'toothbrush'
                    : activeProduct.slug.includes('cleaner')
                    ? 'tongue-cleaner'
                    : 'combo'
                }
                imageUrl={activeProduct.images[activeImageIndex]?.url || activeProduct.images[0]?.url}
                alt={activeProduct.name}
                aspectRatio="4:3"
                enable3DTilt={true}
                className="w-full"
              />

              {/* Thumbnails if multiple images exist */}
              {activeProduct.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {activeProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-18 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#BD7B3C] shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  <span className="text-[11px] text-[#78827C] ml-auto">
                    {activeProduct.images[activeImageIndex]?.caption || `Photo ${activeImageIndex + 1}`}
                  </span>
                </div>
              )}

              <div className="p-4 bg-[#FAF9F5] border border-[#E7E6DC] rounded-xl space-y-2">
                <span className="text-xs font-semibold text-[#192E22] block">
                  Packaging Specification:
                </span>
                <p className="text-xs text-[#555E58] leading-relaxed">
                  {activeProduct.packagingDetails}
                </p>
              </div>
            </div>

            {/* Specifications Column */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#BD7B3C] font-semibold">
                  Specification Sheet
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#192E22] mt-1 mb-3">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-[#525B55] leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              {/* Technical Attributes Table */}
              <div className="border border-[#E7E6DC] rounded-xl overflow-hidden divide-y divide-[#EAE9DF]">
                {Object.entries(activeProduct.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                    <span className="font-medium text-[#707973] sm:col-span-1">{key}</span>
                    <span className="font-semibold text-[#192E22] sm:col-span-2 mt-0.5 sm:mt-0">
                      {val}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-[#FAF9F5]">
                  <span className="font-medium text-[#707973] sm:col-span-1">Dimensions & Weight</span>
                  <span className="font-semibold text-[#192E22] sm:col-span-2 mt-0.5 sm:mt-0">
                    {activeProduct.size} · {activeProduct.weight}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs bg-[#FAF9F5]">
                  <span className="font-medium text-[#707973] sm:col-span-1">Custom Branding MOQ</span>
                  <span className="font-mono font-semibold text-[#BD7B3C] sm:col-span-2 mt-0.5 sm:mt-0">
                    {activeProduct.moq} {activeProduct.moqUnit} (Live digital logo preview provided)
                  </span>
                </div>
              </div>

              {/* Verified Features */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#192E22] mb-3">
                  Key Ergonomic & Botanical Benefits:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#3E4540]">
                      <Check className="w-3.5 h-3.5 text-[#2E5B3C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE9E1] flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenEnquiry(activeProduct.name)}
                  className="py-3 px-6 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Enquire for {activeProduct.name}
                </button>
                <button
                  onClick={onOpenBrandingStudio}
                  className="py-3 px-5 text-xs font-semibold text-[#192E22] bg-[#EAF2EC] hover:bg-[#D9E7DC] border border-[#CCDDCF] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                  <span>See Logo on this Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
