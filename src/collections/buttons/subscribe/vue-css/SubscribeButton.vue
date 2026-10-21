<!-- Adapted from "Animated Subscribe Button" by Magic UI, https://magicui.design/docs/components/animated-subscribe-button · MIT License · Copyright (c) Magic UI -->
<script setup lang="ts">
import { ref } from "vue";

/**
 * SubscribeButton: a toggle. Click and "Subscribe" slides away while a checked
 * "Subscribed" drops in; click again to undo.
 *
 * The state is exposed as `aria-pressed` and reported through
 * `@change="(subscribed) => …"`. Under reduced motion the labels swap
 * instantly.
 */
const emit = defineEmits<{ change: [subscribed: boolean] }>();
const subscribed = ref(false);

function toggle(e: MouseEvent) {
  if ((e.currentTarget as HTMLButtonElement).disabled) return;
  subscribed.value = !subscribed.value;
  emit("change", subscribed.value);
}
</script>

<template>
  <button type="button" :aria-pressed="subscribed" class="btn-subscribe" @click="toggle">
    <span :aria-hidden="subscribed || undefined" class="btn-subscribe-idle">
      <slot>Subscribe</slot>
    </span>
    <span :aria-hidden="!subscribed || undefined" class="btn-subscribe-done">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Subscribed
    </span>
  </button>
</template>

<style>
.btn-subscribe {
  --btn-bg: #e11d48;
  --btn-bg-hover: #f43f5e;
  --btn-fg: #ffffff;
  --btn-ring: #f43f5e;

  position: relative;
  overflow: hidden;
  display: inline-grid;
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
  transition: background-color 150ms;
}

/* Both labels share one grid cell, so the button is as wide as the longer one
   and doesn't jump. Whichever label leaves goes quickly (100ms); the one
   arriving waits for it, then takes 300ms. */
.btn-subscribe-idle,
.btn-subscribe-done {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition:
    transform 300ms ease-out 100ms,
    opacity 300ms ease-out 100ms;
}

.btn-subscribe-done,
.btn-subscribe[aria-pressed="true"] .btn-subscribe-idle {
  opacity: 0;
  transition-duration: 100ms;
  transition-delay: 0ms;
  transition-timing-function: ease-in;
}

.btn-subscribe-done {
  transform: translateY(-2rem);
}

.btn-subscribe[aria-pressed="true"] .btn-subscribe-idle {
  transform: translateX(3rem);
}

.btn-subscribe[aria-pressed="true"] .btn-subscribe-done {
  opacity: 1;
  transform: none;
  transition-duration: 300ms;
  transition-delay: 100ms;
  transition-timing-function: ease-out;
}

.btn-subscribe-done svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn-subscribe:hover:enabled {
  background: var(--btn-bg-hover);
}

.btn-subscribe:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-subscribe:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* The labels swap instantly. */
@media (prefers-reduced-motion: reduce) {
  .btn-subscribe-idle,
  .btn-subscribe-done {
    transition: none;
  }
}
</style>
