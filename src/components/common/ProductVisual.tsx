import React, { useState, useRef, MouseEvent } from 'react';

interface ProductVisualProps {
  type: 'toothbrush' | 'tongue-cleaner' | 'combo' | 'case' | 'generic';
  imageUrl?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4:3' | '16:9' | 'tall';
  customLogoText?: string;
  customLogoImage?: string | null;
  showCustomBranding?: boolean;
  enable3DTilt?: boolean;
  engravingTone?: 'burnt' | 'dark' | 'amber';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  imageUrl,
  alt,
  className = '',
  aspectRatio = '4:3',
  customLogoText = '',
  customLogoImage = null,
  showCustomBranding = false,
  enable3DTilt = true,
  engravingTone = 'burnt',
}) => {
  const [imageError, setImageError] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enable3DTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const aspectClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    tall: 'aspect-[3/4]',
  };

  // Laser engraving text color mapping
  const toneColors = {
    burnt: 'text-[#4A321A]',
    dark: 'text-[#241A0E]',
    amber: 'text-[#6A4B29]',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-[#F5F5EE] border border-[#E8E7DF] rounded-xl transition-shadow duration-500 ${
        isHovered ? 'shadow-xl shadow-stone-900/5' : 'shadow-sm'
      } ${aspectClasses[aspectRatio]} ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* 3D Motion Frame */}
      <div
        className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center p-6 relative"
        style={{
          transform: enable3DTilt && isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft studio pedestal shadow */}
        <div className="absolute bottom-6 w-3/4 h-8 bg-stone-900/10 blur-xl rounded-full pointer-events-none" />

        {/* Real photo if available & not errored */}
        {imageUrl && !imageError ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-center p-2 transition-transform duration-700 ease-out hover:scale-105"
              loading="lazy"
            />

            {/* Live Laser Engraving Simulation Overlay */}
            {showCustomBranding && (customLogoText || customLogoImage) && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[#EADCC8]/90 backdrop-blur-xs border border-[#C5B498] shadow-lg pointer-events-none transition-all duration-300 max-w-[85%]"
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="flex items-center gap-2.5">
                  {customLogoImage ? (
                    <img
                      src={customLogoImage}
                      alt="Custom Brand Logo"
                      className="h-7 max-w-[120px] object-contain mix-blend-multiply opacity-90 drop-shadow-xs filter contrast-125"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] tracking-widest uppercase font-mono text-[#745B41]">
                        Laser Engraved
                      </span>
                      <span className={`font-serif italic font-semibold text-sm tracking-wider ${toneColors[engravingTone]} drop-shadow-xs`}>
                        {customLogoText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* High-Fidelity Bamboo SVG Vector Representation */
          <div className="w-full h-full flex items-center justify-center relative select-none">
            {type === 'toothbrush' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-64 drop-shadow-md">
                <defs>
                  <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DFD0B5" />
                    <stop offset="35%" stopColor="#D5C4A3" />
                    <stop offset="70%" stopColor="#C9B494" />
                    <stop offset="100%" stopColor="#AD9573" />
                  </linearGradient>
                  <linearGradient id="bristleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3A3D3B" />
                    <stop offset="100%" stopColor="#1E201F" />
                  </linearGradient>
                </defs>
                {/* Bamboo Wood Grain lines */}
                <path
                  d="M50 210 C 100 210, 160 170, 240 140 C 290 120, 340 100, 360 85 C 365 81, 370 70, 355 65 C 340 60, 320 70, 290 85 C 210 115, 140 155, 60 185 C 45 190, 40 210, 50 210 Z"
                  fill="url(#bambooGrad)"
                  stroke="#8E7859"
                  strokeWidth="1.5"
                />
                {/* Bamboo nodes / growth rings */}
                <path d="M120 185 Q 125 178 122 170" stroke="#9A8260" strokeWidth="1" opacity="0.6" />
                <path d="M210 145 Q 215 138 212 130" stroke="#9A8260" strokeWidth="1" opacity="0.6" />
                {/* Bristle head */}
                <g transform="translate(310, 45) rotate(-22)">
                  <rect x="0" y="0" width="45" height="28" rx="4" fill="url(#bristleGrad)" />
                  <line x1="8" y1="0" x2="8" y2="28" stroke="#505452" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="16" y1="0" x2="16" y2="28" stroke="#505452" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="24" y1="0" x2="24" y2="28" stroke="#505452" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="32" y1="0" x2="32" y2="28" stroke="#505452" strokeWidth="1" strokeDasharray="2,2" />
                </g>
                {/* Laser engraving on bamboo toothbrush handle */}
                {customLogoImage ? (
                  <image
                    href={customLogoImage}
                    x="110"
                    y="155"
                    width="75"
                    height="30"
                    transform="rotate(-23 145 170)"
                    style={{ mixBlendMode: 'multiply', opacity: 0.85 }}
                  />
                ) : (
                  <text
                    x="150"
                    y="180"
                    transform="rotate(-23 150 180)"
                    fill={engravingTone === 'dark' ? '#241A0E' : engravingTone === 'amber' ? '#6A4B29' : '#4A321A'}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="serif"
                    letterSpacing="1.5"
                    filter="drop-shadow(0px 1px 0px rgba(255,255,255,0.4))"
                  >
                    {showCustomBranding && customLogoText ? customLogoText.toUpperCase() : 'EARTH SMILE'}
                  </text>
                )}
              </svg>
            )}

            {type === 'tongue-cleaner' && (
              /* Pure Bamboo Tongue Cleaner SVG Vector */
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-64 drop-shadow-md">
                <defs>
                  <linearGradient id="bambooCleanerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5D8C3" />
                    <stop offset="50%" stopColor="#D5C4A3" />
                    <stop offset="100%" stopColor="#BAA27D" />
                  </linearGradient>
                </defs>
                {/* Curved bamboo tongue scraper arch */}
                <path
                  d="M100 230 L 100 130 C 100 50, 300 50, 300 130 L 300 230 C 300 240, 275 240, 275 230 L 275 140 C 275 80, 125 80, 125 140 L 125 230 C 125 240, 100 240, 100 230 Z"
                  fill="url(#bambooCleanerGrad)"
                  stroke="#967F5D"
                  strokeWidth="1.5"
                />
                {/* Smooth beveled scraping paddle edge */}
                <path
                  d="M140 76 Q 200 62 260 76"
                  stroke="#796345"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Laser engraving on top curve or grip arms */}
                {customLogoImage ? (
                  <image
                    href={customLogoImage}
                    x="160"
                    y="70"
                    width="80"
                    height="30"
                    style={{ mixBlendMode: 'multiply', opacity: 0.85 }}
                  />
                ) : (
                  <text
                    x="200"
                    y="95"
                    fill={engravingTone === 'dark' ? '#241A0E' : engravingTone === 'amber' ? '#6A4B29' : '#4A321A'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1.8"
                    fontFamily="serif"
                  >
                    {showCustomBranding && customLogoText ? customLogoText.toUpperCase() : 'EARTH SMILE BAMBOO'}
                  </text>
                )}
                {/* Ergonomic bamboo finger grip notches */}
                <rect x="98" y="180" width="28" height="30" rx="3" fill="#A8916E" opacity="0.4" />
                <rect x="274" y="180" width="28" height="30" rx="3" fill="#A8916E" opacity="0.4" />
              </svg>
            )}

            {(type === 'combo' || type === 'generic' || type === 'case') && (
              /* Bamboo Toothbrush + Bamboo Tongue Cleaner Duo Box */
              <svg viewBox="0 0 400 300" className="w-full h-full max-h-64 drop-shadow-md">
                <defs>
                  <linearGradient id="kraftBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ECE3D4" />
                    <stop offset="100%" stopColor="#D4C4AE" />
                  </linearGradient>
                </defs>
                {/* Recycled Kraft Presentation Box */}
                <rect x="90" y="60" width="220" height="180" rx="12" fill="url(#kraftBoxGrad)" stroke="#B3A086" strokeWidth="2" />
                <rect x="100" y="70" width="200" height="160" rx="8" fill="#F4EFE6" stroke="#C4B49C" strokeWidth="1" strokeDasharray="4 2" />
                {/* Bamboo Toothbrush outline in box */}
                <rect x="130" y="85" width="14" height="120" rx="4" fill="#C9B494" stroke="#8E7859" />
                {/* Bamboo Tongue Cleaner outline in box */}
                <path d="M190 195 L 190 120 C 190 90, 250 90, 250 120 L 250 195" stroke="#C9B494" strokeWidth="10" strokeLinecap="round" fill="none" />
                
                {/* Branded box seal */}
                <circle cx="200" cy="150" r="32" fill="#1E3527" />
                <text x="200" y="148" fill="#EAE6DC" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
                  BAMBOO
                </text>
                <text x="200" y="160" fill="#DE9B5E" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
                  DUO SET
                </text>
                {/* Custom client logo or title on box */}
                <text x="200" y="215" fill="#584835" fontSize="10" textAnchor="middle" fontFamily="serif" fontStyle="italic">
                  {showCustomBranding && customLogoText ? customLogoText : '100% Bamboo Dental Ritual'}
                </text>
              </svg>
            )}
          </div>
        )}

        {/* Dynamic Glare Specular Highlight on 3D Tilt */}
        {enable3DTilt && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 opacity-25"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
