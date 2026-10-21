// Magnetic: leans toward the cursor while it hovers, then springs back. Mouse
// only (touch has no hover), skipped for reduced motion. The offset is measured
// from the button's resting centre, so its own movement doesn't feed back into
// the maths.
const STRENGTH = 0.35; // share of the cursor's distance the button travels

document.querySelectorAll(".btn-magnetic").forEach((button) => {
  let x = 0;
  let y = 0;
  const move = (nx, ny) => {
    x = nx;
    y = ny;
    button.style.transform = `translate(${x}px, ${y}px)`;
  };

  button.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || button.disabled) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - x;
    const cy = rect.top + rect.height / 2 - y;
    move((e.clientX - cx) * STRENGTH, (e.clientY - cy) * STRENGTH);
  });
  button.addEventListener("pointerleave", () => move(0, 0));
});
