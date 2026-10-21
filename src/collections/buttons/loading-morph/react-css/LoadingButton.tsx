import { useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./LoadingButton.css";

/**
 * LoadingButton: shrinks into a spinner while the work runs.
 *
 * Pass the work as `action`, a function returning a promise. On click the
 * button morphs into a circle until it settles, then shows a check (resolved)
 * or a shaking cross (rejected) and morphs back. Without `action` it fakes a
 * 1.5s success. Under reduced motion it keeps its size and shows the status
 * as text. Clicks while it's busy are ignored, `onClick` included.
 *
 * Copy LoadingButton.css alongside this file and keep the import above.
 */
const MORPH_MS = 300; // matches the width transition in LoadingButton.css
const MIN_MS = 600; // so a fast response doesn't flash
const SHOW_MS = 1500;
const SHAKE = [0, -6, 6, -4, 4, 0].map((x) => `translateX(${x}px)`);
const STATUS = { idle: "", loading: "Loading…", success: "Done", error: "Failed" };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action?: () => Promise<unknown>;
}

export default function LoadingButton({
  children = "Save changes",
  className = "",
  action,
  onClick,
  ...props
}: LoadingButtonProps) {
  const [state, setState] = useState<keyof typeof STATUS>("idle");
  const busy = useRef(false);

  async function run(e: MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    if (button.disabled || busy.current) return;
    busy.current = true;
    onClick?.(e);
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
    setState("loading");

    const work = Promise.resolve()
      .then(() => (action ? action() : wait(1500)))
      .then(
        () => true,
        () => false,
      );
    const [ok] = await Promise.all([work, wait(MIN_MS)]);
    setState(ok ? "success" : "error");
    if (!ok && !still) {
      button.animate({ transform: SHAKE }, { duration: 400, easing: "ease-in-out" });
    }

    await wait(SHOW_MS);
    setState("idle");
    if (!still) {
      button.style.width = `${width}px`;
      button.style.borderRadius = "";
      await wait(MORPH_MS);
      button.style.width = "";
      button.style.paddingInline = "";
    }
    busy.current = false;
  }

  return (
    <button
      type="button"
      className={`btn-loading ${className}`.trim()}
      data-state={state}
      aria-busy={state === "loading" || undefined}
      onClick={run}
      {...props}
    >
      <span className="btn-loading-label">{children}</span>
      <span className="btn-loading-icon" aria-hidden="true">
        <svg className="btn-loading-spinner" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" />
        </svg>
        <svg className="btn-loading-check" viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <svg className="btn-loading-cross" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
      <span className="btn-loading-status" aria-live="polite">
        {STATUS[state]}
      </span>
    </button>
  );
}
