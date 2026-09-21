<template>
  <div
    :class="[
      'board-cell',
      isDark ? 'board-cell--dark' : 'board-cell--light',
      isSelected && 'board-cell--selected',
      isTarget && 'board-cell--target',
    ]"
    @click="emit('click', row, col)"
  >
    <BoardPiece v-if="piece" :color="piece.color" />
  </div>
</template>

<script setup lang="ts">
import BoardPiece from '@/components/board/BoardPiece.vue'
import type { PieceView } from '@/types/board-view'

defineProps<{
  row: number
  col: number
  isDark: boolean
  piece: PieceView | null
  isSelected: boolean
  isTarget: boolean
}>()

const emit = defineEmits<{ (e: 'click', row: number, col: number): void }>()
</script>

<style scoped>
.board-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.1s;
  position: relative;
}

.board-cell--light {
  background: var(--color-cell-light);
}

.board-cell--dark {
  background: var(--color-cell-dark);
}

.board-cell--selected {
  background-image: linear-gradient(var(--color-cell-selected), var(--color-cell-selected));
}

.board-cell--target::after {
  content: '';
  position: absolute;
  inset: 25%;
  border-radius: 50%;
  background: rgba(100, 200, 100, 0.4);
  border: 2px solid rgba(100, 200, 100, 0.7);
}

.board-cell:hover {
  filter: brightness(1.08);
}
</style>
