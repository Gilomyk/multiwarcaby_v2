<template>
  <div class="game-view">
    <AppHeader />

    <main class="game-main">
      <div class="game-layout">
        <div class="game-area">
          <GameBoard :board="board" @cell-click="handleCellClick" />

          <div v-if="canEndSequence || canEndTurn" class="game-controls">
            <AppButton v-if="canEndSequence" variant="outline" @click="handleEndSequence">
              Zakończ serię
            </AppButton>

            <AppButton v-if="canEndTurn" variant="primary" @click="handleEndTurn">
              Zakończ turę
            </AppButton>
          </div>
        </div>

        <GameStatus
          v-if="gameState.status.type === 'playing'"
          :current-player="gameState.currentPlayer"
          :player-count="gameState.playerCount"
          :scores="gameState.scores"
          :moves-used="gameState.turn.movesUsed"
          :is-sequence-active="gameState.turn.sequencePiece !== null"
        />

        <GameResult
          v-else
          :winner="gameState.status.winner"
          :player-count="gameState.playerCount"
          :scores="gameState.scores"
          @restart="handleRestart"
        />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import GameBoard from '@/components/board/GameBoard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import GameStatus from '@/components/game/GameStatus.vue'
import GameResult from '@/components/game/GameResult.vue'

import { createInitialGameState, dispatch } from '@/engine/game'

import type { Action, GameState, Position } from '@/engine/types'

import type { CellView, PieceView } from '@/types/board-view'

const gameState = ref<GameState>(createInitialGameState(2))

const selectedPosition = ref<Position | null>(null)

const pieceView: PieceView = {
  color: 'gold',
}

const board = computed<CellView[][]>(() =>
  gameState.value.board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      isDark: (rowIndex + colIndex) % 2 === 1,
      piece: cell === 'piece' ? pieceView : null,
      isSelected: isSamePosition(selectedPosition.value, {
        row: rowIndex,
        col: colIndex,
      }),
      isTarget: false,
    })),
  ),
)

const canEndSequence = computed(
  () => gameState.value.status.type === 'playing' && gameState.value.turn.sequencePiece !== null,
)

const canEndTurn = computed(
  () =>
    gameState.value.status.type === 'playing' &&
    gameState.value.turn.movesUsed === 1 &&
    gameState.value.turn.sequencePiece === null,
)

function handleCellClick(row: number, col: number) {
  const position: Position = {
    row,
    col,
  }

  const cell = gameState.value.board[row]?.[col]

  if (!cell) {
    return
  }

  /*
   * Brak zaznaczonego pionka.
   */
  if (selectedPosition.value === null) {
    if (cell === 'piece') {
      selectedPosition.value = position
    }

    return
  }

  /*
   * Ponowne kliknięcie zaznaczonego pionka.
   *
   * Podczas serii bić nie usuwamy zaznaczenia,
   * ponieważ ten pionek jest nadal pionkiem sekwencji.
   */
  if (isSamePosition(selectedPosition.value, position)) {
    if (gameState.value.turn.sequencePiece === null) {
      selectedPosition.value = null
    }

    return
  }

  /*
   * Zmiana zaznaczenia na inny pionek jest możliwa
   * tylko wtedy, gdy nie trwa seria bić.
   */
  if (cell === 'piece' && gameState.value.turn.sequencePiece === null) {
    selectedPosition.value = position
    return
  }

  dispatchAction({
    type: 'move',
    from: selectedPosition.value,
    to: position,
  })
}

function handleEndSequence() {
  dispatchAction({
    type: 'endSequence',
  })
}

function handleEndTurn() {
  dispatchAction({
    type: 'endTurn',
  })
}

function dispatchAction(action: Action) {
  console.log('dispatch action:', action)

  const result = dispatch(gameState.value, action)

  console.log('dispatch result:', result)

  if (!result.ok) {
    return
  }

  gameState.value = result.state

  /*
   * Engine jest źródłem prawdy również dla otwartej
   * serii bić.
   *
   * - capture -> pozycja bijącego pionka
   * - endSequence -> null
   * - endTurn -> null
   * - zwykły krok -> null
   */
  selectedPosition.value = result.state.turn.sequencePiece
}

function isSamePosition(first: Position | null, second: Position): boolean {
  return first !== null && first.row === second.row && first.col === second.col
}

function handleRestart() {
  gameState.value = createInitialGameState(gameState.value.playerCount)

  selectedPosition.value = null
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

.game-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-6);
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.game-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .game-layout {
    flex-direction: column;
    align-items: center;
  }
}
</style>
