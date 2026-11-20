# SplatLink Editor changes to SuperSplat

The SplatLink Editor is built from SuperSplat by PlayCanvas Ltd. (MIT License, https://github.com/playcanvas/supersplat).
`scripts/build-editor.mjs` downloads a pinned SuperSplat commit, applies these changes, and builds the result into `public/editor/`.

1. `src/index.html`: title and description changed to SplatLink Editor. The two inline scripts moved to `static/editor-boot.js`, because the SplatLink content security policy blocks inline scripts. The web app manifest link is removed.
2. `static/locales/*.json`, `src/index.ts`, `src/ui/menu.ts`, `src/ui/editor.ts`, `src/doc.ts`: the visible name "SuperSplat" changed to "SplatLink Editor".
3. `src/ui/about-popup.ts`: the About box shows "SplatLink Editor" and credits "based on SuperSplat by PlayCanvas (MIT)".
4. `src/ui/svg/logo.svg`, `src/ui/playcanvas-logo.png`, `static/icons/*`: replaced with the SplatLink logo. `src/iframe-api.ts`: the logo no longer opens the SuperSplat website.
5. `src/ui/menu.ts`: the Publish item is removed, because it uploads to the PlayCanvas service. The forum link now opens the SplatLink help page.
6. `static/lib/gsaf` (prebuilt decoder, license not confirmed) and `static/images` (SuperSplat screenshots) are left out. Import of `.gsaf` animations does not work.

The SuperSplat license is kept in `public/editor/LICENSE-SuperSplat.txt` and `licenses/SuperSplat-MIT.txt`.
