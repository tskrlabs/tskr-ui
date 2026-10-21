import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "marquee",
  title: "Marquee",
  description: "On hover and focus the label turns into a ticker that scrolls across the pill.",
  tech: "css",
  credit: {
    title: "happy-moth-17",
    author: "doniaskima",
    authorUrl: "https://uiverse.io/profile/doniaskima",
    source: "https://uiverse.io/doniaskima/happy-moth-17",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["marquee.html", "marquee.css"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["marquee.html", "marquee.css"] },
  ],
};

export default meta;
