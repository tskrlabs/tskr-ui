import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "shine",
  title: "Shine",
  description: "A glint sweeps across the face on hover and focus.",
  tech: "css",
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["shine.html"],
      reference: true,
    },
    { id: "css", framework: "markup", styling: "css", files: ["shine.html", "shine.css"] },
  ],
};

export default meta;
