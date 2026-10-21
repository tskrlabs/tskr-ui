import type { ButtonHTMLAttributes, FocusEvent, PointerEvent } from "react";

/**
 * SpotlightButton: a soft glow follows the cursor across the face.
 *
 * Mouse and pen only (touch has no hover). The position lives in
 * `--btn-spotlight-x/-y`; removing them falls back to the centre, which is
 * where the glow sits on keyboard focus and, with reduced motion, on hover too
 * (it just doesn't follow).
 */
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function follow(e: PointerEvent<HTMLButtonElement>) {
  const button = e.currentTarget;
  if (e.pointerType === "touch" || button.disabled || reduced()) return;
  const rect = button.getBoundingClientRect();
  button.style.setProperty("--btn-spotlight-x", `${e.clientX - rect.left}px`);
  button.style.setProperty("--btn-spotlight-y", `${e.clientY - rect.top}px`);
}

// Re-centre for keyboard focus only; a click keeps the glow under the cursor.
function centre(e: FocusEvent<HTMLButtonElement>) {
  const button = e.currentTarget;
  if (!button.matches(":focus-visible")) return;
  button.style.removeProperty("--btn-spotlight-x");
  button.style.removeProperty("--btn-spotlight-y");
}

export default function SpotlightButton({
  children = "Spotlight",
  className = "",
  onPointerMove,
  onFocus,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 ring-inset [--btn-spotlight-x:50%] [--btn-spotlight-y:50%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      onPointerMove={(e) => {
        follow(e);
        onPointerMove?.(e);
      }}
      onFocus={(e) => {
        centre(e);
        onFocus?.(e);
      }}
      {...props}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_80px_at_var(--btn-spotlight-x)_var(--btn-spotlight-y),rgb(196_181_253/0.45),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-disabled:hidden" />
      <span className="relative">{children}</span>
    </button>
  );
}
