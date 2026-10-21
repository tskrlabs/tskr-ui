import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "pulsating",
  title: "Pulsating",
  description: "A soft ring swells out from the edge and settles back, over and over.",
  tech: "css",
  credit: {
    title: "Pulsating Button",
    author: "Magic UI",
    authorUrl: "https://magicui.design",
    source: "https://magicui.design/docs/components/pulsating-button",
    library: "magic-ui",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["pulsating.html", "pulsating.css"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["pulsating.html", "pulsating.css"] },
  ],
};

export default meta;
