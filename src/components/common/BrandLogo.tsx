import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  onClick,
}) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: 'text-base gap-2',
    md: 'text-xl md:text-2xl gap-2.5',
    lg: 'text-2xl md:text-3xl gap-3',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center font-bold tracking-tight select-none cursor-pointer ${sizeClasses[size]} ${className}`}
      role="banner"
    >
      {/* Botanical Smile Emblem */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-300 hover:rotate-6`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="46" fill={isLight ? '#FFFFFF' : '#192E22'} fillOpacity={isLight ? 0.15 : 0.08} />
        {/* Smile curve in warm bamboo/copper */}
        <path
          d="M26 62 C 40 80, 60 80, 74 62"
          stroke={isLight ? '#DE9B5E' : '#BD7B3C'}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Stylized organic bamboo sprout leaf */}
        <path
          d="M50 22 C 38 34, 34 46, 50 56 C 66 46, 62 34, 50 22 Z"
          fill={isLight ? '#88A590' : '#2D4B37'}
        />
        {/* Leaf spine vein */}
        <path
          d="M50 28 L50 52"
          stroke={isLight ? '#142018' : '#FFFFFF'}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
      </svg>

      {/* Brand Text: Single pure wordmark */}
      <span className={`tracking-wider font-semibold font-serif uppercase ${isLight ? 'text-white' : 'text-[#192E22]'}`}>
        Earth Smile
      </span>
    </div>
  );
};
