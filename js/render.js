/* Pure markup renderers shared by the browser (js/components.js) and the build step (scripts/build.mjs). */
(function (root) {
  "use strict";
  function make(MP) {
  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.200-3.400-8.300ZM12 21.700c-1.800 0-3.500-.5-5-1.400l-.4-.2-3.800 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200C2.100 6.500 6.600 2.100 12 2.100c2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.800-9.800 9.800Zm5.400-7.300c-.3-.1-1.800-.9-2-1-.3-.1-.5-.1-.7.100l-1 1.200c-.2.200-.4.200-.7.100a8 8 0 0 1-4-3.500c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.1.200 2.200 3.300 5.200 4.600 1.900.8 2.600.9 3.600.7.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400-.1-.1-.3-.2-.6-.3Z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.300 1.800.6 2.800.7a2 2 0 0 1 1.700 2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>'
  };

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    var links = [["/", "Home"], ["/services/", "Services"], ["/pricing/", "Pricing"], ["/portfolio/", "Portfolio"], ["/about/", "About"]];
    function cur(path, href) { return (href === "/" ? path === "/" : path.indexOf(href) === 0) ? ' aria-current="page"' : ""; }

    function header(path) {
      return '<a class="announce" href="/get-quote/">' + ICON.bolt + '<b>Websites delivered in ' + MP.deliveryHours + ' hours</b><span> \u00b7 from ' + esc(MP.packages[0].price) + '</span><i>Get a free quote \u2192</i></a>' +
        '<div class="topbar"><div class="wrap"><a href="' + MP.mailLink + '">' + ICON.mail + esc(MP.email) + '</a>' +
        '<a href="' + MP.telLink + '">' + ICON.phone + esc(MP.phoneDisplay) + '</a>' +
        (MP.phone2Tel ? '<a class="tb-2" href="' + MP.tel2Link + '">' + ICON.phone + esc(MP.phone2Display) + '</a>' : '') + '</div></div>' +
        '<div class="wrap nav">' +
        '<a class="logo" href="/" aria-label="MomProduct home"><img src="/images/logo.svg" alt="" width="38" height="38"><span>Mom<b>Product</b></span></a>' +
        '<nav aria-label="Main"><ul class="nav-links" id="nav-links">' +
        links.map(function (l) { return '<li><a href="' + l[0] + '"' + cur(path, l[0].replace(/\/$/, "") || "/") + ">" + l[1] + "</a></li>"; }).join("") +
        '<li><a class="btn btn-primary mobile-only" href="/get-quote/">Get a Free Quote</a></li></ul></nav>' +
        '<div class="nav-cta"><a class="btn btn-primary btn-sm" href="/get-quote/">Get a Quote</a>' +
        '<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">' + ICON.menu + "</button></div></div>";
    }

    function footer() {
      return '<div class="wrap"><div class="foot-grid">' +
        '<div><a class="logo" href="/"><img src="/images/logo.svg" alt="" width="38" height="38"><span>Mom<b>Product</b></span></a>' +
        "<p>Professional, mobile-friendly websites with transparent pricing for small businesses, startups, freelancers and professionals.</p></div>" +
        '<div><h4>Explore</h4><ul><li><a href="/">Home</a></li><li><a href="/services/">Services</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/about/">About</a></li><li><a href="/blog/">Blog</a></li></ul></div>' +
        '<div><h4>Services</h4><ul><li><a href="/services/#business">Business websites</a></li><li><a href="/services/#landing">Landing pages</a></li><li><a href="/services/#portfolio-sites">Portfolio websites</a></li><li><a href="/services/#redesign">Website redesign</a></li><li><a href="/services/#maintenance">Maintenance</a></li></ul></div>' +
        '<div><h4>Contact</h4><ul><li><a href="' + MP.mailLink + '">' + esc(MP.email) + '</a></li><li><a href="' + MP.telLink + '">' + esc(MP.phoneDisplay) + '</a></li>' + (MP.phone2Tel ? '<li><a href="' + MP.tel2Link + '">' + esc(MP.phone2Display) + '</a></li>' : '') + '<li><a href="' + MP.waLink() + '" target="_blank" rel="noopener">Chat on WhatsApp</a></li><li><a href="/get-quote/">Get a free quote</a></li></ul></div>' +
        '</div><div class="foot-bottom"><span class="visitors" data-visitors hidden><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg> Total visitors: <b data-visitor-count>0</b></span><span>© ' + new Date().getFullYear() + " " + esc(MP.company) + ". All rights reserved.</span>" +
        '<span><a href="/privacy-policy/">Privacy Policy</a> &nbsp;·&nbsp; <a href="/terms/">Terms of Service</a></span></div></div>';
    }

    function packages() {
      return MP.packages.map(function (p) {
        return '<article class="card price-card reveal' + (p.featured ? " featured" : "") + '">' +
          (p.featured ? '<span class="badge">Most popular</span>' : "") +
          '<h3>' + esc(p.name) + '</h3><div class="scope">' + esc(p.scope) + "</div>" +
          '<div class="delivery">' + ICON.bolt + esc(p.delivery) + "</div>" +
          '<div class="price">' + esc(p.price) + " <small>one-time</small></div>" +
          '<p class="blurb">' + esc(p.blurb) + "</p>" +
          '<ul class="tick">' + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
          '<ul class="tick no">' + p.limits.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
          '<div class="actions"><a class="btn ' + (p.featured ? "btn-primary" : "btn-outline") + '" href="/get-quote/?package=' + p.id + '">Get this package</a>' +
          '<a class="btn btn-wa" href="' + MP.waLink("Hi MomProduct, I am interested in the " + p.name + " (" + p.price + "). Please share more details.") + '" target="_blank" rel="noopener">' + ICON.wa + "Ask on WhatsApp</a></div></article>";
      }).join("");
    }
    function demo(kind) {
      return '<div class="mini mini-' + kind + '"><div class="mini-bar"><i></i><i></i><i></i></div><div class="mini-nav"><b></b><span></span><span></span><span></span></div><div class="mini-hero"><div><em></em><em class="s"></em><u></u></div><div class="mini-img"></div></div><div class="mini-cards"><i></i><i></i><i></i></div></div><span class="demo-end"></span>';
    }
    return { icons: ICON, esc: esc, demo: demo, header: header, footer: footer, packages: packages };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = make; else root.MPRender = make;
})(typeof window !== "undefined" ? window : this);
