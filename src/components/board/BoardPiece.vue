<template>
  <div
    class="piece-wrapper"
    :class="{ 'piece-wrapper--moving': moveOffset !== null }"
    :style="moveStyle"
  >
    <PieceGraphic :color="color" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import PieceGraphic from '@/components/icons/PieceGraphic.vue'
import type { PieceColor } from '@/types/board-view'

const props = defineProps<{
  color: PieceColor
  moveOffset: {
    row: number
    col: number
  } | null
  moveDurationMs: number
}>()

const moveStyle = computed(() => {
  if (props.moveOffset === null) {
    return undefined
  }

  return {
    transform: `translate(
      ${props.moveOffset.col * 100}%,
      ${props.moveOffset.row * 100}%
    )`,
    transitionDuration: `${props.moveDurationMs}ms`,
  }
})
</script>

<style scoped>
.piece-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: relative;
  z-index: 1;
}

.piece-wrapper--moving {
  z-index: 10;
  transition-property: transform;
  transition-timing-function: ease-in-out;
}
</style>
