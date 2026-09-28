import React, { useState } from 'react';
import { ArrowRight, Sprout, Factory, PackageOpen, HeartHandshake } from 'lucide-react';

export const SustainabilitySection: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages = [
    {
      stage: '01',
      title: 'Ethical Moso Bamboo Harvesting',
      subtitle: 'Sustainably Harvested Wild Moso Bamboo',
      icon: Sprout,
      desc: 'We source exclusively mature 4-to-5-year-old Moso bamboo (Phyllostachys edulis) from certified managed mountain forests. Bamboo reaches full height within months without artificial fertilizers or chemical irrigation, generating 35% more oxygen than equivalent timber stands. Giant pandas do not consume Moso bamboo, ensuring zero impact on natural wildlife ecosystems.',
      stats: '0 Artificial Fertilizers · 100% Panda Habitat Safe',
      imageUrl: '/sample-bamboo-toothbrushes-pair.svg',
    },
    {
      stage: '02',
      title: 'Chemical-Free Steam Carbonization',
      subtitle: 'High-Temperature 220°C Steam Curing',
      icon: Factory,
      desc: 'Instead of synthetic petro-chemical varnishes or formaldehyde coatings, Earth Smile utilizes pure high-temperature dry-steam carbonization. This natural heat treatment caramelizes the bamboo’s internal cellulose sugars, creating an impenetrable water-resistant surface that prevents mold, mildew, and splintering in humid bathrooms.',
      stats: 'Zero Formaldehyde · 100% Organic Candelilla Wax Seal',
      imageUrl: '/sample-bamboo-brushes-and-cleaner.svg',
    },
    {
      stage: '03',
      title: 'Plastic-Free Kraft Packaging',
      subtitle: 'Compostable Unbleached Paper & Soy Inks',
      icon: PackageOpen,
      desc: 'No blister plastic bubbles, shrink-wrap foils, or petrochemical tape. Every Earth Smile bamboo toothbrush and bamboo tongue cleaner is protected by 100% post-consumer recycled paperboard, printed exclusively with water-dispersed organic soy inks that decompose harmlessly into nutrient-rich garden soil.',
      stats: '100% Backyard Compostable in 180 Days',
      imageUrl: '/sample-bamboo-tongue-cleaner-box.svg',
    },
    {
      stage: '04',
      title: 'Soil-to-Soil Closed Loop',
      subtitle: 'Returning Morning Rituals Harmlessly to Earth',
      icon: HeartHandshake,
      desc: 'After 90 days of daily brushing or tongue cleaning, the bamboo handles can be returned directly to backyard soil, flower beds, or industrial compost where they naturally break down into organic matter. Zero plastic waste, zero microplastics entering municipal drinking water or oceans.',
      stats: 'Zero Microplastics Entering Global Waterways',
      imageUrl: '/sample-bamboo-brushes-and-cleaner.svg',
    },
  ];

  const current = stages[activeStageIndex];
  const CurrentIcon = current.icon;

  return (
    <section id="sustainability" className="py-24 bg-[#F2F1EA] border-b border-[#E3E2D6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2">
              Traceable Bamboo Lifecycle
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight">
              From Mountain Forest to Soil Lifecycle
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#525B55] max-w-md">
            Our bamboo toothbrushes and bamboo tongue cleaners represent a closed ecological loop where every natural fiber returns safely to the earth.
          </p>
        </div>

        {/* 4-Stage Interactive Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Interactive Stepper Navigation (Left) */}
          <div className="lg:col-span-5 space-y-3">
            {stages.map((stg, idx) => {
              const isSelected = activeStageIndex === idx;
              const StepIcon = stg.icon;
              return (
                <button
                  key={stg.stage}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#192E22] shadow-sm ring-1 ring-[#192E22]'
                      : 'bg-white/60 hover:bg-white border-[#E0DFD5]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#192E22] text-white' : 'bg-[#EAE9E0] text-[#555E58]'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-[#BD7B3C] font-semibold">STAGE {stg.stage}</span>
                      {isSelected && (
                        <span className="text-[11px] text-[#2D5A3C] font-medium">Active Focus</span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#142018]">
                      {stg.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Dive (Right) */}
          <div className="lg:col-span-7 bg-white border border-[#E0DFD5] rounded-2xl overflow-hidden p-6 sm:p-10 shadow-xs">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-[#F5F5EE]">
              <img
                src={current.imageUrl}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-200">
                  Stage {current.stage}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold mt-0.5">
                  {current.subtitle}
                </h4>
              </div>
            </div>

            <p className="text-sm md:text-base text-[#4C554F] leading-relaxed mb-6">
              {current.desc}
            </p>

            <div className="p-4 bg-[#F8F7F2] border border-[#E9E8DE] rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-[#192E22] flex items-center gap-2">
                <CurrentIcon className="w-4 h-4 text-[#BD7B3C]" />
                <span>{current.stats}</span>
              </span>
              <span className="text-[11px] text-[#717A74] font-mono">100% Bamboo Cycle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
