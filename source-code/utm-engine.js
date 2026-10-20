/**
 * UTMForge Pro - Campaign URL & Attribution Engine
 * (c) 2026 UTMForge Pro. All rights reserved.
 */

(function(global) {
  'use strict';

  function slugify(text) {
    if (!text) return '';
    return String(text)
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  function validateUrl(urlStr) {
    if (!urlStr) return { valid: false, error: 'Destination URL is required.' };
    let normalized = urlStr.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    try {
      const parsed = new URL(normalized);
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return { valid: false, error: 'Invalid hostname format.' };
      }
      return { valid: true, url: parsed.toString() };
    } catch (e) {
      return { valid: false, error: 'Malformed URL.' };
    }
  }

  class UTMEngine {
    constructor(options = {}) {
      this.forceLowercase = options.forceLowercase !== false;
      this.slugifyParams = options.slugifyParams !== false;
    }

    cleanParam(val) {
      if (!val) return '';
      let clean = String(val).trim();
      if (this.slugifyParams) {
        clean = slugify(clean);
      } else if (this.forceLowercase) {
        clean = clean.toLowerCase();
      }
      return clean;
    }

    validateParams(params) {
      const issues = [];
      if (!params.utm_source) issues.push({ field: 'utm_source', level: 'error', message: 'Campaign Source (utm_source) is required for GA4/Mixpanel tracking.' });
      if (!params.utm_medium) issues.push({ field: 'utm_medium', level: 'error', message: 'Campaign Medium (utm_medium) is required for channel grouping.' });
      if (!params.utm_campaign) issues.push({ field: 'utm_campaign', level: 'error', message: 'Campaign Name (utm_campaign) is required for campaign attribution.' });

      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
        const val = params[key];
        if (val && /\s/.test(val)) {
          issues.push({ field: key, level: 'warning', message: `Contains spaces which will be converted to hyphens or URL encoded.` });
        }
        if (val && /[A-Z]/.test(val) && !this.forceLowercase) {
          issues.push({ field: key, level: 'warning', message: `Contains uppercase letters. GA4 distinguishes case (e.g. 'Email' vs 'email').` });
        }
      });

      return issues;
    }

    buildURL(baseUrl, params = {}, customParams = {}) {
      const urlCheck = validateUrl(baseUrl);
      if (!urlCheck.valid) {
        return { success: false, error: urlCheck.error };
      }

      const parsed = new URL(urlCheck.url);

      const standardKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      standardKeys.forEach(k => {
        if (params[k]) {
          parsed.searchParams.set(k, this.cleanParam(params[k]));
        } else {
          parsed.searchParams.delete(k);
        }
      });

      // Custom parameters (e.g. ref, affiliate, discount)
      Object.keys(customParams).forEach(k => {
        if (customParams[k]) {
          parsed.searchParams.set(this.cleanParam(k), this.cleanParam(customParams[k]));
        }
      });

      const finalUrl = parsed.toString();
      const validationIssues = this.validateParams(params);

      return {
        success: true,
        finalUrl: finalUrl,
        paramsCount: Array.from(parsed.searchParams.keys()).length,
        issues: validationIssues
      };
    }

    batchBuild(baseUrls, params = {}, customParams = {}) {
      if (!Array.isArray(baseUrls)) {
        baseUrls = String(baseUrls).split('\n').map(s => s.trim()).filter(Boolean);
      }
      return baseUrls.map(url => {
        const res = this.buildURL(url, params, customParams);
        return {
          originalUrl: url,
          ...res
        };
      });
    }
  }

  // Pre-configured Industry Presets
  const CHANNEL_PRESETS = {
    google_search: {
      name: 'Google Search Ads (CPC)',
      params: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'brand-search-2026', utm_term: '{keyword}', utm_content: 'ad-headline-v1' }
    },
    meta_ads: {
      name: 'Meta Ads (Facebook & Instagram)',
      params: { utm_source: 'meta', utm_medium: 'paid-social', utm_campaign: 'retargeting-catalog', utm_content: 'carousel-creative-a' }
    },
    linkedin_sponsored: {
      name: 'LinkedIn Sponsored Content',
      params: { utm_source: 'linkedin', utm_medium: 'paid-social', utm_campaign: 'enterprise-csuite-leadgen', utm_content: 'whitepaper-pdf-promo' }
    },
    email_newsletter: {
      name: 'Email Newsletter (Substack / Klaviyo)',
      params: { utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'weekly-digest-issue-42', utm_content: 'cta-button-main' }
    },
    offline_qr: {
      name: 'UAE GITEX / Event Print Banner QR',
      params: { utm_source: 'gitex-dubai', utm_medium: 'offline-qr', utm_campaign: 'dubai-booth-showcase', utm_content: 'standee-banner-a' }
    }
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { slugify, validateUrl, UTMEngine, CHANNEL_PRESETS };
  } else {
    global.slugify = slugify;
    global.validateUrl = validateUrl;
    global.UTMEngine = UTMEngine;
    global.CHANNEL_PRESETS = CHANNEL_PRESETS;
  }
})(typeof window !== 'undefined' ? window : this);
