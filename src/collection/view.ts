/*
 * Collection gallery (ADR-0018). Pure assembly of what a piece shows and copies
 * for the visitor's variant preference: the resolved variant, its files as code
 * blocks, and the "copy all" bundle. Docs-only; never copied.
 */
import type { PieceMeta, PieceVariant } from "../collections/types";
import type { PieceEntry, PieceFile } from "../lib/collections";
import type { VariantPref } from "../detail/usage";

export interface PieceView {
  variant: PieceVariant;
  files: PieceFile[];
  /** Everything in one paste: see `bundle`. */
  all: string;
  /** Set when the preferred variant doesn't exist and we fell back. */
  note: string | null;
}

const FW_LABEL: Record<string, string> = { vue: "Vue", react: "React", html: "HTML" };
const ST_LABEL: Record<string, string> = { tailwind: "Tailwind", css: "CSS" };

/** CSS pieces: pick by styling only. JS pieces: framework + styling, like snippets. */
function resolve(meta: PieceMeta, pref: VariantPref): { variant: PieceVariant; fellBack: boolean } {
  const ref = meta.variants.find((v) => v.reference) ?? meta.variants[0];
  if (meta.tech === "css") {
    const v = meta.variants.find((x) => x.styling === pref.styling);
    return { variant: v ?? ref, fellBack: !v };
  }
  const exact = meta.variants.find(
    (v) =>
      v.framework === pref.framework &&
      (pref.framework === "html" || v.styling === pref.styling),
  );
  if (exact) return { variant: exact, fellBack: false };
  const sameFw = meta.variants.find((v) => v.framework === pref.framework);
  return { variant: sameFw ?? ref, fellBack: true };
}

/**
 * A CSS piece's markup pasted into JSX needs `className`/`htmlFor`, and its
 * credit comment (ADR-0019) as a JSX comment. Derived from the one markup file
 * rather than kept as a second copy that could drift.
 */
function toJsx(f: PieceFile): PieceFile {
  return {
    filename: f.filename.replace(/\.html$/, ".jsx"),
    lang: "jsx",
    source: f.source
      .replace(/<!--\s*([\s\S]*?)\s*-->/g, "{/* $1 */}")
      .replace(/\bclass=/g, "className=")
      .replace(/\bfor=/g, "htmlFor="),
  };
}

const header = (f: PieceFile) =>
  f.lang === "html" || f.lang === "vue" ? `<!-- ${f.filename} -->` : `/* ${f.filename} */`;

/**
 * Plain HTML/CSS/JS files merge into one paste-anywhere fragment (CSS in
 * `<style>`, JS in `<script>`). Anything with a component file is joined with a
 * filename comment per file, since those files live apart in a project.
 */
export function bundle(files: PieceFile[]): string {
  if (files.length === 1) return files[0].source;
  if (files.every((f) => ["html", "css", "js"].includes(f.lang))) {
    const out: string[] = [];
    for (const f of files.filter((f) => f.lang === "css"))
      out.push(`<style>\n${f.source.trimEnd()}\n</style>`);
    for (const f of files.filter((f) => f.lang === "html")) out.push(f.source.trimEnd());
    for (const f of files.filter((f) => f.lang === "js"))
      out.push(`<script>\n${f.source.trimEnd()}\n</script>`);
    return out.join("\n\n") + "\n";
  }
  return files.map((f) => `${header(f)}\n${f.source.trimEnd()}`).join("\n\n") + "\n";
}

export function buildPieceView(piece: PieceEntry, pref: VariantPref): PieceView {
  const { variant, fellBack } = resolve(piece.meta, pref);
  let files = piece.files[variant.id] ?? [];
  if (piece.meta.tech === "css" && pref.framework === "react") {
    files = files.map((f) => (f.lang === "html" ? toJsx(f) : f));
  }
  const note = fellBack
    ? `no ${FW_LABEL[pref.framework]} + ${ST_LABEL[pref.styling]} variant, showing the reference`
    : null;
  return { variant, files, all: bundle(files), note };
}

/**
 * What a CSS piece's preview renders (no-drift): its reference files bundled
 * exactly as Copy all would (markup, plus any CSS such as keyframes Tailwind
 * can't express, in a <style>).
 */
export function referencePreview(piece: PieceEntry): string {
  const ref = piece.meta.variants.find((v) => v.reference) ?? piece.meta.variants[0];
  return bundle(piece.files[ref.id] ?? []);
}
