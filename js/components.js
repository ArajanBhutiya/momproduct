/* Behaviour: menu, floating WhatsApp, reveal, config-driven links, quote form. Markup is pre-rendered at build time (scripts/build.mjs); this only renders what is missing. */
(function () {
  "use strict";
  var MP = window.MP;
  var R = window.MPRender(MP);
  var ICON = R.icons;
  MP.icons = ICON;
  var path = location.pathname.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";

  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    if (!header.children.length) header.innerHTML = R.header(path);
    // Let the announcement + contact bars scroll away while the main nav stays pinned.
    var pin = function () {
      var bars = header.querySelectorAll(".announce,.topbar"), h = 0;
      bars.forEach(function (b) { h += b.offsetHeight; });
      header.style.top = -h + "px";
    };
    pin(); window.addEventListener("resize", pin); window.addEventListener("load", pin);
    var btn = document.getElementById("menu-btn"), nav = document.getElementById("nav-links");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    if (!footer.children.length) footer.innerHTML = R.footer();
  }

  if (path !== "/get-quote") {
    var wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = MP.waLink();
    wa.target = "_blank"; wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat with MomProduct on WhatsApp");
    wa.innerHTML = ICON.wa + "<span>Chat on WhatsApp</span>";
    document.body.appendChild(wa);
  }

  document.querySelectorAll("[data-packages]").forEach(function (el) {
    if (!el.children.length) el.innerHTML = R.packages();
  });

  /* Config-driven links: <a data-wa>, data-tel, data-mail */
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = MP.waLink(a.getAttribute("data-wa") || undefined); a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = MP.telLink; a.textContent = a.textContent || MP.phoneDisplay; });
  document.querySelectorAll("[data-tel2]").forEach(function (a) { a.href = MP.tel2Link; a.textContent = a.textContent || MP.phone2Display; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = MP.mailLink; a.textContent = a.textContent || MP.email; });
  document.querySelectorAll("[data-text=email]").forEach(function (e) { e.textContent = MP.email; });
  document.querySelectorAll("[data-text=phone]").forEach(function (e) { e.textContent = MP.phoneDisplay; });

  /* Scroll reveal */
  document.documentElement.classList.add("js");
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .08 });
    items.forEach(function (i) { io.observe(i); });
  } else items.forEach(function (i) { i.classList.add("in"); });

  /* Quote form */
  var form = document.getElementById("quote-form");
  if (form) {
    var params = new URLSearchParams(location.search);
    var pkgMap = { starter: "Starter Website (one page)", business: "Business Website (up to 5 pages)", plus: "Business Plus (8–10 pages)" };
    if (params.get("package") && pkgMap[params.get("package")]) form.websiteType.value = pkgMap[params.get("package")];

    var alertBox = document.getElementById("form-alert");
    function show(type, msg) { alertBox.className = "alert show " + type; alertBox.textContent = msg; alertBox.scrollIntoView({ behavior: "smooth", block: "center" }); }
    function setErr(name, msg) {
      var f = form.querySelector('[data-field="' + name + '"]');
      f.classList.toggle("invalid", !!msg);
      f.querySelector(".error").textContent = msg || "";
      var input = f.querySelector("input,select,textarea");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
    function validate() {
      var ok = true, v = function (n) { return (form[n].value || "").trim(); };
      var checks = {
        name: v("name").length < 2 ? "Please enter your full name." : "",
        contact: (function () {
          var c = v("contact");
          if (!c) return "Please enter an email address or phone number.";
          var email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
          var phone = /^\+?[\d\s\-()]{8,16}$/.test(c) && c.replace(/\D/g, "").length >= 8;
          return email || phone ? "" : "Enter a valid email (name@example.com) or phone number.";
        })(),
        businessType: v("businessType") ? "" : "Please choose your business type.",
        websiteType: v("websiteType") ? "" : "Please choose a website type.",
        budget: v("budget") ? "" : "Please choose an approximate budget.",
        timeline: v("timeline") ? "" : "Please choose your expected timeline.",
        consent: form.consent.checked ? "" : "Please confirm you have read the privacy notice."
      };
      Object.keys(checks).forEach(function (k) { setErr(k, checks[k]); if (checks[k]) ok = false; });
      if (!ok) { var first = form.querySelector(".invalid input,.invalid select,.invalid textarea"); if (first) first.focus(); }
      return ok;
    }
    form.addEventListener("input", function (e) { var f = e.target.closest("[data-field]"); if (f && f.classList.contains("invalid")) validate(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alertBox.className = "alert";
      if (form.company_website.value) return; // honeypot: bots fill this in
      if (!validate()) return;
      var last = 0; try { last = +localStorage.getItem("mp_last_submit") || 0; } catch (x) {}
      if (Date.now() - last < 60000) { show("bad", "You just sent an enquiry. Please wait a minute before sending another, or message us on WhatsApp."); return; }
      if (!MP.web3formsKey || !MP.formEndpoint) {
        show("bad", "The enquiry form is not connected yet. Please contact us on WhatsApp or email instead — see the options beside the form.");
        return;
      }
      var submit = form.querySelector("button[type=submit]"), label = submit.textContent;
      submit.disabled = true; submit.textContent = "Sending…";
      var contact = form.contact.value.trim();
      var data = {
        access_key: MP.web3formsKey,
        subject: "New website enquiry — " + form.name.value.trim(),
        from_name: "MomProduct website",
        name: form.name.value.trim(), contact: contact, businessType: form.businessType.value,
        websiteType: form.websiteType.value, budget: form.budget.value, timeline: form.timeline.value,
        message: form.requirements.value.trim() || "(no additional requirements)", source: "momproduct.com/get-quote"
      };
      if (contact.indexOf("@") > -1) data.email = contact; else data.phone = contact; // email lets you reply straight from your inbox
      fetch(MP.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || d.success !== true) throw new Error(d.message || r.status); }); })
        .then(function () { try { localStorage.setItem("mp_last_submit", Date.now()); } catch (x) {} form.reset(); form.style.display = "none"; document.getElementById("form-success").hidden = false; document.getElementById("form-success").scrollIntoView({ behavior: "smooth", block: "center" }); })
        .catch(function () { show("bad", "Sorry, something went wrong sending your enquiry. Please try again, or contact us on WhatsApp or email."); })
        .finally(function () { submit.disabled = false; submit.textContent = label; });
    });
  }
})();
