import { useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";

/**
 * CopyButton: copies `text` to the clipboard.
 *
 * The icon turns into a check and the label reads "Copied" for a moment, then
 * resets. If the clipboard is unavailable (insecure context, permission
 * denied) it reads "Failed" instead. Reduced motion swaps the icons without
 * the crossfade.
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 ring-inset transition-colors enabled:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      onClick={(e) => {
        copy(e);
        onClick?.(e);
      }}
      {...props}
    >
      {/* Both icons share one grid cell so they crossfade in place. */}
      <span aria-hidden="true" className="grid size-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`col-start-1 row-start-1 size-4 transition duration-200 motion-reduce:transition-none ${copied ? "scale-50 opacity-0" : ""}`}
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`col-start-1 row-start-1 size-4 text-emerald-400 transition duration-200 motion-reduce:transition-none ${copied ? "" : "scale-50 opacity-0"}`}
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span aria-live="polite">
        {copied ? "Copied" : state === "failed" ? "Failed" : children}
      </span>
    </button>
  );
}
