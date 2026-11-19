// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// Light, dark and system color themes.
import { useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "splatlink.theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const listeners = new Set<(preference: ThemePreference) => void>();

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function loadThemePreference(): ThemePreference {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  try {
    return globalThis.matchMedia?.(DARK_QUERY).matches ?? false;
  } catch {
    return false;
  }
}

export function resolveTheme(preference: ThemePreference, prefersDark = systemPrefersDark()): ResolvedTheme {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  const root = globalThis.document?.documentElement;
  if (root) {
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  }
  return resolved;
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage can be missing. The theme still applies for this session.
  }
  applyTheme(preference);
  listeners.forEach(listener => listener(preference));
}

/** Applies the saved theme and follows system changes while "system" is selected. */
export function initTheme(): () => void {
  applyTheme(loadThemePreference());
  let media: MediaQueryList | undefined;
  try {
    media = globalThis.matchMedia?.(DARK_QUERY);
  } catch {
    media = undefined;
  }
  const onChange = () => {
    if (loadThemePreference() === "system") applyTheme("system");
  };
  media?.addEventListener?.("change", onChange);
  return () => media?.removeEventListener?.("change", onChange);
}

export function useThemePreference(): [ThemePreference, (preference: ThemePreference) => void] {
  const [preference, setPreference] = useState<ThemePreference>(loadThemePreference);
  useEffect(() => {
    listeners.add(setPreference);
    return () => { listeners.delete(setPreference); };
  }, []);
  return [preference, setThemePreference];
}
