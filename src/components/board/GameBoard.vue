<template>
  <div class="game-board-wrapper">
    <div class="board-coordinates-layout">
      <div class="board-corner"></div>

      <div class="board-files board-files--top">
        <span v-for="label in fileLabels" :key="`top-${label}`">
          {{ label }}
        </span>
      </div>

      <div class="board-corner"></div>

      <div class="board-ranks board-ranks--left">
        <span v-for="label in rankLabels" :key="`left-${label}`">
          {{ label }}
        </span>
      </div>

      <div class="board-outer-white">
        <div class="board-blue-ring">
          <div class="board-inner-white">
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
        </div>
      </div>

      <div class="board-ranks board-ranks--right">
        <span v-for="label in rankLabels" :key="`right-${label}`">
          {{ label }}
        </span>
      </div>

      <div class="board-corner"></div>

      <div class="board-files board-files--bottom">
        <span v-for="label in fileLabels" :key="`bottom-${label}`">
          {{ label }}
        </span>
      </div>

      <div class="board-corner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoardCell from '@/components/board/BoardCell.vue'
import type { CellView, PieceMoveView } from '@/types/board-view'

const boardElement = ref<HTMLElement | null>(null)
const fileLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
const rankLabels = ['9', '8', '7', '6', '5', '4', '3', '2', '1']

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

.board-coordinates-layout {
  display: grid;
  grid-template-columns: 18px auto 18px;
  grid-template-rows: 18px auto 18px;
  gap: 4px;
}

.board-outer-white {
  grid-column: 2;
  grid-row: 2;

  padding: 2px;
  background: #ffffff;
}

.board-blue-ring {
  padding: 2px;
  background: var(--color-board-bg);
}

.board-inner-white {
  padding: 4px;
  background: #ffffff;
}

.board-ranks {
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  align-items: center;
  justify-items: center;
}

.board-ranks--left {
  grid-column: 1;
  grid-row: 2;
}

.board-ranks--right {
  grid-column: 3;
  grid-row: 2;
}

.board-files {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  align-items: center;
  justify-items: center;
}

.board-files--top {
  grid-column: 2;
  grid-row: 1;
}

.board-files--bottom {
  grid-column: 2;
  grid-row: 3;
}

.board-ranks span,
.board-files span {
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  user-select: none;
}

.board-files {
  width: 97.5%;
  justify-self: center;
}

.board-ranks {
  height: 97.5%;
  align-self: center;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);

  width: min(72vw, 62vh, 620px);

  height: min(72vw, 62vh, 620px);
}

@media (max-width: 900px) {
  .game-board {
    width: min(88vw, 50svh);
    height: min(88vw, 50svh);
  }

  .game-board-wrapper {
    padding: 5px;
    border-width: 2px;
  }

  .board-coordinates-layout {
    grid-template-columns: 14px auto 14px;
    grid-template-rows: 14px auto 14px;
    gap: 3px;
  }

  .board-outer-white {
    padding: 3px;
  }

  .board-blue-ring {
    padding: 2px;
  }

  .board-inner-white {
    padding: 1px;
  }

  .board-ranks span,
  .board-files span {
    font-size: 0.58rem;
  }
}
</style>
