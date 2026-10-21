import { useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";

/**
 * LoadingButton: shrinks into a spinner while the work runs.
 *
 * Pass the work as `action`, a function returning a promise. On click the
 * button morphs into a circle until it settles, then shows a check (resolved)
 * or a shaking cross (rejected) and morphs back. Without `action` it fakes a
 * 1.5s success. Under reduced motion it keeps its size and shows the status
 * as text. Clicks while it's busy are ignored, `onClick` included.
 */
const MORPH_MS = 300; // matches duration-300 on the button
const MIN_MS = 600; // so a fast response doesn't flash
const SHOW_MS = 1500;
const SHAKE = [0, -6, 6, -4, 4, 0].map((x) => `translateX(${x}px)`);
const STATUS = { idle: "", loading: "Loading…", success: "Done", error: "Failed" };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const tone = {
  idle: "bg-indigo-600 enabled:hover:bg-indigo-500",
  loading: "bg-indigo-600",
  success: "bg-emerald-600",
  error: "bg-red-600",
};

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
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-[width,border-radius,background-color] duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${tone[state]} ${className}`.trim()}
      aria-busy={state === "loading" || undefined}
      onClick={run}
      {...props}
    >
      {/* The label fades but stays in the DOM, so it keeps the button's name. */}
      <span
        className={`transition-opacity duration-150 motion-reduce:transition-none ${state !== "idle" ? "opacity-0 motion-reduce:absolute" : ""}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center motion-reduce:hidden"
      >
        {state !== "idle" && (
          <svg
            className={`size-5 ${state === "loading" ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {state === "loading" ? (
              <>
                <circle cx="12" cy="12" r="9" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" />
              </>
            ) : state === "success" ? (
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            ) : (
              <path d="M6 6l12 12M18 6L6 18" />
            )}
          </svg>
        )}
      </span>
      {/* Read by screen readers; under reduced motion it replaces the label. */}
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 motion-reduce:static motion-reduce:opacity-100"
        aria-live="polite"
      >
        {STATUS[state]}
      </span>
    </button>
  );
}
