import type { ButtonHTMLAttributes, FocusEvent, PointerEvent } from "react";
import "./SpotlightButton.css";

/**
 * SpotlightButton: a soft glow follows the cursor across the face.
 *
 * Mouse and pen only (touch has no hover). The position lives in
 * `--btn-spotlight-x/-y`; removing them falls back to the centre, which is
 * where the glow sits on keyboard focus and, with reduced motion, on hover too
 * (it just doesn't follow).
 *
 * Copy SpotlightButton.css alongside this file and keep the import above.
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
      className={`btn-spotlight ${className}`.trim()}
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
      <span aria-hidden="true" className="btn-spotlight-glow" />
      <span className="btn-spotlight-label">{children}</span>
    </button>
  );
}
