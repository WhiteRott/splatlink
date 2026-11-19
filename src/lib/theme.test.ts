// @vitest-environment jsdom
// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, loadThemePreference, resolveTheme, setThemePreference } from "./theme";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("theme", () => {
  it("defaults to the system setting", () => {
    expect(loadThemePreference()).toBe("system");
  });

  it("resolves the system setting from the dark-mode preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("saves the choice and marks the document", () => {
    setThemePreference("dark");
    expect(loadThemePreference()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    setThemePreference("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("ignores an unknown saved value", () => {
    localStorage.setItem("splatlink.theme", "purple");
    expect(loadThemePreference()).toBe("system");
    expect(applyTheme(loadThemePreference())).toMatch(/^(light|dark)$/);
  });
});
