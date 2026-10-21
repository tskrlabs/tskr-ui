import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "magnetic",
  title: "Magnetic",
  description: "Leans toward the cursor while it hovers, then springs back.",
  tech: "js",
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["MagneticButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["MagneticButton.vue"] },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      files: ["MagneticButton.tsx"],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["MagneticButton.tsx", "MagneticButton.css"],
    },
    { id: "html", framework: "html", files: ["magnetic.html", "magnetic.css", "magnetic.js"] },
  ],
};

export default meta;
