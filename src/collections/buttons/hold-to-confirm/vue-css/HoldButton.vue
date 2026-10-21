<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

/**
 * HoldButton: press and hold to confirm, for destructive actions.
 *
 * A fill tracks the hold; letting go early cancels. Works with the mouse,
 * touch, and Space / Enter held down. Listen for `@confirm`, not `@click`.
 * The fill is progress feedback, not decoration, so it stays under reduced
 * motion.
 */
const HOLD_MS = 1200;

const emit = defineEmits<{ confirm: [] }>();
const holding = ref(false);
const done = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function start(e: Event) {
  if ((e.currentTarget as HTMLButtonElement).disabled) return;
  if (holding.value || done.value) return;
  holding.value = true;
  timer = setTimeout(() => {
    done.value = true;
    emit("confirm");
    // Show "Confirmed" for a moment, then reset.
    timer = setTimeout(() => {
      done.value = false;
      holding.value = false;
    }, 1500);
  }, HOLD_MS);
}

function cancel() {
  if (done.value) return;
  clearTimeout(timer);
  holding.value = false;
}

const isKey = (e: KeyboardEvent) => e.key === " " || e.key === "Enter";

function onKeydown(e: KeyboardEvent) {
  if (!isKey(e)) return;
  e.preventDefault();
  if (!e.repeat) start(e);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <button
    type="button"
    class="btn-hold"
    @pointerdown="(e) => e.button === 0 && start(e)"
    @pointerup="cancel"
    @pointerleave="cancel"
    @pointercancel="cancel"
    @keydown="onKeydown"
    @keyup="(e) => isKey(e) && cancel()"
    @blur="cancel"
    @contextmenu.prevent
  >
    <span
      aria-hidden="true"
      class="btn-hold-fill"
      :data-holding="holding || undefined"
      :style="{ transitionDuration: holding ? `${HOLD_MS}ms` : undefined }"
    ></span>
    <span class="btn-hold-label" aria-live="polite">
      <template v-if="done">Confirmed</template>
      <slot v-else>Hold to confirm</slot>
    </span>
  </button>
</template>

<style>
.btn-hold {
  --btn-bg: #dc2626;
  --btn-fill: #991b1b;
  --btn-fg: #ffffff;
  --btn-ring: #ef4444;

  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--btn-bg);
  color: var(--btn-fg);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Duration is set inline from HOLD_MS while holding; 200ms is the let-go. */
.btn-hold-fill {
  position: absolute;
  inset: 0;
  background: var(--btn-fill);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms linear;
}

.btn-hold-fill[data-holding] {
  transform: scaleX(1);
}

.btn-hold-label {
  position: relative;
}

.btn-hold:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-hold:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
