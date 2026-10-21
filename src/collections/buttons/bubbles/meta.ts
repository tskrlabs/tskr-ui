import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "bubbles",
  title: "Bubbles",
  description: "A burst of bubbles pops out above and below on hover and focus.",
  tech: "css",
  credit: {
    title: "curly-seahorse-76",
    author: "zjssun",
    authorUrl: "https://uiverse.io/profile/zjssun",
    source: "https://uiverse.io/zjssun/curly-seahorse-76",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["bubbles.html", "bubbles.css"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["bubbles.html", "bubbles.css"] },
  ],
};

export default meta;
