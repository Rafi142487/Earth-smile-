import React, { useState } from 'react';
import { ProductVisual } from '../common/ProductVisual';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onExploreBranding: () => void;
  onSelectProduct: (productSlug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onExploreBranding,
  onSelectProduct,
}) => {
  const [activeHeroTab, setActiveHeroTab] = useState<'bamboo-combo' | 'bamboo-cleaner' | 'bamboo-brush'>('bamboo-combo');
  const [heroLogoText, setHeroLogoText] = useState('YOUR LOGO HERE');

  const heroItems = {
    'bamboo-combo': {
      title: 'Complete Care Combo',
      subtitle: 'Bamboo Toothbrush + Bamboo Tongue Cleaner + Plantable Seed Balls',
      price: '₹129/pc',
      moq: 'MOQ 200 pcs',
      slug: 'bamboo-dental-combo',
      type: 'combo' as const,
      image: '/real-brush-and-cleaner.jpg',
      features: ['Brush + Cleaner + Plantable Seed Balls', 'Tiered Pricing from ₹99/pc', 'Custom Laser Logo Engraving'],
    },
    'bamboo-cleaner': {
      title: 'Artisan Curved Bamboo Tongue Cleaner',
      subtitle: 'Natural ergonomic bamboo scraper for oral freshness',
      price: '₹69/pc',
      moq: 'MOQ 200 pcs',
      slug: 'bamboo-tongue-cleaner',
      type: 'tongue-cleaner' as const,
      image: '/real-tongue-cleaner.png',
      features: ['100% Pure Moso Bamboo', 'Tiered Pricing from ₹59/pc', 'Splinter-Free Smooth Finish'],
    },
    'bamboo-brush': {
      title: 'Artisan Moso Bamboo Toothbrush',
      subtitle: 'Organic Moso bamboo with soft charcoal bio-bristles',
      price: '₹65/pc',
      moq: 'MOQ 200 pcs',
      slug: 'bamboo-toothbrush',
      type: 'toothbrush' as const,
      image: '/real-bamboo-toothbrush.jpg',
      features: ['Zero Plastic Bio-Bristles', 'Tiered Pricing from ₹49/pc', '100% Compostable Handle'],
    },
  };

  const currentItem = heroItems[activeHeroTab];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#FBFBF9] bg-subtle-grain border-b border-[#ECEBE3]">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#E8EFE9]/40 rounded-full blur-3xl pointer-events-none -mr-40" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#F5EFE6]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Messaging */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Quiet unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-4">
              <span>Pure Moso Bamboo</span>
              <span aria-hidden="true">·</span>
              <span>Toothbrushes & Tongue Cleaners</span>
              <span aria-hidden="true">·</span>
              <span>Pre-Print Logo Preview</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-serif font-medium leading-[1.08] text-[#142018] tracking-tight mb-6 max-w-2xl text-balance">
              Better Smiles. <br className="hidden sm:inline" />
              Better Choices.
            </h1>

            {/* Supporting paragraph */}
            <p className="text-lg md:text-xl text-[#4F5651] font-normal leading-relaxed max-w-xl mb-8">
              Thoughtfully designed bamboo dental essentials for everyday oral care and conscious living.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#274433] rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group cursor-pointer tracking-wider uppercase"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreBranding}
                className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#192E22] bg-[#F0EFE8] hover:bg-[#E7E5DC] border border-[#DDDCD3] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer tracking-wider uppercase"
              >
                <Sparkles className="w-4 h-4 text-[#BD7B3C]" />
                <span>CUSTOM BRANDING</span>
              </button>
            </div>

            {/* Quiet Trust & Claim-to-Proof Row */}
            <div className="pt-6 border-t border-[#EAE9E1] grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <p className="text-xl md:text-2xl font-serif font-bold text-[#192E22] tabular-nums">100%</p>
                <p className="text-xs text-[#606963] mt-0.5">Organic Moso bamboo</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-serif font-bold text-[#192E22] tabular-nums">0%</p>
                <p className="text-xs text-[#606963] mt-0.5">Zero plastic handles</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-serif font-bold text-[#192E22] tabular-nums">Together</p>
                <p className="text-xs text-[#606963] mt-0.5">Toothbrush & Cleaner</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Toothbrush & Tongue Cleaner Together */}
          <div className="lg:col-span-5 relative">
            {/* Interactive segment switcher for hero products */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F0EFE8] border border-[#DDDCD3] rounded-lg mb-4">
              <button
                onClick={() => setActiveHeroTab('bamboo-combo')}
                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  activeHeroTab === 'bamboo-combo'
                    ? 'bg-white text-[#192E22] shadow-xs font-semibold'
                    : 'text-[#606963] hover:text-[#192E22]'
                }`}
              >
                Together (Duo Set)
              </button>
              <button
                onClick={() => setActiveHeroTab('bamboo-brush')}
                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  activeHeroTab === 'bamboo-brush'
                    ? 'bg-white text-[#192E22] shadow-xs font-semibold'
                    : 'text-[#606963] hover:text-[#192E22]'
                }`}
              >
                Bamboo Toothbrush
              </button>
              <button
                onClick={() => setActiveHeroTab('bamboo-cleaner')}
                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  activeHeroTab === 'bamboo-cleaner'
                    ? 'bg-white text-[#192E22] shadow-xs font-semibold'
                    : 'text-[#606963] hover:text-[#192E22]'
                }`}
              >
                Bamboo Tongue Cleaner
              </button>
            </div>

            {/* Main Interactive Card */}
            <div className="relative group">
              <ProductVisual
                type={currentItem.type}
                imageUrl={currentItem.image}
                alt={currentItem.title}
                aspectRatio="4:3"
                className="shadow-lg hover:shadow-2xl transition-all duration-300"
                enable3DTilt={true}
                showCustomBranding={true}
                customLogoText={heroLogoText}
              />

              {/* Toothbrush and Tongue Cleaner Together Preview Strip */}
              <div className="mt-3 p-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#192E22] uppercase tracking-wider pl-1">
                  Paired Together:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveHeroTab('bamboo-brush')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                      activeHeroTab === 'bamboo-brush'
                        ? 'bg-white border-[#192E22] font-semibold text-[#192E22]'
                        : 'bg-white/70 border-[#DDDCD3] text-[#555E58] hover:bg-white'
                    }`}
                  >
                    <img
                      src="/real-bamboo-toothbrush.jpg"
                      alt="Bamboo Toothbrush"
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span>Toothbrush</span>
                  </button>

                  <button
                    onClick={() => setActiveHeroTab('bamboo-cleaner')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                      activeHeroTab === 'bamboo-cleaner'
                        ? 'bg-white border-[#192E22] font-semibold text-[#192E22]'
                        : 'bg-white/70 border-[#DDDCD3] text-[#555E58] hover:bg-white'
                    }`}
                  >
                    <img
                      src="/real-tongue-cleaner.png"
                      alt="Bamboo Tongue Cleaner"
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span>Tongue Cleaner</span>
                  </button>

                  <button
                    onClick={() => setActiveHeroTab('bamboo-combo')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                      activeHeroTab === 'bamboo-combo'
                        ? 'bg-[#192E22] border-[#192E22] font-semibold text-white'
                        : 'bg-white/70 border-[#DDDCD3] text-[#555E58] hover:bg-white'
                    }`}
                  >
                    <img
                      src="/real-brush-and-cleaner.jpg"
                      alt="Both Together"
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span>Both Together</span>
                  </button>
                </div>
              </div>

              {/* Live Mini Brand Input on Hero Card */}
              <div className="mt-3 p-4 bg-white/95 backdrop-blur-xs border border-[#E5E4DC] rounded-xl shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-serif font-bold text-[#192E22]">
                      {currentItem.price}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#78817B]">
                      Max Price / MRP
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold">
                    {currentItem.moq}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={heroLogoText}
                    onChange={e => setHeroLogoText(e.target.value)}
                    placeholder="Enter brand name..."
                    maxLength={26}
                    className="flex-1 px-3 py-1.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs font-mono uppercase text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                  <button
                    onClick={onExploreBranding}
                    className="px-3 py-1.5 bg-[#192E22] text-white text-xs font-medium rounded-lg hover:bg-[#254231] whitespace-nowrap cursor-pointer"
                  >
                    Upload Logo
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0EFE8]">
                  <button
                    onClick={() => onSelectProduct(currentItem.slug)}
                    className="text-xs font-semibold text-[#192E22] hover:text-[#BD7B3C] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-[#7E8781]">Interactive 3D Motion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
