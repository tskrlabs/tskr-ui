import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "interactive-hover",
  title: "Interactive hover",
  description:
    "On hover and focus a dot grows to fill the face while the label trades places with an arrow.",
  tech: "css",
  credit: {
    title: "Interactive Hover Button",
    author: "Magic UI",
    authorUrl: "https://magicui.design",
    source: "https://magicui.design/docs/components/interactive-hover-button",
    library: "magic-ui",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["interactive-hover.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["interactive-hover.html", "interactive-hover.css"],
    },
  ],
};

export default meta;
