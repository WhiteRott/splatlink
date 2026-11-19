# Modifications

SplatLink is based on OOOSplat (https://github.com/ooolabdev/ooosplat), Copyright 2026 ooolabdev, licensed under the Apache License 2.0.

WhiteRott changed the files below for SplatLink. This file states those changes, as section 4(b) of the Apache License 2.0 requires. Changed source files also carry a "Modified by WhiteRott for SplatLink" line at the top.

## 2026-11-19: Rebrand from OOOSplat to SplatLink

### Name and identity
- `src-tauri/tauri.conf.json`: product name and window title changed to SplatLink. App identifier changed to `app.splatlink.desktop`.
- `src-tauri/Cargo.toml`: authors, repository and homepage updated. The internal crate and binary names are unchanged.
- `package.json`, `package-lock.json`: package name, author and repository updated.
- `index.html`: page title changed to SplatLink.

### Logo and icons
- `assets/app-icon.svg`, `assets/app-icon-rounded.svg`, `assets/readme-logo.svg`: OOOSplat mark replaced with the SplatLink logo.
- `src-tauri/icons/`: all desktop, Android and iOS icons regenerated from the SplatLink logo.

### Visible text
- `src/app/App.tsx`: header brand name changed to SplatLink.
- `src/components/ErrorReportDialog.tsx`, `src/components/UpdateNotice.tsx`, `src/components/McpSettingsPanel.tsx`: visible name changed to SplatLink.
- `src/components/GaussianViewer/GaussianViewer.tsx`: preview watermark text changed to SplatLink.
- `src/components/GaussianViewer/GaussianVideoExport.ts`: video export watermark label changed to SplatLink.
- `src/i18n/index.tsx`: interface strings that named OOOSplat now name SplatLink.
- `html-viewer/body.html`, `src-tauri/src/commands/html_export.rs`: exported HTML viewer name and title changed to SplatLink.
- `src-tauri/src/mcp/mod.rs`: local AI agent server name changed to SplatLink.

### Network addresses
- `config/telemetry-endpoint.txt`, `config/diagnostics-endpoint.txt`: telemetry and error reports now go to `splatlink.app`, not to the OOOSplat server.
- `src-tauri/src/telemetry/service.rs`: telemetry user agent changed to SplatLink.
- `src-tauri/src/diagnostics/mod.rs`: error report header changed to `X-SplatLink-Report`.
- `src-tauri/src/updates.rs`: update checks now read `splatlink.app` and accept downloads only from `github.com/WhiteRott/splatlink/releases`.

### Documentation and checks
- `README.md`: new SplatLink README.
- `docs/upstream/`: the original OOOSplat READMEs, moved from the repository root. Image paths updated.
- `NOTICE`: SplatLink attribution added. The original OOOSplat notice is kept.
- `MODIFICATIONS.md`: this file (new).
- `scripts/verify-docs.mjs`, `scripts/verify-licenses.mjs`: checks updated for the new README layout and the new author and repository.
- Tests updated for the new names: `src/app/App.preview.test.tsx`, `src/components/GaussianViewer/GaussianVideoExport.test.ts`, `src-tauri/src/updates/tests.rs`.

## 2026-11-19: Dark mode

- `src/lib/theme.ts` (new): stores the System, Light or Dark choice and applies it to the page. "System" follows the operating system setting.
- `src/lib/theme.test.ts` (new): tests for the theme logic.
- `scripts/generate-dark-theme.mjs` (new): builds `src/styles-dark.css` from `src/styles.css`. Run `npm run theme:dark` after you change `styles.css`.
- `src/styles-dark.css` (new, generated): the dark color rules.
- `src/styles.css`: styles for the theme selector.
- `src/main.tsx`: loads the dark styles and applies the saved theme at startup.
- `src/components/SettingsDialog.tsx`: new Appearance choice (System, Light, Dark) under Settings / Interface.
- `src/i18n/index.tsx`: Appearance text in Chinese and English.
- `package.json`: new `theme:dark` script.

## 2026-11-19: Loading screen and default folder

- `index.html`: new loading screen with the SplatLink logo, name and a progress bar. It follows the light or dark theme.
- `public/theme-boot.js` (new): sets the saved theme before the first paint, so the loading screen has the right colors.
- `src/lib/splash.ts` (new): hides the loading screen. It stays at least 0.7 seconds and at most 10 seconds.
- `src/main.tsx`: starts the 10-second limit for the loading screen.
- `src/app/App.tsx`: hides the loading screen when the project folder is known. The folder shown before settings load now reads "Documents / SplatLink".
- `src-tauri/tauri.conf.json`: window background changed to dark, to match the loading screen.
- `src-tauri/src/project/catalog.rs`: the default working directory is now `Documents/SplatLink` (it was `Documents/SplatStudio/Projects`). A saved folder equal to the old default moves to the new default. Projects in the old default folder stay visible in the list.

## 2026-11-19: Hover tooltips

- `src/lib/tooltips.ts` (new): the on/off choice for tooltips (on by default) and the rules for tooltip text.
- `src/components/HoverTooltips.tsx` (new): one shared tooltip. It shows after a short hover or on keyboard focus. When tooltips are off, the browser's own tooltips are also hidden.
- `src/components/HoverTooltips.test.tsx` (new): tests for the tooltips.
- `src/main.tsx`: mounts the shared tooltip.
- `src/components/SettingsDialog.tsx`: new "Hover tooltips" switch under Settings / Interface.
- `src/app/App.tsx`, `src/components/MaterialInputs.tsx`: helpful tooltips on Start Generation, Refresh, Settings, Auto-run, Add files and Add folders.
- `src/i18n/index.tsx`: tooltip text in Chinese and English.
- `src/styles.css`, `src/styles-dark.css`: tooltip styles.

## Not changed yet
- Internal code names (for example `ooo_splat`, `OOOSPLAT_*` environment variables and database table names) are unchanged. Users do not see them.
- Some backend log and error messages still name OOOSplat.
- The engine downloads (COLMAP and Brush) still come from the original OOOSplat release pages. Their licenses allow this.
