/**
 * Shared shapes for collections and their pieces (ADR-0018).
 *
 * A collection is one gallery page; a piece is the unit copied from it. Pieces
 * have no props, playground, usage or API table, so this is deliberately a much
 * smaller model than `SnippetMeta`.
 */
import type { Styling } from "../snippets/types";

/** `collection.ts` at `src/collections/<name>/`. */
export interface CollectionMeta {
  /** Slug; matches the collection's folder name and its URL. */
  name: string;
  title: string;
  description: string;
}

/**
 * `css`: pure markup + CSS, ships `tailwind` + `css` markup cells.
 * `js`: has behaviour, ships the full five-cell matrix.
 */
export type PieceTech = "css" | "js";

export interface PieceVariant {
  /** Stable id; also the variant's folder name (e.g. "tailwind", "react-css"). */
  id: string;
  /** `markup` = plain markup that pastes into any framework (CSS pieces). */
  framework: "markup" | "vue" | "react" | "html";
  styling?: Styling;
  /** Files the variant ships, entry first, relative to the variant folder. */
  files: string[];
  /** The reference: `tailwind` for CSS pieces, `vue-tailwind` for JS pieces. */
  reference?: boolean;
}

/** `meta.ts` at `src/collections/<collection>/<piece>/`. */
export interface PieceMeta {
  /** Slug; matches the piece's folder name and its `#hash` on the gallery. */
  name: string;
  title: string;
  /** One line, shown on the card and in the modal. */
  description: string;
  tech: PieceTech;
  variants: PieceVariant[];
}
