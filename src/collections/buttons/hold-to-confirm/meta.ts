import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "hold-to-confirm",
  title: "Hold to confirm",
  description: "Press and hold to confirm a destructive action. Letting go early cancels.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["HoldButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["HoldButton.vue"] },
    { id: "react-tailwind", framework: "react", styling: "tailwind", files: ["HoldButton.tsx"] },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["HoldButton.tsx", "HoldButton.css"],
    },
    { id: "html", framework: "html", files: ["hold.html", "hold.css", "hold.js"] },
  ],
};

export default meta;
