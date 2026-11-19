// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// Hides the startup loading screen from index.html.
const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 10_000;
const startedAt = typeof performance !== "undefined" ? performance.now() : 0;
let hidden = false;

export function hideSplash(): void {
  if (hidden) return;
  hidden = true;
  const splash = globalThis.document?.getElementById("splash");
  if (!splash) return;
  const elapsed = (typeof performance !== "undefined" ? performance.now() : MIN_VISIBLE_MS) - startedAt;
  const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
  globalThis.setTimeout(() => {
    splash.classList.add("hidden");
    globalThis.setTimeout(() => splash.remove(), 320);
  }, wait);
}

/** Safety net: never keep the loading screen longer than MAX_VISIBLE_MS. */
export function scheduleSplashTimeout(): void {
  globalThis.setTimeout(hideSplash, MAX_VISIBLE_MS);
}
