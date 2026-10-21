// Hold to confirm: press and hold, for destructive actions. A fill tracks the
// hold; letting go early cancels. Works with the mouse, touch, and Space /
// Enter held down. When the hold completes the button dispatches a `confirm`
// event, so listen for that instead of `click`:
//   button.addEventListener("confirm", () => { … });
// The fill is progress feedback, not decoration, so it stays under reduced
// motion.
const HOLD_MS = 1200;
const isKey = (e) => e.key === " " || e.key === "Enter";

document.querySelectorAll(".btn-hold").forEach((button) => {
  const fill = button.querySelector(".btn-hold-fill");
  const label = button.querySelector(".btn-hold-label");
  const idle = label.textContent;
  let timer;
  let holding = false;
  let done = false;

  const setHolding = (on) => {
    holding = on;
    fill.toggleAttribute("data-holding", on);
    fill.style.transitionDuration = on ? `${HOLD_MS}ms` : "";
  };

  const start = () => {
    if (button.disabled || holding || done) return;
    setHolding(true);
    timer = setTimeout(() => {
      done = true;
      label.textContent = "Confirmed";
      button.dispatchEvent(new CustomEvent("confirm"));
      // Show "Confirmed" for a moment, then reset.
      timer = setTimeout(() => {
        done = false;
        label.textContent = idle;
        setHolding(false);
      }, 1500);
    }, HOLD_MS);
  };

  const cancel = () => {
    if (done) return;
    clearTimeout(timer);
    setHolding(false);
  };

  button.addEventListener("pointerdown", (e) => e.button === 0 && start());
  ["pointerup", "pointerleave", "pointercancel", "blur"].forEach((t) =>
    button.addEventListener(t, cancel),
  );
  button.addEventListener("keydown", (e) => {
    if (!isKey(e)) return;
    e.preventDefault();
    if (!e.repeat) start();
  });
  button.addEventListener("keyup", (e) => isKey(e) && cancel());
  button.addEventListener("contextmenu", (e) => e.preventDefault());
});
