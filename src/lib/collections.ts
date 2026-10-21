/*
 * Collection registry (ADR-0018) — discovers every collection, its pieces, and
 * every piece variant's raw files at build time. The on-disk folders are the
 * source of truth: `src/collections/<collection>/<piece>/<variant>/<file>`.
 * The raw strings are what the gallery both shows as code and (for a CSS
 * piece's reference) renders as the preview, so the two can't drift.
 */
import type { CollectionMeta, PieceMeta } from "../collections/types";

const collectionModules = import.meta.glob<{ default: CollectionMeta }>(
  "../collections/*/collection.ts",
  { eager: true },
);
const pieceModules = import.meta.glob<{ default: PieceMeta }>(
  "../collections/*/*/meta.ts",
  { eager: true },
);
const rawFiles = import.meta.glob<string>("../collections/*/*/*/*", {
  query: "?raw",
  import: "default",
  eager: true,
});

const LANG: Record<string, string> = {
  vue: "vue",
  tsx: "tsx",
  jsx: "jsx",
  html: "html",
  css: "css",
  js: "js",
};
const langOf = (filename: string) => LANG[filename.split(".").pop() ?? ""] ?? "txt";

export interface PieceFile {
  filename: string;
  lang: string;
  source: string;
}

export interface PieceEntry {
  meta: PieceMeta;
  /** Variant id → its files, entry first. */
  files: Record<string, PieceFile[]>;
}

export interface Collection {
  meta: CollectionMeta;
  /** Alphabetical by title. */
  pieces: PieceEntry[];
}

/** `../collections/<collection>/…` → `<collection>` */
const segment = (path: string, i: number) => path.split("/")[2 + i];

export const allCollections: Collection[] = Object.entries(collectionModules)
  .map(([path, m]) => {
    const name = segment(path, 0);
    const pieces = Object.entries(pieceModules)
      .filter(([p]) => segment(p, 0) === name)
      .map(([p, pm]): PieceEntry => {
        const meta = pm.default;
        const dir = `../collections/${name}/${segment(p, 1)}`;
        const files: Record<string, PieceFile[]> = {};
        for (const v of meta.variants) {
          files[v.id] = v.files.map((filename) => ({
            filename,
            lang: langOf(filename),
            source: rawFiles[`${dir}/${v.id}/${filename}`] ?? "",
          }));
        }
        return { meta, files };
      })
      .sort((a, b) => a.meta.title.localeCompare(b.meta.title));
    return { meta: m.default, pieces };
  })
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

export const collectionHref = (c: Collection) => `/collections/${c.meta.name}`;
