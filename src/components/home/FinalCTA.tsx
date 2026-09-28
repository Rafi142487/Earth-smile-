import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';

interface FinalCTAProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="py-24 bg-[#192E22] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#DE9B5E]/15 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#DE9B5E] block mb-3">
          Step into Conscious Oral Care
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-6 text-balance">
          Ready to Put Your Brand on <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#E0A361]">Everyday Smiles?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#D1DDD3] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Join leading dental clinics, five-star resorts, and corporate wellness leaders who have transitioned away from plastic oral care. Receive physical sample prototypes within 72 hours.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={() => onOpenEnquiry('Final CTA - Turnkey Private Label Kit')}
            className="px-8 py-4 text-sm font-semibold text-[#142018] bg-white hover:bg-[#F2F1EA] rounded-lg transition-all shadow-lg flex items-center gap-2 cursor-pointer group"
          >
            <span>Request B2B Quote & Samples</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={buildWhatsAppUrl({
              customQuery: 'Hi Earth Smile, we are ready to discuss an order. Please share the fastest way to get physical samples and a commercial price schedule.',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 text-sm font-semibold text-white bg-[#264432] hover:bg-[#325942] border border-white/20 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#DE9B5E]" />
            <span>Chat on WhatsApp (+91 {EARTH_SMILE_PHONE})</span>
          </a>
        </div>

        {/* Quiet assurance footer */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9BB1A2] pt-6 border-t border-[#294633]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DE9B5E]" />
            <span>Low 100-Unit Custom MOQ</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Sample Dispatched in 48-72h</span>
          <span aria-hidden="true">·</span>
          <span>Pan-India & International Export Terminal</span>
        </div>
      </div>
    </section>
  );
};
