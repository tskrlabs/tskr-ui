import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "download-tooltip",
  title: "Download tooltip",
  description:
    "On hover and focus the label slides out for a download icon while a size tooltip pops up above.",
  tech: "css",
  credit: {
    title: "afraid-yak-30",
    author: "satyamchaudharydev",
    authorUrl: "https://uiverse.io/profile/satyamchaudharydev",
    source: "https://uiverse.io/satyamchaudharydev/afraid-yak-30",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["download-tooltip.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["download-tooltip.html", "download-tooltip.css"],
    },
  ],
};

export default meta;
