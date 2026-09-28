import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultUrl = buildWhatsAppUrl({
    customQuery: 'Hi Earth Smile, I would like to know about pricing, MOQ and custom branding for your eco-friendly dental products.',
  });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Subtle floating bubble prompt on hover */}
      {isHovered && (
        <div className="hidden sm:block bg-[#192E22] text-white text-xs py-2 px-3.5 rounded-xl shadow-lg border border-white/10 animate-in fade-in slide-in-from-right-2 duration-200">
          <p className="font-semibold">Quick Wholesale Inquiries</p>
          <p className="text-[11px] text-stone-300">WhatsApp: +91 {EARTH_SMILE_PHONE}</p>
        </div>
      )}

      {/* Primary Floating Button (Subtle, luxury forest-green with copper accent) */}
      <a
        href={defaultUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#192E22] text-[#E0A361] hover:text-white hover:bg-[#254231] shadow-xl hover:shadow-2xl border border-[#3E5E4A]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Direct WhatsApp Procurement Chat"
        title="Chat with Earth Smile B2B Desk on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        {/* Discreet green presence dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
      </a>
    </div>
  );
};
