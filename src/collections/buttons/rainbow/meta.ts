import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "rainbow",
  title: "Rainbow",
  description: "A rainbow runs along the bottom edge and glows softly beneath, endlessly.",
  tech: "css",
  credit: {
    title: "Rainbow Button",
    author: "Magic UI",
    authorUrl: "https://magicui.design",
    source: "https://magicui.design/docs/components/rainbow-button",
    library: "magic-ui",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["rainbow.html", "rainbow.css"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["rainbow.html", "rainbow.css"] },
  ],
};

export default meta;
