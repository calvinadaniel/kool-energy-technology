# Kool Energy Technology — Shopify Store Design (Phase 4)

**Date:** 2026-09-08  
**Store:** https://k1gv00-g8.myshopify.com/  
**Contract:** Option A — Dawn theme, re-skinned ($900 Phase 4)  
**Approach:** Shopify CLI + theme files versioned in this repo  

---

## Overview

Build a password-protected Shopify equipment store with placeholder catalog data. Small parts/accessories use standard checkout; a small set of equipment SKUs use an on-store Request a Quote form. Brand matches the live marketing site (Architectural Blueprint), not the outdated quote typography notes.

Marketing site remains on GitHub Pages. Custom domain `shop.koolenergytechnology.com` is **out of scope for this build** (Milestone 4).

---

## Decisions locked

| Topic | Decision |
|---|---|
| Access | Staff credentials available; store URL confirmed |
| Build approach | Shopify CLI + Dawn theme in `shopify/theme/` |
| Catalog posture | Mostly Add to Cart; quote-only equipment later / as demos |
| Quote path | Shopify form/page on the store (not Jobber, not mailto) |
| Brand | Navy `#112581`, cyan `#00658d`, CTA red `#ba1a1a`, surface `#fbf8ff`, Manrope + Inter, `assets/logo.png` |
| Style preview | Approved mockup (brainstorm companion, 2026-09-08) |

---

## Architecture

```
Marketing site (GitHub Pages)          Shopify store (k1gv00-g8.myshopify.com)
├── Home / Services / About / …        ├── Dawn theme (CLI-managed)
├── /service-request/ (Jobber)         ├── Collections + placeholder products
└── Cross-link to shop (later)         ├── Hybrid: cart vs quote-only
                                       ├── Shopify Forms / contact quote page
                                       └── Password protected until go-live
```

**In repo**

| Path | Purpose |
|---|---|
| `shopify/theme/` | Dawn theme pull/push via CLI |
| `shopify/catalog/` | Placeholder product CSV + collection definitions |
| `shopify/README.md` | Connect, pull, push, import, password steps |

**Admin-only (not in repo):** plan/billing, Shopify Payments, shipping zones, tax, Forms app config, store password.

**Secrets:** Do not commit passwords, Theme Access tokens, or `.env`. Gitignore `.shopify/` and local credential files.

---

## Catalog & hybrid flow

### Collections

- Parts  
- Accessories  
- Filters  
- Equipment (quote-only demos)

### Products

- About **10–12** placeholder SKUs  
- Titles or tags clearly marked **Draft / placeholder**  
- **Majority:** standard products with Add to Cart and draft prices  
- **1–2 equipment demos:** tag `quote-only`, price on request, CTA → store quote form  

### Quote behavior

- Quote products hide or replace Add to Cart with **Request a Quote**  
- Prefer product tag + alternate product template and/or metafield; minimal Liquid only if theme settings cannot express this  
- Primary: Shopify’s native form (Forms or contact page) on the store; prefill product name when the platform allows. Use a free app only if native cannot support the quote CTA.  

### Data reload

- CSV under `shopify/catalog/` is the source of truth for placeholders  
- When client supplies real names/prices/photos/specs, replace CSV and re-import (up to 25 SKUs per contract)

### Shipping & tax (assumptions until client confirms)

- Shipping zones oriented to Tri-State (NY / NJ / CT)  
- NY sales tax nexus enabled in Admin  
- Document assumptions in `shopify/README.md`; refine before Milestone 2 if client answers differ  

---

## Theme / CLI workflow

1. Install Shopify CLI locally; authenticate to `k1gv00-g8.myshopify.com`  
2. Install **Dawn** on the store if not already default  
3. `shopify theme pull` into `shopify/theme/`  
4. Brand pass via theme settings (and settings data committed where safe):  
   - Colors: navy, cyan, red CTA, surface  
   - Fonts: Manrope (headings), Inter (body)  
   - Logo: upload from `assets/logo.png`  
   - Header/footer: link back to marketing site  
5. Implement quote-only product presentation (template/tag; Forms)  
6. `shopify theme push` / `shopify theme dev` for preview  
7. Keep store **password-protected** until Milestone 4  

**Option A boundary:** No full custom Liquid rebuild of Architectural Blueprint. Theme-editor-first; only small template overrides for hybrid CTA if required.

---

## Out of scope (this build)

- Custom domain DNS/SSL (`shop.koolenergytechnology.com`) — Milestone 4  
- Real client product photos, final prices, full ≤25 SKU catalog  
- Live Shopify Payments checkout QA until client payment method is ready  
- Marketing-site deep integration beyond header/footer cross-links  
- Instagram reel export/posting  

---

## Success criteria (ready for Milestone 2 review)

- [ ] Dawn live on store with approved brand colors, fonts, and logo  
- [ ] Placeholder catalog imported (mostly cart; ≥1 quote-only demo)  
- [ ] Quote form works on-store for quote-tagged products  
- [ ] Shipping & tax configured under documented assumptions  
- [ ] Theme files pullable/pushable from `shopify/theme/` via CLI  
- [ ] Store password-protected; draft labeling visible on placeholders  
- [ ] `shopify/README.md` sufficient for reconnect and catalog reload  

---

## Risks

| Risk | Mitigation |
|---|---|
| Plan/billing on wrong card | Confirm client payment method before paid plan actions |
| Quote form needs a paid app | Prefer native Forms / contact page; document if an app is required |
| Real catalog differs from placeholders | Keep CSV-driven; expect light collection rework |
| Fonts unavailable in Dawn picker | Use closest system pair or theme font settings that load Google fonts |
