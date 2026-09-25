# Equipment Store footer link — Design

**Date:** 2026-09-25  
**Status:** Approved for implementation planning

## Goal

Add a marketing-site footer link to the Shopify equipment store so visitors can reach the store from any page that shares the Quick Links footer.

## Decisions

| Item | Choice |
|---|---|
| Direction | Marketing site → Shopify store only |
| Label | Equipment Store |
| URL | `https://k1gv00-g8.myshopify.com` |
| Placement | Footer Quick Links only (not main nav) |
| Approach | Edit each page footer in place (existing copy-paste pattern) |
| Link behavior | `target="_blank"` + `rel="noopener"` |

## Scope

### In scope

Add one Quick Links list item after **Request Service** on these live pages:

- `index.html`
- `services/index.html`
- `about/index.html`
- `instagram/index.html`
- `service-request/index.html`
- `privacy-policy/index.html`
- `terms-and-conditions/index.html`

Markup:

```html
<li><a href="https://k1gv00-g8.myshopify.com" class="footer-link" target="_blank" rel="noopener">Equipment Store</a></li>
```

Reuse existing `footer-link` styles. No new CSS.

### Out of scope

- Main nav / header links
- Shopify theme footer link back to the marketing site
- Custom domain (`shop.koolenergytechnology.com`)
- Updates to legacy root `*.html` copies (not used by trailing-slash routes)
- Shared footer partial / JS include refactor

## Acceptance criteria

- [ ] All seven pages list **Equipment Store** in Quick Links after Request Service
- [ ] Link opens `https://k1gv00-g8.myshopify.com` in a new tab
- [ ] Visual style matches other footer Quick Links
- [ ] No nav or Shopify theme changes

## Notes

The store may still be password-protected until Milestone 4; the link is intentional so the cross-site path exists once the store is ready for visitors.
