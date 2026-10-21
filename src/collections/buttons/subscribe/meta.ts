import type { PieceMeta } from "../../types";

const meta: PieceMeta = {
  name: "subscribe",
  title: "Subscribe",
  description: "Click to toggle: Subscribe slides away and a checked Subscribed drops in.",
  tech: "js",
  credit: {
    title: "Animated Subscribe Button",
    author: "Magic UI",
    authorUrl: "https://magicui.design",
    source: "https://magicui.design/docs/components/animated-subscribe-button",
    library: "magic-ui",
  },
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      files: ["SubscribeButton.vue"],
      reference: true,
    },
    { id: "vue-css", framework: "vue", styling: "css", files: ["SubscribeButton.vue"] },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      files: ["SubscribeButton.tsx"],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      files: ["SubscribeButton.tsx", "SubscribeButton.css"],
    },
    {
      id: "html",
      framework: "html",
      files: ["subscribe.html", "subscribe.css", "subscribe.js"],
    },
  ],
};

export default meta;
