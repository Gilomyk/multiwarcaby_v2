<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Drop shadow: tight, just below the piece -->
    <circle :cx="cx" :cy="cy + size * 0.07" :r="size * 0.4" fill="#000" opacity="0.3" />
    <!-- Side edge (piece thickness) -->
    <circle :cx="cx" :cy="cy + size * 0.03" :r="size * 0.4" :fill="palette.shadow" />
    <!-- Top face -->
    <circle :cx="cx" :cy="cy" :r="size * 0.4" :fill="palette.base" />
    <!-- Inner ring -->
    <circle
      :cx="cx"
      :cy="cy"
      :r="size * 0.27"
      :fill="palette.highlight"
      fill-opacity="0.35"
      :stroke="palette.shadow"
      stroke-opacity="0.35"
      :stroke-width="size * 0.02"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PieceColor } from '@/types/board-view'

const props = withDefaults(defineProps<{ color: PieceColor; size?: number }>(), { size: 56 })

const PALETTES: Record<PieceColor, { base: string; shadow: string; highlight: string }> = {
  gold: { base: '#c4a775', shadow: '#8d7048', highlight: '#edd9a8' },
  slate: { base: '#8fa8c8', shadow: '#4a6a90', highlight: '#c2d8ee' },
}

const palette = computed(() => PALETTES[props.color])
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size * 0.46)
</script>
