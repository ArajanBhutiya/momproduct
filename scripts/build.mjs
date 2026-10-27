/* Pre-render step: bakes shared markup, contact links, structured data, social tags and the sitemap into the HTML.
   Run after editing js/config.js or any page:   node scripts/build.mjs
   Idempotent — safe to run repeatedly. No dependencies. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

// Load the same config the browser uses.
const sandbox = {};
sandbox.window = sandbox;
vm.runInNewContext(read("js/config.js"), sandbox);
const MP = sandbox.MP;
const R = require(path.join(root, "js/render.js"))(MP);

const SITE = MP.siteUrl.replace(/\/$/, "");
const OG_IMAGE = SITE + "/images/og-image.png";
const today = new Date().toISOString().slice(0, 10);
const esc = (s) => R.esc(s);
const strip = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const phoneIsReal = !/0{6,}/.test(MP.phoneTel); // skip structured-data phone while it is still the placeholder

const pages = ["index.html", "services/index.html", "pricing/index.html", "portfolio/index.html", "about/index.html",
  "get-quote/index.html", "blog/index.html", "privacy-policy/index.html", "terms/index.html", "404.html"];

const sitemapEntries = [];

for (const file of pages) {
  let html = read(file);
  const route = file === "404.html" ? "/404" : "/" + file.replace(/index\.html$/, "").replace(/\/$/, "");
  const navPath = route === "/" ? "/" : route;
  const canonicalPath = file === "404.html" ? "" : route === "/" ? "/" : route + "/";
  const noindex = /<meta name="robots" content="noindex"/.test(html);

  // 1. Shared components
  html = html.replace(/<header id="site-header"[^>]*>[\s\S]*?<\/header>/, `<header id="site-header" class="site-header">${R.header(navPath)}</header>`);
  html = html.replace(/<footer id="site-footer"[^>]*>[\s\S]*?<\/footer>/, `<footer id="site-footer" class="site-footer">${R.footer()}</footer>`);
  html = html.replace(/(data-packages[^>]*>)(?:<!--pkgs-->[\s\S]*?<!--\/pkgs-->)?(<\/div>)/g, `$1<!--pkgs-->${R.packages()}<!--/pkgs-->$2`);

  // Portfolio thumbnails: mini websites
  html = html.replace(/(<div class="demo-thumb (t\d)"[^>]*>)[\s\S]*?(?:<div class="blocks">(?:<i><\/i>){3}<\/div>|<span class="demo-end"><\/span>)<\/div>/g,
    (m, open, t) => `${open}${R.demo(t)}</div>`);

  // 2. Icons and contact links baked in
  html = html.replace(/<span data-icon="(\w+)"><\/span>/g, (m, n) => R.icons[n] || m);
  html = html.replace(/<a([^>]*?)\sdata-wa(?:="([^"]*)")?([^>]*?)href="[^"]*"/g,
    (m, a, msg, b) => `<a${a} data-wa${msg ? `="${msg}"` : ""}${b}href="${esc(MP.waLink(msg ? msg.replace(/&amp;/g, "&") : undefined))}" target="_blank" rel="noopener"`);
  html = html.replace(/<a data-mail href="[^"]*">[^<]*<\/a>/g, `<a data-mail href="${MP.mailLink}">${esc(MP.email)}</a>`);
  html = html.replace(/<a data-tel2 href="[^"]*">[^<]*<\/a>/g, `<a data-tel2 href="${MP.tel2Link}">${esc(MP.phone2Display)}</a>`);
  html = html.replace(/<a data-tel href="[^"]*">[^<]*<\/a>/g, `<a data-tel href="${MP.telLink}">${esc(MP.phoneDisplay)}</a>`);

  // Ensure render.js loads before components.js (build owns this tag)
  html = html.replace(/<script src="\/js\/render\.js"><\/script>\n?/g, "");
  html = html.replace(/(<script src="\/js\/components\.js"><\/script>)/, '<script src="/js/render.js"></script>\n$1');

  // Visitor counter script (build owns this tag; every page shows the footer counter)
  html = html.replace(/<script src="\/js\/visitors\.js"[^>]*><\/script>\n?/g, "");
  html = html.replace(/<\/body>/, '<script src="/js/visitors.js" defer></script>\n</body>');

  html = html.replace(/<script src="\/js\/fx\.js"[^>]*><\/script>\n?/g, "");
  html = html.replace(/<\/body>/, '<script src="/js/fx.js" defer></script>\n</body>');

  // 3. <html lang>
  html = html.replace(/<html lang="[^"]*"/, '<html lang="en-IN"');

  // 4. SEO head block (social tags + structured data), regenerated every run
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || MP.brand;
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "");
  const url = SITE + canonicalPath;
  let seo = "";
  if (!noindex && file !== "404.html") {
    seo += `<meta property="og:type" content="website">\n<meta property="og:site_name" content="${esc(MP.brand)}">\n<meta property="og:locale" content="en_IN">\n` +
      `<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n` +
      `<meta property="og:image" content="${OG_IMAGE}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="MomProduct — ${esc(MP.tagline)}">\n` +
      `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">\n<meta name="twitter:image" content="${OG_IMAGE}">\n`;

    const graph = [];
    const org = {
      "@type": "ProfessionalService", "@id": SITE + "/#org", name: MP.company, alternateName: MP.brand, url: SITE + "/",
      logo: SITE + "/images/logo.svg", image: OG_IMAGE, slogan: MP.tagline,
      description: `Affordable website design and development for small businesses, startups, freelancers and professionals, delivered in ${MP.deliveryHours} hours.`,
      email: MP.email, areaServed: ["IN", "Worldwide"], priceRange: `${MP.packages[0].price}–${MP.packages[MP.packages.length - 1].price}`
    };
    if (phoneIsReal) org.telephone = MP.phone2Tel ? [MP.phoneTel, MP.phone2Tel] : MP.phoneTel;
    graph.push(org);
    graph.push({ "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/", name: MP.brand, publisher: { "@id": SITE + "/#org" }, inLanguage: "en-IN" });
    graph.push({ "@type": "WebPage", "@id": url + "#page", url, name: title, description: desc, isPartOf: { "@id": SITE + "/#website" }, about: { "@id": SITE + "/#org" }, inLanguage: "en-IN" });

    if (route !== "/") {
      graph.push({ "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: h1 || title, item: url }] });
    }
    if (route === "/") {
      const faq = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)]
        .map((m) => ({ "@type": "Question", name: strip(m[1]), acceptedAnswer: { "@type": "Answer", text: strip(m[2]) } }));
      if (faq.length) graph.push({ "@type": "FAQPage", mainEntity: faq });
    }
    if (route === "/pricing") {
      graph.push({ "@type": "OfferCatalog", name: "Website packages", itemListElement: MP.packages.map((p) => ({
        "@type": "Offer", name: p.name, description: `${p.scope}. ${p.blurb}`,
        price: p.price.replace(/[^\d]/g, ""), priceCurrency: "INR", url: SITE + "/get-quote/?package=" + p.id,
        availability: "https://schema.org/InStock", deliveryLeadTime: { "@type": "QuantitativeValue", value: MP.deliveryHours, unitCode: "HUR" }, itemOffered: { "@type": "Service", name: p.name, provider: { "@id": SITE + "/#org" } } })) });
    }
    if (route === "/services") {
      const items = [...html.matchAll(/<article[^>]*id="([^"]+)"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m, i) => ({
        "@type": "ListItem", position: i + 1, item: { "@type": "Service", name: strip(m[2]), url: `${url}#${m[1]}`, provider: { "@id": SITE + "/#org" }, areaServed: "IN" } }));
      if (items.length) graph.push({ "@type": "ItemList", itemListElement: items });
    }
    seo += `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>\n`;
    sitemapEntries.push({ loc: url, route });
  }
  // strip old social/ld blocks (hand-written or previously generated) and re-insert
  html = html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/g, "");
  html = html.replace(/<meta property="og:[^>]*>\n?/g, "").replace(/<meta name="twitter:[^>]*>\n?/g, "");
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, "");
  html = html.replace(/<!--fonts-->[\s\S]*?<!--\/fonts-->\n?/g, "");
  const fonts = '<!--fonts-->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">\n<!--/fonts-->\n';
  html = html.replace(/(<link rel="stylesheet" href="\/css\/style\.css">)/, `<!--seo-->\n${seo}<!--/seo-->\n${fonts}$1`);

  // 5. Sanity checks
  if (!/<link rel="canonical"/.test(html) && !noindex && file !== "404.html") console.warn("WARN no canonical:", file);
  fs.writeFileSync(path.join(root, file), html);
}

// sitemap.xml
const prio = { "/": "1.0", "/pricing": "0.9", "/get-quote": "0.9", "/services": "0.8", "/portfolio": "0.7", "/about": "0.6" };
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapEntries.map((e) => `  <url><loc>${e.loc}</loc><lastmod>${today}</lastmod><priority>${prio[e.route] || "0.3"}</priority></url>`).join("\n") + `\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages, sitemap with ${sitemapEntries.length} URLs.`);
