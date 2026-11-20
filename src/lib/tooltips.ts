// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// On/off preference for hover tooltips.
import { useEffect, useState } from "react";

const STORAGE_KEY = "splatlink.tooltips";
const listeners = new Set<(enabled: boolean) => void>();

export function loadTooltipsEnabled(): boolean {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setTooltipsEnabled(enabled: boolean): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage can be missing. The choice still applies for this session.
  }
  listeners.forEach(listener => listener(enabled));
}

export function useTooltipsEnabled(): [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabled] = useState<boolean>(loadTooltipsEnabled);
  useEffect(() => {
    listeners.add(setEnabled);
    return () => { listeners.delete(setEnabled); };
  }, []);
  return [enabled, setTooltipsEnabled];
}

/**
 * Finds the tooltip text for an element: data-tip first, then a title
 * (moved to data-tip so the browser does not show its own tooltip), then the
 * aria-label of a button or link that has no visible text.
 */
export function tooltipText(element: Element): string | null {
  const tip = element.getAttribute("data-tip");
  if (tip?.trim()) return tip.trim();
  const title = element.getAttribute("title");
  if (title?.trim()) {
    element.setAttribute("data-tip", title.trim());
    element.removeAttribute("title");
    return title.trim();
  }
  const isControl = element.matches("button, a[href], [role='button'], [role='tab'], [role='switch']");
  const label = element.getAttribute("aria-label");
  if (isControl && label?.trim() && !(element.textContent ?? "").trim()) return label.trim();
  return null;
}

export function findTooltipTarget(start: EventTarget | null): { element: Element; text: string } | null {
  let node = start instanceof Element ? start : null;
  for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
    if (node.closest("[data-no-tooltip]")) return null;
    const text = tooltipText(node);
    if (text) return { element: node, text };
  }
  return null;
}
