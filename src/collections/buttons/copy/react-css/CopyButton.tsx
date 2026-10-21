import { useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./CopyButton.css";

/**
 * CopyButton: copies `text` to the clipboard.
 *
 * The icon turns into a check and the label reads "Copied" for a moment, then
 * resets. If the clipboard is unavailable (insecure context, permission
 * denied) it reads "Failed" instead. Reduced motion swaps the icons without
 * the crossfade.
 *
 * Copy CopyButton.css alongside this file and keep the import above.
 */
const RESET_MS = 1500;

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export default function CopyButton({
  text = "npm create astro@latest",
  children = "Copy",
  className = "",
  onClick,
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copied = state === "copied";

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(e: MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget.disabled) return;
    let next: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = "failed";
    }
    clearTimeout(timer.current);
    setState(next);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }

  return (
    <button
      type="button"
      className={`btn-copy ${className}`.trim()}
      data-state={state === "idle" ? undefined : state}
      onClick={(e) => {
        copy(e);
        onClick?.(e);
      }}
      {...props}
    >
      <span className="btn-copy-icons" aria-hidden="true">
        <svg className="btn-copy-icon btn-copy-glyph" viewBox="0 0 24 24">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg className="btn-copy-icon btn-copy-check" viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="btn-copy-label" aria-live="polite">
        {copied ? "Copied" : state === "failed" ? "Failed" : children}
      </span>
    </button>
  );
}
