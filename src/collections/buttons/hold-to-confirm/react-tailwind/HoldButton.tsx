import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";

/**
 * HoldButton: press and hold to confirm, for destructive actions.
 *
 * A fill tracks the hold; letting go early cancels. Works with the mouse,
 * touch, and Space / Enter held down. Use `onConfirm`, not `onClick`.
 * The fill is progress feedback, not decoration, so it stays under reduced
 * motion.
 */
const HOLD_MS = 1200;

interface HoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onConfirm?: () => void;
}

const isKey = (e: KeyboardEvent) => e.key === " " || e.key === "Enter";

export default function HoldButton({
  children = "Hold to confirm",
  className = "",
  onConfirm,
  ...props
}: HoldButtonProps) {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function start(e: SyntheticEvent<HTMLButtonElement>) {
    if (e.currentTarget.disabled || holding || done) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setDone(true);
      onConfirm?.();
      // Show "Confirmed" for a moment, then reset.
      timer.current = setTimeout(() => {
        setDone(false);
        setHolding(false);
      }, 1500);
    }, HOLD_MS);
  }

  function cancel() {
    if (done) return;
    clearTimeout(timer.current);
    setHolding(false);
  }

  return (
    <button
      type="button"
      className={`relative inline-flex touch-none items-center justify-center overflow-hidden rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      onPointerDown={(e) => e.button === 0 && start(e)}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if (!isKey(e)) return;
        e.preventDefault();
        if (!e.repeat) start(e);
      }}
      onKeyUp={(e) => isKey(e) && cancel()}
      onBlur={cancel}
      onContextMenu={(e) => e.preventDefault()}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left bg-red-800 transition-transform ease-linear ${holding ? "scale-x-100" : "scale-x-0"}`}
        style={{ transitionDuration: holding ? `${HOLD_MS}ms` : "200ms" }}
      />
      <span className="relative" aria-live="polite">
        {done ? "Confirmed" : children}
      </span>
    </button>
  );
}
