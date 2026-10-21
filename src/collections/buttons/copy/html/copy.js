// Copy: copies the button's `data-copy` text to the clipboard. The icon turns
// into a check and the label reads "Copied" for a moment, then resets. If the
// clipboard is unavailable (insecure context, permission denied) it reads
// "Failed" instead. Reduced motion swaps the icons without the crossfade.
const RESET_MS = 1500;

document.querySelectorAll(".btn-copy").forEach((button) => {
  const label = button.querySelector(".btn-copy-label");
  const idle = label.textContent;
  let timer;

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    let state = "copied";
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? "");
    } catch {
      state = "failed";
    }
    clearTimeout(timer);
    button.dataset.state = state;
    label.textContent = state === "copied" ? "Copied" : "Failed";
    timer = setTimeout(() => {
      delete button.dataset.state;
      label.textContent = idle;
    }, RESET_MS);
  });
});
