import React, { useState, useRef, ChangeEvent } from 'react';
import { ProductVisual } from '../common/ProductVisual';
import { Upload, Sparkles, ArrowRight, Check, RefreshCw, Eye, Image as ImageIcon, Sliders } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface LiveLogoStudioProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const LiveLogoStudio: React.FC<LiveLogoStudioProps> = ({ onOpenEnquiry }) => {
  const [selectedProduct, setSelectedProduct] = useState<'toothbrush' | 'tongue-cleaner' | 'combo'>('combo');
  const [brandText, setBrandText] = useState('THE TAJ RESORT & SPA');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [engravingTone, setEngravingTone] = useState<'burnt' | 'dark' | 'amber'>('burnt');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClearLogo = () => {
    setUploadedLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const productTitles = {
    combo: 'Toothbrush + Tongue Cleaner Together',
    toothbrush: 'Moso Bamboo Toothbrush',
    'tongue-cleaner': 'Ergonomic Bamboo Tongue Cleaner',
  };

  const currentProductName = productTitles[selectedProduct];

  const handleWhatsAppWithDesign = () => {
    const logoDesc = uploadedLogo ? 'our uploaded corporate logo vector' : `"${brandText}"`;
    const message = `Hi Earth Smile, I customized the ${currentProductName} using your Live Logo Studio with ${logoDesc}. Please share pricing, sample dispatch, and MOQ details.`;
    return buildWhatsAppUrl({
      customQuery: message,
    });
  };

  return (
    <section id="custom-branding" className="py-24 bg-[#FAF9F5] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Pre-Print Digital Proofing Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            See Your Logo on the Bamboo Brush & Tongue Cleaner Before You Print
          </h2>
          <p className="text-base sm:text-lg text-[#4E5650] leading-relaxed">
            Never risk unexpected engraving results. Upload your business logo or enter your clinic name below to inspect the exact laser-etched result on genuine Moso bamboo wood grain in 3D before committing to production.
          </p>
        </div>

        {/* Studio Workspace Card */}
        <div className="bg-white border border-[#E3E2D8] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive 3D Bamboo Visualizer */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Product Target Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE9E1]">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedProduct('combo')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      selectedProduct === 'combo'
                        ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                        : 'bg-[#F2F1EA] text-[#555E59] hover:bg-[#EAE9DE]'
                    }`}
                  >
                    <span>Combo Set</span>
                    <span className="ml-1.5 opacity-80 font-mono text-[11px]">(₹129/-)</span>
                  </button>
                  <button
                    onClick={() => setSelectedProduct('toothbrush')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      selectedProduct === 'toothbrush'
                        ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                        : 'bg-[#F2F1EA] text-[#555E59] hover:bg-[#EAE9DE]'
                    }`}
                  >
                    <span>Toothbrush</span>
                    <span className="ml-1.5 opacity-80 font-mono text-[11px]">(₹65/-)</span>
                  </button>
                  <button
                    onClick={() => setSelectedProduct('tongue-cleaner')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      selectedProduct === 'tongue-cleaner'
                        ? 'bg-[#192E22] text-white shadow-xs font-semibold'
                        : 'bg-[#F2F1EA] text-[#555E59] hover:bg-[#EAE9DE]'
                    }`}
                  >
                    <span>Tongue Cleaner</span>
                    <span className="ml-1.5 opacity-80 font-mono text-[11px]">(₹70/-)</span>
                  </button>
                </div>
                <span className="text-[11px] text-[#767E78] hidden sm:block">
                  Live 3D Specimen
                </span>
              </div>

              {/* 3D Visual Box */}
              <div className="relative">
                <ProductVisual
                  type={selectedProduct}
                  imageUrl={
                    selectedProduct === 'toothbrush'
                      ? '/real-bamboo-toothbrush.jpg'
                      : selectedProduct === 'tongue-cleaner'
                      ? '/real-tongue-cleaner.png'
                      : '/real-brush-and-cleaner.jpg'
                  }
                  alt={`Custom Branded ${currentProductName}`}
                  aspectRatio="16:9"
                  showCustomBranding={true}
                  customLogoText={brandText}
                  customLogoImage={uploadedLogo}
                  enable3DTilt={true}
                  engravingTone={engravingTone}
                  className="w-full"
                />

                {/* Laser Mark Indicator Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#DDDCD1] shadow-xs text-xs font-mono text-[#192E22] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-time Bamboo Laser Simulation</span>
                </div>
              </div>

              {/* Underneath Tip */}
              <div className="flex items-center justify-between text-xs text-[#6B736E] pt-2">
                <span>Move mouse over the bamboo product to inspect the laser reflection</span>
                <span className="font-mono text-[#BD7B3C] font-semibold">±0.05mm Laser Precision</span>
              </div>
            </div>

            {/* Right: Customization Controls Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#142018] mb-2">
                  Configure Your Brand Logo
                </h3>
                <p className="text-xs sm:text-sm text-[#525B55] leading-relaxed mb-6">
                  Preview how your trademark or typography will be burned into the organic bamboo fiber with zero chemical inks or fading.
                </p>

                {/* Control 1: Upload Your Own Logo File */}
                <div className="p-4 bg-[#F8F7F2] border border-[#E5E4DC] rounded-xl mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#192E22] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#BD7B3C]" />
                      <span>Upload Your Logo Image (PNG / SVG)</span>
                    </label>
                    {uploadedLogo && (
                      <button
                        onClick={handleClearLogo}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />

                  {uploadedLogo ? (
                    <div className="p-3 bg-white border border-[#D5D4CA] rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedLogo}
                          alt="Uploaded Logo"
                          className="h-8 max-w-[100px] object-contain"
                        />
                        <span className="text-xs text-[#2D5A3C] font-medium">
                          Logo applied to bamboo preview!
                        </span>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#192E22] underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 border border-dashed border-[#C7C6BC] hover:border-[#192E22] bg-white rounded-lg text-xs text-[#5D6660] hover:text-[#192E22] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#8C958F]" />
                      <span>Click to upload your logo file (PNG/JPG/SVG)</span>
                    </button>
                  )}
                </div>

                {/* Control 2: Enter Brand / Clinic / Hotel Name */}
                <div className="space-y-2 mb-5">
                  <label className="block text-xs font-semibold text-[#192E22]">
                    Or Enter Brand / Clinic / Hotel Text:
                  </label>
                  <input
                    type="text"
                    value={brandText}
                    onChange={e => setBrandText(e.target.value)}
                    placeholder="e.g. DENTAL HARMONY, VILLA BAMBOO"
                    maxLength={32}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D9D8CF] rounded-lg text-xs font-mono uppercase text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                  />
                </div>

                {/* Control 3: Laser Tone Selector */}
                <div className="space-y-2 mb-6">
                  <label className="block text-xs font-semibold text-[#192E22]">
                    Laser Engraving Tone:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'burnt', label: 'Caramel Burn', hex: '#4A321A' },
                      { id: 'dark', label: 'Deep Carbon', hex: '#241A0E' },
                      { id: 'amber', label: 'Natural Amber', hex: '#6A4B29' },
                    ].map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setEngravingTone(tone.id as typeof engravingTone)}
                        className={`p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                          engravingTone === tone.id
                            ? 'bg-white border-[#192E22] ring-1 ring-[#192E22] shadow-xs'
                            : 'bg-[#FAF9F5] border-[#DCDAD0] text-[#555E59]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: tone.hex }}
                          />
                          <span className="font-medium text-[11px] truncate">{tone.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE9E1] space-y-3">
                <a
                  href={handleWhatsAppWithDesign()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Send This Custom Proof to WhatsApp (+91 {EARTH_SMILE_PHONE})</span>
                </a>

                <button
                  onClick={() =>
                    onOpenEnquiry(
                      `Custom Laser-Branded ${currentProductName} - Logo: ${
                        uploadedLogo ? 'Uploaded Graphic' : brandText
                      }`
                    )
                  }
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#192E22] bg-[#EAF2EC] hover:bg-[#D9E7DC] border border-[#C5D8CB] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Pre-Production Physical Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Steps for Pre-Print Approval */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              step: '01',
              title: 'Live 3D Digital Preview',
              desc: 'Inspect your exact logo size, placement, and laser burn on the bamboo brush or tongue cleaner right now.',
            },
            {
              step: '02',
              title: 'Vector Calibration',
              desc: 'Our optical laser engineers calibrate your vector coordinates for crisp 0.05mm crisp bamboo line work.',
            },
            {
              step: '03',
              title: 'Physical Sample Courier',
              desc: 'We can courier a laser-engraved bamboo specimen directly to your clinic or hotel before batch production.',
            },
            {
              step: '04',
              title: 'Direct Dispatch',
              desc: 'Batch production starting from 100 units completed and dispatched with pan-India door delivery.',
            },
          ].map(s => (
            <div key={s.step} className="p-6 bg-white border border-[#E6E5DC] rounded-xl">
              <span className="font-mono text-xl font-bold text-[#BD7B3C] block mb-2">
                {s.step}
              </span>
              <h4 className="font-serif text-base font-semibold text-[#192E22] mb-1">
                {s.title}
              </h4>
              <p className="text-xs text-[#5C645F] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
