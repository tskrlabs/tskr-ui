import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "ripple",
  title: "Ripple",
  description: "A wave spreads from where you click. From the centre on Enter or Space.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["RippleButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["RippleButton.vue"] },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      files: ["RippleButton.tsx"],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["RippleButton.tsx", "RippleButton.css"],
    },
    { id: "html", framework: "html", files: ["ripple.html", "ripple.css", "ripple.js"] },
  ],
};

export default meta;
