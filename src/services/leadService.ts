import { LeadEnquiry } from '../types';
import { supabaseService } from './supabaseService';
import { calculateQuotePricing } from '../utils/quotePricing';

const LEADS_STORAGE_KEY = 'earthsmile_leads_v4';

// Sample fallback inquiries only used if the database and storage are completely empty
const INITIAL_LEADS: LeadEnquiry[] = [
  {
    id: 'quote-apollo-101',
    createdAt: '2026-09-25T10:30:00.000Z',
    name: 'Dr. Rajesh Malhotra',
    phone: '+91 98112 34567',
    email: 'procurement@apollohealth.org',
    company: 'Apollo Dental & Healthcare Centers',
    city: 'Bengaluru, Karnataka',
    productName: 'Eco-Dentist Pro Bamboo Toothbrush',
    quantity: 1200,
    customBranding: true,
    brandingDetails: 'Apollo Dental • Clinic Care 2026',
    message: 'Require 1,200 units with our clinic emblem laser-engraved. Need priority dispatch schedule.',
    leadSource: 'Request a Quote Modal',
    status: 'new',
    adminNotes: 'High-priority institutional client. Sent official PDF price sheet on WhatsApp.',
  },
  {
    id: 'quote-clove-102',
    createdAt: '2026-09-24T14:15:00.000Z',
    name: 'Pooja Venkatesh',
    phone: '+91 99401 88765',
    email: 'pooja.v@clovedental.in',
    company: 'Clove Dental Clinics Chain',
    city: 'Mumbai, Maharashtra',
    productName: 'Bamboo Dental Care Duo Combo',
    quantity: 650,
    customBranding: true,
    brandingDetails: 'Clove Eco Initiative',
    message: 'Monthly recurring quotation required for 650 patient welcome kits across western region branches.',
    leadSource: 'On-Page Contact Section',
    status: 'quoted',
    adminNotes: 'Sample boxes dispatched via courier. Follow-up scheduled for this Friday.',
  },
];

const isDummyLead = (id?: string) => {
  if (!id) return false;
  return id.startsWith('quote-apollo') || id.startsWith('quote-clove') || id.startsWith('quote-sharma') || id.startsWith('quote-greenroots');
};

const enrichLead = (lead: LeadEnquiry): LeadEnquiry => {
  const pricing = calculateQuotePricing(lead);
  return {
    ...lead,
    estimatedValue: lead.estimatedValue || pricing.grandTotal,
  };
};

const safeGetStorage = (key: string): string | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore in restricted envs
  }
};

export const leadService = {
  getLeads(): LeadEnquiry[] {
    try {
      const keys = ['earthsmile_leads_v4', 'earthsmile_leads_v3', 'earthsmile_leads_v2', 'earthsmile_leads_v1', 'earthsmile_leads'];
      for (const k of keys) {
        const stored = safeGetStorage(k);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.filter(item => item && item.id);
            // If we have real leads, filter out mock dummy leads
            const realLeads = valid.filter(item => !isDummyLead(item.id));
            const listToReturn = realLeads.length > 0 ? realLeads : valid;

            return listToReturn
              .map(enrichLead)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        }
      }
      return INITIAL_LEADS.map(enrichLead);
    } catch {
      return INITIAL_LEADS.map(enrichLead);
    }
  },

  /**
   * Submit lead: Saves to local storage AND syncs to Supabase
   */
  submitLead(leadData: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>): LeadEnquiry {
    const leads = this.getLeads().filter(l => !isDummyLead(l.id));
    const pricing = calculateQuotePricing(leadData);

    const newLead: LeadEnquiry = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      estimatedValue: pricing.grandTotal,
    };

    const updated = [newLead, ...leads];
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Supabase in background
    supabaseService.saveQuotation(newLead).then(res => {
      if (res.success) {
        console.info('Quotation stored successfully in Supabase (id: ' + newLead.id + ')');
      } else {
        console.warn('Supabase sync notice:', res.error);
      }
    });

    return newLead;
  },

  /**
   * Async submit lead: Awaits Supabase save before returning
   */
  async submitLeadAsync(leadData: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>): Promise<LeadEnquiry> {
    const leads = this.getLeads().filter(l => !isDummyLead(l.id));
    const pricing = calculateQuotePricing(leadData);

    const newLead: LeadEnquiry = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      estimatedValue: pricing.grandTotal,
    };

    const updated = [newLead, ...leads];
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(updated));

    try {
      await supabaseService.saveQuotation(newLead);
    } catch (e) {
      console.warn('Supabase async save error:', e);
    }

    return newLead;
  },

  /**
   * Asynchronously fetch latest quotations from Supabase and merge with local store
   */
  async fetchAndSyncWithSupabase(): Promise<LeadEnquiry[]> {
    const local = this.getLeads();
    const remote = await supabaseService.fetchQuotations();

    if (remote.success && Array.isArray(remote.data) && remote.data.length > 0) {
      // Remote Supabase has live customer quotes!
      const idMap = new Map<string, LeadEnquiry>();

      // Keep real non-dummy local leads
      for (const item of local) {
        if (item && item.id && !isDummyLead(item.id)) {
          idMap.set(item.id, enrichLead(item));
        }
      }

      // Add remote quotations from Supabase
      for (const item of remote.data) {
        if (item && item.id && !isDummyLead(item.id)) {
          idMap.set(item.id, enrichLead(item));
        }
      }

      const merged = Array.from(idMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return local;
  },

  updateLeadStatus(id: string, status: LeadEnquiry['status']): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.map(lead => (lead.id === id ? { ...lead, status } : lead));
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Supabase
    supabaseService.updateStatus(id, status);
    return updated;
  },

  updateLeadNotes(id: string, adminNotes: string): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.map(lead => (lead.id === id ? { ...lead, adminNotes } : lead));
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Supabase
    supabaseService.updateNotes(id, adminNotes);
    return updated;
  },

  deleteLead(id: string): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.filter(l => l.id !== id);
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Supabase
    supabaseService.deleteQuotation(id);
    return updated;
  },

  clearAllLeads(): LeadEnquiry[] {
    safeSetStorage(LEADS_STORAGE_KEY, JSON.stringify([]));
    return [];
  },
};
