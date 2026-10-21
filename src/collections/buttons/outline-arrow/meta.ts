import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "outline-arrow",
  title: "Outline arrow",
  description: "An outlined button that fills on hover and focus while its arrow nudges forward.",
  tech: "css",
  credit: {
    title: "dull-snake-38",
    author: "reshades",
    authorUrl: "https://uiverse.io/profile/reshades",
    source: "https://uiverse.io/reshades/dull-snake-38",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["outline-arrow.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["outline-arrow.html", "outline-arrow.css"],
    },
  ],
};

export default meta;
