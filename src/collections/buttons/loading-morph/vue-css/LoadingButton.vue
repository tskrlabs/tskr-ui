<script setup lang="ts">
import { computed, ref } from "vue";

/**
 * LoadingButton: shrinks into a spinner while the work runs.
 *
 * Pass the work as `action`, a function returning a promise. On click the
 * button morphs into a circle until it settles, then shows a check (resolved)
 * or a shaking cross (rejected) and morphs back. Without `action` it fakes a
 * 1.5s success. Under reduced motion it keeps its size and shows the status
 * as text.
 */
const MORPH_MS = 300; // matches the width transition below
const MIN_MS = 600; // so a fast response doesn't flash
const SHOW_MS = 1500;
const SHAKE = [0, -6, 6, -4, 4, 0].map((x) => `translateX(${x}px)`);
const STATUS = { idle: "", loading: "Loading…", success: "Done", error: "Failed" };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const props = defineProps<{ action?: () => Promise<unknown> }>();
const state = ref<keyof typeof STATUS>("idle");
const status = computed(() => STATUS[state.value]);
let busy = false;

async function onClick(e: MouseEvent) {
  const button = e.currentTarget as HTMLButtonElement;
  if (button.disabled || busy) return;
  busy = true;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const width = button.offsetWidth;
  const circle = button.offsetHeight;
  if (!still) {
    // Pin the measured width so it can transition down to the height. The
    // side padding goes too, or it would stop the width short of a circle.
    button.style.width = `${width}px`;
    void button.offsetWidth;
    button.style.paddingInline = "0";
    button.style.width = `${circle}px`;
    button.style.borderRadius = `${circle / 2}px`;
  }
  state.value = "loading";

  const work = Promise.resolve()
    .then(() => (props.action ? props.action() : wait(1500)))
    .then(
      () => true,
      () => false,
    );
  const [ok] = await Promise.all([work, wait(MIN_MS)]);
  state.value = ok ? "success" : "error";
  if (!ok && !still) {
    button.animate({ transform: SHAKE }, { duration: 400, easing: "ease-in-out" });
  }

  await wait(SHOW_MS);
  state.value = "idle";
  if (!still) {
    button.style.width = `${width}px`;
    button.style.borderRadius = "";
    await wait(MORPH_MS);
    button.style.width = "";
    button.style.paddingInline = "";
  }
  busy = false;
}
</script>

<template>
  <button
    type="button"
    class="btn-loading"
    :data-state="state"
    :aria-busy="state === 'loading' || undefined"
    @click="onClick"
  >
    <span class="btn-loading-label"><slot>Save changes</slot></span>
    <span class="btn-loading-icon" aria-hidden="true">
      <svg class="btn-loading-spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" />
      </svg>
      <svg class="btn-loading-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      <svg class="btn-loading-cross" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </span>
    <span class="btn-loading-status" aria-live="polite">{{ status }}</span>
  </button>
</template>

<style>
.btn-loading {
  --btn-bg: #4f46e5;
  --btn-bg-hover: #6366f1;
  --btn-success: #059669;
  --btn-error: #dc2626;
  --btn-fg: #ffffff;
  --btn-ring: #6366f1;

  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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
  white-space: nowrap;
  cursor: pointer;
  transition:
    width 300ms ease-in-out,
    border-radius 300ms ease-in-out,
    background-color 300ms;
}

.btn-loading[data-state="idle"]:hover:enabled {
  background: var(--btn-bg-hover);
}

.btn-loading[data-state="success"] {
  background: var(--btn-success);
}

.btn-loading[data-state="error"] {
  background: var(--btn-error);
}

.btn-loading-label {
  transition: opacity 150ms;
}

/* The label fades but stays in the DOM, so it keeps the button's name. */
.btn-loading:not([data-state="idle"]) .btn-loading-label {
  opacity: 0;
}

.btn-loading-icon,
.btn-loading-status {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-loading-icon svg {
  display: none;
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn-loading[data-state="loading"] .btn-loading-spinner,
.btn-loading[data-state="success"] .btn-loading-check,
.btn-loading[data-state="error"] .btn-loading-cross {
  display: block;
}

.btn-loading-spinner {
  animation: btn-loading-spin 800ms linear infinite;
}

@keyframes btn-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Read by screen readers; shown in place of the icons under reduced motion. */
.btn-loading-status {
  opacity: 0;
}

.btn-loading:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-loading:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (prefers-reduced-motion: reduce) {
  .btn-loading,
  .btn-loading-label {
    transition: none;
  }

  .btn-loading-icon {
    display: none;
  }

  /* The status text takes the label's place in the flow, so it always fits. */
  .btn-loading-status {
    position: static;
    opacity: 1;
  }

  .btn-loading:not([data-state="idle"]) .btn-loading-label {
    position: absolute;
  }
}
</style>
