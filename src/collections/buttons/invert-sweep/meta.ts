import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "invert-sweep",
  title: "Invert sweep",
  description: "A shape sweeps across on hover and focus, inverting every colour it covers.",
  tech: "css",
  credit: {
    title: "tall-termite-79",
    author: "vinodjangid07",
    authorUrl: "https://uiverse.io/profile/vinodjangid07",
    source: "https://uiverse.io/vinodjangid07/tall-termite-79",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["invert-sweep.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["invert-sweep.html", "invert-sweep.css"],
    },
  ],
};

export default meta;
