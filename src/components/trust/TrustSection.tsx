import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl, EARTH_SMILE_PHONE } from '../../utils/whatsapp';

export const TrustSection: React.FC = () => {
  const complianceAreas = [
    {
      title: 'Material Purity & Bamboo Sourcing',
      points: [
        'Wild-harvested organic Moso bamboo (Phyllostachys edulis)',
        '100% natural candelilla plant wax buffing for smooth touch',
        'Zero synthetic varnishes, zero petroleum chemical lacquers',
        'Double steam carbonization preventing bathroom water absorption',
      ],
    },
    {
      title: 'Manufacturing & Hygiene Standards',
      points: [
        'Precision automated dry-steam heat treatment at 220°C',
        'Bristle pull-force mechanical stress testing for zero shedding',
        'Hand-sanded round-bevel micro-edge on bamboo tongue scrapers',
        'Hygienic sterile handling prior to individual box packaging',
      ],
    },
    {
      title: 'Plastic-Free Kraft Packaging',
      points: [
        '100% unbleached post-consumer recycled kraft paperboard',
        'Water-dispersed organic soy inks with zero petroleum dyes',
        'Individual boxes with euro hang tabs for retail display',
        'Naturally compostable in garden soil within 180 days',
      ],
    },
    {
      title: 'Custom Branding & Laser Calibration',
      points: [
        '±0.05mm precision industrial CO2 laser engraving systems',
        'Live 3D pre-print digital proofing on this website before ordering',
        'Pre-production physical sample dispatch available on request',
        'GST invoices and pan-India enterprise logistics support',
      ],
    },
  ];

  return (
    <section className="py-24 bg-[#FBFBF9] border-b border-[#EAE9E1]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E4A37]" />
            <span>Material & Craftsmanship Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight mb-4 text-balance">
            Quality Rooted in Natural Bamboo Integrity
          </h2>
          <p className="text-base sm:text-lg text-[#515953] leading-relaxed">
            Institutional buyers, dental practices, and hospitality partners require verified quality. We maintain rigorous standards across raw Moso bamboo harvesting, thermal carbonization, and laser engraving.
          </p>
        </div>

        {/* 4 Pillars of Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {complianceAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#F8F7F2] border border-[#E7E6DC] rounded-xl hover:border-[#192E22] transition-colors"
            >
              <h3 className="font-serif text-xl font-semibold text-[#142018] mb-5 pb-3 border-b border-[#E9E8DE]">
                {area.title}
              </h3>

              <div className="space-y-3">
                {area.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#48504B]">
                    <CheckCircle2 className="w-4 h-4 text-[#2E5B3C] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Verification Hub */}
        <div className="bg-[#FAF9F5] border border-[#E3E2D8] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#BD7B3C] font-mono block mb-1">
              Pre-Print Approval Protocol
            </span>
            <h4 className="font-serif text-xl font-semibold text-[#142018]">
              Need Physical Pre-Production Samples for Your Team?
            </h4>
            <p className="text-xs sm:text-sm text-[#5C645F] mt-1 max-w-xl">
              We courier laser-engraved bamboo toothbrush and tongue cleaner prototypes directly to your practice or hotel address for quality inspection prior to batch production.
            </p>
          </div>

          <a
            href={buildWhatsAppUrl({
              customQuery: 'Hi Earth Smile, I would like to request physical pre-production samples of your bamboo toothbrush and tongue cleaner with our logo.',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <span>Request Physical Samples</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
