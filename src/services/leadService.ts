import { LeadEnquiry } from '../types';

const LEADS_STORAGE_KEY = 'earthsmile_leads_v2';

export const leadService = {
  getLeads(): LeadEnquiry[] {
    try {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

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
    return newLead;
  },

  updateLeadStatus(id: string, status: LeadEnquiry['status']): LeadEnquiry[] {
    const leads = this.getLeads();
    const updated = leads.map(lead => (lead.id === id ? { ...lead, status } : lead));
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
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
    return updated;
  },
};
