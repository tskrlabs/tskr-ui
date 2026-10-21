import { useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import "./MagneticButton.css";

/**
 * MagneticButton: leans toward the cursor while it hovers, then springs back.
 *
 * Mouse only (touch has no hover), skipped for reduced motion. The offset is
 * measured from the button's resting centre, so its own movement doesn't feed
 * back into the maths.
 *
 * Copy MagneticButton.css alongside this file and keep the import above.
 */

const STRENGTH = 0.35; // share of the cursor's distance the button travels

export default function MagneticButton({
  children = "Magnetic",
  className = "",
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function pull(e: PointerEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    if (e.pointerType !== "mouse" || button.disabled) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - offset.x;
    const cy = rect.top + rect.height / 2 - offset.y;
    setOffset({ x: (e.clientX - cx) * STRENGTH, y: (e.clientY - cy) * STRENGTH });
  }

  return (
    <button
      type="button"
      className={`btn-magnetic ${className}`.trim()}
      style={{ ...style, transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerMove={(e) => {
        pull(e);
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        setOffset({ x: 0, y: 0 });
        onPointerLeave?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
