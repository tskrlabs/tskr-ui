import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "fill-sweep",
  title: "Fill sweep",
  description: "A violet gradient fills the pill from the left on hover and focus.",
  tech: "css",
  credit: {
    title: "stale-baboon-45",
    author: "Madflows",
    authorUrl: "https://uiverse.io/profile/Madflows",
    source: "https://uiverse.io/Madflows/stale-baboon-45",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["fill-sweep.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["fill-sweep.html", "fill-sweep.css"],
    },
  ],
};

export default meta;
