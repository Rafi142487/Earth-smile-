import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      title="Back to top (Shortcut: T)"
      className="fixed bottom-24 right-7 sm:bottom-24 sm:right-7 z-40 p-2.5 sm:p-3 rounded-full bg-white/90 dark:bg-[#15251C]/90 text-[#192E22] dark:text-[#E2ECE5] hover:text-white dark:hover:text-white hover:bg-[#192E22] dark:hover:bg-[#254231] border border-[#DDD9CE] dark:border-[#2F4A38] shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-3"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};
