import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: 'outline' | 'ghost' | 'solid';
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  variant = 'outline',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const baseStyle =
    'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E7D4E] focus-visible:outline-none';

  const sizeStyle =
    size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm';

  const variantStyles = {
    outline:
      'bg-white dark:bg-[#15251C] hover:bg-stone-50 dark:hover:bg-[#1E3628] text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-[#2C4836] shadow-2xs',
    ghost:
      'bg-transparent hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300',
    solid:
      'bg-[#192E22] hover:bg-[#254231] text-white shadow-xs',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${copied ? copiedLabel : label}: ${textToCopy}`}
      title={copied ? copiedLabel : label}
      className={`${baseStyle} ${sizeStyle} ${variantStyles[variant]} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 shrink-0" />
          {label && <span>{label}</span>}
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </button>
  );
};
