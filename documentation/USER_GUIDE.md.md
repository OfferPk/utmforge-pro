# UTMForge Pro — User Guide & Marketing Manual

Welcome to **UTMForge Pro**, your campaign URL builder, UTM parameter validator, and vector QR deep-link studio.

---

## 1\. Quick Start

### 1.1 Running the Visual Studio

1. Open `source-code/index.html` in your web browser. No web server or node installation is needed.  
2. Enter your target destination URL (e.g., `https://cloudscale.ai/enterprise`).  
3. Click a **Quick Channel Preset** (Google CPC, Meta Ads, LinkedIn Ads, Newsletter, or Event QR) to populate standardized parameters.  
4. Customize `utm_campaign`, `utm_term`, or `utm_content` as needed.  
5. Add any custom query parameters (e.g. `ref`, `discount`, `partner_id`).  
6. Click **Copy Full URL** to grab the production-ready link, or click **SVG QR** to download an infinitely scalable vector QR code for print banners.

---

## 2\. Using the Automation CLI

SignShield Pro includes a standalone command-line tool (`build/utmforge-cli.py`) for automated CSV batch processing and QR code exports:

\# Validate campaign JSON manifest

python3 build/utmforge-cli.py \--input source-code/templates/b2b-saas-omnichannel.json \--validate

\# Process links and export batch tagged CSV & vector QR code

python3 build/utmforge-cli.py \\

  \--input source-code/templates/b2b-saas-omnichannel.json \\

  \--output-csv campaign-links.csv \\

  \--output-qr campaign-qr.svg \\

  \--output-json campaign-manifest.json

---

## 3\. Best Practices for GA4 Attribution Hygiene

1. **Always Use Lowercase**: GA4 treats `Email`, `email`, and `EMAIL` as three separate mediums, ruining default channel groupings.  
2. **Never Use Spaces**: Spaces cause broken links or ugly `%20` tags in SMS and email campaigns; UTMForge Pro automatically converts them to hyphens.  
3. **Consistent Campaign Naming**: Use date-prefixed or quarterly formats (e.g. `q4-enterprise-ai-launch`).