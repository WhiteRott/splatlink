// @vitest-environment jsdom
// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HoverTooltips } from "./HoverTooltips";
import { findTooltipTarget, loadTooltipsEnabled, setTooltipsEnabled } from "../lib/tooltips";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  localStorage.clear();
  vi.useRealTimers();
});

function hover(element: Element) {
  element.dispatchEvent(new Event("pointerover", { bubbles: true }));
}

describe("tooltip text", () => {
  it("uses data-tip, then title, then the label of an icon-only button", () => {
    document.body.innerHTML = '<button id="a" data-tip="Tip A">A</button><button id="b" title="Tip B">B</button><button id="c" aria-label="Close"></button><button id="d" aria-label="Save">Save</button>';
    expect(findTooltipTarget(document.getElementById("a"))?.text).toBe("Tip A");
    expect(findTooltipTarget(document.getElementById("b"))?.text).toBe("Tip B");
    expect(document.getElementById("b")?.hasAttribute("title")).toBe(false);
    expect(findTooltipTarget(document.getElementById("c"))?.text).toBe("Close");
    expect(findTooltipTarget(document.getElementById("d"))).toBeNull();
  });

  it("is on by default and remembers the choice", () => {
    expect(loadTooltipsEnabled()).toBe(true);
    setTooltipsEnabled(false);
    expect(loadTooltipsEnabled()).toBe(false);
  });
});

describe("HoverTooltips", () => {
  it("shows a tooltip after a short hover", () => {
    act(() => root.render(<><button data-tip="Start the job">Go</button><HoverTooltips /></>));
    act(() => hover(container.querySelector("button")!));
    expect(container.querySelector('[role="tooltip"]')).toBeNull();
    act(() => { vi.advanceTimersByTime(500); });
    expect(container.querySelector('[role="tooltip"]')?.textContent).toBe("Start the job");
  });

  it("shows nothing when tooltips are off", () => {
    setTooltipsEnabled(false);
    act(() => root.render(<><button data-tip="Start the job">Go</button><HoverTooltips /></>));
    act(() => hover(container.querySelector("button")!));
    act(() => { vi.advanceTimersByTime(500); });
    expect(container.querySelector('[role="tooltip"]')).toBeNull();
  });
});
