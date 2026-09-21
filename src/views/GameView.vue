<template>
  <div class="game-view">
    <AppHeader />
    <main class="game-main"><GameBoard :board="board" @cell-click="handleCellClick" /></main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import GameBoard from '@/components/board/GameBoard.vue'
import { createMockBoard } from '@/mocks/board.mock'
import type { CellView } from '@/types/board-view'

const board = ref<CellView[][]>(createMockBoard())

function handleCellClick(row: number, col: number) {
  const cell = board.value[row]?.[col]
  if (!cell) return

  const select = !cell.isSelected && cell.piece !== null
  board.value = board.value.map((r) =>
    r.map((c) => ({
      ...c,
      isSelected: select && c.row === row && c.col === col,
      isTarget: false,
    })),
  )
}
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.game-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
}
</style>
