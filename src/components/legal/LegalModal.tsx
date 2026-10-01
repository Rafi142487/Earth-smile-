import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Cookie, Trash2, CheckCircle2, Building, AlertTriangle, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { leadService } from '../../services/leadService';
import { CopyButton } from '../common/CopyButton';
import { EARTH_SMILE_PHONE } from '../../utils/whatsapp';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'cookies' | 'deletion' | 'standards';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);

  // Data deletion state
  const [deleteIdentifier, setDeleteIdentifier] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletionStatus, setDeletionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync active tab when defaultTab changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
    setDeletionStatus(null);
  }, [defaultTab, isOpen]);

  // Escape key handler
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDeleteData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteIdentifier.trim()) {
      setDeletionStatus({ success: false, message: 'Please provide the email address or phone number used during your inquiry.' });
      return;
    }
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      setDeletionStatus({ success: false, message: 'Please type "DELETE" to confirm permanent erasure.' });
      return;
    }

    setIsDeleting(true);
    setDeletionStatus(null);

    try {
      const term = deleteIdentifier.trim().toLowerCase();

      // 1. Wipe from local storage
      const localLeads = leadService.getLeads();
      const retained = localLeads.filter(
        l => !l.email.toLowerCase().includes(term) && !l.phone.includes(term)
      );
      localStorage.setItem('earthsmile_leads_v3', JSON.stringify(retained));

      // 2. Wipe from Supabase
      const remoteLeads = await supabaseService.fetchQuotations();
      if (remoteLeads.success && remoteLeads.data.length > 0) {
        const matches = remoteLeads.data.filter(
          l => (l.email && l.email.toLowerCase().includes(term)) || (l.phone && l.phone.includes(term))
        );
        for (const m of matches) {
          await supabaseService.deleteQuotation(m.id);
        }
      }

      setDeletionStatus({
        success: true,
        message: `All quotation records and personal data associated with "${deleteIdentifier}" have been permanently erased from our databases and local storage.`,
      });
      setDeleteIdentifier('');
      setDeleteConfirmText('');
    } catch (err: any) {
      setDeletionStatus({
        success: false,
        message: err?.message || 'Error processing deletion request. Please contact grievance@earthsmile.in directly.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'privacy' as const, label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms' as const, label: 'Terms of Service', icon: FileText },
    { id: 'refund' as const, label: 'Refund & Quality', icon: RefreshCw },
    { id: 'cookies' as const, label: 'Cookie Policy', icon: Cookie },
    { id: 'standards' as const, label: 'Verified Standards', icon: CheckCircle2 },
    { id: 'deletion' as const, label: 'Data Deletion', icon: Trash2 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#121E17] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#243B2E] overflow-hidden flex flex-col max-h-[90vh] text-[#1C1F1D] dark:text-[#E2ECE5] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-[#243B2E] bg-stone-50/80 dark:bg-[#16261E]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] dark:bg-[#1E3628] text-[#192E22] dark:text-[#A7D3B5] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#2E7D4E]" />
            </div>
            <div>
              <h3 id="legal-modal-title" className="font-serif text-lg sm:text-xl font-bold text-[#192E22] dark:text-white">
                Compliance, Trust & Transparency Hub
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                Earth Smile Eco Innovations Pvt. Ltd. • Last Verified: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close legal compliance dialog"
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation pills */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-stone-100/60 dark:bg-[#101A14] border-b border-stone-200 dark:border-[#243B2E] overflow-x-auto text-xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#192E22] text-white shadow-2xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-white/80 dark:hover:bg-stone-800/60 hover:text-[#192E22] dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#BD7B3C]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-xs sm:text-sm leading-relaxed space-y-6">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold uppercase tracking-wider">
                  Data Protection & Privacy
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  Privacy Policy & Data Protection Statement
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Compliant with the Digital Personal Data Protection Act 2023 (India) and General Data Protection Regulation (GDPR).
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">1. Data Controller Identification</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  This website is operated by <strong>Earth Smile Eco Innovations Pvt. Ltd.</strong>, located at 42, Green Timber Industrial Estate, Peenya 2nd Stage, Bengaluru, Karnataka 560058, India. Contact: <a href="mailto:contact@earthsmile.in" className="text-emerald-700 dark:text-emerald-400 underline">contact@earthsmile.in</a>.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">2. Strict Data Minimization Principle</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  We collect strictly necessary commercial information required to furnish wholesale quotations and process purchase orders:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-300">
                  <li><strong>Contact Details:</strong> Business Contact Name, Official Phone / WhatsApp number, Business Email.</li>
                  <li><strong>Commercial Scope:</strong> Practice/Company Name, Shipping City, Product variant, Quantity, and Custom Laser Engraving specifications.</li>
                  <li><strong>What We Do NOT Collect:</strong> We never collect residential addresses, personal credit cards, biometric data, or sensitive personal data.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">3. Purpose of Processing & No Third-Party Resale</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Data submitted via our quotation forms is used exclusively to:
                  (a) Calculate commercial pricing tiers and freight estimates;
                  (b) Send laser engraving digital proofs and sample dispatch tracking;
                  (c) Issue commercial proforma invoices and regulatory shipping documentation.
                </p>
                <p className="text-stone-600 dark:text-stone-300 font-medium">
                  We have never sold, rented, or monetized customer data, and never will. There are zero third-party marketing trackers installed on this platform.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">4. Child Privacy Protection & Age Consent</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Our services and website are strictly intended for adults (18 years and older) who represent businesses, hospitals, or dental practices. We do not solicit or knowingly collect personal data from minors.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">5. Grievance Officer & Data Protection Officer</h5>
                <div className="p-3.5 bg-stone-50 dark:bg-[#16261E] rounded-xl border border-stone-200 dark:border-[#2C4836] space-y-1 text-xs">
                  <p><strong>Grievance Officer:</strong> Mr. S. M. Rafi (Compliance & Legal Operations)</p>
                  <p><strong>Email:</strong> grievance@earthsmile.in | response guaranteed within 48 business hours.</p>
                  <p><strong>Direct Helpline:</strong> +91 {EARTH_SMILE_PHONE}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold uppercase tracking-wider">
                  Commercial Agreement
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  B2B Commercial Terms of Service
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Governing wholesale procurement, custom laser engraving production, and logistics delivery.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">1. Minimum Order Quantities (MOQs)</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Wholesale pricing is unlocked at our baseline minimum manufacturing batches:
                  (a) Bamboo Toothbrushes: 100 units;
                  (b) Bamboo Tongue Cleaners: 100 units;
                  (c) Duo Care Combo sets: 50 units.
                  Sample packs (1–10 units) are available for clinical evaluation upon courier fee pre-payment.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">2. 100% Upfront Pricing Guarantee (No Hidden Fees)</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Every quotation issued contains an exact line-item breakdown:
                  (a) Base unit cost per piece;
                  (b) Custom laser setup fee (Waived for orders of 500 units or greater);
                  (c) Transparent net commercial pricing with zero hidden surcharges;
                  (d) Insured courier or freight shipping charges calculated by volume weight.
                  <strong> No unexpected documentation fees, surcharges, or hidden packaging fees are ever charged.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">3. Laser Engraving & Client Logo Intellectual Property</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Clients retain 100% ownership and copyright of their uploaded logos, clinic crests, and emblems. By submitting artwork, you warrant that you are authorized to utilize the trademark. We will never reuse your branded inventory for third-party resale.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">4. Pre-Production Golden Sample Sign-Off</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Before mass laser engraving batches, we furnish high-resolution photo/video proofs of the first physical unit. Batch engraving commences only after your written approval via WhatsApp or Email.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">5. Dispute Jurisdiction</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Any disputes arising out of commercial orders shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & REPLACEMENT POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold uppercase tracking-wider">
                  Quality Guarantee
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  Refund & Defect Replacement Policy
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Clear, guaranteed protocols for wholesale shipment quality assurance.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">1. 7-Day Defect Notification Period</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Upon delivery of your bulk order, inspect the outer carton and contents within <strong>7 business days</strong>. If any units exhibit manufacturing defects, transit damage, or laser misalignment exceeding ±0.5mm from the approved digital proof, notify us on WhatsApp with photos.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">2. 100% Free Replacement Guarantee</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  We will immediately re-manufacture and dispatch replacement units via express air courier at zero additional cost to you. If replacement is not feasible, we issue a prompt refund or credit note against your next purchase order.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm">3. Custom Branded Order Cancellations</h5>
                <p className="text-stone-600 dark:text-stone-300">
                  Because custom laser engraving permanently bonds your emblem into the organic Moso bamboo fibers, orders cannot be canceled once physical laser production has commenced following your written sign-off. Orders may be canceled or amended at 100% refund prior to laser production approval.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold uppercase tracking-wider">
                  Transparency
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  Cookie & Storage Transparency Statement
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Clear inventory of what is stored in your browser and why.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-[#2C4836]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-[#16261E] text-stone-700 dark:text-stone-300 font-mono text-[10px] uppercase border-b border-stone-200 dark:border-[#2C4836]">
                    <tr>
                      <th className="py-2.5 px-3">Storage Key</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Purpose</th>
                      <th className="py-2.5 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-600 dark:text-stone-300">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#192E22] dark:text-white">earthsmile_theme</td>
                      <td className="py-2.5 px-3">Preferences</td>
                      <td className="py-2.5 px-3">Remembers light/dark theme selection.</td>
                      <td className="py-2.5 px-3">Persistent</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#192E22] dark:text-white">earthsmile_cookie_consent</td>
                      <td className="py-2.5 px-3">Essential</td>
                      <td className="py-2.5 px-3">Records your cookie acceptance choice.</td>
                      <td className="py-2.5 px-3">1 Year</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#192E22] dark:text-white">earthsmile_leads_v3</td>
                      <td className="py-2.5 px-3">Functional</td>
                      <td className="py-2.5 px-3">Caches your quotation drafts offline.</td>
                      <td className="py-2.5 px-3">Local Only</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#192E22] dark:text-white">earthsmile_utm_session_v1</td>
                      <td className="py-2.5 px-3">Analytics</td>
                      <td className="py-2.5 px-3">Preserves referral campaign source for quote attribution.</td>
                      <td className="py-2.5 px-3">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-stone-600 dark:text-stone-300">
                You can reset or wipe all stored preferences at any time by clearing your browser cache or clicking below:
              </p>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('earthsmile_cookie_consent');
                    alert('Cookie preferences reset. The consent banner will reappear.');
                    window.location.reload();
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#192E22] bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg cursor-pointer"
              >
                <Cookie className="w-3.5 h-3.5" />
                <span>Reset Cookie Consent Preferences</span>
              </button>
            </div>
          )}

          {/* TAB 5: VERIFIED STANDARDS (REMOVING UNSUPPORTED CLAIMS & FAKE REVIEWS) */}
          {activeTab === 'standards' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-[#BD7B3C] font-semibold uppercase tracking-wider">
                  Honest Sustainability & Truth in Advertising
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  Verified Material Claims & Genuine Partner Reviews
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Our anti-greenwashing commitment: precision facts and verified enterprise client feedback.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-[#142B1F] border border-emerald-200 dark:border-[#245237] rounded-xl space-y-2">
                <h5 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Material Specifications (No Unsupported Claims)</span>
                </h5>
                <ul className="list-disc pl-5 space-y-1.5 text-emerald-800/90 dark:text-emerald-300 text-xs">
                  <li><strong>Moso Bamboo Species:</strong> 100% wild-harvested <em>Phyllostachys edulis</em> from managed forestry reserves. Fast-growing giant timber bamboo (harvested after 4–5 years without replanting).</li>
                  <li><strong>Compostability Transparency:</strong> The bamboo handle is 100% home-compostable (biodegrades in garden compost within 180 days). Unlike dishonest competitors claiming "100% bristle compostable in 2 weeks", our soft bristles are BPA-free castor-oil blended PBT nylon and must be detached with pliers for conventional plastics recycling.</li>
                  <li><strong>Thermal Treatment:</strong> Dry-steam carbonization at 220°C permanently alters the sugar starch structure, making the handle water-resistant and mold-inhibiting without chemical biocides.</li>
                  <li><strong>Surface Polishing:</strong> Buffed exclusively with natural plant candelilla wax and edible vegetable oils. Zero petroleum lacquers or polyurethane coatings.</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-[#16261E] border border-stone-200 dark:border-[#2C4836] rounded-xl space-y-2">
                <h5 className="font-semibold text-[#192E22] dark:text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#BD7B3C]" />
                  <span>Real B2B Client Testimonials (Zero Fake Bot Reviews)</span>
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Every quote, review, and client logo displayed across our platform corresponds to verified purchase orders from registered dental clinics, hotel chains, and corporate distributors. We strictly prohibit astroturfing, fake 5-star badges, or unverified claims.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: DATA DELETION REQUEST */}
          {activeTab === 'deletion' && (
            <div className="space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">
                  Self-Serve Privacy Rights
                </span>
                <h4 className="text-xl font-serif font-bold text-[#192E22] dark:text-white mt-1">
                  Request Data Deletion (Right to be Forgotten)
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  In compliance with GDPR Article 17 and DPDP Act 2023, you have the right to request permanent erasure of your commercial quotation history and contact data.
                </p>
              </div>

              {deletionStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                    deletionStatus.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {deletionStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{deletionStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleDeleteData} className="p-5 bg-stone-50 dark:bg-[#16261E] rounded-xl border border-stone-200 dark:border-[#2C4836] space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Your Registered Business Email or Phone Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={deleteIdentifier}
                    onChange={e => setDeleteIdentifier(e.target.value)}
                    placeholder="e.g. clinic@example.com or +91 98765 43210"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-[#101A14] border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    We will find and permanently delete all quotation drafts, submitted client specs, and contact records associated with this identifier.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#192E22] dark:text-white mb-1">
                    Type "DELETE" below to confirm:
                  </label>
                  <input
                    type="text"
                    required
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full max-w-xs px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-[#101A14] border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Deleting...' : 'Permanently Delete My Records'}</span>
                  </button>

                  <a
                    href="mailto:grievance@earthsmile.in?subject=Manual%20Data%20Deletion%20Request"
                    className="text-xs text-stone-600 dark:text-stone-400 hover:underline"
                  >
                    Or email Grievance Officer
                  </a>
                </div>
              </form>
            </div>
          )}

          {/* Business Details Bar (Shared in modal footer) */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-stone-500 dark:text-stone-400">
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">Registered Entity:</span>
              <span>Earth Smile Eco Innovations Pvt. Ltd.</span>
            </div>
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">Commercial Billing:</span>
              <span className="font-mono">Direct / MSME Exempt</span>
            </div>
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">IEC Code (Export):</span>
              <span className="font-mono">0716982341</span>
            </div>
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">Peenya Fulfillment Hub:</span>
              <span>Peenya 2nd Stage, Bengaluru 560058</span>
            </div>
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">WhatsApp & Support:</span>
              <span className="font-mono">+91 {EARTH_SMILE_PHONE}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block">Font & Asset Licensing:</span>
              <span>SIL OFL 1.1 / Unsplash Commercial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
