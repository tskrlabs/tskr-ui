<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

/**
 * CopyButton: copies `text` to the clipboard.
 *
 * The icon turns into a check and the label reads "Copied" for a moment, then
 * resets. If the clipboard is unavailable (insecure context, permission
 * denied) it reads "Failed" instead. Reduced motion swaps the icons without
 * the crossfade.
 */
const RESET_MS = 1500;

const props = withDefaults(defineProps<{ text?: string }>(), {
  text: "npm create astro@latest",
});
const state = ref<"idle" | "copied" | "failed">("idle");
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy(e: MouseEvent) {
  if ((e.currentTarget as HTMLButtonElement).disabled) return;
  let next: "copied" | "failed" = "copied";
  try {
    await navigator.clipboard.writeText(props.text);
  } catch {
    next = "failed";
  }
  clearTimeout(timer);
  state.value = next;
  timer = setTimeout(() => (state.value = "idle"), RESET_MS);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <button
    type="button"
    class="btn-copy"
    :data-state="state === 'idle' ? undefined : state"
    @click="copy"
  >
    <span class="btn-copy-icons" aria-hidden="true">
      <svg class="btn-copy-icon btn-copy-glyph" viewBox="0 0 24 24">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg class="btn-copy-icon btn-copy-check" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
    <span class="btn-copy-label" aria-live="polite">
      <template v-if="state === 'copied'">Copied</template>
      <template v-else-if="state === 'failed'">Failed</template>
      <slot v-else>Copy</slot>
    </span>
  </button>
</template>

<style>
.btn-copy {
  --btn-bg: #18181b;
  --btn-bg-hover: #27272a;
  --btn-fg: #ffffff;
  --btn-check: #34d399;
  --btn-edge: rgb(255 255 255 / 0.15);
  --btn-ring: #a1a1aa;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  transition: background-color 150ms;
}

.btn-copy:hover:enabled {
  background: var(--btn-bg-hover);
}

/* Both icons share one grid cell so they crossfade in place. */
.btn-copy-icons {
  display: grid;
  width: 1rem;
  height: 1rem;
}

.btn-copy-icon {
  grid-area: 1 / 1;
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    opacity 200ms,
    transform 200ms;
}

.btn-copy-check {
  color: var(--btn-check);
  opacity: 0;
  transform: scale(0.5);
}

.btn-copy[data-state="copied"] .btn-copy-glyph {
  opacity: 0;
  transform: scale(0.5);
}

.btn-copy[data-state="copied"] .btn-copy-check {
  opacity: 1;
  transform: none;
}

.btn-copy:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-copy:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .btn-copy-icon {
    transition: none;
  }
}
</style>
