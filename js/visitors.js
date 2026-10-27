/* Visitor counter UI. Counts one visit per browser session, then shows the running total.
   If the counter API is unavailable (local preview, not yet configured) nothing is shown — no fake numbers. */
(function () {
  "use strict";
  var swaps = document.querySelectorAll("[data-visitors-swap]");
  var tags = document.querySelectorAll("[data-visitors]");
  if (!swaps.length && !tags.length) return;

  function show(n) {
    var text = Number(n).toLocaleString("en-IN");
    swaps.forEach(function (el) { el.innerHTML = "<b>" + text + "</b><span>Website visitors</span>"; });
    tags.forEach(function (el) { el.querySelector("[data-visitor-count]").textContent = text; el.hidden = false; });
  }

  var counted = false;
  try { counted = sessionStorage.getItem("mp_counted") === "1"; } catch (e) {}

  fetch("/api/visits", { method: counted ? "GET" : "POST", cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      if (typeof d.count !== "number") return;
      try { sessionStorage.setItem("mp_counted", "1"); } catch (e) {}
      show(d.count);
    })
    .catch(function () { /* leave the static fallback in place */ });
})();
