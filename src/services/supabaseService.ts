import { createClient } from '@supabase/supabase-js';
import { LeadEnquiry } from '../types';

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://vyhitcmnotpgprvrtugf.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_BgRso-jMj1XzWfNrBLFaqA_JVanWA8p';

export const SUPABASE_PROJECT_ID = 'vyhitcmnotpgprvrtugf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_SQL_SETUP = `-- Copy & paste into Supabase SQL Editor (Project: ${SUPABASE_PROJECT_ID})
-- Run to create the quotations table & policies

CREATE TABLE IF NOT EXISTS public.quotations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    city TEXT,
    product_name TEXT,
    quantity INTEGER DEFAULT 50,
    custom_branding BOOLEAN DEFAULT false,
    branding_details TEXT,
    message TEXT,
    lead_source TEXT DEFAULT 'Website Quotation Form',
    status TEXT DEFAULT 'new',
    admin_notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to submit quote requests
DROP POLICY IF EXISTS "Allow public insert to quotations" ON public.quotations;
CREATE POLICY "Allow public insert to quotations"
ON public.quotations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reading quotations
DROP POLICY IF EXISTS "Allow select on quotations" ON public.quotations;
CREATE POLICY "Allow select on quotations"
ON public.quotations
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updating quotations
DROP POLICY IF EXISTS "Allow update on quotations" ON public.quotations;
CREATE POLICY "Allow update on quotations"
ON public.quotations
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow deleting quotations
DROP POLICY IF EXISTS "Allow delete on quotations" ON public.quotations;
CREATE POLICY "Allow delete on quotations"
ON public.quotations
FOR DELETE
TO anon, authenticated
USING (true);
`;

export interface SupabaseSyncResult {
  success: boolean;
  tableReady: boolean;
  error?: string;
  lead?: LeadEnquiry;
}

export const supabaseService = {
  /**
   * Insert a new quotation directly into Supabase public.quotations
   */
  async saveQuotation(lead: LeadEnquiry): Promise<SupabaseSyncResult> {
    try {
      const payload = {
        id: lead.id,
        created_at: lead.createdAt || new Date().toISOString(),
        name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        company: lead.company || null,
        city: lead.city || null,
        product_name: lead.productName,
        quantity: lead.quantity || 50,
        custom_branding: Boolean(lead.customBranding),
        branding_details: lead.brandingDetails || null,
        message: lead.message || null,
        lead_source: lead.leadSource || 'Website Quotation Form',
        status: lead.status || 'new',
        admin_notes: lead.adminNotes || null,
      };

      const { data, error } = await supabase
        .from('quotations')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('Supabase quotation sync warning:', error.message);
        return {
          success: false,
          tableReady: error.code !== 'PGRST205', // PGRST205 = table not found
          error: error.message,
        };
      }

      return {
        success: true,
        tableReady: true,
        lead,
      };
    } catch (err: any) {
      console.warn('Supabase network exception:', err);
      return {
        success: false,
        tableReady: false,
        error: err?.message || 'Network error',
      };
    }
  },

  /**
   * Fetch all quotations from Supabase
   */
  async fetchQuotations(): Promise<{ success: boolean; data: LeadEnquiry[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: [], error: error.message };
      }

      const formatted: LeadEnquiry[] = (data || []).map((row: any) => ({
        id: row.id,
        createdAt: row.created_at || new Date().toISOString(),
        name: row.name,
        phone: row.phone,
        email: row.email || '',
        company: row.company || '',
        city: row.city || '',
        productName: row.product_name || row.productName || 'Bamboo Product',
        quantity: Number(row.quantity) || 50,
        customBranding: Boolean(row.custom_branding ?? row.customBranding),
        brandingDetails: row.branding_details || row.brandingDetails || '',
        message: row.message || '',
        leadSource: row.lead_source || row.leadSource || 'Supabase DB',
        status: (row.status as LeadEnquiry['status']) || 'new',
        adminNotes: row.admin_notes || row.adminNotes || '',
      }));

      return { success: true, data: formatted };
    } catch (err: any) {
      return { success: false, data: [], error: err?.message || 'Network error' };
    }
  },

  /**
   * Update quotation status in Supabase
   */
  async updateStatus(id: string, status: LeadEnquiry['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Update quotation admin notes in Supabase
   */
  async updateNotes(id: string, adminNotes: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ admin_notes: adminNotes })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Delete quotation from Supabase
   */
  async deleteQuotation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Check connection status to Supabase
   */
  async testConnection(): Promise<{ connected: boolean; tableFound: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST205') {
          return {
            connected: true,
            tableFound: false,
            message: 'Connected to Supabase, but "quotations" table is not created yet.',
          };
        }
        return {
          connected: false,
          tableFound: false,
          message: error.message,
        };
      }

      return {
        connected: true,
        tableFound: true,
        message: 'Successfully connected to Supabase "quotations" table.',
      };
    } catch (e: any) {
      return {
        connected: false,
        tableFound: false,
        message: e?.message || 'Network unreachable',
      };
    }
  },
};
