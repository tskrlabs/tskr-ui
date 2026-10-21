<script setup lang="ts">
/*
 * Collection gallery. The live render of one piece (no-drift, ADR-0018): a CSS
 * piece renders its reference files verbatim (markup + any CSS); a JS piece mounts its
 * `vue-tailwind` reference component, resolved here by glob because a Vue
 * component can't cross the Astro island boundary as a prop.
 */
import { computed, type Component } from "vue";
import type { PieceEntry } from "../lib/collections";
import { referencePreview } from "./view";

const live = import.meta.glob<{ default: Component }>(
  "../collections/*/*/vue-tailwind/*.vue",
  { eager: true },
);

const props = defineProps<{ collection: string; piece: PieceEntry }>();

const component = computed(() => {
  if (props.piece.meta.tech !== "js") return null;
  const prefix = `../collections/${props.collection}/${props.piece.meta.name}/vue-tailwind/`;
  const key = Object.keys(live).find((k) => k.startsWith(prefix));
  return key ? live[key].default : null;
});
// Only a CSS piece's reference is markup; a JS piece's file is never v-html'd.
const markup = computed(() =>
  props.piece.meta.tech === "css" ? referencePreview(props.piece) : "",
);
</script>

<template>
  <component :is="component" v-if="component" />
  <div v-else-if="markup" class="cg-markup" v-html="markup"></div>
</template>
