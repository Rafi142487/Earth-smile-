import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { EARTH_SMILE_PHONE, buildWhatsAppUrl } from '../../utils/whatsapp';
import { leadService } from '../../services/leadService';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product: 'Bamboo Toothbrush',
    quantity: 100,
    customBranding: true,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    leadService.submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company || 'Not Specified',
      city: 'India',
      productName: formData.product,
      quantity: Number(formData.quantity),
      customBranding: formData.customBranding,
      message: formData.message,
      leadSource: 'On-Page Contact Section',
    });

    setIsSubmitting(false);
    setSubmitted(true);

    // Build WhatsApp message and open
    const waUrl = buildWhatsAppUrl({
      productName: formData.product,
      quantity: Number(formData.quantity),
      customBranding: formData.customBranding,
      companyName: formData.company,
      senderName: formData.name,
      customQuery: formData.message,
    });

    setTimeout(() => {
      window.location.href = waUrl;
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 bg-[#F5F5EE] border-b border-[#E3E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>Procurement & Direct Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            Request a Quote or Sample Batch
          </h2>
          <p className="text-base sm:text-lg text-[#525B55] leading-relaxed">
            Connect directly with our production desk. Discuss custom laser engraving, packaging specifications, wholesale volume pricing, or sample dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E3E2D8] rounded-2xl p-7 space-y-6 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-[#142018]">
                Direct Contact Information
              </h3>

              <div className="space-y-5 text-sm">
                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#1E3527] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#2E7D4E]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#737C76] font-medium block">
                      Primary Contact & WhatsApp:
                    </span>
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base font-bold text-[#192E22] hover:text-[#BD7B3C] transition-colors"
                    >
                      +91 {EARTH_SMILE_PHONE}
                    </a>
                    <span className="text-xs text-[#5D6660] block mt-0.5">
                      Fastest response for pricing & vector proofs
                    </span>
                  </div>
                </div>

                {/* Direct Calling */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#BD7B3C] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#737C76] font-medium block">
                      Phone Desk:
                    </span>
                    <a
                      href={`tel:${EARTH_SMILE_PHONE}`}
                      className="font-mono text-base font-bold text-[#192E22] hover:text-[#BD7B3C] transition-colors"
                    >
                      {EARTH_SMILE_PHONE}
                    </a>
                    <span className="text-xs text-[#5D6660] block mt-0.5">
                      Monday to Saturday, 9:00 AM – 7:30 PM IST
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ECEBE3] text-[#555E58] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#737C76] font-medium block">
                      Commercial Email:
                    </span>
                    <a
                      href="mailto:contact@earthsmile.in"
                      className="font-medium text-[#192E22] hover:text-[#BD7B3C] transition-colors"
                    >
                      contact@earthsmile.in
                    </a>
                  </div>
                </div>

                {/* Logistics */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ECEBE3] text-[#555E58] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#737C76] font-medium block">
                      Dispatch & Logistics Hub:
                    </span>
                    <span className="text-xs text-[#282F2A] font-medium">
                      Pan-India Express Air & Surface Cargo Dispatch
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Turnkey Assurance Card */}
            <div className="p-6 bg-[#192E22] text-white rounded-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DE9B5E] font-semibold block">
                Pre-Print Verification Guarantee
              </span>
              <p className="text-xs text-[#D0DDD2] leading-relaxed">
                We never start bulk manufacturing until you have reviewed and signed off on your live digital laser engraving proof. Physical pre-production samples are dispatched upon request.
              </p>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E3E2D8] rounded-2xl p-7 sm:p-10 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#EBF4EE] text-[#2E7D4E] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#192E22]">
                    Enquiry Recorded
                  </h3>
                  <p className="text-sm text-[#555E58] max-w-md mx-auto">
                    Thank you, {formData.name}. We are transferring your details directly to our WhatsApp desk ({EARTH_SMILE_PHONE}) for an immediate quotation.
                  </p>
                  <div className="pt-4">
                    <a
                      href={buildWhatsAppUrl({
                        productName: formData.product,
                        quantity: Number(formData.quantity),
                        companyName: formData.company,
                        senderName: formData.name,
                      })}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#192E22] text-white rounded-lg text-xs font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 text-[#DE9B5E]" />
                      <span>Continue to WhatsApp Now</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl font-semibold text-[#142018]">
                    Send Commercial Enquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Rajesh Kumar"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@dentalclinic.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Company / Clinic / Hotel Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Harmony Dental Care"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Select Product *
                      </label>
                      <select
                        value={formData.product}
                        onChange={e => setFormData({ ...formData, product: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      >
                        <option value="Bamboo Toothbrush">1. Bamboo Toothbrush</option>
                        <option value="Bamboo Tongue Cleaner">2. Bamboo Tongue Cleaner</option>
                        <option value="Bamboo Toothbrush + Tongue Cleaner Combo">
                          3. Bamboo Toothbrush + Tongue Cleaner Combo
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#192E22] mb-1">
                        Estimated Units
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                      />
                    </div>
                  </div>

                  {/* Custom branding toggle */}
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#E7E6DC] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#192E22] block">
                        Custom Logo Laser Engraving Required?
                      </span>
                      <span className="text-[11px] text-[#636C66]">
                        Inspect digital proof before manufacturing starts
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
                    <label className="block text-xs font-semibold text-[#192E22] mb-1">
                      Project Notes / Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention preferred bristle color, box branding, delivery location or timeline..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg text-xs text-[#192E22] focus:outline-none focus:ring-1 focus:ring-[#192E22]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#DE9B5E]" />
                    <span>Submit & Connect to WhatsApp (+91 {EARTH_SMILE_PHONE})</span>
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
