<template>
  <svg
    class="piece-graphic"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    :style="svgStyle"
  >
    <defs>
      <!-- cień pod pionkiem -->
      <filter :id="ids.shadowFilter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blur" />
        <feOffset in="blur" dx="0" dy="2.2" result="offsetBlur" />
        <feComponentTransfer in="offsetBlur">
          <feFuncA type="linear" slope="0.35" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- dolny cylinder -->
      <linearGradient :id="ids.bottomSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="palette.highlightSoft" />
        <stop offset="30%" :stop-color="palette.base" />
        <stop offset="75%" :stop-color="palette.shadow" />
        <stop offset="100%" :stop-color="palette.deepShadow" />
      </linearGradient>

      <radialGradient :id="ids.bottomTop" cx="35%" cy="25%" r="75%">
        <stop offset="0%" :stop-color="palette.topShine" />
        <stop offset="45%" :stop-color="palette.highlight" />
        <stop offset="100%" :stop-color="palette.base" />
      </radialGradient>

      <!-- środkowy cylinder -->
      <linearGradient :id="ids.middleSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="palette.highlight" />
        <stop offset="35%" :stop-color="palette.base" />
        <stop offset="80%" :stop-color="palette.shadow" />
        <stop offset="100%" :stop-color="palette.deepShadow" />
      </linearGradient>

      <radialGradient :id="ids.middleTop" cx="35%" cy="25%" r="75%">
        <stop offset="0%" :stop-color="palette.topShine" />
        <stop offset="50%" :stop-color="palette.highlight" />
        <stop offset="100%" :stop-color="palette.base" />
      </radialGradient>

      <!-- górny cylinder -->
      <linearGradient :id="ids.topSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :stop-color="palette.topShine" />
        <stop offset="35%" :stop-color="palette.highlight" />
        <stop offset="85%" :stop-color="palette.shadow" />
        <stop offset="100%" :stop-color="palette.deepShadow" />
      </linearGradient>

      <radialGradient :id="ids.topTop" cx="35%" cy="25%" r="75%">
        <stop offset="0%" :stop-color="palette.topShine" />
        <stop offset="55%" :stop-color="palette.highlight" />
        <stop offset="100%" :stop-color="palette.base" />
      </radialGradient>

      <!-- wgłębienie -->
      <radialGradient :id="ids.recessOuter" cx="40%" cy="30%" r="70%">
        <stop offset="0%" :stop-color="palette.shadow" />
        <stop offset="100%" :stop-color="palette.deepShadow" />
      </radialGradient>

      <radialGradient :id="ids.recessInner" cx="45%" cy="35%" r="70%">
        <stop offset="0%" :stop-color="palette.base" />
        <stop offset="100%" :stop-color="palette.shadow" />
      </radialGradient>
    </defs>

    <!-- cień pod pionkiem -->
    <ellipse cx="50" cy="82" rx="29" ry="7.2" fill="#000000" opacity="0.18" />

    <g :filter="`url(#${ids.shadowFilter})`">
      <!-- DOLNY CYLINDER -->
      <path
        d="M20 58
           C20 67.5, 28 75, 50 75
           C72 75, 80 67.5, 80 58
           L80 67
           C80 76.5, 72 84, 50 84
           C28 84, 20 76.5, 20 67
           Z"
        :fill="`url(#${ids.bottomSide})`"
      />
      <ellipse cx="50" cy="66" rx="30" ry="10" :fill="`url(#${ids.bottomTop})`" />

      <!-- cień środkowego cylindra na dolnym -->
      <ellipse cx="50" cy="63.5" rx="27.6" ry="8.2" :fill="palette.deepShadow" opacity="0.14" />

      <!-- ŚRODKOWY CYLINDER -->
      <path
        d="M22.5 47
     C22.5 53.5, 29.5 57.5, 50 57.5
     C70.5 57.5, 77.5 53.5, 77.5 47
     L77.5 60
     C77.5 67.5, 70.5 73.5, 50 73.5
     C29.5 73.5, 22.5 67.5, 22.5 60
     Z"
        :fill="`url(#${ids.middleSide})`"
      />
      <ellipse cx="50" cy="52" rx="27.5" ry="8.5" :fill="`url(#${ids.middleTop})`" />

      <!-- cień górnego cylindra na środkowym -->
      <ellipse cx="50" cy="49.2" rx="24.8" ry="6.7" :fill="palette.deepShadow" opacity="0.13" />

      <!-- GÓRNY CYLINDER -->
      <path
        d="M25.5 34
     C25.5 38.5, 31 42, 50 42
     C69 42, 74.5 38.5, 74.5 34
     L74.5 45.5
     C74.5 51.7, 69 57, 50 57
     C31 57, 25.5 51.7, 25.5 45.5
     Z"
        :fill="`url(#${ids.topSide})`"
      />
      <ellipse cx="50" cy="36" rx="24.5" ry="7.2" :fill="`url(#${ids.topTop})`" />

      <!-- WGŁĘBIENIE -->
      <ellipse
        cx="50"
        cy="35.8"
        rx="21.5"
        ry="5.1"
        :fill="`url(#${ids.recessOuter})`"
        opacity="0.95"
      />
      <ellipse cx="50" cy="35.4" rx="12.8" ry="2.9" :fill="`url(#${ids.recessInner})`" />

      <!-- highlights -->
      <path
        d="M31 33
           C36 29.8, 43 28.6, 50 29.4
           C44.2 28.6, 37.3 29.9, 31 33 Z"
        fill="#ffffff"
        opacity="0.26"
      />

      <path
        d="M27 46
           C32 41.2, 39.5 38.9, 47 39.6
           C40.4 39.3, 33.8 41.7, 27 46 Z"
        fill="#ffffff"
        opacity="0.16"
      />

      <path
        d="M23 58
           C29 53.4, 37.2 51.1, 46 51.8
           C38.4 51.4, 30.8 53.6, 23 58 Z"
        fill="#ffffff"
        opacity="0.11"
      />

      <!-- cienka krawędź górnych elips -->
      <path
        d="M25.5 36
     C25.5 40, 36 43.2, 50 43.2
     C64 43.2, 74.5 40, 74.5 36"
        fill="none"
        :stroke="palette.edge"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.4"
      />

      <path
        d="M22.5 52
     C22.5 56.7, 34 60.5, 50 60.5
     C66 60.5, 77.5 56.7, 77.5 52"
        fill="none"
        :stroke="palette.edge"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.3"
      />

      <path
        d="M20 66
     C20 71.5, 33 76, 50 76
     C67 76, 80 71.5, 80 66"
        fill="none"
        :stroke="palette.edge"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.24"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type PieceColor = 'gold' | 'slate'

const props = defineProps<{
  color: PieceColor
  size?: number
}>()

const PALETTES: Record<
  PieceColor,
  {
    base: string
    highlight: string
    highlightSoft: string
    topShine: string
    shadow: string
    deepShadow: string
    edge: string
  }
> = {
  gold: {
    base: '#d4b06c',
    highlight: '#e6c989',
    highlightSoft: '#eed9a4',
    topShine: '#fff2cc',
    shadow: '#b58f4f',
    deepShadow: '#8e6b36',
    edge: '#7c5a2a',
  },

  slate: {
    base: '#98abc5',
    highlight: '#bfd0e5',
    highlightSoft: '#d7e3f1',
    topShine: '#edf5ff',
    shadow: '#6c84a3',
    deepShadow: '#4d6686',
    edge: '#3f5876',
  },
}

const palette = computed(() => PALETTES[props.color])

const uid = `piece-${Math.random().toString(36).slice(2, 9)}`

const ids = {
  shadowFilter: `${uid}-shadow-filter`,
  bottomSide: `${uid}-bottom-side`,
  bottomTop: `${uid}-bottom-top`,
  middleSide: `${uid}-middle-side`,
  middleTop: `${uid}-middle-top`,
  topSide: `${uid}-top-side`,
  topTop: `${uid}-top-top`,
  recessOuter: `${uid}-recess-outer`,
  recessInner: `${uid}-recess-inner`,
}

const svgStyle = computed(() =>
  props.size
    ? {
        width: `${props.size}px`,
        height: `${props.size}px`,
      }
    : undefined,
)
</script>

<style scoped>
.piece-graphic {
  width: 100%;
  height: 100%;
  display: block;

  transform: translateY(-6%) scale(1.08);
  transform-origin: center;
}
</style>
