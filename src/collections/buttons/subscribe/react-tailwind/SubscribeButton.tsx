/* Adapted from "Animated Subscribe Button" by Magic UI, https://magicui.design/docs/components/animated-subscribe-button · MIT License · Copyright (c) Magic UI */
import { useState, type ButtonHTMLAttributes, type MouseEvent } from "react";

/**
 * SubscribeButton: a toggle. Click and "Subscribe" slides away while a checked
 * "Subscribed" drops in; click again to undo.
 *
 * The state is exposed as `aria-pressed` and reported through
 * `onChange(subscribed)` (not the native form `onChange`). Under reduced
 * motion the labels swap instantly.
 */
interface SubscribeButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  onChange?: (subscribed: boolean) => void;
}

export default function SubscribeButton({
  children = "Subscribe",
  className = "",
  onChange,
  onClick,
  ...props
}: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(false);

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    if (e.currentTarget.disabled) return;
    const next = !subscribed;
    setSubscribed(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      aria-pressed={subscribed}
      className={`group relative inline-grid overflow-hidden rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors enabled:hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      onClick={toggle}
      {...props}
    >
      <span
        aria-hidden={subscribed || undefined}
        className="col-start-1 row-start-1 inline-flex items-center justify-center transition delay-100 duration-300 ease-out group-aria-pressed:translate-x-12 group-aria-pressed:opacity-0 group-aria-pressed:delay-0 group-aria-pressed:duration-100 group-aria-pressed:ease-in motion-reduce:transition-none"
      >
        {children}
      </span>
      <span
        aria-hidden={!subscribed || undefined}
        className="col-start-1 row-start-1 inline-flex -translate-y-8 items-center justify-center gap-1.5 opacity-0 transition delay-0 duration-100 ease-in group-aria-pressed:translate-y-0 group-aria-pressed:opacity-100 group-aria-pressed:delay-100 group-aria-pressed:duration-300 group-aria-pressed:ease-out motion-reduce:transition-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Subscribed
      </span>
    </button>
  );
}
