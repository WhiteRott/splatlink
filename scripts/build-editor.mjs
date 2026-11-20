// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
// Builds the SplatLink Editor from SuperSplat (MIT, Copyright (c) 2011-2026 PlayCanvas Ltd.).
//
// Steps: download the pinned SuperSplat source, apply the SplatLink changes
// listed in editor/PATCHES.md, build it, and copy the result to public/editor.
// Run: npm run editor:build   (needs git, npm and network access)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SOURCE_REPO = "https://github.com/playcanvas/supersplat";
const SOURCE_COMMIT = "7912e1d78b7a98cff26f7c8c2820a784b537819e"; // SuperSplat v3.9.2
const EDITOR_NAME = "SplatLink Editor";
const EDITOR_BOOT = `// SplatLink Editor startup (moved out of index.html, which may not hold inline scripts).
navigator.serviceWorker?.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
['dragover', 'drop'].forEach((type) => window.addEventListener(type, (e) => {
    if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
}));
`;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const target = path.join(root, "public", "editor");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "splatlink-editor-"));
const src = path.join(work, "supersplat");

function run(cmd, args, cwd, env = {}) {
  execFileSync(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
}

function edit(file, replacements) {
  const full = path.join(src, file);
  let text = fs.readFileSync(full, "utf8");
  for (const [from, to] of replacements) {
    if (!text.includes(from)) throw new Error(`Patch failed in ${file}: text not found:\n${from}`);
    text = text.split(from).join(to);
  }
  fs.writeFileSync(full, text);
}

console.log(`Downloading SuperSplat ${SOURCE_COMMIT}`);
run("git", ["init", "-q", src], work);
run("git", ["fetch", "-q", "--depth", "1", SOURCE_REPO, SOURCE_COMMIT], src);
run("git", ["checkout", "-q", "FETCH_HEAD"], src);

console.log("Applying SplatLink changes");
// 1. Page: SplatLink name, no inline scripts (the SplatLink CSP blocks them), no web app manifest.
edit("src/index.html", [
  ["<title>SuperSplat</title>", `<title>${EDITOR_NAME}</title>`],
  ['        <link rel="manifest" href="./manifest.json">\n', ""],
  [
    'content="SuperSplat is an advanced browser-based editor for manipulating and optimizing 3D Gaussian Splats. It is open source and engine agnostic."',
    `content="${EDITOR_NAME}: Gaussian splat editor for SplatLink, based on SuperSplat by PlayCanvas."`,
  ],
]);
{
  const file = path.join(src, "src/index.html");
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/\s*<!--[\s\S]*?-->\s*<script>[\s\S]*?<\/script>/g, "");
  html = html.replace("</head>", '    <script src="./editor-boot.js"></script>\n    </head>');
  fs.writeFileSync(file, html);
}

// 2. Visible name in all languages and in startup messages.
for (const locale of fs.readdirSync(path.join(src, "static/locales"))) {
  const file = path.join(src, "static/locales", locale);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const key of Object.keys(data)) {
    if (typeof data[key] === "string") data[key] = data[key].split("SuperSplat").join(EDITOR_NAME);
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 4) + "\n");
}
edit("src/index.ts", [
  ["'SuperSplat failed to start.", `'${EDITOR_NAME} failed to start.`],
  ["'SuperSplat requires WebGPU,", `'${EDITOR_NAME} requires WebGPU,`],
  ["`SuperSplat v${appVersion}", `\`${EDITOR_NAME} (based on SuperSplat v\${appVersion})`],
]);

edit("src/ui/menu.ts", [
  ["text: 'SuperSplat'", `text: '${EDITOR_NAME}'`],
  ["home.dom.setAttribute('aria-label', 'SuperSplat');", `home.dom.setAttribute('aria-label', '${EDITOR_NAME}');`],
  ["home.dom.setAttribute('title', 'SuperSplat');", `home.dom.setAttribute('title', '${EDITOR_NAME}');`],
]);
edit("src/ui/editor.ts", [["text: 'SUPERSPLAT '", "text: 'SPLATLINK EDITOR '"]]);
edit("src/doc.ts", [["description: 'SuperSplat document'", `description: '${EDITOR_NAME} document'`]]);

// 3. About box: SplatLink name, credit SuperSplat and PlayCanvas.
edit("src/ui/about-popup.ts", [
  ["text: 'SuperSplat'", `text: '${EDITOR_NAME}'`],
  ["text: `v${appVersion}`", "text: `based on SuperSplat v${appVersion} by PlayCanvas (MIT)`"],
]);

// 4. Logo: SplatLink logo; the logo does not leave the editor.
fs.copyFileSync(path.join(root, "editor/logo.svg"), path.join(src, "src/ui/svg/logo.svg"));
fs.copyFileSync(path.join(root, "src-tauri/icons/icon.png"), path.join(src, "src/ui/playcanvas-logo.png"));
fs.copyFileSync(path.join(root, "src-tauri/icons/128x128@2x.png"), path.join(src, "static/icons/logo-192.png"));
fs.copyFileSync(path.join(root, "src-tauri/icons/icon.png"), path.join(src, "static/icons/logo-512.png"));
edit("src/iframe-api.ts", [["    window.location.assign('https://superspl.at/');", "    // SplatLink: stay in the editor window."]]);

// 5. Remove Publish (it uploads to the PlayCanvas service) and point help to SplatLink.
edit("src/ui/menu.ts", [
  [`            {
                // separator
            },
            {
                text: () => i18n.t('menu.file.publish', { ellipsis: true }),
                icon: createSvg(scenePublish),
                isEnabled: () => !events.invoke('scene.empty'),
                onSelect: async () => await events.invoke('show.publishSettingsDialog')
            }
        ]);`, `        ]);`],
  ["window.open('https://forum.playcanvas.com', '_blank')", "window.open('https://whiterott.github.io/splatlink-help/', '_blank')"],
]);

// 6. Leave out the prebuilt gsaf decoder: its license is not confirmed.
fs.rmSync(path.join(src, "static/lib/gsaf"), { recursive: true, force: true });
fs.rmSync(path.join(src, "static/images"), { recursive: true, force: true });

console.log("Building");
run("npm", ["ci", "--no-audit", "--no-fund"], src);
run("npm", ["run", "build"], src, { BASE_HREF: "/editor/" });

console.log(`Copying to ${path.relative(root, target)}`);
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(path.join(src, "dist"), target, { recursive: true });
for (const leftover of ["manifest.json", "static/lib/gsaf", "static/images"]) {
  fs.rmSync(path.join(target, leftover), { recursive: true, force: true });
}
for (const file of fs.readdirSync(target)) {
  if (file.endsWith(".map")) fs.rmSync(path.join(target, file));
}
fs.writeFileSync(path.join(target, "editor-boot.js"), EDITOR_BOOT);
fs.copyFileSync(path.join(src, "LICENSE"), path.join(target, "LICENSE-SuperSplat.txt"));
fs.writeFileSync(path.join(target, "SOURCE.txt"), `${EDITOR_NAME}
Based on SuperSplat by PlayCanvas Ltd. (MIT License).
Source: ${SOURCE_REPO}
Commit: ${SOURCE_COMMIT}
Changes: see editor/PATCHES.md in the SplatLink repository.
Built by scripts/build-editor.mjs.
`);
fs.rmSync(work, { recursive: true, force: true });
console.log("Done");
