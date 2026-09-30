import React, { useState, useEffect } from 'react';

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderType?: 'toothbrush' | 'tongue-cleaner' | 'combo' | 'default';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Micro SVG blur-up placeholders mimicking the genuine bamboo product silhouettes
const BLUR_PLACEHOLDERS: Record<string, string> = {
  toothbrush: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23F7F6F0"/><stop offset="100%" stop-color="%23EDE9DF"/></linearGradient><linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23DECEB2"/><stop offset="50%" stop-color="%23CFBCA0"/><stop offset="100%" stop-color="%23BFA889"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg)"/><ellipse cx="200" cy="245" rx="140" ry="14" fill="%23222" opacity="0.05" filter="blur(8px)"/><rect x="188" y="70" width="24" height="175" rx="12" fill="url(%23wood)" opacity="0.85" filter="blur(6px)"/><rect x="186" y="55" width="28" height="35" rx="6" fill="%232B2B28" opacity="0.75" filter="blur(5px)"/></svg>`,
  
  'tongue-cleaner': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23F7F6F0"/><stop offset="100%" stop-color="%23EDE9DF"/></linearGradient><linearGradient id="arch" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23DCC8A9"/><stop offset="100%" stop-color="%23C2A988"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg2)"/><ellipse cx="200" cy="245" rx="130" ry="14" fill="%23222" opacity="0.05" filter="blur(8px)"/><path d="M 130 230 C 130 110, 270 110, 270 230" fill="none" stroke="url(%23arch)" stroke-width="26" stroke-linecap="round" opacity="0.85" filter="blur(6px)"/></svg>`,
  
  combo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23F7F6F0"/><stop offset="100%" stop-color="%23EDE9DF"/></linearGradient><linearGradient id="wood2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23DDCDB3"/><stop offset="100%" stop-color="%23BFA889"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg3)"/><ellipse cx="200" cy="245" rx="150" ry="15" fill="%23222" opacity="0.06" filter="blur(9px)"/><rect x="135" y="75" width="22" height="170" rx="11" fill="url(%23wood2)" opacity="0.8" filter="blur(6px)"/><rect x="133" y="60" width="26" height="32" rx="5" fill="%232B2B28" opacity="0.7" filter="blur(5px)"/><path d="M 205 235 C 205 130, 295 130, 295 235" fill="none" stroke="url(%23wood2)" stroke-width="22" stroke-linecap="round" opacity="0.8" filter="blur(6px)"/></svg>`,
  
  default: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23F9F8F4"/><stop offset="50%" stop-color="%23EFECE2"/><stop offset="100%" stop-color="%23E5E0D2"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg4)"/><circle cx="200" cy="150" r="70" fill="%23D8C6A5" opacity="0.4" filter="blur(16px)"/></svg>`,
};

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  placeholderType = 'default',
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If the image is cached, it might already be complete
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const placeholderSvg = BLUR_PLACEHOLDERS[placeholderType] || BLUR_PLACEHOLDERS.default;

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${containerClassName}`}>
      {/* 1. Low-Resolution Tonal Blur Placeholder */}
      <img
        src={placeholderSvg}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-contain filter blur-md scale-105 pointer-events-none transition-opacity duration-700 ease-out ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 2. Soft Ambient Shimmer while downloading */}
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse pointer-events-none"
        />
      )}

      {/* 3. High-Definition Real Asset */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setHasError(true);
          onError?.();
        }}
        className={`w-full h-full object-contain transition-all duration-700 ease-out ${className} ${
          isLoaded
            ? 'opacity-100 filter-none scale-100'
            : 'opacity-0 filter blur-xs scale-[1.02]'
        }`}
      />
    </div>
  );
};
