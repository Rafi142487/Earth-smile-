import React from 'react';
import { Keyboard, X, Sparkles, Moon, Sun, ArrowUp, Lock, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '?', description: 'Open / Close this shortcuts guide' },
    { key: 'H', description: 'Scroll to top / Hero section' },
    { key: 'P', description: 'Jump to Products Showcase' },
    { key: 'B', description: 'Open Live Logo Branding Studio' },
    { key: 'Q', description: 'Open Commercial Quotation Modal' },
    { key: 'D', description: 'Toggle Dark / Light Mode' },
    { key: 'T', description: 'Back to Top ↑' },
    { key: 'A', description: 'Open Administrator Portal' },
    { key: 'Esc', description: 'Close any active modal or drawer' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F5] dark:bg-[#15251C] border border-[#E3E1D7] dark:border-[#2C4A37] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-[#101F16] border-b border-[#EAE9E1] dark:border-[#233B2C] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EAF2EC] dark:bg-[#1E3628] text-[#192E22] dark:text-[#A7D3B5]">
              <Keyboard className="w-4 h-4 text-[#BD7B3C]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#192E22] dark:text-white">
                Keyboard Navigation
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Quick access keys across Earth Smile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {shortcuts.map(sc => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A2C21] border border-[#EBEAE2] dark:border-[#284131]"
            >
              <span className="text-xs text-[#39423D] dark:text-[#CBD8CE] font-medium">
                {sc.description}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-[#192E22] dark:text-white bg-[#F3F2EB] dark:bg-[#14231A] border border-[#DDD9CE] dark:border-[#355740] rounded-md shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#F2F1EA] dark:bg-[#101F16] border-t border-[#EAE9DE] dark:border-[#233B2C] text-center">
          <p className="text-[11px] text-[#69746D] dark:text-[#8FA596] font-mono">
            Press <kbd className="font-bold text-[#192E22] dark:text-white">Esc</kbd> or click outside to dismiss
          </p>
        </div>
      </div>
    </div>
  );
};
