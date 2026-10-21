import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "spotlight",
  title: "Spotlight",
  description: "A soft glow follows the cursor across the face. Centred on keyboard focus.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["SpotlightButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["SpotlightButton.vue"] },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      files: ["SpotlightButton.tsx"],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["SpotlightButton.tsx", "SpotlightButton.css"],
    },
    { id: "html", framework: "html", files: ["spotlight.html", "spotlight.css", "spotlight.js"] },
  ],
};

export default meta;
