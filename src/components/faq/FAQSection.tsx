import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/faqs';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Products & Materials', 'Custom Branding', 'Bulk Orders & B2B', 'Shipping & Export'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? FAQS_DATA
      : FAQS_DATA.filter(f => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-[#FBFBF9] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#BD7B3C]" />
              <span>Clarity & Transparency</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight">
              Frequently Answered Questions
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#565E59] max-w-md">
            Everything you need to know regarding Moso bamboo durability, laser engraving specifications, MOQ rules, and shipping timelines.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#192E22] text-white'
                  : 'bg-[#F1F0E8] text-[#555D57] hover:bg-[#E5E4DB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl space-y-4">
          {filteredFaqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#F8F7F2] border border-[#E7E6DC] rounded-xl overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-semibold text-[#142018]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-[#DDDCD1] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#192E22] text-white border-[#192E22]' : 'text-[#58615B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-[#4E5650] leading-relaxed border-t border-[#EAE9DE] pt-4 animate-in fade-in-50 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unresolved question desk banner */}
        <div className="mt-12 p-6 bg-[#F4F4EE] border border-[#E2E1D8] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF2ED] text-[#1E3527] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#142018]">Have a Specific Custom Order Question?</h4>
              <p className="text-xs text-[#5D6560]">Our commercial team typically answers WhatsApp inquiries within 15 minutes.</p>
            </div>
          </div>

          <a
            href={buildWhatsAppUrl({
              customQuery: 'Hi Earth Smile, I have a specific question about your dental products and custom branding options.',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Chat with Product Specialist
          </a>
        </div>
      </div>
    </section>
  );
};
