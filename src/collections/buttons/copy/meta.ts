import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "copy",
  title: "Copy",
  description: "Copies a snippet to the clipboard. The icon turns into a check and says so.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["CopyButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["CopyButton.vue"] },
    { id: "react-tailwind", framework: "react", styling: "tailwind", files: ["CopyButton.tsx"] },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["CopyButton.tsx", "CopyButton.css"],
    },
    { id: "html", framework: "html", files: ["copy.html", "copy.css", "copy.js"] },
  ],
};

export default meta;
