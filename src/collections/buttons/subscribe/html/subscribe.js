/* Adapted from "Animated Subscribe Button" by Magic UI, https://magicui.design/docs/components/animated-subscribe-button · MIT License · Copyright (c) Magic UI */
// Subscribe: a toggle. Click and "Subscribe" slides away while a checked
// "Subscribed" drops in; click again to undo. The state lives in
// `aria-pressed`, and every change dispatches a `change` event:
//   button.addEventListener("change", (e) => e.detail.subscribed);
// Under reduced motion the labels swap instantly.
const hide = (el, hidden) =>
  hidden ? el.setAttribute("aria-hidden", "true") : el.removeAttribute("aria-hidden");

document.querySelectorAll(".btn-subscribe").forEach((button) => {
  const idle = button.querySelector(".btn-subscribe-idle");
  const done = button.querySelector(".btn-subscribe-done");

  button.addEventListener("click", () => {
    if (button.disabled) return;
    const subscribed = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(subscribed));
    // Only the visible label names the button.
    hide(idle, subscribed);
    hide(done, !subscribed);
    button.dispatchEvent(new CustomEvent("change", { detail: { subscribed } }));
  });
});
