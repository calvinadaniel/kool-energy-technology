# Shopify Store (Phase 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-protected Dawn store on `k1gv00-g8.myshopify.com` with branded theme files in-repo, a placeholder mostly-cart catalog, and an on-store quote path for `quote-only` equipment demos.

**Architecture:** Shopify CLI manages Dawn under `shopify/theme/`. Placeholder products live as CSV under `shopify/catalog/` and are imported via Admin. Hybrid purchase uses the `quote-only` tag plus a minimal product template override that replaces Add to Cart with a link to a Shopify Forms/contact quote page. Brand tokens match the live marketing site.

**Tech Stack:** Shopify CLI, Dawn theme, Liquid (minimal), Shopify Admin (catalog/shipping/tax/forms), Node.js (CSV + settings validation scripts), PowerShell/bash for CLI steps.

## Global Constraints

- Store: `https://k1gv00-g8.myshopify.com/`
- Option A only: Dawn re-skin; no full Architectural Blueprint Liquid rebuild
- Brand colors (exact): navy `#112581`, cyan `#00658d`, CTA red `#ba1a1a`, surface `#fbf8ff`
- Fonts: Manrope (headings), Inter (body) — not DM Sans / Bebas Neue
- Logo source: `assets/logo.png`
- Catalog: ~10–12 draft SKUs; mostly Add to Cart; ≥1 `quote-only` equipment demo
- Quote path: on-store Shopify form/page (not Jobber, not mailto)
- Keep store password-protected until Milestone 4
- Never commit passwords, Theme Access tokens, `.env`, or `.shopify/` auth caches
- Custom domain `shop.koolenergytechnology.com` is out of scope for this plan
- Confirm client payment method before any paid Shopify plan actions

---

## File Map

| Path | Responsibility |
|---|---|
| `shopify/README.md` | Connect CLI, pull/push, import CSV, shipping/tax assumptions, password, Milestone 2 checklist |
| `shopify/catalog/products.csv` | Placeholder products for Admin import |
| `shopify/catalog/collections.md` | Collection names + membership rules |
| `shopify/scripts/validate-catalog.mjs` | Asserts CSV schema and quote/cart split |
| `shopify/scripts/validate-theme-brand.mjs` | Asserts brand hex tokens exist in theme settings |
| `shopify/theme/` | Dawn theme (CLI pull); brand settings + quote template |
| `shopify/theme/templates/product.quote.json` | Alternate product template for quote-only SKUs |
| `shopify/theme/sections/main-product-quote.liquid` | Product section: Request a Quote CTA, no cart |
| `shopify/theme/config/settings_data.json` | Color/font/logo theme settings (after pull) |
| `.gitignore` | Ignore `.shopify/`, theme lock secrets, local env |

---

### Task 1: Scaffold `shopify/` and ignore secrets

**Files:**
- Create: `shopify/README.md`
- Create: `shopify/catalog/.gitkeep`
- Create: `shopify/theme/.gitkeep`
- Create: `shopify/scripts/.gitkeep`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: none
- Produces: repo layout ready for CLI pull and catalog files

- [ ] **Step 1: Update `.gitignore`**

Append (do not remove existing entries):

```
# Shopify CLI / local auth
.shopify/
shopify/.env
shopify/**/.env
```

- [ ] **Step 2: Create directories and README skeleton**

Write `shopify/README.md`:

```markdown
# Kool Energy Technology — Shopify (Phase 4)

**Store:** https://k1gv00-g8.myshopify.com/

## Prerequisites
- Shopify staff access to the store
- Shopify CLI installed (`shopify version`)
- Node.js 18+ for validation scripts

## Commands (filled in by later tasks)
- Theme pull / push
- Catalog validate / import
- Brand validate
- Shipping & tax assumptions
- Password protection
- Milestone 2 checklist
```

Create empty dirs via `.gitkeep` files at:
- `shopify/catalog/.gitkeep`
- `shopify/theme/.gitkeep`
- `shopify/scripts/.gitkeep`

- [ ] **Step 3: Verify layout**

Run:

```powershell
Test-Path shopify/README.md, shopify/catalog/.gitkeep, shopify/theme/.gitkeep, shopify/scripts/.gitkeep
Select-String -Path .gitignore -Pattern '\.shopify/'
```

Expected: all `True`; `.gitignore` contains `.shopify/`

- [ ] **Step 4: Commit**

```bash
git add .gitignore shopify/README.md shopify/catalog/.gitkeep shopify/theme/.gitkeep shopify/scripts/.gitkeep
git commit -m "chore: scaffold shopify Phase 4 directories"
```

---

### Task 2: Install CLI, auth, pull Dawn into `shopify/theme/`

**Files:**
- Replace: `shopify/theme/` (Dawn files from pull)
- Modify: `shopify/README.md` (CLI commands)
- Remove: `shopify/theme/.gitkeep` after pull succeeds

**Interfaces:**
- Consumes: Task 1 layout; staff login for `k1gv00-g8.myshopify.com`
- Produces: Dawn theme files under `shopify/theme/` including `config/settings_schema.json`

- [ ] **Step 1: Install Shopify CLI if missing**

Run:

```powershell
shopify version
```

If not found, install (Windows, one of):

```powershell
npm install -g @shopify/cli @shopify/theme
```

Re-run `shopify version`. Expected: version string printed (no command-not-found).

- [ ] **Step 2: Authenticate to the store**

From repo root:

```powershell
cd shopify
shopify auth logout
shopify theme list --store k1gv00-g8.myshopify.com
```

Complete browser login with staff credentials when prompted. Expected: list of themes (may include Dawn / default).

- [ ] **Step 3: Ensure Dawn is installed on the store**

In Admin → Online Store → Themes: if Dawn is missing, **Add theme** → Dawn (free). Note the theme ID from `shopify theme list`.

- [ ] **Step 4: Pull Dawn into `shopify/theme/`**

```powershell
# from shopify/
Remove-Item -Recurse -Force theme -ErrorAction SilentlyContinue
shopify theme pull --store k1gv00-g8.myshopify.com --path theme --only ""
# If --only "" is rejected, use interactive pull or:
# shopify theme pull --store k1gv00-g8.myshopify.com --path theme --theme THEME_ID
```

Expected: `shopify/theme/layout/theme.liquid` and `shopify/theme/config/settings_schema.json` exist.

- [ ] **Step 5: Document CLI commands in README**

Replace the Commands section in `shopify/README.md` with:

```markdown
## Theme CLI

Store: `k1gv00-g8.myshopify.com`

```powershell
cd shopify
shopify theme list --store k1gv00-g8.myshopify.com
shopify theme pull --store k1gv00-g8.myshopify.com --path theme --theme THEME_ID
shopify theme push --store k1gv00-g8.myshopify.com --path theme --theme THEME_ID
shopify theme dev --store k1gv00-g8.myshopify.com --path theme
```

Replace `THEME_ID` with the Dawn theme id from `theme list`.
```

- [ ] **Step 6: Commit theme baseline**

```bash
git add shopify/theme shopify/README.md
git commit -m "chore: pull Dawn theme baseline into shopify/theme"
```

---

### Task 3: Placeholder catalog CSV + validation script

**Files:**
- Create: `shopify/catalog/products.csv`
- Create: `shopify/catalog/collections.md`
- Create: `shopify/scripts/validate-catalog.mjs`
- Modify: `shopify/README.md`
- Delete: `shopify/catalog/.gitkeep` if still present

**Interfaces:**
- Consumes: none
- Produces: CSV with columns below; `validate-catalog.mjs` exits 0 when valid
- CSV columns (exact headers):  
  `Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Requires Shipping,Variant Taxable,Image Src,Gift Card,SEO Title,SEO Description,Status`

- [ ] **Step 1: Write failing validation script**

Create `shopify/scripts/validate-catalog.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = path.join(root, 'catalog', 'products.csv');

function fail(msg) {
  console.error('FAIL:', msg);
  process.exit(1);
}

if (!fs.existsSync(csvPath)) fail(`Missing ${csvPath}`);

const text = fs.readFileSync(csvPath, 'utf8').trim();
const lines = text.split(/\r?\n/);
if (lines.length < 2) fail('CSV needs a header and at least one product row');

const header = lines[0].split(',');
const required = ['Handle', 'Title', 'Tags', 'Variant Price', 'Status'];
for (const col of required) {
  if (!header.includes(col)) fail(`Missing column: ${col}`);
}

const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const rows = lines.slice(1).map((line) => {
  // Minimal CSV split — catalog must not contain unescaped commas in fields
  const cols = line.split(',');
  return {
    handle: cols[idx.Handle],
    title: cols[idx.Title],
    tags: cols[idx.Tags] || '',
    price: cols[idx['Variant Price']],
    status: cols[idx.Status],
  };
});

if (rows.length < 10 || rows.length > 12) {
  fail(`Expected 10–12 products, found ${rows.length}`);
}

const quoteRows = rows.filter((r) => r.tags.split(/\s*,\s*/).includes('quote-only'));
const cartRows = rows.filter((r) => !r.tags.split(/\s*,\s*/).includes('quote-only'));

if (quoteRows.length < 1) fail('Need at least one quote-only product');
if (cartRows.length < quoteRows.length) fail('Cart products should outnumber quote-only (mostly cart)');

for (const r of rows) {
  if (!/draft|placeholder/i.test(r.title) && !/draft|placeholder/i.test(r.tags)) {
    fail(`Product "${r.handle}" must include Draft/placeholder in Title or Tags`);
  }
  if (r.status !== 'Active' && r.status !== 'Draft') {
    fail(`Product "${r.handle}" Status must be Active or Draft`);
  }
}

for (const r of quoteRows) {
  if (Number(r.price) !== 0) fail(`quote-only "${r.handle}" must have Variant Price 0`);
}

console.log(`OK: ${rows.length} products (${cartRows.length} cart, ${quoteRows.length} quote-only)`);
```

- [ ] **Step 2: Run script — expect FAIL (missing CSV)**

```powershell
node shopify/scripts/validate-catalog.mjs
```

Expected: `FAIL: Missing ...products.csv` (exit code 1)

- [ ] **Step 3: Write `shopify/catalog/collections.md`**

```markdown
# Collections

| Collection | Handles include |
|---|---|
| Parts | capacitor, contactor, relay, drain-pan-tablet (cart) |
| Accessories | thermostat-cover, disconnect-box, whip-kit (cart) |
| Filters | filter-16251, filter-20201, filter-MERV13 (cart) |
| Equipment | package-unit-5ton, condenser-3ton (quote-only) |

Membership is also encoded via product Type / Tags in `products.csv`.
```

- [ ] **Step 4: Write `shopify/catalog/products.csv`**

Create exactly **11** data rows (plus header). Rules:
- No commas inside field values (validator uses simple split)
- Vendor: `Kool Energy Technology`
- Tags always include `draft`
- Cart products: positive `Variant Price`; tags like `draft,parts`
- Quote products: Tags include `quote-only,draft,equipment`; `Variant Price` = `0`
- Titles start with `[DRAFT]`
- Status: `Active`
- Option1 Name: `Title`; Option1 Value: `Default Title`
- Variant Requires Shipping: `TRUE` for cart; `FALSE` for quote-only
- Variant Taxable: `TRUE`
- Published: `TRUE`
- Gift Card: `FALSE`
- Leave Image Src empty

Header row (exact):

```csv
Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Requires Shipping,Variant Taxable,Image Src,Gift Card,SEO Title,SEO Description,Status
```

Product rows (exact handles — copy as CSV lines):

1. `draft-filter-16251` — `[DRAFT] Pleated Filter 16x25x1` — Type `Filters` — Tags `draft,filters` — Price `24.00`
2. `draft-filter-20201` — `[DRAFT] Pleated Filter 20x20x1` — Type `Filters` — Tags `draft,filters` — Price `22.00`
3. `draft-filter-merv13` — `[DRAFT] MERV-13 Filter 16x25x2` — Type `Filters` — Tags `draft,filters` — Price `36.00`
4. `draft-capacitor-5uf` — `[DRAFT] Run Capacitor 5uF 370V` — Type `Parts` — Tags `draft,parts` — Price `18.50`
5. `draft-contactor-30a` — `[DRAFT] Contactor 30A 1-Pole` — Type `Parts` — Tags `draft,parts` — Price `29.00`
6. `draft-relay-fan` — `[DRAFT] Fan Relay 24V` — Type `Parts` — Tags `draft,parts` — Price `16.00`
7. `draft-thermostat-cover` — `[DRAFT] Thermostat Locking Cover` — Type `Accessories` — Tags `draft,accessories` — Price `12.00`
8. `draft-disconnect-60a` — `[DRAFT] Non-Fused Disconnect 60A` — Type `Accessories` — Tags `draft,accessories` — Price `45.00`
9. `draft-whip-kit-6ft` — `[DRAFT] Electrical Whip Kit 6ft` — Type `Accessories` — Tags `draft,accessories` — Price `38.00`
10. `draft-package-unit-5ton` — `[DRAFT] 5-Ton Package Unit` — Type `Equipment` — Tags `quote-only,draft,equipment` — Price `0`
11. `draft-condenser-3ton` — `[DRAFT] 3-Ton Condenser` — Type `Equipment` — Tags `quote-only,draft,equipment` — Price `0`

For each row fill remaining columns with: empty Body, Vendor `Kool Energy Technology`, empty Product Category, Published `TRUE`, Option1 `Title` / `Default Title`, SKU = handle, Grams `0`, Inventory Tracker empty, Qty `0`, Policy `deny`, Fulfillment `manual`, Requires Shipping `TRUE` (or `FALSE` for quote-only), Taxable `TRUE`, Image empty, Gift Card `FALSE`, SEO empty, Status `Active`.

- [ ] **Step 5: Run validation — expect PASS**

```powershell
node shopify/scripts/validate-catalog.mjs
```

Expected: `OK: 11 products (9 cart, 2 quote-only)`

- [ ] **Step 6: Document catalog commands in README**

Append:

```markdown
## Catalog

Validate:

```powershell
node shopify/scripts/validate-catalog.mjs
```

Import: Admin → Products → Import → upload `shopify/catalog/products.csv`.  
Then create manual collections from `shopify/catalog/collections.md` (Parts, Accessories, Filters, Equipment) and assign products by Type/tags.
```

- [ ] **Step 7: Commit**

```bash
git add shopify/catalog shopify/scripts/validate-catalog.mjs shopify/README.md
git commit -m "feat: add placeholder Shopify catalog CSV and validator"
```

---

### Task 4: Brand theme settings + brand validator

**Files:**
- Modify: `shopify/theme/config/settings_data.json` (color/font tokens after inspecting schema)
- Create: `shopify/scripts/validate-theme-brand.mjs`
- Modify: `shopify/README.md`
- Upload: logo via Admin or CLI (from `assets/logo.png`) — document path

**Interfaces:**
- Consumes: Dawn `settings_data.json` from Task 2
- Produces: settings containing `#112581`, `#00658d`, `#ba1a1a`, `#fbf8ff`; validator exits 0

- [ ] **Step 1: Write failing brand validator**

Create `shopify/scripts/validate-theme-brand.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const settingsPath = path.join(root, 'theme', 'config', 'settings_data.json');
const required = ['#112581', '#00658d', '#ba1a1a', '#fbf8ff'];

function fail(msg) {
  console.error('FAIL:', msg);
  process.exit(1);
}

if (!fs.existsSync(settingsPath)) fail(`Missing ${settingsPath}`);

const raw = fs.readFileSync(settingsPath, 'utf8');
// Dawn settings_data.json may include /* */ comment preamble — strip then parse
const jsonText = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
let data;
try {
  data = JSON.parse(jsonText);
} catch (e) {
  fail(`settings_data.json parse error: ${e.message}`);
}

const blob = JSON.stringify(data).toLowerCase();
for (const hex of required) {
  if (!blob.includes(hex.toLowerCase())) fail(`Brand color missing from settings: ${hex}`);
}

console.log('OK: brand color tokens present in settings_data.json');
```

- [ ] **Step 2: Run validator — expect FAIL or PASS**

```powershell
node shopify/scripts/validate-theme-brand.mjs
```

Expected before edits: `FAIL: Brand color missing...`

- [ ] **Step 3: Apply brand colors in theme settings**

Open `shopify/theme/config/settings_data.json`. Under `current` (or the active preset), set Dawn color settings to:

| Role | Hex |
|---|---|
| Primary / buttons / headings (navy) | `#112581` |
| Secondary / links (cyan) | `#00658d` |
| Sale / accent CTA where applicable | `#ba1a1a` |
| Background / surface | `#fbf8ff` |

Exact setting keys vary by Dawn version — map by reading `config/settings_schema.json` for color settings (`colors_solid_button_labels`, `colors_accent_1`, `colors_background_1`, etc.) and assign the four hex values to the closest semantic roles. Prefer:
- Background → `#fbf8ff`
- Solid button background → `#112581`
- Accent / secondary → `#00658d`
- Any “sale” or destructive accent used for primary CTA → `#ba1a1a` if a separate CTA control exists; otherwise keep primary button navy and use red for a custom CTA class only if already present

If the theme editor is easier: run `shopify theme dev`, set colors in the editor, then `shopify theme pull` to capture `settings_data.json`.

- [ ] **Step 4: Set fonts**

In theme settings, set heading font to **Manrope** and body to **Inter** if available in Dawn’s font picker. If Manrope is unavailable, pick the closest geometric sans and note the fallback in `shopify/README.md`.

- [ ] **Step 5: Logo**

Admin → Themes → Customize → Header → Logo → upload `assets/logo.png` (copy from repo). Pull theme again so logo reference is in settings/files, or document that logo is Admin-uploaded and not duplicated in git binaries if Shopify stores it on CDN only.

- [ ] **Step 6: Header/footer marketing link**

Add a menu item or header link labeled `Main website` → `https://calvinadaniel.github.io/kool-energy-technology/` (or production domain if client prefers). Footer: short line “Precision Heating & Cooling for Business” + NY · NJ · CT.

- [ ] **Step 7: Re-run brand validator — expect PASS**

```powershell
node shopify/scripts/validate-theme-brand.mjs
```

Expected: `OK: brand color tokens present in settings_data.json`

- [ ] **Step 8: Push theme**

```powershell
cd shopify
shopify theme push --store k1gv00-g8.myshopify.com --path theme --theme THEME_ID
```

Expected: push succeeds; password-page preview shows navy/cyan brand.

- [ ] **Step 9: Document + commit**

Append brand validate command to README. Commit:

```bash
git add shopify/theme/config/settings_data.json shopify/scripts/validate-theme-brand.mjs shopify/README.md
git commit -m "feat: apply Architectural Blueprint brand tokens to Dawn"
```

---

### Task 5: Quote-only product template + on-store form

**Files:**
- Create: `shopify/theme/sections/main-product-quote.liquid`
- Create: `shopify/theme/templates/product.quote.json`
- Modify: `shopify/README.md` (assign template + Forms steps)

**Interfaces:**
- Consumes: products tagged `quote-only` from catalog
- Produces: template suffix `quote` assignable in Admin; CTA links to `/pages/request-a-quote`

- [ ] **Step 1: Create quote product section**

Create `shopify/theme/sections/main-product-quote.liquid`:

```liquid
{% comment %}
  Quote-only product: no add-to-cart. CTA goes to store quote page.
{% endcomment %}
<section class="page-width" style="padding: 2rem 0;">
  <div style="display:grid; gap: 1.5rem; grid-template-columns: 1fr 1fr;">
    <div>
      {% if product.featured_media %}
        {{ product.featured_media | image_url: width: 1200 | image_tag: loading: 'lazy' }}
      {% else %}
        <div style="background:#dce3f5;min-height:280px;display:flex;align-items:center;justify-content:center;color:#112581;">
          Photo pending
        </div>
      {% endif %}
    </div>
    <div>
      <p style="letter-spacing:0.12em;text-transform:uppercase;font-size:0.75rem;color:#00658d;font-weight:700;">Quote only</p>
      <h1 style="font-family: Manrope, sans-serif; color:#112581; letter-spacing:-0.02em;">{{ product.title }}</h1>
      <div style="margin: 1rem 0; color:#5a5a72;">{{ product.description }}</div>
      <p style="font-weight:600;color:#112581;">Price on request</p>
      <a
        href="/pages/request-a-quote?product={{ product.handle | url_encode }}"
        style="display:inline-block;margin-top:1rem;background:#ba1a1a;color:#fff;padding:0.85rem 1.25rem;text-decoration:none;font-weight:700;border-radius:4px;"
      >
        Request a quote
      </a>
      <p style="margin-top:1rem;font-size:0.875rem;color:#5a5a72;">
        Draft placeholder — not a live equipment listing.
      </p>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Quote product",
  "settings": [],
  "presets": [{ "name": "Quote product" }]
}
{% endschema %}
```

- [ ] **Step 2: Create `product.quote.json` template**

Create `shopify/theme/templates/product.quote.json` (Dawn 15-style; adjust if pull used older JSON shape — match neighboring `product.json`):

```json
{
  "sections": {
    "main": {
      "type": "main-product-quote",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

If Dawn requires additional sections (breadcrumb, related), copy structure from `templates/product.json` and replace only the main section type with `main-product-quote`.

- [ ] **Step 3: Push theme**

```powershell
cd shopify
shopify theme push --store k1gv00-g8.myshopify.com --path theme --theme THEME_ID
```

- [ ] **Step 4: Create Request a Quote page + form (Admin)**

1. Admin → Online Store → Pages → Add page  
   - Title: `Request a Quote`  
   - Handle must be `request-a-quote`  
2. Add a contact/quote form:  
   - Prefer **Shopify Forms** (free) embedded on the page, fields: Name, Email, Phone, Product (single-line), Message  
   - If Forms unavailable: use theme contact form section on this page and instruct customers to paste product name  
3. Save.

- [ ] **Step 5: Assign template to quote products**

After catalog import (Task 6), for each `quote-only` product: Admin → Product → Theme template → **product.quote**.

Verify cart products still use default `product` template.

- [ ] **Step 6: Manual test**

Open a quote product on the password-protected storefront. Expected:
- No Add to Cart button
- Red **Request a quote** button
- Link lands on `/pages/request-a-quote` with `?product=` query present

Open a cart product. Expected: normal Dawn Add to Cart.

- [ ] **Step 7: Document + commit**

Document Forms + template assignment in README. Commit theme files:

```bash
git add shopify/theme/sections/main-product-quote.liquid shopify/theme/templates/product.quote.json shopify/README.md
git commit -m "feat: add quote-only product template and CTA"
```

---

### Task 6: Import catalog + create collections

**Files:**
- Modify: `shopify/README.md` (record import completed notes)
- Admin only: products + collections

**Interfaces:**
- Consumes: `shopify/catalog/products.csv` (passes `validate-catalog.mjs`)
- Produces: 11 products in Admin; 4 collections; quote products use `product.quote`

- [ ] **Step 1: Re-validate CSV**

```powershell
node shopify/scripts/validate-catalog.mjs
```

Expected: `OK: 11 products (9 cart, 2 quote-only)`

- [ ] **Step 2: Import CSV**

Admin → Products → Import → upload `shopify/catalog/products.csv` → Review → Import.

Expected: 11 products listed with `[DRAFT]` titles.

- [ ] **Step 3: Create collections**

Create automated or manual collections:

| Collection | Rule |
|---|---|
| Parts | Product type equals Parts |
| Accessories | Product type equals Accessories |
| Filters | Product type equals Filters |
| Equipment | Product type equals Equipment |

Expected: Equipment contains 2 quote-only products; others contain cart SKUs only.

- [ ] **Step 4: Assign `product.quote` template**

For `draft-package-unit-5ton` and `draft-condenser-3ton` → Theme template `product.quote`.

- [ ] **Step 5: Smoke-test storefront**

Password enter → homepage or `/collections/filters` → open one cart SKU → add to cart works.  
Open Equipment SKU → Request a quote path works.

- [ ] **Step 6: Commit README note only** (no secrets)

Append “Catalog imported on &lt;date&gt;” checklist item to README. Commit if README changed:

```bash
git add shopify/README.md
git commit -m "docs: note placeholder catalog import steps completed"
```

---

### Task 7: Shipping, tax, password, Milestone 2 checklist

**Files:**
- Modify: `shopify/README.md` (assumptions + QA checklist)

**Interfaces:**
- Consumes: live store Admin access
- Produces: documented shipping/tax assumptions; password enabled; README Milestone 2 checklist all actionable

- [ ] **Step 1: Configure shipping (Admin)**

Settings → Shipping and delivery:
- Add profile covering **United States**
- Zones: at minimum New York, New Jersey, Connecticut (Tri-State)
- Placeholder flat rate e.g. `$15.00` “Tri-State ground (draft)” for cart items
- Do not enable international for this phase

- [ ] **Step 2: Configure tax (Admin)**

Settings → Taxes:
- Enable **United States** / collect tax based on shipping address
- Ensure **New York** nexus/collection is on (assumption: NY sales tax nexus)
- Leave rates as Shopify defaults unless client provides overrides

- [ ] **Step 3: Password protect**

Online Store → Preferences → **Restrict access to visitors with the password** → enabled.  
Store password in client password manager only — never in git.

- [ ] **Step 4: Append assumptions + Milestone 2 checklist to README**

```markdown
## Shipping & tax assumptions
- Zones: NY, NJ, CT (Tri-State)
- Placeholder flat rate shipping for draft cart SKUs
- NY sales tax collection enabled (Shopify defaults)
- Refine when client confirms carrier/rates/nexus

## Password
- Storefront password enabled until Milestone 4 go-live
- Do not commit the password

## Milestone 2 checklist
- [ ] Dawn branded (navy/cyan/red/surface, Manrope/Inter, logo)
- [ ] `node shopify/scripts/validate-theme-brand.mjs` passes
- [ ] 10–12 draft products imported; mostly cart
- [ ] ≥1 quote-only product uses `product.quote` + Request a quote CTA
- [ ] Quote page `/pages/request-a-quote` form submits
- [ ] Collections: Parts, Accessories, Filters, Equipment
- [ ] Shipping Tri-State + NY tax configured
- [ ] Password protection on
- [ ] Theme pull/push via CLI documented with THEME_ID
```

- [ ] **Step 5: Run both validators**

```powershell
node shopify/scripts/validate-catalog.mjs
node shopify/scripts/validate-theme-brand.mjs
```

Expected: both OK.

- [ ] **Step 6: Commit**

```bash
git add shopify/README.md
git commit -m "docs: add Shopify shipping tax password and Milestone 2 checklist"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| CLI + Dawn in `shopify/theme/` | Task 2 |
| Brand colors/fonts/logo + marketing link | Task 4 |
| Placeholder CSV 10–12 mostly cart | Task 3 |
| Import + collections | Task 6 |
| quote-only + on-store form | Task 5 |
| Shipping & tax assumptions | Task 7 |
| Password until M4 | Task 7 |
| `shopify/README.md` reconnect/reload docs | Tasks 1–7 |
| No custom domain / no real catalog | Explicitly out of Task list |
| Secrets not committed | Task 1 gitignore + Task 7 password note |

No TBD placeholders remain. Validator interfaces (`validate-catalog.mjs`, `validate-theme-brand.mjs`) are consistent across tasks.
