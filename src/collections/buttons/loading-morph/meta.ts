import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "loading-morph",
  title: "Loading morph",
  description:
    "Shrinks into a spinner while the work runs, then shows a check or a shaking cross before morphing back.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["LoadingButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["LoadingButton.vue"] },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      files: ["LoadingButton.tsx"],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["LoadingButton.tsx", "LoadingButton.css"],
    },
    { id: "html", framework: "html", files: ["loading.html", "loading.css", "loading.js"] },
  ],
};

export default meta;
