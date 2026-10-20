# UTMForge Pro — Technical Architecture & Attribution Specification

**Product Version**: 1.0.0  
**Release Date**: 2026-09-29  
**License**: MIT / Commercial Dual License

---

## 1\. System Overview

UTMForge Pro is an offline-first campaign URL builder, UTM parameter taxonomy standardizer, and high-resolution vector QR code deep-link studio. It helps growth marketing teams, performance advertising agencies, and e-commerce founders eliminate attribution tracking errors in Google Analytics 4 (GA4), Mixpanel, and CRM platforms without paying \$29 to \$199/month for commercial link management platforms (such as Bitly Enterprise or UTM.io).

### Key Architectural Pillars:

1. **100% Client-Side Privacy & Zero Link Redirection Delay**: Eliminates the 200–500ms latency redirect penalty and vendor link-rot risk associated with proprietary shortlink SaaS tools. All parameters are compiled directly in browser memory.  
2. **Strict GA4 Taxonomy Normalization**:  
   - Automated lowercasing to prevent split-reporting (e.g. `utm_source=Facebook` vs `utm_source=facebook`).  
   - Automated space-to-hyphen slugification to avoid unencoded `%20` 404 hazards in legacy email clients.  
   - Validation against GA4 default channel definitions (`cpc`, `paid-social`, `organic-social`, `email`, `affiliate`, `referral`).  
3. **Native Vector QR Generator (ISO/IEC 18004\)**: Built-in 29x29 matrix encoder with Reed-Solomon error correction and custom center call-to-action badge overlays (`SCAN ME`) rendered to infinite-resolution SVG.

---

## 2\. Directory Layout & Module Structure

2026-09-29-UTMForge-Pro/

├── source-code/

│   ├── index.html                   \# Visual studio interface & link inspector

│   ├── css/

│   │   └── utmforge.css             \# Studio styling, parameter tables & QR previews

│   ├── js/

│   │   ├── utm-engine.js            \# URL formatting, normalization & validation engine

│   │   ├── qr-generator.js          \# Standalone vector QR matrix generator

│   │   └── app.js                   \# Application state binder & exporter

│   └── templates/

│       ├── b2b-saas-omnichannel.json \# Google, Meta, LinkedIn & Substack preset

│       ├── ecommerce-influencer-launch.json \# TikTok & Instagram influencer preset

│       └── uae-gitex-offline-event.json \# UAE GITEX Dubai event standee QR preset

├── build/

│   ├── utmforge-cli.py              \# Standalone Python CLI batch processor & QR exporter

│   └── utmforge-pro-v1.0.0.zip      \# Complete production distribution bundle

├── documentation/

│   ├── ARCHITECTURE.md              \# Technical design & GA4 taxonomy specification

│   ├── USER\_GUIDE.md                \# Operating guide & campaign tagging manual

│   └── MONETIZATION\_AND\_MARKETING\_PLAYBOOK.md \# Agency pricing & commercial strategy

├── screenshots/

│   ├── campaign-preview.svg         \# High-resolution vector preview of campaign link

│   └── studio-preview.svg           \# High-resolution vector preview of studio

└── README.md                        \# Master repository documentation

---

## 3\. Data Flow Diagram

\[Target Destination URL\] \+ \[UTM Fields: source, medium, campaign, term, content\]

                         │

                         ▼

        \[Taxonomy Normalizer & Slugifier\]

       (Lowercase \+ Replace Spaces \+ URL Encoding)

                         │

                         ├─────────────────────────────────────────┐

                         ▼                                         ▼

            \[Clean Production URL\]                   \[Vector QR Matrix Generator\]

        (1-Click Copy / Batch CSV Export)           (ISO/IEC 18004 Reed-Solomon SVG)