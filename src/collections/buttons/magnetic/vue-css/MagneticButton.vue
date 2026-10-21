<script setup lang="ts">
import { ref } from "vue";

/**
 * MagneticButton: leans toward the cursor while it hovers, then springs back.
 *
 * Mouse only (touch has no hover), skipped for reduced motion. The offset is
 * measured from the button's resting centre, so its own movement doesn't feed
 * back into the maths.
 */
const STRENGTH = 0.35; // share of the cursor's distance the button travels

const offset = ref({ x: 0, y: 0 });

function pull(e: PointerEvent) {
  const button = e.currentTarget as HTMLButtonElement;
  if (e.pointerType !== "mouse" || button.disabled) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2 - offset.value.x;
  const cy = rect.top + rect.height / 2 - offset.value.y;
  offset.value = { x: (e.clientX - cx) * STRENGTH, y: (e.clientY - cy) * STRENGTH };
}

function release() {
  offset.value = { x: 0, y: 0 };
}
</script>

<template>
  <button
    type="button"
    class="btn-magnetic"
    :style="{ transform: `translate(${offset.x}px, ${offset.y}px)` }"
    @pointermove="pull"
    @pointerleave="release"
  >
    <slot>Magnetic</slot>
  </button>
</template>

<style>
.btn-magnetic {
  --btn-bg: #10b981;
  --btn-bg-hover: #34d399;
  --btn-fg: #022c22;
  --btn-ring: #10b981;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 9999px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  cursor: pointer;
  transition:
    transform 300ms ease-out,
    background-color 150ms;
}

.btn-magnetic:hover:enabled {
  background: var(--btn-bg-hover);
}

.btn-magnetic:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-magnetic:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
