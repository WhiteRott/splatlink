/* SplatLink (WhiteRott, 2026): set the saved theme before the first paint.
   The CSP blocks inline scripts, so this runs from a file. */
(function () {
  var preference = "system";
  try { preference = localStorage.getItem("splatlink.theme") || "system"; } catch (e) {}
  var dark = preference === "dark" ||
    (preference !== "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
})();
