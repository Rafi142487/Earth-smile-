import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

interface FloatingContactWidgetProps {
  onOpenEnquiry?: (productName?: string) => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = () => {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-40 no-print">
      <div className="relative animate-float-gentle">
        {/* Animated aura radar ripple rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-radar-ripple pointer-events-none" />
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-radar-ripple [animation-delay:1.2s] pointer-events-none" />

        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp (+91 ${EARTH_SMILE_PHONE})`}
          title={`Chat on WhatsApp (+91 ${EARTH_SMILE_PHONE})`}
          className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none relative group border-2 border-white/60"
        >
          {/* Pulsing online badge indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>

          {/* Only WhatsApp Logo */}
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />

          {/* Hover Tooltip Label */}
          <span className="absolute right-full mr-3.5 px-3 py-1.5 bg-[#142018]/90 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:flex items-center gap-1.5 backdrop-blur-xs">
            <span>Chat on WhatsApp</span>
          </span>
        </a>
      </div>
    </div>
  );
};
