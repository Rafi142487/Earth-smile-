import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Product } from '../../types';
import { ProductVisual } from '../common/ProductVisual';
import { X, Check, ArrowRight, Upload, Sparkles, ImageIcon } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenEnquiry: (productName?: string) => void;
  onSelectRelated: (productSlug: string) => void;
  relatedProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenEnquiry,
  onSelectRelated,
  relatedProducts,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants[0]?.id || ''
  );
  const [customLogoPreview, setCustomLogoPreview] = useState('YOUR CLINIC / HOTEL');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const currentVariant =
    product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setUploadedLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnquireWithVariant = () => {
    const detail = `${product.name} (Variant: ${currentVariant?.name || 'Standard'}) - Logo: ${
      uploadedLogo ? 'Uploaded Graphic File' : customLogoPreview
    }`;
    onOpenEnquiry(detail);
  };

  const handleWhatsAppWithVariant = () => {
    const logoDesc = uploadedLogo ? 'our uploaded logo vector' : `"${customLogoPreview}"`;
    return buildWhatsAppUrl({
      productName: `${product.name} [Variant: ${currentVariant?.name || 'Default'}]`,
      quantity: product.moq,
      customBranding: product.customBrandingAvailable,
      customQuery: `Hi Earth Smile, I want to order ${product.name} with custom laser engraving of ${logoDesc}. Please send me the sample mockup and quotation.`,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200"
    >
      <div className="bg-[#FBFBF9] border border-[#E5E4DC] rounded-2xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden relative">
        {/* Sticky top modal control bar */}
        <div className="sticky top-0 z-20 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#EAE9E1] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#626A65]">
            <span className="font-semibold text-[#192E22]">{product.categoryLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 space-y-12">
          {/* Top Half: PDP Gallery (Left) + Purchase Module (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Gallery & Pre-Print Logo Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative">
                <ProductVisual
                  type={
                    product.slug.includes('toothbrush')
                      ? 'toothbrush'
                      : product.slug.includes('cleaner')
                      ? 'tongue-cleaner'
                      : 'combo'
                  }
                  imageUrl={product.images[activeImageIndex]?.url}
                  alt={product.name}
                  aspectRatio="4:3"
                  enable3DTilt={true}
                  showCustomBranding={true}
                  customLogoText={customLogoPreview}
                  customLogoImage={uploadedLogo}
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#BD7B3C] shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Pre-Print Logo Tester Box */}
              {product.customBrandingAvailable && (
                <div className="bg-[#F4F4EE] border border-[#E0DFD6] rounded-xl p-4 mt-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#192E22]">
                      <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
                      <span>See Your Logo on Handle Before Ordering</span>
                    </div>
                    {uploadedLogo && (
                      <button
                        onClick={() => setUploadedLogo(null)}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Reset Logo
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#5D6560] mb-3">
                    Type your brand name below or upload a logo file to see it laser-engraved onto the bamboo:
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customLogoPreview}
                      onChange={e => setCustomLogoPreview(e.target.value)}
                      placeholder="Enter brand / clinic name..."
                      maxLength={32}
                      className="w-full px-3 py-2 bg-white border border-[#D5D4CB] rounded-md text-xs font-mono uppercase text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-[#D0CFCE] hover:border-[#192E22] text-[#192E22] rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-[#BD7B3C]" />
                        <span>{uploadedLogo ? 'Change Uploaded Logo' : 'Upload Logo (PNG/SVG)'}</span>
                      </button>
                      <span className="text-[10px] text-[#76807A]">
                        Instant laser burn preview above
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contiguous Purchase / B2B Quote Module */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6B736E] mb-2">
                  <span className="font-mono text-[#BD7B3C] font-semibold">
                    MOQ: {product.moq} {product.moqUnit}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#2D5A3C] font-medium">100% Organic Moso Bamboo</span>
                </div>

                <h1 id="product-detail-title" className="text-2xl sm:text-3xl font-serif font-bold text-[#142018] tracking-tight">
                  {product.name}
                </h1>

                <p className="text-sm text-[#525954] mt-3 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Pricing & Commercial Terms */}
              <div className="p-4 bg-[#F5F5EE] dark:bg-[#14231B] border border-[#E5E4DB] dark:border-[#233B2C] rounded-xl">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-[#192E22] dark:text-white uppercase font-mono tracking-wider">
                    Max Price / MRP:
                  </span>
                  <span className="text-3xl font-serif font-bold text-[#192E22] dark:text-white font-mono tabular-nums">
                    {product.price}
                  </span>
                </div>
                <p className="text-[11px] text-[#78827C] dark:text-[#9FB1A5]">
                  Wholesale volume discounts available on bulk orders. Pre-print laser branding included.
                </p>
              </div>

              {/* Available Variants */}
              {product.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-2 uppercase tracking-wider">
                    Select Bamboo Variant / Profile:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map(variant => {
                      const isSelected = variant.id === selectedVariantId;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#192E22] ring-1 ring-[#192E22] shadow-xs'
                              : 'bg-white/60 hover:bg-white border-[#E0DFD6]'
                          }`}
                        >
                          <div className="font-semibold text-[#192E22]">{variant.name}</div>
                          {variant.bristleType && (
                            <div className="text-[11px] text-[#69726D] mt-0.5">{variant.bristleType}</div>
                          )}
                          <div className="text-[10px] text-[#BD7B3C] font-mono mt-1">SKU: {variant.sku}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleEnquireWithVariant}
                  className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#192E22] hover:bg-[#274433] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Quote With This Logo Design</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={handleWhatsAppWithVariant()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 text-xs font-semibold text-[#192E22] bg-[#EAF2EC] hover:bg-[#D9E7DC] border border-[#C5D8CB] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Send Design Proof to WhatsApp (+91 {EARTH_SMILE_PHONE})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Lower Half: Specifications & Materials */}
          <div className="pt-10 border-t border-[#EAE9E1] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#192E22] mb-3">
                Bamboo Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5651] leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Highlight Bamboo Toothbrush and Bamboo Tongue Cleaner together */}
              {product.slug === 'bamboo-dental-combo' && (
                <div className="mb-5 p-3.5 bg-[#FAF9F5] border border-[#E4E2D8] rounded-xl space-y-2.5">
                  <span className="text-[11px] font-semibold text-[#192E22] uppercase tracking-wider block">
                    Essentials Included Together in Set:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-[#EAE9E0] flex items-center gap-2">
                      <img
                        src="/real-bamboo-toothbrush.jpg"
                        alt="Bamboo Toothbrush"
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#192E22] block leading-tight">Bamboo Toothbrush</span>
                        <span className="text-[10px] text-[#6E7771]">Charcoal bristles</span>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#EAE9E0] flex items-center gap-2">
                      <img
                        src="/real-tongue-cleaner.png"
                        alt="Bamboo Tongue Cleaner"
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#192E22] block leading-tight">Tongue Cleaner</span>
                        <span className="text-[10px] text-[#6E7771]">Organic arch</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#313834]">
                    <Check className="w-3.5 h-3.5 text-[#2D5A3C] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#192E22] mb-3">
                Bamboo Specifications
              </h3>
              <dl className="space-y-2 text-xs border border-[#ECEBE3] rounded-xl p-4 bg-white">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-[#F2F1EA] last:border-b-0">
                    <dt className="text-[#6D7570]">{key}</dt>
                    <dd className="font-medium text-[#1E2521] text-right ml-4">{val}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 p-4 bg-[#F5F5EE] rounded-xl border border-[#EAE9E1] text-xs">
                <span className="font-semibold text-[#192E22] block mb-1">Eco-Packaging:</span>
                <span className="text-[#59625D]">{product.packagingDetails}</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#192E22] mb-3">
                Pre-Print Logo Approval
              </h3>
              <div className="space-y-3 text-xs">
                {product.brandingOptions.map((opt, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#E5E4DC] rounded-lg">
                    <div className="font-semibold text-[#192E22] flex items-center justify-between">
                      <span>{opt.name}</span>
                      <span className="font-mono text-[#BD7B3C] text-[10px]">
                        MOQ: {opt.minimumQuantity}
                      </span>
                    </div>
                    <p className="text-[#606963] mt-1 text-[11px]">{opt.description}</p>
                    <div className="mt-2 text-[10px] text-[#2D5A3C]">
                      Turnaround: ~{opt.setupTimeDays} business days
                    </div>
                  </div>
                ))}
              </div>

              {product.faqs && product.faqs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#ECEBE3]">
                  <span className="font-serif font-semibold text-xs text-[#192E22] block mb-2">
                    Buyer Question:
                  </span>
                  <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#EAE9E1] text-xs">
                    <p className="font-medium text-[#192E22]">{product.faqs[0].question}</p>
                    <p className="text-[#58615C] mt-1 text-[11px] leading-relaxed">
                      {product.faqs[0].answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Bamboo Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#EAE9E1]">
              <h3 className="font-serif text-xl font-semibold text-[#192E22] mb-6">
                Matching Bamboo Oral Care Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rp => (
                  <div
                    key={rp.id}
                    onClick={() => onSelectRelated(rp.slug)}
                    className="p-4 bg-white border border-[#E5E4DC] rounded-xl hover:border-[#192E22] transition-colors cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-[#BD7B3C] block mb-1">
                      {rp.categoryLabel}
                    </span>
                    <h4 className="font-serif font-semibold text-sm text-[#192E22] group-hover:text-[#BD7B3C] line-clamp-1">
                      {rp.name}
                    </h4>
                    <p className="text-xs text-[#6B736E] mt-1 line-clamp-1">{rp.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
