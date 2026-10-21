/* Adapted from "Animated Subscribe Button" by Magic UI, https://magicui.design/docs/components/animated-subscribe-button · MIT License · Copyright (c) Magic UI */
import { useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import "./SubscribeButton.css";

/**
 * SubscribeButton: a toggle. Click and "Subscribe" slides away while a checked
 * "Subscribed" drops in; click again to undo.
 *
 * The state is exposed as `aria-pressed` and reported through
 * `onChange(subscribed)` (not the native form `onChange`). Under reduced
 * motion the labels swap instantly.
 *
 * Copy SubscribeButton.css alongside this file and keep the import above.
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
      className={`btn-subscribe ${className}`.trim()}
      onClick={toggle}
      {...props}
    >
      <span aria-hidden={subscribed || undefined} className="btn-subscribe-idle">
        {children}
      </span>
      <span aria-hidden={!subscribed || undefined} className="btn-subscribe-done">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Subscribed
      </span>
    </button>
  );
}
