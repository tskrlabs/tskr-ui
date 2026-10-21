// Spotlight: a soft glow follows the cursor across the face. Mouse and pen only
// (touch has no hover). The position lives in `--btn-spotlight-x/-y`; removing
// them falls back to the centre, which is where the glow sits on keyboard focus
// and, with reduced motion, on hover too (it just doesn't follow).
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".btn-spotlight").forEach((button) => {
  button.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || button.disabled || reduced()) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--btn-spotlight-x", `${e.clientX - rect.left}px`);
    button.style.setProperty("--btn-spotlight-y", `${e.clientY - rect.top}px`);
  });
  // Re-centre for keyboard focus only; a click keeps the glow under the cursor.
  button.addEventListener("focus", () => {
    if (!button.matches(":focus-visible")) return;
    button.style.removeProperty("--btn-spotlight-x");
    button.style.removeProperty("--btn-spotlight-y");
  });
});
