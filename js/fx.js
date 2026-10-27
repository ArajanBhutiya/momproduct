/* Visual polish and small UI helpers.
   1. Portfolio category filter (progressive: without JS every card is simply shown).
   2. Cursor-following glow on cards (skipped for touch devices and reduced motion). */
(function () {
  "use strict";

  document.querySelectorAll("[data-filter-bar]").forEach(function (bar) {
    var buttons = bar.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll("[data-cat]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        items.forEach(function (it) {
          var show = f === "all" || it.getAttribute("data-cat") === f;
          it.hidden = !show;
          if (show) it.classList.add("in");
        });
      });
    });
  });

  if (!window.matchMedia || !matchMedia("(hover:hover)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".card,.bento .b");
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--x", e.clientX - r.left + "px");
    el.style.setProperty("--y", e.clientY - r.top + "px");
  }, { passive: true });
})();
