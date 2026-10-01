import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2, Building, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';
import { leadService } from '../../services/leadService';
import { utmTracker } from '../../utils/utmTracker';
import { CopyButton } from '../common/CopyButton';

interface ContactSectionProps {
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenLegal }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product: 'Bamboo Toothbrush',
    quantity: 200,
    customBranding: true,
    message: '',
    consentGiven: true,
    ageVerified: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide contact name.';
    const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || digitsOnly.length < 6) {
      errs.phone = 'Valid phone or WhatsApp number is required.';
    }
    if (formData.email.trim() && !formData.email.includes('@')) {
      errs.email = 'Valid email address format required.';
    }
    if (!formData.consentGiven) {
      errs.consentGiven = 'Consent to privacy policy & commercial contact is required.';
    }
    if (!formData.ageVerified) {
      errs.ageVerified = 'Confirmation of 18+ age and purchasing authorization is required.';
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
        company: formData.company.trim() || 'Not Specified',
        city: 'India',
        productName: formData.product,
        quantity: Number(formData.quantity),
        customBranding: formData.customBranding,
        message: formData.message.trim(),
        leadSource: 'On-Page Contact Section',
        consentGiven: formData.consentGiven,
        ageVerified: formData.ageVerified,
        utmParams: Object.keys(utm).length > 0 ? (utm as Record<string, string>) : undefined,
      });

      setLastSubmittedId(newLead.id);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppDirectUrl = buildWhatsAppUrl({
    productName: formData.product,
    quantity: Number(formData.quantity),
    customBranding: formData.customBranding,
    companyName: formData.company,
    senderName: formData.name,
    customQuery: `Hello Earth Smile, I registered a commercial inquiry for ${formData.quantity} units of ${formData.product}. Reference ID: ${lastSubmittedId || 'Direct'}. Please provide your official price matrix.`,
  });

  return (
    <section id="contact" className="py-24 bg-[#F5F5EE] dark:bg-[#0E1712] border-b border-[#E3E2D6] dark:border-[#1E3125] scroll-mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] dark:text-[#A7D3B5] mb-2 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Procurement & Direct Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] dark:text-white tracking-tight mb-4 text-balance">
            Request a Quote or Sample Batch
          </h2>
          <p className="text-base sm:text-lg text-[#525B55] dark:text-[#A4B3A8] leading-relaxed">
            Connect directly with our production desk. Discuss custom laser engraving, packaging specifications, wholesale volume pricing, or sample dispatch with zero hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#142219] border border-[#E3E2D8] dark:border-[#243B2E] rounded-2xl p-7 space-y-6 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-[#142018] dark:text-white">
                Direct Contact Information
              </h3>

              <div className="space-y-5 text-sm">
                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1C3A27] text-[#25D366] flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737C76] dark:text-stone-400 font-medium block">
                        Primary Contact & WhatsApp:
                      </span>
                      <CopyButton textToCopy={`+91${EARTH_SMILE_PHONE}`} label="Copy" />
                    </div>
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base font-bold text-[#192E22] dark:text-white hover:text-[#BD7B3C] transition-colors"
                    >
                      +91 {EARTH_SMILE_PHONE}
                    </a>
                    <span className="text-xs text-[#5D6660] dark:text-stone-400 block mt-0.5">
                      Fastest response for pricing & vector proofs
                    </span>
                  </div>
                </div>

                {/* Direct Calling */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] dark:bg-[#2A2318] text-[#BD7B3C] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737C76] dark:text-stone-400 font-medium block">
                        Phone Helpline:
                      </span>
                      <CopyButton textToCopy={EARTH_SMILE_PHONE} label="Copy" />
                    </div>
                    <a
                      href={`tel:${EARTH_SMILE_PHONE}`}
                      className="font-mono text-base font-bold text-[#192E22] dark:text-white hover:text-[#BD7B3C] transition-colors"
                    >
                      {EARTH_SMILE_PHONE}
                    </a>
                    <span className="text-xs text-[#5D6660] dark:text-stone-400 block mt-0.5">
                      Monday to Saturday, 9:00 AM – 7:30 PM IST
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ECEBE3] dark:bg-[#1E3024] text-[#555E58] dark:text-stone-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737C76] dark:text-stone-400 font-medium block">
                        Commercial Email:
                      </span>
                      <CopyButton textToCopy="contact@earthsmile.in" label="Copy" />
                    </div>
                    <a
                      href="mailto:contact@earthsmile.in"
                      className="font-medium text-[#192E22] dark:text-white hover:text-[#BD7B3C] transition-colors font-mono"
                    >
                      contact@earthsmile.in
                    </a>
                  </div>
                </div>

                {/* Logistics */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ECEBE3] dark:bg-[#1E3024] text-[#555E58] dark:text-stone-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-[#737C76] dark:text-stone-400 font-medium block">
                      Dispatch & Logistics Hub:
                    </span>
                    <span className="text-xs text-[#282F2A] dark:text-stone-200 font-medium">
                      Pan-India Express Air & Surface Cargo Dispatch
                    </span>
                  </div>
                </div>
              </div>

              {/* Registered Corporate Details Box */}
              <div className="p-4 bg-stone-50 dark:bg-[#101A14] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#192E22] dark:text-white">Earth Smile Eco Innovations Pvt. Ltd.</span>
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    Registered Manufacturer
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 pt-0.5">
                  Peenya 2nd Stage Industrial Estate, Bengaluru 560058, Karnataka, India
                </div>
              </div>
            </div>

            {/* Turnkey Assurance Card */}
            <div className="p-6 bg-[#192E22] text-white rounded-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DE9B5E] font-semibold block">
                Pre-Print Verification Guarantee
              </span>
              <p className="text-xs text-[#D0DDD2] leading-relaxed">
                We never start bulk manufacturing until you have reviewed and signed off on your live digital laser engraving proof. Physical pre-production samples are dispatched upon request with 100% upfront transparent fee schedule.
              </p>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#142219] border border-[#E3E2D8] dark:border-[#243B2E] rounded-2xl p-7 sm:p-10 shadow-xs">
              {submitted ? (
                /* SUCCESS STATE */
                <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-[#EBF4EE] dark:bg-[#1C3A27] text-[#2E7D4E] dark:text-[#A7D3B5] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-semibold rounded-full mb-2 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Stored in Supabase Database
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-[#192E22] dark:text-white">
                      Quotation Request Registered
                    </h3>
                  </div>

                  <p className="text-sm text-[#555E58] dark:text-[#A8B7AB] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Reference ID: <span className="font-mono text-[#BD7B3C] font-semibold">{lastSubmittedId || 'Enquiry Logged'}</span>. We have forwarded your requirements for <strong>{formData.quantity} units of {formData.product}</strong> to our B2B pricing desk.
                  </p>

                  <div className="p-3 bg-stone-50 dark:bg-[#101A14] rounded-xl border border-stone-200 dark:border-stone-800 max-w-sm mx-auto flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-500">Ref: {lastSubmittedId}</span>
                    <CopyButton textToCopy={lastSubmittedId} label="Copy ID" />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsAppDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#192E22] hover:bg-[#254231] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>Send via WhatsApp (+91 {EARTH_SMILE_PHONE})</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          company: '',
                          product: 'Bamboo Toothbrush',
                          quantity: 100,
                          customBranding: true,
                          message: '',
                          consentGiven: true,
                          ageVerified: true,
                        });
                      }}
                      className="px-4 py-3 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM INPUT STATE */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl font-semibold text-[#142018] dark:text-white">
                    Send Commercial Enquiry
                  </h3>

                  {/* Form Error Banner */}
                  {Object.keys(errors).length > 0 && (
                    <div
                      role="alert"
                      className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Please resolve the following:</span>
                        <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px]">
                          {Object.values(errors).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                      {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                      {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. contact@clinic.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                      {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                        Company / Clinic / Hotel Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Organization or Clinic Name"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                        Select Product *
                      </label>
                      <select
                        value={formData.product}
                        onChange={e => setFormData({ ...formData, product: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      >
                        <option value="Bamboo Toothbrush">1. Bamboo Toothbrush</option>
                        <option value="Bamboo Tongue Cleaner">2. Bamboo Tongue Cleaner</option>
                        <option value="Complete Care Combo (Toothbrush + Tongue Cleaner + Seed Balls)">
                          3. Complete Care Combo (+ Plantable Seed Balls)
                        </option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#192E22] dark:text-white">
                          Estimated Units
                        </label>
                        <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold">MOQ: 200 pcs</span>
                      </div>
                      <input
                        type="number"
                        min="200"
                        step="50"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>
                  </div>

                  {/* Custom branding toggle */}
                  <div className="p-3.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#E7E6DC] dark:border-stone-700 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#192E22] dark:text-white block">
                        Custom Logo Laser Engraving Required?
                      </span>
                      <span className="text-[11px] text-[#636C66] dark:text-stone-400">
                        Free setup on 500+ units • Inspect 3D digital proof before production
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.customBranding}
                        onChange={e => setFormData({ ...formData, customBranding: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#192E22]" />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                      Project Notes / Special Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mention delivery target date, preferred bristle hardness or packaging specifications..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#101A14] border border-[#DDDCD3] dark:border-stone-700 rounded-lg text-xs text-[#192E22] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>

                  {/* Legal Consent & Age Verification */}
                  <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentGiven}
                        onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                        className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                      />
                      <span>
                        I consent to processing of my commercial enquiry under the{' '}
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
                        I confirm that I am <strong>18+ years of age</strong> and authorized to solicit wholesale quotes on behalf of my practice or organization.
                      </span>
                    </label>
                    {errors.ageVerified && <p className="text-[10px] text-red-600 pl-6">{errors.ageVerified}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Quotation...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#DE9B5E]" />
                        <span>Submit & Request Formal Quotation</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
