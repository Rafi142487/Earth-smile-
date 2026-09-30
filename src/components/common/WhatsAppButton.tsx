import React, { useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultUrl = buildWhatsAppUrl({
    customQuery: 'Hi Earth Smile, I would like to know about pricing, MOQ and custom branding for your eco-friendly dental products.',
  });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Subtle floating bubble prompt on hover */}
      {isHovered && (
        <div className="hidden sm:block bg-[#192E22] dark:bg-[#15251C] text-white text-xs py-2 px-3.5 rounded-xl shadow-xl border border-white/10 dark:border-[#2C4A37] animate-in fade-in slide-in-from-right-2 duration-200">
          <p className="font-semibold flex items-center gap-1.5">
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </p>
          <p className="text-[11px] text-stone-300 font-mono mt-0.5">+91 {EARTH_SMILE_PHONE}</p>
        </div>
      )}

      {/* Primary Floating WhatsApp Button with Official Logo */}
      <a
        href={defaultUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
        aria-label="Direct WhatsApp Procurement Chat"
        title="Chat with Earth Smile B2B Desk on WhatsApp"
      >
        {/* Soft pulse halo */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40" />

        {/* WhatsApp Logo */}
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 transition-transform duration-300 group-hover:scale-110" />

        {/* Online Status Beacon */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white border-2 border-[#25D366] rounded-full z-20 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#128C7E]" />
        </span>
      </a>
    </div>
  );
};
