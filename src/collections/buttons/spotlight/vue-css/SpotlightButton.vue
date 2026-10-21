<script setup lang="ts">
/**
 * SpotlightButton: a soft glow follows the cursor across the face.
 *
 * Mouse and pen only (touch has no hover). The position lives in
 * `--btn-spotlight-x/-y`; removing them falls back to the centre, which is
 * where the glow sits on keyboard focus and, with reduced motion, on hover too
 * (it just doesn't follow).
 */
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function follow(e: PointerEvent) {
  const button = e.currentTarget as HTMLButtonElement;
  if (e.pointerType === "touch" || button.disabled || reduced()) return;
  const rect = button.getBoundingClientRect();
  button.style.setProperty("--btn-spotlight-x", `${e.clientX - rect.left}px`);
  button.style.setProperty("--btn-spotlight-y", `${e.clientY - rect.top}px`);
}

// Re-centre for keyboard focus only; a click keeps the glow under the cursor.
function centre(e: FocusEvent) {
  const button = e.currentTarget as HTMLButtonElement;
  if (!button.matches(":focus-visible")) return;
  button.style.removeProperty("--btn-spotlight-x");
  button.style.removeProperty("--btn-spotlight-y");
}
</script>

<template>
  <button type="button" class="btn-spotlight" @pointermove="follow" @focus="centre">
    <span class="btn-spotlight-glow" aria-hidden="true"></span>
    <span class="btn-spotlight-label"><slot>Spotlight</slot></span>
  </button>
</template>

<style>
.btn-spotlight {
  --btn-bg: #09090b;
  --btn-fg: #ffffff;
  --btn-edge: rgb(255 255 255 / 0.15);
  --btn-glow: rgb(196 181 253 / 0.45);
  --btn-ring: #a78bfa;
  /* Moved by the script; the centre is the keyboard / reduced-motion spot. */
  --btn-spotlight-x: 50%;
  --btn-spotlight-y: 50%;

  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 1px var(--btn-edge);
  background: var(--btn-bg);
  color: var(--btn-fg);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  cursor: pointer;
}

.btn-spotlight-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 80px at var(--btn-spotlight-x) var(--btn-spotlight-y),
    var(--btn-glow),
    transparent
  );
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;
}

@media (hover: hover) {
  .btn-spotlight:hover:enabled .btn-spotlight-glow {
    opacity: 1;
  }
}

.btn-spotlight:focus-visible .btn-spotlight-glow {
  opacity: 1;
}

.btn-spotlight-label {
  position: relative;
}

.btn-spotlight:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-spotlight:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
