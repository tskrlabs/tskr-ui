import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "pushable",
  title: "Pushable",
  description: "A raised key that lifts on hover and sinks when pressed.",
  tech: "css",
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["pushable.html"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["pushable.html", "pushable.css"],
    },
  ],
};

export default meta;
