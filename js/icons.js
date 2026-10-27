/* Fills <span data-icon="wa|check|phone|mail"></span> placeholders with inline SVG icons. */
document.querySelectorAll("[data-icon]").forEach(function (el) {
  var svg = MP.icons[el.getAttribute("data-icon")];
  if (svg) el.outerHTML = svg;
});
