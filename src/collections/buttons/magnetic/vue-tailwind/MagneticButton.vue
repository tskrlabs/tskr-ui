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
    class="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition-[transform,background-color] duration-300 ease-out enabled:hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
    :style="{ transform: `translate(${offset.x}px, ${offset.y}px)` }"
    @pointermove="pull"
    @pointerleave="release"
  >
    <slot>Magnetic</slot>
  </button>
</template>
