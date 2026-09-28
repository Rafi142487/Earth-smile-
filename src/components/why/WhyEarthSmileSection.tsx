import React from 'react';
import { Leaf, Award, Sparkles, Truck, Box, ShieldCheck } from 'lucide-react';

export const WhyEarthSmileSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: '100% Organic Moso Bamboo',
      desc: 'Wild-harvested mature Moso bamboo handles and hand-carved bamboo tongue scrapers. Free from petroleum plastics, synthetic varnishes, or toxic glues.',
      icon: Leaf,
    },
    {
      num: '02',
      title: 'See Your Logo Before You Print',
      desc: 'Our Live Logo Studio allows you to upload your logo or enter your business name and inspect the exact laser engraving on the bamboo handle in 3D before committing to production.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Business-Friendly Low MOQ',
      desc: 'Start with batches as low as 100 units for custom-engraved bamboo toothbrushes and 50 units for bamboo tongue cleaners, making conscious branding accessible to all businesses.',
      icon: Award,
    },
    {
      num: '04',
      title: 'Thermal Steam Carbonization',
      desc: 'High-temperature 220°C dry-steam carbonization seals the bamboo pores, preventing water absorption, mold, and splintering in bathroom environments naturally.',
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: 'Plastic-Free Aesthetic Packaging',
      desc: 'Debossed unbleached kraft card boxes and biodegradable glassine envelopes that look understated and luxurious on retail shelves and hotel vanities.',
      icon: Box,
    },
    {
      num: '06',
      title: 'Scalable Wholesale Manufacturing',
      desc: 'Over 50,000 monthly unit bamboo brush and tongue cleaner manufacturing capacity with expedited pan-India delivery and international export certification.',
      icon: Truck,
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#FBFBF9] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BD7B3C]" />
              <span>The Earth Smile Standard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight">
              Pure Bamboo Craftsmanship. Real-Time Logo Proofing.
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#59625D] max-w-md">
            Dedicated exclusively to high-grade bamboo toothbrushes and bamboo tongue cleaners, combining ecological responsibility with verified custom branding.
          </p>
        </div>

        {/* 6 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map(pillar => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-8 bg-[#F8F7F2] border border-[#E7E6DC] rounded-xl hover:border-[#192E22] transition-colors duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-sm font-semibold text-[#BD7B3C] tracking-wider">
                      {pillar.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E3E2D8] flex items-center justify-center text-[#1E3527] group-hover:bg-[#1E3527] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#142018] mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555E58] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE9DE] flex items-center gap-1.5 text-[11px] text-[#717A74]">
                  <span>100% Bamboo Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
