import type { ButtonHTMLAttributes, MouseEvent } from "react";

/**
 * RippleButton: a wave spreads from the click point.
 *
 * Keyboard activation has no pointer position, so the wave starts from the
 * centre. The wave is painted in `currentColor`, so it follows the text colour.
 */
function ripple(e: MouseEvent<HTMLButtonElement>) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const button = e.currentTarget;
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

export default function RippleButton({
  children = "Ripple",
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 ring-inset transition-colors enabled:hover:bg-zinc-800 enabled:active:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
