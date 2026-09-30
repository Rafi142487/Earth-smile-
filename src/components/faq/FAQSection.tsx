import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/faqs';
import { ChevronDown, HelpCircle, MessageSquare, Search, ChevronsUpDown } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Products & Materials', 'Custom Branding', 'Bulk Orders & B2B', 'Shipping & Export'];

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    if (!matchesCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (openFaqIds.length === filteredFaqs.length) {
      setOpenFaqIds([]);
    } else {
      setOpenFaqIds(filteredFaqs.map(f => f.id));
    }
  };

  const allExpanded = filteredFaqs.length > 0 && openFaqIds.length === filteredFaqs.length;

  return (
    <section id="faq" className="py-24 bg-[#FBFBF9] dark:bg-[#0E1712] border-b border-[#EAE9E1] dark:border-[#1E3125] scroll-mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] dark:text-[#A7D3B5] mb-2 flex items-center gap-1.5 font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-[#BD7B3C]" />
              <span>Clarity & Transparency</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] dark:text-white tracking-tight">
              Frequently Answered Questions
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#565E59] dark:text-[#A5B3A8] max-w-md leading-relaxed">
            Everything you need to know regarding Moso bamboo durability, laser engraving specifications, MOQ rules, and export dispatch timelines.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="max-w-4xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Quick FAQ Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. laser logo, bristles, MOQ, samples)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#15251C] border border-[#DDD9CE] dark:border-[#2C4836] rounded-xl text-[#192E22] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#192E22] dark:focus:ring-[#A7D3B5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Expand/Collapse All Button */}
          <button
            onClick={handleToggleAll}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#192E22] dark:text-[#CBD8CE] bg-white dark:bg-[#15251C] hover:bg-[#F3F2EB] dark:hover:bg-[#1D3325] border border-[#DDD9CE] dark:border-[#2C4836] rounded-xl transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-[#BD7B3C]" />
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#192E22] dark:bg-[#254231] text-white shadow-xs'
                  : 'bg-[#F1F0E8] dark:bg-[#17281E] text-[#555D57] dark:text-[#A7B5AA] hover:bg-[#E5E4DB] dark:hover:bg-[#21382A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="max-w-4xl p-10 bg-white dark:bg-[#14221A] border border-dashed border-[#DDD9CE] dark:border-[#2C4836] rounded-2xl text-center space-y-2">
            <p className="text-sm font-semibold text-[#192E22] dark:text-white">No questions matched your search query</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Try clearing keywords or chat directly with our product specialist.</p>
          </div>
        ) : (
          <div className="max-w-4xl space-y-3.5">
            {filteredFaqs.map(faq => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-[#F8F7F2] dark:bg-[#14221A] border border-[#E7E6DC] dark:border-[#233B2C] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#D5D3C5] dark:hover:border-[#355740]"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#142018] dark:text-white leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-white dark:bg-[#1D3125] border border-[#DDDCD1] dark:border-[#2D4D3A] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-[#192E22] dark:bg-[#2F523D] text-white border-[#192E22] dark:border-[#2F523D]'
                          : 'text-[#58615B] dark:text-[#A7B5AA]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#4E5650] dark:text-[#CBD8CE] leading-relaxed border-t border-[#EAE9DE] dark:border-[#1E3325] pt-4 animate-in fade-in-50 duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Unresolved question desk banner with WhatsApp icon */}
        <div className="mt-12 p-6 bg-[#F4F4EE] dark:bg-[#14231B] border border-[#E2E1D8] dark:border-[#243E2E] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EBF2ED] dark:bg-[#1B3526] text-[#1E3527] dark:text-[#A7D3B5] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-[#2E7D4E]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#142018] dark:text-white">Have a Specific Custom Order Question?</h4>
              <p className="text-xs text-[#5D6560] dark:text-[#9FB1A5]">Our commercial desk typically answers inquiries within 15 minutes.</p>
            </div>
          </div>

          <a
            href={buildWhatsAppUrl({
              customQuery: 'Hi Earth Smile, I have a specific question about your dental products and custom branding options.',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#192E22] dark:bg-[#254231] hover:bg-[#254231] dark:hover:bg-[#2F523D] rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-xs hover-lift"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
