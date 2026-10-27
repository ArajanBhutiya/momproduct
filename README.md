# MomProduct.com — static marketing website

Plain HTML/CSS/JS. No build step, no dependencies.

## Run locally
    npx serve .        # or: python -m http.server 8080
Open http://localhost:8080 (a server is required: pages use root-relative paths like `/css/style.css`).

## Build step (SEO pre-rendering)
After editing `js/config.js` (contact, prices) or any page, run:

    node scripts/build.mjs

It bakes the header, footer, pricing cards, icons and contact links into the static HTML (so search engines see them without running JavaScript), regenerates JSON-LD structured data (business, FAQ, breadcrumbs, price offers), Open Graph / Twitter tags, `sitemap.xml` and `robots.txt`. Commit the result. Requires Node 18+.

## Before launch — edit `js/config.js`
| Setting | Why |
|---|---|
| `email`, `phoneDisplay`, `phoneTel`, `phone2*`, `whatsappNumber` | Contact details (already filled in). WhatsApp number = digits only, with country code. |
| `packages[].price` | Package prices (₹2,999 / ₹5,999 / ₹9,999). |
| `formEndpoint`, `web3formsKey` | Enquiry form delivery via Web3Forms. The access key is public by design (not a password) and decides which inbox receives enquiries. Manage it at web3forms.com. If you switch provider, also update `connect-src` in `_headers`. |

Also review: Privacy Policy and Terms (drafts), `sitemap.xml` / canonical URLs if the domain changes, and replace demo portfolio cards with live demo links when available.

## Deploy (Cloudflare Pages / Netlify)
1. Push this folder to GitHub.
2. Create a project: build command = none, output directory = `/` (root).
3. Add custom domain `momproduct.com`; HTTPS is automatic. Redirect www → apex.
4. `_headers` applies security headers on both platforms. `404.html` is used for unknown routes.
5. Test the live form with a real submission.

## Structure
    index.html, services/, pricing/, portfolio/, about/, get-quote/, blog/, privacy-policy/, terms/, 404.html
    css/style.css        design system
    js/config.js         single source for contact info, prices, form endpoint
    js/components.js     header, footer, pricing cards, floating WhatsApp, quote-form validation
    js/render.js         markup renderers shared by browser and build
    js/icons.js          inline icon placeholders
    scripts/build.mjs    pre-render + SEO generator
    robots.txt, sitemap.xml, _headers

## Visitor counter (Cloudflare Pages only)
The footer and homepage show a total visitor count, served by `functions/api/visits.js`. To switch it on:
1. Cloudflare dashboard -> Workers & Pages -> KV -> **Create namespace** (e.g. `momproduct-visits`).
2. Your Pages project -> Settings -> Functions -> **KV namespace bindings** -> add variable name `VISITS` pointing to that namespace (add it for Production, then redeploy).
3. Visit the live site; the number appears and goes up once per browser session. Check it any time at `https://momproduct.com/api/visits`.

Until it is configured (or when previewing locally) the counter stays hidden and the homepage shows "HTTPS / Secure launch" instead — it never shows a made-up number. It counts sessions, skips obvious bots, and the total is approximate under heavy simultaneous traffic. It starts at 0 on launch. On Netlify this function would need rewriting as a Netlify Function.

## Analytics
Not included by default (privacy). If you add Google Analytics, add a consent banner first and update the CSP in `_headers` and the Privacy Policy.
