import { LeadEnquiry } from '../types';
import { supabaseService } from './supabaseService';

const LEADS_STORAGE_KEY = 'earthsmile_leads_v3';

// Baseline default inquiries to ensure the Quotation Management dashboard is never empty
const INITIAL_LEADS: LeadEnquiry[] = [
  {
    id: 'quote-apollo-101',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
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
  {
    id: 'quote-sharma-103',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    name: 'Dr. Sharma',
    phone: '+91 98765 43210',
    email: 'contact@sharmadental.com',
    company: 'Dr. Sharma Multi-Speciality Clinic',
    city: 'New Delhi',
    productName: 'Ergonomic Bamboo Tongue Cleaner',
    quantity: 300,
    customBranding: false,
    brandingDetails: '',
    message: 'Interested in counter-top display packaging and patient giveaways. Please provide tier pricing.',
    leadSource: 'Direct Website Quote',
    status: 'contacted',
    adminNotes: 'Discussed volume discount schedule on telephone.',
  },
  {
    id: 'quote-greenroots-104',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    name: 'Vikram Singhania',
    phone: '+91 97118 90214',
    email: 'vikram@greenrootsorganic.com',
    company: 'GreenRoots Eco Stores',
    city: 'Hyderabad, Telangana',
    productName: 'Eco-Dentist Pro Bamboo Toothbrush',
    quantity: 2000,
    customBranding: true,
    brandingDetails: 'GreenRoots Life',
    message: 'Looking for bulk wholesale distributor agreement for south zone retail outlets.',
    leadSource: 'B2B Wholesale Portal',
    status: 'new',
    adminNotes: 'Commercial retail query. Awaiting MOA sign-off.',
  }
];

export const leadService = {
  getLeads(): LeadEnquiry[] {
    try {
      const keys = ['earthsmile_leads_v3', 'earthsmile_leads_v2', 'earthsmile_leads_v1', 'earthsmile_leads'];
      for (const k of keys) {
        const stored = localStorage.getItem(k);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with initial leads so baseline is preserved
            const idMap = new Map<string, LeadEnquiry>();
            for (const item of INITIAL_LEADS) {
              idMap.set(item.id, item);
            }
            for (const item of parsed) {
              if (item && item.id) idMap.set(item.id, item);
            }
            return Array.from(idMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        }
      }
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  },

  /**
   * Submit lead: Saves to local storage AND syncs to Supabase
   */
  submitLead(leadData: Omit<LeadEnquiry, 'id' | 'createdAt' | 'status'>): LeadEnquiry {
    const leads = this.getLeads();
    const newLead: LeadEnquiry = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const updated = [newLead, ...leads];
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist lead locally', e);
    }

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
    const leads = this.getLeads();
    const newLead: LeadEnquiry = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const updated = [newLead, ...leads];
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist lead locally', e);
    }

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

    if (remote.success && Array.isArray(remote.data)) {
      // Merge by ID, preferring remote updates
      const idMap = new Map<string, LeadEnquiry>();
      for (const item of local) {
        if (item && item.id) idMap.set(item.id, item);
      }
      for (const item of remote.data) {
        if (item && item.id) idMap.set(item.id, item);
      }

      const merged = Array.from(idMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.warn(e);
      }
      return merged;
    }

    return local;
  },

  updateLeadStatus(id: string, status: LeadEnquiry['status']): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.map(lead => (lead.id === id ? { ...lead, status } : lead));
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Sync to Supabase
    supabaseService.updateStatus(id, status);
    return updated;
  },

  updateLeadNotes(id: string, adminNotes: string): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.map(lead => (lead.id === id ? { ...lead, adminNotes } : lead));
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Sync to Supabase
    supabaseService.updateNotes(id, adminNotes);
    return updated;
  },

  deleteLead(id: string): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.filter(l => l.id !== id);
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Sync to Supabase
    supabaseService.deleteQuotation(id);
    return updated;
  },

  clearAllLeads(): LeadEnquiry[] {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.warn(e);
    }
    return [];
  },
};
