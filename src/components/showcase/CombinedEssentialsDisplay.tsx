import React, { useState, useRef, MouseEvent } from 'react';
import { Product } from '../../types';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { Check, Sparkles, ArrowRight, Layers, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface CombinedEssentialsDisplayProps {
  comboProduct?: Product;
  toothbrushProduct?: Product;
  cleanerProduct?: Product;
  onOpenEnquiry: (productName?: string) => void;
  onSelectProduct: (productSlug: string) => void;
  onOpenBrandingStudio: () => void;
}

export const CombinedEssentialsDisplay: React.FC<CombinedEssentialsDisplayProps> = ({
  comboProduct,
  toothbrushProduct,
  cleanerProduct,
  onOpenEnquiry,
  onSelectProduct,
  onOpenBrandingStudio,
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'ritual' | 'synced'>('unified');
  const [logoText, setLogoText] = useState('YOUR CLINIC / BRAND');
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      x: ((y - centerY) / centerY) * -6,
      y: ((x - centerX) / centerX) * 6,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleWhatsAppPair = () => {
    return buildWhatsAppUrl({
      productName: 'Complete Care Combo (Bamboo Toothbrush + Tongue Cleaner + Plantable Seed Balls)',
      quantity: 200,
      customBranding: true,
      customQuery: `Hi Earth Smile, I want to enquire about the Complete Care Combo (Bamboo Toothbrush + Bamboo Tongue Cleaner + Plantable Seed Balls) with custom branding "${logoText}". Please share wholesale quotation and sample details.`,
    });
  };

  return (
    <div className="bg-white border border-[#E2E1D6] rounded-2xl p-6 sm:p-10 shadow-sm overflow-hidden">
      {/* Top Header Row with Kicker & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#ECEBE2] mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Unified Oral Care System</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-[#142018] tracking-tight">
            Combined Essentials: Better Together
          </h3>
          <p className="text-sm text-[#555D57] mt-1 max-w-xl">
            Brushing cleans teeth enamel; scraping cleans the tongue. Crafted from matching organic Moso bamboo, engineered to work in harmony.
          </p>
        </div>

        {/* View Mode Interactive Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F0E8] border border-[#DDDCD1] rounded-xl self-start lg:self-auto">
          <button
            onClick={() => setViewMode('unified')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'unified'
                ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                : 'text-[#5C645F] hover:text-[#192E22]'
            }`}
          >
            Merged Canvas
          </button>
          <button
            onClick={() => setViewMode('ritual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'ritual'
                ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                : 'text-[#5C645F] hover:text-[#192E22]'
            }`}
          >
            Ritual Composition
          </button>
          <button
            onClick={() => setViewMode('synced')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'synced'
                ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                : 'text-[#5C645F] hover:text-[#192E22]'
            }`}
          >
            Side-by-Side Sync
          </button>
        </div>
      </div>

      {/* Main Grid: Unified Visual Canvas (Left) + Value as a Pair (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Seamlessly Merged Visual Canvas with 3D Tilt */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative bg-gradient-to-b from-[#F7F6F0] via-[#FAF9F5] to-[#F1EFE8] border border-[#E0DED3] rounded-2xl overflow-hidden p-6 sm:p-8 transition-shadow duration-500 shadow-sm hover:shadow-xl"
            style={{ perspective: 1000 }}
          >
            {/* Ambient Lighting & Glare */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 opacity-25"
              style={{
                background: isHovered
                  ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`
                  : 'none',
              }}
            />

            {/* Top Stage Badges */}
            <div className="flex items-center justify-between gap-2 relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-[#192E22] border border-[#DDDCD3] shadow-xs font-semibold">
                  Toothbrush + Tongue Cleaner Paired
                </span>
                <span className="hidden sm:inline-block text-[11px] text-[#78827C]">
                  100% Organic Moso Bamboo
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold bg-white/90 px-2 py-0.5 rounded border border-[#E0DED4]">
                ±0.05mm Matched Laser
              </span>
            </div>

            {/* Dynamic Visual Content Based on View Mode */}
            <div
              className="relative w-full aspect-[16/11] transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: isHovered
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
                  : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* VIEW 1: UNIFIED MERGED CANVAS (Toothbrush & Tongue Cleaner gracefully layered together) */}
              {viewMode === 'unified' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Background Pedestal Glow */}
                  <div className="absolute bottom-4 w-4/5 h-10 bg-stone-900/10 blur-xl rounded-full" />

                  {/* Left Layer: Real Bamboo Toothbrushes Pair */}
                  <div
                    className="absolute left-2 sm:left-4 top-4 bottom-4 w-[54%] rounded-xl overflow-hidden shadow-lg border border-[#E7E5DC] bg-white transition-transform duration-500 hover:scale-105 z-10 p-1 flex items-center justify-center"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <ProgressiveImage
                      src="/real-bamboo-toothbrush.jpg"
                      alt="Authentic Bamboo Toothbrush with charcoal bristles"
                      placeholderType="toothbrush"
                    />
                    <div className="absolute top-3 left-3 bg-[#192E22]/90 text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow-xs z-10">
                      Item 01: Toothbrush
                    </div>
                    {/* Synchronized Laser Logo Overlay on Toothbrush */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#EADCC8]/90 backdrop-blur-xs px-3 py-1 rounded text-[10px] font-serif italic text-[#4A321A] border border-[#C5B498] shadow-sm max-w-[85%] text-center truncate z-10">
                      {logoText}
                    </div>
                  </div>

                  {/* Right Layer: Real Bamboo Tongue Cleaner */}
                  <div
                    className="absolute right-2 sm:right-4 top-6 bottom-2 w-[54%] rounded-xl overflow-hidden shadow-xl border border-[#E7E5DC] bg-white transition-transform duration-500 hover:scale-105 z-20 p-1 flex items-center justify-center"
                    style={{ transform: 'rotate(2deg)' }}
                  >
                    <ProgressiveImage
                      src="/real-tongue-cleaner.png"
                      alt="Authentic Bamboo Tongue Cleaner"
                      placeholderType="tongue-cleaner"
                    />
                    <div className="absolute top-3 right-3 bg-[#BD7B3C] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow-xs z-10">
                      Item 02: Tongue Cleaner
                    </div>
                    {/* Synchronized Laser Logo Overlay on Tongue Cleaner */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#EADCC8]/90 backdrop-blur-xs px-3 py-1 rounded text-[10px] font-serif italic text-[#4A321A] border border-[#C5B498] shadow-sm max-w-[85%] text-center truncate z-10">
                      {logoText}
                    </div>
                  </div>

                  {/* Center Unifying Seal Badge */}
                  <div className="absolute z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DDDCD3] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#192E22]">
                    <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                    <span>Matched Bamboo Pair</span>
                  </div>
                </div>
              )}

              {/* VIEW 2: RITUAL COMPOSITION (Complete pair presentation photo) */}
              {viewMode === 'ritual' && (
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-[#E7E5DC] bg-white p-2 flex items-center justify-center">
                  <ProgressiveImage
                    src="/real-brush-and-cleaner.jpg"
                    alt="Authentic Bamboo Toothbrush and Tongue Cleaner product photography"
                    placeholderType="combo"
                  />
                  {/* Coordinated Laser Branding on Ritual Canvas */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#EADCC8]/90 backdrop-blur-xs px-4 py-1.5 rounded-lg text-xs font-serif italic text-[#4A321A] border border-[#C5B498] shadow-md text-center max-w-[80%] truncate z-10">
                    <span className="block text-[9px] font-mono tracking-widest text-[#745B41] not-italic uppercase mb-0.5">
                      Matched Dual Laser Engraving
                    </span>
                    <span>{logoText}</span>
                  </div>
                </div>
              )}

              {/* VIEW 3: SYNCHRONIZED SIDE-BY-SIDE */}
              {viewMode === 'synced' && (
                <div className="grid grid-cols-2 gap-3 w-full h-full">
                  {/* Left Side: Toothbrush */}
                  <div className="relative rounded-xl overflow-hidden shadow-md border border-[#E7E5DC] bg-white flex flex-col justify-between p-2">
                    <ProgressiveImage
                      src="/real-bamboo-toothbrush.jpg"
                      alt="Authentic Bamboo Toothbrush"
                      placeholderType="toothbrush"
                    />
                    <div className="absolute top-2 left-2 bg-[#192E22] text-white text-[10px] font-mono px-2 py-0.5 rounded z-10">
                      Toothbrush
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-[#EADCC8]/90 backdrop-blur-xs p-1 rounded text-center text-[10px] font-serif text-[#4A321A] truncate border border-[#C5B498] z-10">
                      {logoText}
                    </div>
                  </div>

                  {/* Right Side: Tongue Cleaner */}
                  <div className="relative rounded-xl overflow-hidden shadow-md border border-[#E7E5DC] bg-white flex flex-col justify-between p-2">
                    <ProgressiveImage
                      src="/real-tongue-cleaner.png"
                      alt="Authentic Bamboo Tongue Cleaner"
                      placeholderType="tongue-cleaner"
                    />
                    <div className="absolute top-2 left-2 bg-[#BD7B3C] text-white text-[10px] font-mono px-2 py-0.5 rounded z-10">
                      Tongue Cleaner
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-[#EADCC8]/90 backdrop-blur-xs p-1 rounded text-center text-[10px] font-serif text-[#4A321A] truncate border border-[#C5B498] z-10">
                      {logoText}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Inset: Real-time Live Logo Proofing Input */}
            <div className="mt-4 pt-3 border-t border-[#ECEBE3] flex items-center gap-3">
              <span className="text-xs font-semibold text-[#192E22] whitespace-nowrap">
                Test Brand on Both:
              </span>
              <input
                type="text"
                value={logoText}
                onChange={e => setLogoText(e.target.value)}
                placeholder="Enter clinic / brand name..."
                maxLength={26}
                className="flex-1 px-3 py-1.5 bg-white border border-[#DDDCD3] rounded-lg text-xs font-mono uppercase text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
              />
              <button
                onClick={onOpenBrandingStudio}
                className="px-3 py-1.5 bg-[#192E22] text-white text-xs font-medium rounded-lg hover:bg-[#254231] whitespace-nowrap cursor-pointer"
              >
                Full Studio
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reinforcing Their Value as a Pair */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#2E4A37] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#2E5B3C]" />
              <span>Complete Daily Hygiene Ritual</span>
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-[#142018] tracking-tight">
              Why They Belong Together
            </h4>
            <p className="text-xs sm:text-sm text-[#505752] leading-relaxed mt-2">
              Dentists emphasize that brushing alone cleans tooth enamel, but up to 85% of bad breath bacteria reside in the lingual crevices of the tongue. Pairing Earth Smile bamboo toothbrushes with the curved tongue cleaner provides full-mouth hygiene with zero plastic.
            </p>
          </div>

          {/* 3 Value Pillars as a Pair */}
          <div className="space-y-3.5">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#E9E7DE] rounded-xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EAE8DD] text-[#192E22] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                01
              </div>
              <div>
                <h5 className="font-serif text-sm font-semibold text-[#192E22]">
                  Dual Enamel & Lingual Cleansing
                </h5>
                <p className="text-xs text-[#5D6560] leading-relaxed mt-0.5">
                  Micro-activated charcoal bio-bristles sweep dental plaque, while the beveled bamboo arch scrapes tongue biofilm without gagging.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] border border-[#E9E7DE] rounded-xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EAE8DD] text-[#192E22] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                02
              </div>
              <div>
                <h5 className="font-serif text-sm font-semibold text-[#192E22]">
                  Matched Grain & Dual Laser Branding
                </h5>
                <p className="text-xs text-[#5D6560] leading-relaxed mt-0.5">
                  Both items are steam-carbonized at 220°C from genuine Moso bamboo, featuring identical laser branding alignment for clinics and resorts.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] border border-[#E9E7DE] rounded-xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EAE8DD] text-[#192E22] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                03
              </div>
              <div>
                <h5 className="font-serif text-sm font-semibold text-[#192E22]">
                  Plantable Seed Balls & Kraft Gift Presentation Box
                </h5>
                <p className="text-xs text-[#5D6560] leading-relaxed mt-0.5">
                  Includes native plantable seed balls alongside the brush and cleaner in a rigid recycled unbleached kraft gift box with soy ink printing.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip & Exact Combo Price */}
          <div className="p-4 bg-[#F5F5EE] dark:bg-[#14231B] border border-[#ECEBE2] dark:border-[#233B2C] rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#78817B] dark:text-[#9FB1A5] block text-[10px] uppercase font-mono">Tiered Price:</span>
              <span className="font-serif text-base font-bold text-[#192E22] dark:text-white">₹129 → ₹99/pc</span>
            </div>
            <div>
              <span className="text-[#78817B] dark:text-[#9FB1A5] block text-[10px] uppercase font-mono">MOQ:</span>
              <span className="font-mono font-semibold text-[#192E22] dark:text-white">200 Pcs / Sets</span>
            </div>
            <div>
              <span className="text-[#78817B] dark:text-[#9FB1A5] block text-[10px] uppercase font-mono">Includes:</span>
              <span className="font-medium text-[#192E22] dark:text-white">Brush + Cleaner + Seed Balls</span>
            </div>
            <div>
              <span className="text-[#78817B] dark:text-[#9FB1A5] block text-[10px] uppercase font-mono">Proofing:</span>
              <span className="font-semibold text-[#BD7B3C]">Live Pre-Print</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() =>
                onOpenEnquiry(
                  `Complete Care Combo (Toothbrush + Tongue Cleaner + Seed Balls) - Logo: ${logoText}`
                )
              }
              className="flex-1 min-w-[170px] py-3.5 px-6 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs text-center uppercase tracking-wider cursor-pointer"
            >
              GET COMBO QUOTE (FROM ₹99/PC)
            </button>

            <a
              href={handleWhatsAppPair()}
              target="_blank"
              rel="noopener noreferrer"
              title="Direct WhatsApp"
              aria-label="Direct WhatsApp"
              className="w-12 h-12 shrink-0 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-6 h-6 fill-white" />
            </a>

            <button
              onClick={() => onSelectProduct('bamboo-dental-combo')}
              className="py-3.5 px-3 text-xs font-semibold text-[#5A635E] hover:text-[#192E22] transition-colors cursor-pointer"
            >
              Full Specs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
