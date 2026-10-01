import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, MessageCircle, Building, MapPin, User, Mail, Phone, Hash, ShieldCheck, AlertCircle } from 'lucide-react';
import { leadService } from '../../services/leadService';
import { INITIAL_PRODUCTS } from '../../data/products';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';
import { utmTracker } from '../../utils/utmTracker';
import { CopyButton } from '../common/CopyButton';
import { LeadEnquiry } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
  sourceContext?: string;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProductName = '',
  sourceContext = 'Direct Inquiry',
  onOpenLegal,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: '',
    productName: defaultProductName || INITIAL_PRODUCTS[0].name,
    quantity: 200,
    customBranding: true,
    brandingDetails: '',
    message: '',
    consentGiven: true,
    ageVerified: true,
  });

  const [submittedLead, setSubmittedLead] = useState<LeadEnquiry | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultProductName) {
      setFormData(prev => ({ ...prev, productName: defaultProductName }));
    }
  }, [defaultProductName]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Contact name is required';
    const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || digitsOnly.length < 6) {
      errs.phone = 'Valid phone or WhatsApp number is required';
    }
    if (formData.email.trim() && !formData.email.includes('@')) {
      errs.email = 'Valid email address format required';
    }
    if (formData.quantity < 1) {
      errs.quantity = 'Minimum batch quantity is 1 unit';
    }
    if (!formData.consentGiven) {
      errs.consentGiven = 'Consent to privacy policy & commercial contact is required';
    }
    if (!formData.ageVerified) {
      errs.ageVerified = 'You must confirm you are 18+ and authorized for commercial purchasing';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const utm = utmTracker.get();
      const newLead = await leadService.submitLeadAsync({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || 'Individual Practice',
        city: formData.city.trim() || 'India',
        productName: formData.productName,
        quantity: Number(formData.quantity),
        customBranding: formData.customBranding,
        brandingDetails: formData.brandingDetails.trim(),
        message: formData.message.trim(),
        leadSource: sourceContext,
        consentGiven: formData.consentGiven,
        ageVerified: formData.ageVerified,
        utmParams: Object.keys(utm).length > 0 ? (utm as Record<string, string>) : undefined,
      });

      setSubmittedLead(newLead);
    } catch (err) {
      console.error('Failed to submit quote request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppDirectUrl = buildWhatsAppUrl({
    productName: formData.productName,
    quantity: Number(formData.quantity),
    customBranding: formData.customBranding,
    companyName: formData.company,
    senderName: formData.name,
    customQuery: `Hi Earth Smile, I submitted an enquiry for ${formData.quantity} units of ${formData.productName}. Reference ID: ${submittedLead?.id || 'pending'}. Please share your official quotation and pre-print laser sample terms.`,
  });

  const resetForm = () => {
    setSubmittedLead(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F5] dark:bg-[#121E17] border border-[#E3E2D8] dark:border-[#243B2E] rounded-2xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden relative text-[#1C1F1D] dark:text-[#E2ECE5]">
        {/* Header */}
        <div className="bg-white dark:bg-[#16261E] border-b border-[#EAE9E1] dark:border-[#243B2E] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BD7B3C] font-semibold block">
              Commercial Quotation & Prototype Desk
            </span>
            <h2 id="enquiry-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#192E22] dark:text-white">
              Request Bamboo Pricing & Samples
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submittedLead ? (
            /* FORM SUCCESS STATE */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-[#EAF2EC] dark:bg-[#1C3A27] text-[#2E7D4E] dark:text-[#A7D3B5] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-semibold rounded-full mb-2 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stored in Supabase Database
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#142018] dark:text-white">
                  Quotation Request Registered!
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#555E59] dark:text-[#A8B7AB] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{submittedLead.name}</strong>. Our commercial fulfillment team has received your requirement for <strong>{submittedLead.quantity} units of {submittedLead.productName}</strong>.
              </p>

              {/* Reference ID & Copy Buttons */}
              <div className="p-4 bg-white dark:bg-[#16261E] rounded-xl border border-stone-200 dark:border-[#2C4836] max-w-md mx-auto space-y-2 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">Quote Reference ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#BD7B3C]">{submittedLead.id}</span>
                    <CopyButton textToCopy={submittedLead.id} label="Copy ID" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400">Direct WhatsApp Desk:</span>
                  <span className="font-mono font-semibold text-[#192E22] dark:text-white">+91 {EARTH_SMILE_PHONE}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#192E22] hover:bg-[#264432] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#DE9B5E]" />
                  <span>Send Request Instantly on WhatsApp</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-400 dark:text-stone-500 pt-2">
                Unsubscribe anytime by replying STOP or emailing <a href="mailto:unsubscribe@earthsmile.in" className="underline">unsubscribe@earthsmile.in</a>. Zero spam guarantee.
              </p>

              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="text-xs text-[#606963] dark:text-stone-400 hover:text-[#192E22] dark:hover:text-white underline cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* FORM INPUT STATE */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Error Banner */}
              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-start gap-2 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Please correct the following:</span>
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px]">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* No Hidden Fees Guarantee Banner */}
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Zero Hidden Fees:</strong> Complete line-item breakdown with upfront itemized quote & freight.</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  B2B Transparent
                </span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contact person name"
                      className={`w-full pl-9 pr-3 py-2 bg-white dark:bg-[#16261E] border rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF] dark:border-stone-700'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full pl-9 pr-3 py-2 bg-white dark:bg-[#16261E] border rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF] dark:border-stone-700'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. procurement@clinic.com"
                      className={`w-full pl-9 pr-3 py-2 bg-white dark:bg-[#16261E] border rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF] dark:border-stone-700'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Company / Clinic Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Clinic, resort, or firm name"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#16261E] border border-[#D9D8CF] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                </div>
              </div>

              {/* City & Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City & state location"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#16261E] border border-[#D9D8CF] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Selected Product Line
                  </label>
                  <select
                    value={formData.productName}
                    onChange={e => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#16261E] border border-[#D9D8CF] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22] cursor-pointer"
                  >
                    {INITIAL_PRODUCTS.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity & Custom Branding Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F5F5EE] dark:bg-[#16261E] border border-[#E3E2D8] dark:border-[#2C4836] rounded-xl">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#192E22] dark:text-white">
                      Estimated Quantity (Units) *
                    </label>
                    <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold">MOQ: 200 pcs</span>
                  </div>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={200}
                      step={50}
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#101A14] border border-[#D9D8CF] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                  {errors.quantity && <p className="text-[10px] text-red-600 mt-1">{errors.quantity}</p>}
                </div>

                <div className="flex flex-col justify-center">
                  <span className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Custom Logo Laser Branding?
                  </span>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#192E22] dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.customBranding === true}
                        onChange={() => setFormData({ ...formData, customBranding: true })}
                        className="text-[#192E22] focus:ring-[#192E22]"
                      />
                      <span>Yes (Laser Engraved)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#5D6660] dark:text-stone-400 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.customBranding === false}
                        onChange={() => setFormData({ ...formData, customBranding: false })}
                        className="text-[#192E22] focus:ring-[#192E22]"
                      />
                      <span>No (Standard)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                  Project Notes / Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention delivery target date, preferred laser engraving text or packaging specifications..."
                  className="w-full px-3 py-2 bg-white dark:bg-[#16261E] border border-[#D9D8CF] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                />
              </div>

              {/* Legal Consents & Age Verification Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <span>
                    I consent to Earth Smile processing my business requirements and sharing official quotations via WhatsApp / Email in accordance with the{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.('privacy')}
                      className="text-emerald-700 dark:text-emerald-400 underline font-medium"
                    >
                      Privacy Policy
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.('terms')}
                      className="text-emerald-700 dark:text-emerald-400 underline font-medium"
                    >
                      Terms of Service
                    </button>.
                  </span>
                </label>
                {errors.consentGiven && <p className="text-[10px] text-red-600 pl-6">{errors.consentGiven}</p>}

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ageVerified}
                    onChange={e => setFormData({ ...formData, ageVerified: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                  />
                  <span>
                    I confirm that I am <strong>18 years of age or older</strong> and authorized to solicit wholesale commercial pricing on behalf of my practice or organization.
                  </span>
                </label>
                {errors.ageVerified && <p className="text-[10px] text-red-600 pl-6">{errors.ageVerified}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering Quotation in Database...
                    </span>
                  ) : (
                    <>
                      <span>Submit Commercial Quotation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1 text-[11px] text-[#78827C]">
                <span>
                  Immediate consultation on WhatsApp: <a href={whatsAppDirectUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#192E22] dark:text-[#DE9B5E] hover:underline">+91 {EARTH_SMILE_PHONE}</a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
