<template>
  <div class="game-board-wrapper">
    <div ref="boardElement" class="game-board">
      <template v-for="(row, rowIdx) in board" :key="rowIdx">
        <BoardCell
          v-for="(cell, colIdx) in row"
          :key="`${rowIdx}-${colIdx}`"
          :row="cell.row"
          :col="cell.col"
          :isDark="cell.isDark"
          :piece="cell.piece"
          :isSelected="cell.isSelected"
          :isTarget="cell.isTarget"
          :move-offset="getMoveOffset(cell.row, cell.col)"
          :move-duration-ms="props.moveDurationMs"
          @click="(r, c) => emit('cell-click', r, c)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoardCell from '@/components/board/BoardCell.vue'
import type { CellView, PieceMoveView } from '@/types/board-view'

const boardElement = ref<HTMLElement | null>(null)

const props = defineProps<{
  board: CellView[][]
  movingPiece: PieceMoveView | null
  moveDurationMs: number
}>()

const emit = defineEmits<{
  (e: 'cell-click', row: number, col: number): void
}>()

function getMoveOffset(row: number, col: number): { row: number; col: number } | null {
  const move = props.movingPiece

  if (move === null || move.from.row !== row || move.from.col !== col) {
    return null
  }

  return {
    row: move.to.row - move.from.row,
    col: move.to.col - move.from.col,
  }
}

function getCellCenter(row: number, col: number) {
  if (!boardElement.value) {
    return null
  }

  const rect = boardElement.value.getBoundingClientRect()

  const cellWidth = rect.width / 9
  const cellHeight = rect.height / 9

  return {
    x: rect.left + (col + 0.5) * cellWidth,
    y: rect.top + (row + 0.5) * cellHeight,
  }
}

defineExpose({
  getCellCenter,
})
</script>

<style scoped>
.game-board-wrapper {
  padding: 8px;
  background: var(--color-board-bg);
  border: 3px solid var(--color-board-border);
  border-radius: 4px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.game-board {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  width: min(72vmin, 620px);
  height: min(72vmin, 620px);
}

@media (max-width: 900px) {
  .game-board {
    width: min(88vw, 52dvh);
    height: min(88vw, 52dvh);
  }

  .game-board-wrapper {
    padding: 5px;
    border-width: 2px;
  }
}
</style>
