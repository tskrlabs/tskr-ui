import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "arrow",
  title: "Arrow",
  description: "The chevron grows a shaft into an arrow as the button darkens on hover and focus.",
  tech: "css",
  credit: {
    title: "modern-sheep-10",
    author: "satyamchaudharydev",
    authorUrl: "https://uiverse.io/profile/satyamchaudharydev",
    source: "https://uiverse.io/satyamchaudharydev/modern-sheep-10",
    library: "uiverse",
  },
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["arrow.html"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["arrow.html", "arrow.css"] },
  ],
};

export default meta;
