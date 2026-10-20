# UTMForge Pro (v1.0.0)

### Multi-Channel Campaign URL Builder, UTM Parameter Validator & Vector QR Studio

UTMForge Pro is an offline-first campaign tracking platform, UTM parameter taxonomy standardizer, and native vector QR code generator for performance marketers, growth agencies, and e-commerce brands across US, UK, UAE, and global markets.

---

## Key Features

- **100% Client-Side Execution**: Runs completely in the browser with zero cloud server dependencies, zero link-rot risk, and zero tracking redirects.  
- **GA4 Channel Preset Taxonomy**: Instant 1-click parameters for Google Search CPC, Meta Ads (Facebook & Instagram), LinkedIn Sponsored Content, Substack/Klaviyo Newsletters, and Offline Event QRs.  
- **Automated Parameter Hygiene**: Enforces lowercase normalization and space-to-hyphen slugification to avoid fragmented analytics buckets in Google Analytics 4, Mixpanel, and HubSpot.  
- **Custom Parameter Repeater**: Attach arbitrary business logic parameters (e.g. `ref`, `affiliate_id`, `discount_code`) with automated sanitization.  
- **Native Vector QR Generator**: Built-in 29x29 matrix engine (ISO/IEC 18004 standard) featuring Reed-Solomon error correction and custom center call-to-action badges (`SCAN ME`) rendered directly to SVG.  
- **Standalone Python CLI Tool**: Batch processes CSV link lists, validates UTM syntax, and exports production-ready CSV manifests and vector QR assets.

---

## Directory Structure

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

## Quick Start

### 1\. Launch the Visual Studio

Open `source-code/index.html` in your web browser. No local web server or installation required.

### 2\. Using the Automation CLI

\# Validate campaign JSON manifest

python3 build/utmforge-cli.py \--input source-code/templates/b2b-saas-omnichannel.json \--validate

\# Process links and export batch tagged CSV & vector QR code

python3 build/utmforge-cli.py \\

  \--input source-code/templates/b2b-saas-omnichannel.json \\

  \--output-csv campaign-links.csv \\

  \--output-qr campaign-qr.svg \\

  \--output-json campaign-manifest.json

---

## Specifications

- **QR Standard**: ISO/IEC 18004 Byte-Mode with Reed-Solomon Error Correction  
- **Browser Compatibility**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+  
- **CLI Requirements**: Python 3.8+ (Zero third-party package dependencies)  
- **License**: MIT / Dual Commercial License