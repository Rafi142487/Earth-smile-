import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('earthsmile_cookie_consent');
      if (!consent) {
        // Show after a brief delay for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('earthsmile_cookie_consent', JSON.stringify({ type, date: new Date().toISOString() }));
    } catch {
      // ignore
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white/95 dark:bg-[#15251C]/95 backdrop-blur-md border border-[#E3E1D7] dark:border-[#2C4836] p-4 sm:p-5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#EAF2EC] dark:bg-[#1E3628] text-[#1E3527] dark:text-[#A7D3B5] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D4E]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#192E22] dark:text-white uppercase tracking-wider font-mono">
              Privacy & Local Preferences
            </h4>
            <button
              onClick={() => handleAccept('essential')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 cursor-pointer"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#525B55] dark:text-[#A4B3A8] mt-1 leading-relaxed">
            Earth Smile uses local storage solely to save your custom logo previews, shopping inquiries, and light/dark theme preference with zero invasive third-party tracking.
          </p>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => handleAccept('all')}
              className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] dark:bg-[#254231] dark:hover:bg-[#2F523D] rounded-lg transition-colors cursor-pointer shadow-xs text-center"
            >
              Accept All
            </button>
            <button
              onClick={() => handleAccept('essential')}
              className="py-1.5 px-3 text-xs font-medium text-[#464E48] dark:text-[#C2CFC5] bg-[#F2F1EA] dark:bg-[#1C2C21] hover:bg-[#E7E5DB] rounded-lg transition-colors cursor-pointer text-center"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
