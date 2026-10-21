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
  <button
    type="button"
    :aria-pressed="subscribed"
    class="group relative inline-grid overflow-hidden rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors enabled:hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
    @click="toggle"
  >
    <span
      :aria-hidden="subscribed || undefined"
      class="col-start-1 row-start-1 inline-flex items-center justify-center transition delay-100 duration-300 ease-out group-aria-pressed:translate-x-12 group-aria-pressed:opacity-0 group-aria-pressed:delay-0 group-aria-pressed:duration-100 group-aria-pressed:ease-in motion-reduce:transition-none"
    >
      <slot>Subscribe</slot>
    </span>
    <span
      :aria-hidden="!subscribed || undefined"
      class="col-start-1 row-start-1 inline-flex -translate-y-8 items-center justify-center gap-1.5 opacity-0 transition delay-0 duration-100 ease-in group-aria-pressed:translate-y-0 group-aria-pressed:opacity-100 group-aria-pressed:delay-100 group-aria-pressed:duration-300 group-aria-pressed:ease-out motion-reduce:transition-none"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="size-4 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Subscribed
    </span>
  </button>
</template>
