# Adapted pieces: rebuilding MIT work, with the credit travelling in the code

We wanted more buttons than we could design from scratch, and good ones already
exist under the MIT licence: [Magic UI](https://magicui.design) and the
community library [Uiverse](https://uiverse.io) (MIT, one author per element).
CodePen public pens are MIT by default too. tskr/ui is itself MIT, so the
licences are compatible.

MIT asks one thing of a copy: *the copyright notice and permission notice shall
be included in all copies or substantial portions.* A copy-paste collection
makes every visitor a redistributor, so a credit buried on an About page isn't
enough: it has to travel with the code they paste.

We decided:

- **Adapt, don't vendor.** An adapted piece is rebuilt to our piece model
  ([[0018-collections-copy-paste-pieces-beside-snippets]]): zero dependencies
  (Magic UI's Motion-based effects are redone in CSS/JS), the [[Piece checklist]]
  (native `<button>`, focus ring, reduced motion, disabled, keyboard parity,
  `btn-<piece>` names, light + dark), and the usual variant cells. The credit
  says "adapted from", not "by".
- **Credit in three places.**
  1. *In every file of the piece*: one leading comment,
     `Adapted from "<original>" by <author> (<library>), <url> · MIT License · <copyright line>`,
     in the file's own comment syntax (`<!-- -->` for HTML/Vue, `/* */` for
     CSS/JS/TSX). It lives in the source file, so what the code view shows and
     what Copy all copies can't drift. React visitors of a markup-only piece get
     it converted to `{/* */}` along with `class` → `className`.
  2. *In the modal*: a line under the description linking the original, its
     author, and the licence.
  3. *On `/credits`*: every library used, the pieces adapted from it, and the
     library's **full** licence text, which the one-line comment points to.
- **Only clearly-licensed sources.** MIT (or equivalent) stated in the source's
  own LICENSE / licensing page. Excluded for now: Hover.css (v2.2+ is free only
  for personal/open-source use), and anything with a custom or unstated licence
  (Aceternity UI, blog posts, Animista).
- **`PieceMeta.credit`** carries the original's title, author (+ URL), source
  URL and library; `src/collections/libraries.ts` holds each library's name,
  copyright line and licence URL. Absent `credit` means the piece is original.
  The gallery gets an Original / Adapted filter beside CSS / JS (the ~15-piece
  threshold from ADR-0018 is reached in the same batch).

## Consequences

- Adding a source library means adding it to `libraries.ts` (and `LibraryId`)
  after checking its licence, not just linking it.
- Uiverse elements credit the element's author, with Uiverse's own copyright
  line on `/credits`.
- The one-line comment is the minimum that travels; the full permission notice
  lives on `/credits`. A stricter reading of MIT would put the whole notice in
  every file; we judged ~20 lines of licence per button too heavy and accepted
  the common copy-paste-library practice.
