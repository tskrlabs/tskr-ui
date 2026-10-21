<script setup lang="ts">
/*
 * Collection gallery (ADR-0018). The single island for a collection page: the
 * card grid (live preview + quick copy) and the piece modal (big preview, the
 * variant picker, every file of the selected variant, Copy all). The modal is a
 * native <dialog>; opening a piece sets `#<piece>` so it is linkable, and Back
 * closes it. Docs-only; never copied.
 */
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { Copy, Check, X, CodeXml } from "lucide-vue-next";
import PiecePreview from "./PiecePreview.vue";
import CodeBlock from "../detail/CodeBlock.vue";
import VariantSelector from "../detail/VariantSelector.vue";
import { pref, setPref, initPref } from "../detail/variantPref";
import { buildPieceView } from "./view";
import { libraries } from "../collections/libraries";
import type { CollectionMeta } from "../collections/types";
import type { PieceEntry } from "../lib/collections";

const props = defineProps<{ collection: CollectionMeta; pieces: PieceEntry[] }>();

// Filter chips: by tech, and by origin (our own vs adapted, ADR-0019).
type TechFilter = "all" | "css" | "js";
type OriginFilter = "all" | "original" | "adapted";
const tech = ref<TechFilter>("all");
const origin = ref<OriginFilter>("all");
const techChips: { id: TechFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JS" },
];
const originChips: { id: OriginFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "original", label: "Original" },
  { id: "adapted", label: "Adapted" },
];
const visible = computed(() =>
  props.pieces.filter(
    (p) =>
      (tech.value === "all" || p.meta.tech === tech.value) &&
      (origin.value === "all" || (origin.value === "adapted") === !!p.meta.credit),
  ),
);
const hasAdapted = computed(() => props.pieces.some((p) => p.meta.credit));

const dlg = ref<HTMLDialogElement | null>(null);
const openName = ref<string | null>(null);
const current = computed(() => props.pieces.find((p) => p.meta.name === openName.value) ?? null);
const view = computed(() => (current.value ? buildPieceView(current.value, pref) : null));

// Whether the open modal added its own history entry (so closing can pop it).
let pushed = false;

function show(name: string) {
  openName.value = name;
  nextTick(() => {
    if (dlg.value && !dlg.value.open) dlg.value.showModal();
  });
}

function open(name: string) {
  if (openName.value === name) return;
  history.pushState(null, "", `#${name}`);
  pushed = true;
  show(name);
}

// Fires for Esc, the close button, and backdrop clicks alike.
function onClose() {
  const name = openName.value;
  openName.value = null;
  if (name && location.hash === `#${name}`) {
    if (pushed) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  }
  pushed = false;
}

function onBackdrop(e: MouseEvent) {
  if (e.target === dlg.value) dlg.value?.close();
}

function syncFromHash() {
  const name = decodeURIComponent(location.hash.slice(1));
  if (props.pieces.some((p) => p.meta.name === name)) {
    show(name);
  } else if (dlg.value?.open) {
    pushed = false; // the entry is already gone: Back took us here
    dlg.value.close();
  }
}

// Copy feedback, keyed by what was copied ("card:shine", "all").
const copied = ref<string | null>(null);
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text);
  copied.value = key;
  setTimeout(() => {
    if (copied.value === key) copied.value = null;
  }, 1600);
}
const cardCopy = (p: PieceEntry) => copy(buildPieceView(p, pref).all, `card:${p.meta.name}`);

onMounted(() => {
  initPref();
  syncFromHash();
  // Back over a pushState entry fires popstate (not always hashchange); a typed
  // `#piece` fires hashchange. Either way the hash is the truth.
  window.addEventListener("popstate", syncFromHash);
  window.addEventListener("hashchange", syncFromHash);
});
onBeforeUnmount(() => {
  window.removeEventListener("popstate", syncFromHash);
  window.removeEventListener("hashchange", syncFromHash);
});
</script>

<template>
  <div class="cg">
    <header class="cg-head">
      <p class="con-bc">
        <span class="s-bc__group">collections/</span><span class="s-bc__name">{{ collection.name }}</span>
      </p>
      <h1 class="con-title">{{ collection.title }}</h1>
      <p class="cg-lede">
        {{ collection.description }}
        <template v-if="hasAdapted">
          Some are adapted from MIT-licensed work, see <a href="/credits">credits</a>.
        </template>
      </p>
      <div class="con-toolbar">
        <span class="con-toolbar__label">variant</span>
        <VariantSelector compact />
      </div>
      <div class="cg-filters">
        <span class="con-toolbar__label">show</span>
        <div class="vseg" role="group" aria-label="Filter by technique">
          <button
            v-for="c in techChips"
            :key="c.id"
            type="button"
            class="vseg__btn"
            :aria-pressed="tech === c.id"
            @click="tech = c.id"
          >
            {{ c.label }}
          </button>
        </div>
        <div class="vseg" role="group" aria-label="Filter by origin">
          <button
            v-for="c in originChips"
            :key="c.id"
            type="button"
            class="vseg__btn"
            :aria-pressed="origin === c.id"
            @click="origin = c.id"
          >
            {{ c.label }}
          </button>
        </div>
        <span class="cg-count" aria-live="polite">
          {{ visible.length === pieces.length ? pieces.length : `${visible.length} of ${pieces.length}` }} pieces
        </span>
      </div>
    </header>

    <p v-if="!visible.length" class="cg-empty">No pieces match these filters.</p>
    <ul class="cg-grid">
      <li v-for="p in visible" :key="p.meta.name" class="cg-card">
        <div class="cg-stage">
          <span class="cg-tag cg-stage__tag">{{ p.meta.tech }}</span>
          <PiecePreview :collection="collection.name" :piece="p" />
        </div>
        <div class="cg-card__foot">
          <button
            type="button"
            class="cg-card__open"
            :aria-label="`${p.meta.title}: view code`"
            @click="open(p.meta.name)"
          >
            <span class="cg-card__title">{{ p.meta.title }}</span>
            <span class="cg-card__code" aria-hidden="true"><CodeXml :size="14" /> Code</span>
          </button>
          <button
            type="button"
            class="cg-icon-btn"
            :aria-label="`Copy ${p.meta.title}`"
            :title="copied === `card:${p.meta.name}` ? 'Copied' : 'Copy'"
            @click="cardCopy(p)"
          >
            <Check v-if="copied === `card:${p.meta.name}`" :size="15" />
            <Copy v-else :size="15" />
          </button>
        </div>
      </li>
    </ul>

    <dialog
      ref="dlg"
      class="cg-modal"
      aria-labelledby="cg-modal-title"
      @close="onClose"
      @click="onBackdrop"
    >
      <div v-if="current && view" class="cg-modal__inner">
        <header class="cg-modal__head">
          <div>
            <p class="con-bc">
              <span class="s-bc__group">{{ collection.name }}/</span><span class="s-bc__name">{{ current.meta.name }}</span>
            </p>
            <h2 id="cg-modal-title" class="cg-modal__title">
              {{ current.meta.title }} <span class="cg-tag">{{ current.meta.tech }}</span>
            </h2>
            <p class="cg-modal__desc">{{ current.meta.description }}</p>
            <p v-if="current.meta.credit" class="cg-modal__credit">
              Adapted from
              <a :href="current.meta.credit.source" target="_blank" rel="noopener">{{
                current.meta.credit.title
              }}</a>
              by
              <a
                v-if="current.meta.credit.authorUrl"
                :href="current.meta.credit.authorUrl"
                target="_blank"
                rel="noopener"
                >{{ current.meta.credit.author }}</a
              ><template v-else>{{ current.meta.credit.author }}</template>
              ({{ libraries[current.meta.credit.library].name }}) ·
              <a href="/credits">{{ libraries[current.meta.credit.library].license }}</a>
            </p>
          </div>
          <button type="button" class="cg-icon-btn" aria-label="Close" @click="dlg?.close()">
            <X :size="16" />
          </button>
        </header>

        <div class="cg-stage cg-stage--lg">
          <PiecePreview :key="current.meta.name" :collection="collection.name" :piece="current" />
        </div>

        <div class="cg-modal__bar">
          <VariantSelector v-if="current.meta.tech === 'js'" compact />
          <div v-else class="vsel vsel--compact">
            <div class="vsel__axis">
              <div class="vseg" role="group" aria-label="Styling">
                <button
                  v-for="s in (['tailwind', 'css'] as const)"
                  :key="s"
                  type="button"
                  class="vseg__btn"
                  :aria-pressed="pref.styling === s"
                  @click="setPref({ styling: s })"
                >
                  {{ s === "tailwind" ? "Tailwind" : "CSS" }}
                </button>
              </div>
            </div>
          </div>
          <button type="button" class="cg-copyall" @click="copy(view.all, 'all')">
            <Check v-if="copied === 'all'" :size="14" />
            <Copy v-else :size="14" />
            {{ copied === "all" ? "Copied" : "Copy all" }}
          </button>
        </div>
        <p v-if="current.meta.tech === 'css'" class="cg-modal__note">
          Plain markup, so it pastes into any template{{
            pref.framework === "react" ? " (shown with className for JSX)" : ""
          }}.
        </p>
        <p v-else-if="view.note" class="cg-modal__note">{{ view.note }}</p>

        <div class="cg-modal__files">
          <CodeBlock
            v-for="f in view.files"
            :key="`${view.variant.id}/${f.filename}`"
            :code="f.source"
            :lang="f.lang"
            :filename="f.filename"
            line-numbers
            wrappable
          />
        </div>
      </div>
    </dialog>
  </div>
</template>
