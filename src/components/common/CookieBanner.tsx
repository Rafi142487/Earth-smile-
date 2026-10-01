import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Sliders, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('earthsmile_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setShowBanner(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (type: 'all' | 'essential' | 'custom') => {
    try {
      const payload = {
        type,
        essential: true,
        analytics: type === 'all' ? true : type === 'essential' ? false : analyticsConsent,
        date: new Date().toISOString(),
      };
      localStorage.setItem('earthsmile_cookie_consent', JSON.stringify(payload));
    } catch {
      // ignore
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white/95 dark:bg-[#15251C]/95 backdrop-blur-md border border-[#E3E1D7] dark:border-[#2C4836] p-4 sm:p-5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 no-print"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#EAF2EC] dark:bg-[#1E3628] text-[#1E3527] dark:text-[#A7D3B5] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D4E]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#192E22] dark:text-white uppercase tracking-wider font-mono">
              Privacy & Cookie Consent
            </h4>
            <button
              onClick={() => handleSave('essential')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 cursor-pointer"
              aria-label="Dismiss cookie notice with essential cookies only"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#525B55] dark:text-[#A4B3A8] mt-1.5 leading-relaxed">
            Earth Smile uses local storage strictly for dark mode preference, quotation drafts, and pre-print laser proofs with zero third-party advertising trackers.
          </p>

          {/* Granular Preferences Accordion */}
          {showPreferences && (
            <div className="mt-3 p-3 bg-stone-50 dark:bg-[#101A14] rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">Essential & Security</span>
                  <span className="text-stone-500 text-[10px]">Session auth, theme, and quote drafts</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Always Active
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">UTM Referral Attribution</span>
                  <span className="text-stone-500 text-[10px]">Helps attribute wholesale requests</span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={e => setAnalyticsConsent(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSave('all')}
              className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] dark:bg-[#254231] dark:hover:bg-[#2F523D] rounded-lg transition-colors cursor-pointer shadow-xs text-center"
            >
              Accept All
            </button>
            <button
              onClick={() => handleSave(showPreferences ? 'custom' : 'essential')}
              className="py-1.5 px-3 text-xs font-medium text-[#464E48] dark:text-[#C2CFC5] bg-[#F2F1EA] dark:bg-[#1C2C21] hover:bg-[#E7E5DB] rounded-lg transition-colors cursor-pointer text-center"
            >
              {showPreferences ? 'Save Custom' : 'Essential Only'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg border border-stone-200 dark:border-stone-700 cursor-pointer"
              title="Customize Preferences"
              aria-label="Customize cookie preferences"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenCookiePolicy && (
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={onOpenCookiePolicy}
                className="text-[10px] text-stone-400 hover:text-[#BD7B3C] underline cursor-pointer"
              >
                Read Cookie & Storage Policy →
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
