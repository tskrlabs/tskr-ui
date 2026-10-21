// Loading morph: on click the button shrinks into a circle with a spinner while
// the work runs, then shows a check (success) or a shaking cross (failure) and
// morphs back. Give each button its work as a function returning a promise:
//   button.action = () => fetch("/api/save", { method: "POST" });
// A rejected promise counts as a failure. Without one it fakes a 1.5s success.
// Under reduced motion the button keeps its size and shows the status as text.
const MORPH_MS = 300; // matches the width transition in loading.css
const MIN_MS = 600; // so a fast response doesn't flash
const SHOW_MS = 1500;
const SHAKE = [0, -6, 6, -4, 4, 0].map((x) => `translateX(${x}px)`);
const STATUS = { loading: "Loading…", success: "Done", error: "Failed" };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

document.querySelectorAll(".btn-loading").forEach((button) => {
  const status = button.querySelector(".btn-loading-status");
  let busy = false;

  const setState = (state) => {
    button.dataset.state = state;
    status.textContent = STATUS[state] ?? "";
    if (state === "loading") button.setAttribute("aria-busy", "true");
    else button.removeAttribute("aria-busy");
  };

  button.addEventListener("click", async () => {
    if (button.disabled || busy) return;
    busy = true;
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
      .then(() => (button.action ? button.action() : wait(1500)))
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
    busy = false;
  });
});
