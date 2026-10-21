import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "lift",
  title: "Lift",
  description: "A white pill that rises and turns green with a soft glow on hover, then settles when pressed.",
  tech: "css",
  credit: {
    title: "stale-rattlesnake-87",
    author: "cssbuttons-io",
    authorUrl: "https://uiverse.io/profile/cssbuttons-io",
    source: "https://uiverse.io/cssbuttons-io/stale-rattlesnake-87",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["lift.html"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["lift.html", "lift.css"] },
  ],
};

export default meta;
