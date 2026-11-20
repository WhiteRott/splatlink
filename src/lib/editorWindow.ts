// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// Opens the SplatLink Editor (based on SuperSplat by PlayCanvas, MIT) in its own window.
export const EDITOR_WINDOW_LABEL = "splat-editor";
const EDITOR_PAGE = "/editor/index.html";

/** Builds the editor page address that loads one splat file. */
export function editorUrl(assetUrl: string, filename: string): string {
  // The editor calls decodeURIComponent on each value after the URL is parsed,
  // so each value is encoded one extra time here.
  const params = new URLSearchParams();
  params.append("load", encodeURIComponent(assetUrl));
  params.append("filename", encodeURIComponent(filename));
  return `${EDITOR_PAGE}?${params.toString()}`;
}

/** Returns the file name part of a path, for both / and \ separators. */
export function fileNameOf(path: string): string {
  const parts = path.split(/[\\/]/).filter(Boolean);
  return parts[parts.length - 1] || "splat.ply";
}

/**
 * Opens the editor window with the given splat file. An open editor window
 * closes first, so the new file loads in a clean editor.
 */
export async function openSplatEditor(assetUrl: string, filename: string, title: string): Promise<void> {
  const url = editorUrl(assetUrl, filename);
  if (!("__TAURI_INTERNALS__" in globalThis)) {
    globalThis.open?.(url, EDITOR_WINDOW_LABEL);
    return;
  }
  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const existing = await WebviewWindow.getByLabel(EDITOR_WINDOW_LABEL);
  if (existing) {
    await existing.close();
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  await new Promise<void>((resolve, reject) => {
    const editor = new WebviewWindow(EDITOR_WINDOW_LABEL, {
      url,
      title,
      width: 1400,
      height: 900,
      minWidth: 900,
      minHeight: 600,
      center: true,
      focus: true,
    });
    void editor.once("tauri://created", () => resolve());
    void editor.once("tauri://error", event => reject(new Error(String(event.payload))));
  });
}
