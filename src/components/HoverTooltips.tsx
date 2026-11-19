// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// One shared tooltip for the whole app. It shows after a short hover or on
// keyboard focus, and only when tooltips are turned on in Settings.
import { useEffect, useRef, useState } from "react";
import { findTooltipTarget, useTooltipsEnabled } from "../lib/tooltips";

const SHOW_DELAY_MS = 450;
const GAP = 8;

interface TipState { text: string; x: number; y: number; placement: "above" | "below" }

export function HoverTooltips() {
  const [enabled] = useTooltipsEnabled();
  const [tip, setTip] = useState<TipState | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const current = useRef<Element | null>(null);

  useEffect(() => {
    const hide = () => {
      window.clearTimeout(timer.current);
      current.current = null;
      setTip(null);
    };
    if (!enabled) {
      hide();
      // Still move titles away, so the browser does not show its own tooltips.
      const strip = (event: Event) => { findTooltipTarget(event.target); };
      document.addEventListener("pointerover", strip, true);
      return () => document.removeEventListener("pointerover", strip, true);
    }

    const show = (element: Element, text: string, delay: number) => {
      window.clearTimeout(timer.current);
      current.current = element;
      timer.current = window.setTimeout(() => {
        if (current.current !== element || !element.isConnected) return;
        const box = element.getBoundingClientRect();
        const below = box.top < 48;
        setTip({
          text,
          x: Math.min(Math.max(box.left + box.width / 2, 12), window.innerWidth - 12),
          y: below ? box.bottom + GAP : box.top - GAP,
          placement: below ? "below" : "above",
        });
      }, delay);
    };

    const onOver = (event: PointerEvent) => {
      const found = findTooltipTarget(event.target);
      if (!found) { if (current.current) hide(); return; }
      if (found.element !== current.current) { setTip(null); show(found.element, found.text, SHOW_DELAY_MS); }
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element | null;
      if (!target?.matches?.(":focus-visible")) return;
      const found = findTooltipTarget(target);
      if (found) show(found.element, found.text, 0);
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("focusout", hide, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("focusout", hide, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled || !tip) return null;
  return <div
    className={`hover-tooltip ${tip.placement}`}
    role="tooltip"
    style={{ left: tip.x, top: tip.y }}
  >{tip.text}</div>;
}
