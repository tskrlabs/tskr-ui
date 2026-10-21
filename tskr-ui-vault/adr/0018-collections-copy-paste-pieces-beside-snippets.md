# Collections: a gallery of copy-paste pieces beside snippets

We wanted "a lot of buttons." Run through the snippet model, every button would
be a full snippet: a `meta.ts` with props, a detail page with Preview →
Prerequisites → Source → Usage → API, a playground, five variant cells
([[0006-effect-port-matrix-and-nuxt-next-exemption]]). That is the wrong shape for
what a button *is* to the person copying it: a small, finished piece of markup
they pick by eye, paste, and restyle themselves. There is nothing to configure,
so there is no API table to read and no Usage to generate; a detail page per
button would be twenty near-empty pages, and twenty sidebar links.

We also rejected the obvious shortcut of a base `Button` with `variant` / `size`
props: every UI kit already ships one, and those props are exactly the mode
toggles [[0013-single-purpose-snippets-static-vs-animated]] forbids. The value
is in **effect buttons**: one distinctive interaction per piece (shine sweep,
pushable 3D, ripple, hold-to-confirm…).

We decided to add a second unit beside the snippet:

- **A Collection is one gallery page of pieces.** `/collections/<name>` (the
  first is `/collections/buttons`). It is not a category: a category groups
  snippets that each have a detail page; a collection *is* the page. The sidebar
  gains a `COLLECTIONS` group above the category groups; the home index lists
  one line per collection, not per piece.
- **A Piece is the unit you copy from a collection.** No props, no playground,
  no API table, no Usage. It lives at `src/collections/<collection>/<piece>/`
  with a small `meta.ts` (`PieceMeta`: title, one-line description, `tech`, its
  variants and their files) and is discovered by glob, like snippets. It does
  **not** reuse `SnippetMeta`, which would drag props/usage/kind along unused.
- **The variant matrix follows the code, not symmetry** (extending
  [[0006-effect-port-matrix-and-nuxt-next-exemption]]). A **CSS piece** (pure
  markup + CSS) ships two cells, `tailwind` and `css`, as plain markup: a Vue or
  React wrapper around a `<button>` would differ from the markup only in syntax.
  A `tailwind` cell may carry one small `.css` file for what utilities can't
  express (e.g. the `@keyframes` behind Border beam's `offset-path` travel).
  A **JS piece** (behaviour: pointer math, timers, state) ships the full five:
  `vue-tailwind` (reference), `vue-css`, `react-tailwind`, `react-css`, `html`.
- **Zero dependencies.** A piece that needs a library (gsap, a confetti lib) is
  not a piece; it becomes a normal snippet with its own detail page and
  **Prerequisites** ([[0012-prerequisites-not-install]]).
- **Restyling is the user's job, so make the edit points obvious.** The `css`
  cell opens with a handful of `--btn-*` custom properties; Tailwind cells use
  ordinary palette classes. Class names and keyframes are namespaced per piece
  (`btn-shine`, `btn-shine-sweep`) so two pasted pieces never collide (the same
  reasoning as the `animated-gradient-text` rename in
  [[0013-single-purpose-snippets-static-vs-animated]]).
- **No-drift holds for previews** ([[0004-single-source-snippet-structure]],
  [[0005-two-tier-pages-preview-renders-reference]]). A CSS piece's reference is
  its `tailwind` cell, and the gallery renders *those exact files* as HTML (the
  markup plus any CSS in a `<style>`, the same bundle Copy all produces);
  Tailwind v4's source scan picks its classes up. A JS piece's reference is `vue-tailwind`, mounted live. Previews follow the
  site theme ([[0016-os-default-light-mode-accent-safe-token-split]]), so every
  piece must read on both light and dark.
- **Copy flow: one page picker, a modal per piece.** The page reuses the global
  **Variant preference** (framework + styling) from the snippet pages. A card shows
  only the live preview, a CSS/JS tag, the title and an explicit **Code**
  button (the description lives in the modal). Opening a piece shows a native `<dialog>` with a large preview, the picker, and the
  selected variant's files as stacked code blocks, each with its own Copy, plus
  Copy all; a corner icon on the card copies the all-in-one version (CSS in
  `<style>`, JS in `<script>`) without opening anything. Opening a piece sets
  `#<piece>`, so a piece is linkable and Back closes the modal.

## Consequences

- **Two units, two pages.** Snippets keep their detail pages; pieces never get
  one. A piece that grows props or a dependency is promoted to a snippet, not
  given a half-detail page.
- **"Collection" is now a technical term.** It previously named the whole
  library in [[CONTEXT]]; that entry was only ever a brand-level noun (no page,
  type, or route used it), so it is redefined. The tagline "a copy-paste
  collection of…" stays as plain prose.
- **Every piece clears the [[Piece checklist]]** (accessible `<button>` where
  possible, focus ring, reduced motion, disabled, keyboard parity, namespaced
  classes, light + dark) before it lands.
- **Sandboxes don't cover pieces yet.** [[0017-sandboxes-verify-the-ports-the-site-never-runs]]
  globs `src/snippets/**`; JS pieces' non-reference cells are, for now, verified
  by hand. Extending the glob to `src/collections/**` is the follow-up.
- **Filtering is deferred.** One alphabetical grid with a `CSS` / `JS` tag per
  card; filter chips once a collection passes ~15 pieces.
