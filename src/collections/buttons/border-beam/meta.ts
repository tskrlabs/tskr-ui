import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "border-beam",
  title: "Border beam",
  description: "A point of light travels around the edge at a steady pace, endlessly.",
  tech: "css",
  variants: [
    {
      id: "tailwind",
      framework: "markup",
      styling: "tailwind",
      files: ["border-beam.html", "border-beam.css"],
      reference: true,
    },
    {
      id: "css",
      framework: "markup",
      styling: "css",
      files: ["border-beam.html", "border-beam.css"],
    },
  ],
};

export default meta;
