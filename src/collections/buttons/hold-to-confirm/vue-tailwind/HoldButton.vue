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
    class="relative inline-flex touch-none items-center justify-center overflow-hidden rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
      class="absolute inset-0 origin-left bg-red-800 transition-transform ease-linear"
      :class="holding ? 'scale-x-100' : 'scale-x-0'"
      :style="{ transitionDuration: holding ? `${HOLD_MS}ms` : '200ms' }"
    ></span>
    <span class="relative" aria-live="polite">
      <template v-if="done">Confirmed</template>
      <slot v-else>Hold to confirm</slot>
    </span>
  </button>
</template>
