<template>
  <div class="game-board-wrapper">
    <div class="game-board">
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
          @click="(r, c) => emit('cell-click', r, c)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardCell from '@/components/board/BoardCell.vue'
import type { CellView } from '@/types/board-view'

defineProps<{ board: CellView[][] }>()

const emit = defineEmits<{ (e: 'cell-click', row: number, col: number): void }>()
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
</style>
