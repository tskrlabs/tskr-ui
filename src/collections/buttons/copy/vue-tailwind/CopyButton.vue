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
    class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 ring-inset transition-colors enabled:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
    @click="copy"
  >
    <!-- Both icons share one grid cell so they crossfade in place. -->
    <span aria-hidden="true" class="grid size-4">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="col-start-1 row-start-1 size-4 transition duration-200 motion-reduce:transition-none"
        :class="state === 'copied' ? 'scale-50 opacity-0' : ''"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="col-start-1 row-start-1 size-4 text-emerald-400 transition duration-200 motion-reduce:transition-none"
        :class="state === 'copied' ? '' : 'scale-50 opacity-0'"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
    <span aria-live="polite">
      <template v-if="state === 'copied'">Copied</template>
      <template v-else-if="state === 'failed'">Failed</template>
      <slot v-else>Copy</slot>
    </span>
  </button>
</template>
