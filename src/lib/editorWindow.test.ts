// Added by WhiteRott for SplatLink (2026). See MODIFICATIONS.md.
import { describe, expect, it } from "vitest";
import { editorUrl, fileNameOf } from "./editorWindow";

describe("editor window", () => {
  it("builds an editor address that loads one file", () => {
    const url = new URL(editorUrl("http://asset.localhost/C%3A%2Fsplats%2Ffinal.ply?previewSession=1", "final.ply"), "http://localhost");
    expect(url.pathname).toBe("/editor/index.html");
    // Same steps as the editor: URL parsing, then decodeURIComponent.
    expect(url.searchParams.getAll("load").map(decodeURIComponent)).toEqual(["http://asset.localhost/C%3A%2Fsplats%2Ffinal.ply?previewSession=1"]);
    expect(decodeURIComponent(url.searchParams.get("filename")!)).toBe("final.ply");
  });

  it("finds the file name for Windows and Linux paths", () => {
    expect(fileNameOf("C:\\Users\\Gene\\Documents\\SplatLink\\cup\\final.ply")).toBe("final.ply");
    expect(fileNameOf("/home/rgs/Documents/SplatLink/cup/final.ply")).toBe("final.ply");
    expect(fileNameOf("")).toBe("splat.ply");
  });
});
