<script setup lang="ts">
/**
 * RippleButton: a wave spreads from the click point.
 *
 * Keyboard activation has no pointer position, so the wave starts from the
 * centre. The wave is painted in `currentColor`, so it follows the text colour.
 */
function ripple(e: MouseEvent) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const button = e.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();
  const size = Math.hypot(rect.width, rect.height) * 2;
  // `detail` is 0 for keyboard clicks (Enter / Space).
  const x = e.detail ? e.clientX - rect.left : rect.width / 2;
  const y = e.detail ? e.clientY - rect.top : rect.height / 2;

  const wave = document.createElement("span");
  wave.setAttribute("aria-hidden", "true");
  Object.assign(wave.style, {
    position: "absolute",
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    background: "currentColor",
    pointerEvents: "none",
  });
  button.append(wave);
  wave.animate(
    [
      { transform: "scale(0)", opacity: 0.35 },
      { transform: "scale(1)", opacity: 0 },
    ],
    { duration: 600, easing: "ease-out" },
  ).onfinish = () => wave.remove();
}
</script>

<template>
  <button type="button" class="btn-ripple" @click="ripple">
    <slot>Ripple</slot>
  </button>
</template>

<style>
.btn-ripple {
  --btn-bg: #18181b;
  --btn-bg-hover: #27272a;
  --btn-bg-active: #3f3f46;
  --btn-fg: #ffffff;
  --btn-edge: rgb(255 255 255 / 0.15);
  --btn-ring: #a1a1aa;

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
  transition: background-color 150ms;
}

.btn-ripple:hover:enabled {
  background: var(--btn-bg-hover);
}

.btn-ripple:active:enabled {
  background: var(--btn-bg-active);
}

.btn-ripple:focus-visible {
  outline: 2px solid var(--btn-ring);
  outline-offset: 2px;
}

.btn-ripple:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
