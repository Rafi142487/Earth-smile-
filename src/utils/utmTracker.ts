/**
 * UTM Tracker Utility
 * Captures query parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, ref)
 * and persists them in sessionStorage for attributing quotation leads.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  referrer?: string;
  landingPage?: string;
}

const STORAGE_KEY = 'earthsmile_utm_session_v1';

export const utmTracker = {
  /**
   * Initializes UTM tracking from current window URL. Call this on app load.
   */
  init(): UtmParams {
    if (typeof window === 'undefined') return {};

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const existing = this.get();

      const newParams: UtmParams = {
        ...existing,
        utm_source: urlParams.get('utm_source') || existing.utm_source || undefined,
        utm_medium: urlParams.get('utm_medium') || existing.utm_medium || undefined,
        utm_campaign: urlParams.get('utm_campaign') || existing.utm_campaign || undefined,
        utm_term: urlParams.get('utm_term') || existing.utm_term || undefined,
        utm_content: urlParams.get('utm_content') || existing.utm_content || undefined,
        gclid: urlParams.get('gclid') || existing.gclid || undefined,
        referrer: existing.referrer || document.referrer || undefined,
        landingPage: existing.landingPage || window.location.pathname,
      };

      // Clean undefined keys
      const cleanParams: UtmParams = {};
      (Object.keys(newParams) as (keyof UtmParams)[]).forEach(k => {
        if (newParams[k]) cleanParams[k] = newParams[k];
      });

      if (Object.keys(cleanParams).length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cleanParams));
      }

      return cleanParams;
    } catch {
      return {};
    }
  },

  /**
   * Retrieve currently active UTM session parameters
   */
  get(): UtmParams {
    if (typeof window === 'undefined') return {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  /**
   * Formats UTM params as a readable string for admin lead dossiers
   */
  formatSummary(): string {
    const params = this.get();
    const parts: string[] = [];
    if (params.utm_source) parts.push(`Source: ${params.utm_source}`);
    if (params.utm_medium) parts.push(`Medium: ${params.utm_medium}`);
    if (params.utm_campaign) parts.push(`Campaign: ${params.utm_campaign}`);
    if (params.utm_term) parts.push(`Term: ${params.utm_term}`);
    if (params.referrer) parts.push(`Referrer: ${params.referrer}`);
    return parts.length > 0 ? parts.join(' | ') : 'Direct / Organic Navigation';
  },
};
