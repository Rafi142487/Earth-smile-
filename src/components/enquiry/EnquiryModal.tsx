import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, MessageCircle, Building, MapPin, User, Mail, Phone, Hash } from 'lucide-react';
import { leadService } from '../../services/leadService';
import { INITIAL_PRODUCTS } from '../../data/products';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';
import { LeadEnquiry } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
  sourceContext?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProductName = '',
  sourceContext = 'Direct Inquiry',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: '',
    productName: defaultProductName || INITIAL_PRODUCTS[0].name,
    quantity: 100,
    customBranding: true,
    brandingDetails: '',
    message: '',
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
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid corporate or personal email required';
    }
    if (formData.quantity < 20) {
      errs.quantity = 'Minimum batch quantity is 20 units';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newLead = leadService.submitLead({
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
      });

      setSubmittedLead(newLead);
      setIsSubmitting(false);
    }, 400);
  };

  const whatsAppDirectUrl = buildWhatsAppUrl({
    productName: formData.productName,
    quantity: Number(formData.quantity),
    customBranding: formData.customBranding,
    companyName: formData.company,
    senderName: formData.name,
    customQuery: `Hi Earth Smile, I submitted an enquiry for ${formData.quantity} units of ${formData.productName}. Please share your official quotation and pre-print laser sample terms.`,
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
      <div className="bg-[#FAF9F5] border border-[#E3E2D8] rounded-2xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-white border-b border-[#EAE9E1] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BD7B3C] font-semibold block">
              Commercial Quotation & Prototype Desk
            </span>
            <h2 id="enquiry-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#192E22]">
              Request Bamboo Pricing & Samples
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submittedLead ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF2EC] text-[#2E7D4E] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#142018]">
                Enquiry Successfully Registered
              </h3>
              <p className="text-xs sm:text-sm text-[#555E59] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{submittedLead.name}</strong>. Reference ID: <span className="font-mono text-[#BD7B3C]">{submittedLead.id}</span>. Our corporate desk has received your request for <strong>{submittedLead.quantity} units of {submittedLead.productName}</strong>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#192E22] hover:bg-[#264432] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#DE9B5E]" />
                  <span>Connect with Sales on WhatsApp ({EARTH_SMILE_PHONE})</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="text-xs text-[#606963] hover:text-[#192E22] underline cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#5D6560] mb-4">
                Fill in your company requirements below. Our commercial desk will prepare an itemized quotation and digital logo proof within 24 hours.
              </p>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contact person name"
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF]'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Mobile / WhatsApp number"
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Work / Business email"
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22] ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D9D8CF]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Company / Clinic Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Clinic, resort, or firm name"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9D8CF] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                </div>
              </div>

              {/* City & Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City & state location"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9D8CF] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Selected Product Line
                  </label>
                  <select
                    value={formData.productName}
                    onChange={e => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9D8CF] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22] cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F5F5EE] border border-[#E3E2D8] rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] mb-1">
                    Estimated Quantity (Units) *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-[#8C958F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={20}
                      step={10}
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9D8CF] rounded-lg text-xs text-[#192E22] font-mono focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>
                  {errors.quantity && <p className="text-[10px] text-red-600 mt-1">{errors.quantity}</p>}
                </div>

                <div className="flex flex-col justify-center">
                  <span className="block text-xs font-semibold text-[#192E22] mb-1">
                    Custom Logo Laser Branding?
                  </span>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#192E22] cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.customBranding === true}
                        onChange={() => setFormData({ ...formData, customBranding: true })}
                        className="text-[#192E22] focus:ring-[#192E22]"
                      />
                      <span>Yes (Laser Engraved)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#5D6660] cursor-pointer">
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
                <label className="block text-xs font-semibold text-[#192E22] mb-1">
                  Project Notes / Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention delivery target date, preferred laser engraving text or packaging specifications..."
                  className="w-full px-3 py-2 bg-white border border-[#D9D8CF] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Submit Commercial Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#78827C]">
                  Or message directly on WhatsApp: <a href={whatsAppDirectUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#192E22] hover:underline">+91 {EARTH_SMILE_PHONE}</a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
