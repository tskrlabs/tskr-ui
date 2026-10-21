# Piece checklist

Every **piece** in a **collection** ([[0018-collections-copy-paste-pieces-beside-snippets]])
clears this list before it lands. It is the price of "pick it, paste it, it works."

## Element & semantics
- [ ] Native `<button type="button">` unless the piece is genuinely a link (then `<a>`). No clickable `<div>`.
- [ ] Label is real text content (or `aria-label` when icon-only).

## States
- [ ] Visible `:focus-visible` ring that reads on light **and** dark.
- [ ] `disabled` works: no effect plays, cursor + opacity say so, JS handlers bail out.
- [ ] Keyboard parity: anything the pointer can trigger, Space/Enter can (e.g. ripple from the centre on key activation; hold-to-confirm while the key is held).

## Motion
- [ ] `@media (prefers-reduced-motion: reduce)` removes the motion; the button stays fully usable and still gives feedback (a colour change is fine).

## Copy-paste hygiene
- [ ] Zero dependencies. Needs a library → it's a snippet, not a piece.
- [ ] Classes and keyframes namespaced `btn-<piece>` / `btn-<piece>-<thing>`.
- [ ] `css` cell opens with `--btn-*` custom properties for the colours a user would change, and doesn't rely on Tailwind's preflight (sets its own font, border, background, cursor).
- [ ] No site tokens (`bg-canvas`, `--color-accent`…): plain Tailwind palette / plain CSS only.

## Variants
- [ ] CSS piece: `tailwind` + `css` markup cells, nothing else. The `tailwind` cell may add one small `.css` only for what utilities can't express (e.g. `@keyframes`).
- [ ] CSS piece markup is JSX-safe apart from `class`/`for` (React visitors get it with `className`/`htmlFor` swapped in): no HTML comments, no inline `style="…"`, no unclosed void tags.
- [ ] JS piece: `vue-tailwind` (reference) + `vue-css` + `react-tailwind` + `react-css` + `html`, all behaving the same.

## Preview
- [ ] Reads on the light and the dark stage.
- [ ] Looks right at card size and at modal size.
