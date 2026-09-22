<template>
  <FlyingCapturedPiece
    v-if="flyingCapture"
    :from="flyingCapture.from"
    :to="flyingCapture.to"
    :target-size="flyingCapture.targetSize"
    :duration-ms="CAPTURE_ANIMATION_MS"
  />
  <div class="game-view">
    <AppHeader />

    <main class="game-main">
      <div class="game-layout">
        <div class="game-area">
          <p class="game-announcement">
            {{ gameAnnouncement }}
          </p>
          <div class="board-stage">
            <CapturedPile
              ref="playerTwoPile"
              :count="gameState.scores[1] ?? 0"
              placement="top-left"
              player-label="Gracz 2."
            />

            <GameBoard
              ref="boardComponent"
              :board="board"
              :moving-piece="movingPiece"
              :move-duration-ms="MOVE_ANIMATION_MS"
              @cell-click="handleCellClick"
            />

            <CapturedPile
              ref="playerOnePile"
              :count="gameState.scores[0] ?? 0"
              placement="bottom-right"
              player-label="Gracz 1."
            />
          </div>

          <div class="game-action-area">
            <div class="game-controls">
              <span v-if="showTurnStartMessage" class="game-controls__message">
                Rozpoczynasz turę!
              </span>

              <AppButton v-if="canEndSequence" variant="secondary" @click="handleEndSequence">
                Zakończ serię
              </AppButton>

              <AppButton v-if="canEndTurn" variant="primary" @click="handleEndTurn">
                Zakończ turę
              </AppButton>
            </div>

            <p class="game-feedback">
              {{ actionErrorMessage ?? '' }}
            </p>
          </div>

          <div class="game-side-panel">
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
        </div>
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
import CapturedPile from '@/components/game/CapturedPile.vue'
import FlyingCapturedPiece from '@/components/game/FlyingCapturedPiece.vue'

import { createInitialGameState, dispatch } from '@/engine/game'

import type { Action, ActionError, GameState, Position, GameEvent } from '@/engine/types'

import type { CellView, PieceMoveView, PieceView } from '@/types/board-view'

// Types

interface ScreenPoint {
  x: number
  y: number
}

interface FlyingCapture {
  from: ScreenPoint
  to: ScreenPoint
  targetSize: number
}

// Constants

const gameState = ref<GameState>(createInitialGameState(2))

const selectedPosition = ref<Position | null>(null)

const pieceView: PieceView = {
  color: 'gold',
}

const gameAnnouncement = ref('Gracz 1. rozpoczyna turę.')

// moving piece animation

const movingPiece = ref<PieceMoveView | null>(null)
const isAnimating = ref(false)

const MOVE_ANIMATION_MS = 180

// captured piece animation

const boardComponent = ref<InstanceType<typeof GameBoard> | null>(null)

const playerOnePile = ref<InstanceType<typeof CapturedPile> | null>(null)
const playerTwoPile = ref<InstanceType<typeof CapturedPile> | null>(null)

const flyingCapture = ref<FlyingCapture | null>(null)

const hiddenCapturedPosition = ref<Position | null>(null)

const CAPTURE_ANIMATION_MS = 280

// Error handling

const actionError = ref<ActionError | null>(null)

const ERROR_MESSAGE_MS = 1400

const board = computed<CellView[][]>(() =>
  gameState.value.board.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const position: Position = {
        row: rowIndex,
        col: colIndex,
      }

      const isHiddenCapturedPiece = isSamePosition(hiddenCapturedPosition.value, position)

      return {
        row: rowIndex,
        col: colIndex,
        isDark: (rowIndex + colIndex) % 2 === 1,
        piece: cell === 'piece' && !isHiddenCapturedPiece ? pieceView : null,

        isSelected: isSamePosition(selectedPosition.value, position),

        isTarget: false,
      }
    }),
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

const actionErrorMessage = computed(() => {
  switch (actionError.value) {
    case 'destination-occupied':
      return 'Pole docelowe jest zajęte.'

    case 'invalid-source':
      return 'Nie można wykonać ruchu z tego pola.'

    case 'invalid-destination':
      return 'Nieprawidłowe pole docelowe.'

    case 'invalid-move':
      return 'Ten ruch jest niedozwolony.'

    case 'no-moves-left':
      return 'Wykorzystano już oba ruchy.'

    case 'must-make-move':
      return 'Najpierw wykonaj co najmniej jeden ruch.'

    case 'game-finished':
      return 'Gra została już zakończona.'

    default:
      return null
  }
})

const showTurnStartMessage = computed(
  () =>
    gameState.value.status.type === 'playing' &&
    gameState.value.turn.movesUsed === 0 &&
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

async function dispatchAction(action: Action) {
  if (isAnimating.value) {
    return
  }

  console.log('dispatch action:', action)

  const stateBeforeAction = gameState.value

  const result = dispatch(stateBeforeAction, action)

  console.log('dispatch result:', result)

  if (!result.ok) {
    showActionError(result.error)
    return
  }

  actionError.value = null

  const moveEvent = result.events.find((event) => event.type === 'step' || event.type === 'capture')

  if (!moveEvent) {
    gameState.value = result.state

    updateGameAnnouncement(stateBeforeAction, result.state, result.events)

    selectedPosition.value = result.state.turn.sequencePiece

    return
  }

  isAnimating.value = true

  /*
   * 1. Pionek wykonujący ruch / skok.
   */
  movingPiece.value = {
    from: moveEvent.from,
    to: moveEvent.to,
  }

  await wait(MOVE_ANIMATION_MS)

  /*
   * 2. Jeśli było to bicie, zbity pionek
   *    leci na stos gracza.
   */
  if (moveEvent.type === 'capture') {
    const capturingPlayer = stateBeforeAction.currentPlayer

    const nextPileSlot = stateBeforeAction.scores[capturingPlayer] ?? 0

    await animateCapturedPiece(moveEvent, capturingPlayer, nextPileSlot)
  }

  /*
   * 3. Dopiero teraz pokazujemy finalny stan engine.
   *
   * score zwiększa się tutaj, więc dokładnie w tym
   * momencie pojawia się również statyczny pionek
   * w docelowym slocie stosu.
   */
  gameState.value = result.state

  updateGameAnnouncement(stateBeforeAction, result.state, result.events)

  const gameOverEvent = result.events.find((event) => event.type === 'game-over')

  selectedPosition.value = gameOverEvent ? null : result.state.turn.sequencePiece

  movingPiece.value = null
  flyingCapture.value = null
  hiddenCapturedPosition.value = null

  isAnimating.value = false
}

function isSamePosition(first: Position | null, second: Position): boolean {
  return first !== null && first.row === second.row && first.col === second.col
}

function handleRestart() {
  gameState.value = createInitialGameState(gameState.value.playerCount)

  selectedPosition.value = null
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

async function animateCapturedPiece(
  event: Extract<GameEvent, { type: 'capture' }>,
  playerIndex: number,
  slotIndex: number,
) {
  const source = boardComponent.value?.getCellCenter(event.over.row, event.over.col)

  const pile = playerIndex === 0 ? playerOnePile.value : playerTwoPile.value

  const target = pile?.getSlotTarget(slotIndex)

  /*
   * Np. responsive < 900 px:
   * stos jest ukryty, więc po prostu pomijamy animację.
   */
  if (!source || !target) {
    return
  }

  hiddenCapturedPosition.value = event.over

  flyingCapture.value = {
    from: source,
    to: {
      x: target.x,
      y: target.y,
    },
    targetSize: target.size,
  }

  await wait(CAPTURE_ANIMATION_MS)
}

function showActionError(error: ActionError) {
  actionError.value = error

  window.setTimeout(() => {
    if (actionError.value === error) {
      actionError.value = null
    }
  }, ERROR_MESSAGE_MS)
}

function playerLabel(playerIndex: number) {
  return `Gracz ${playerIndex + 1}.`
}

function updateGameAnnouncement(
  stateBeforeAction: GameState,
  nextState: GameState,
  events: GameEvent[],
) {
  const gameOverEvent = events.find((event) => event.type === 'game-over')

  if (gameOverEvent) {
    gameAnnouncement.value =
      gameOverEvent.winner === null
        ? 'Gra zakończyła się remisem!'
        : `${playerLabel(gameOverEvent.winner)} wygrywa!`

    return
  }

  const turnEndedEvent = events.find((event) => event.type === 'turn-ended')

  if (turnEndedEvent) {
    gameAnnouncement.value = `${playerLabel(stateBeforeAction.currentPlayer)} zakończył turę.`

    window.setTimeout(() => {
      if (nextState.status.type === 'playing') {
        gameAnnouncement.value = `${playerLabel(nextState.currentPlayer)} rozpoczyna turę.`
      }
    }, 900)

    return
  }

  const captureEvent = events.find((event) => event.type === 'capture')

  if (captureEvent && stateBeforeAction.turn.sequencePiece === null) {
    gameAnnouncement.value = `${playerLabel(stateBeforeAction.currentPlayer)} rozpoczyna serię bić!`

    return
  }

  if (
    nextState.status.type === 'playing' &&
    nextState.turn.movesUsed === 1 &&
    nextState.turn.sequencePiece === null
  ) {
    gameAnnouncement.value = `${playerLabel(nextState.currentPlayer)} wykonuje 2. ruch.`

    return
  }
}
</script>

<style scoped>
.game-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;

  height: 100vh;
  overflow: hidden;
}

.game-main {
  min-height: 0;
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: clamp(6px, 1.5vh, 20px) var(--space-4);

  overflow: hidden;
}

.game-layout {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  min-height: 0;
}

.game-area {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: clamp(4px, 1vh, 16px);

  max-height: 100%;
  min-height: 0;
}

.game-action-area {
  display: grid;
  grid-template-rows: 34px 20px;
  align-items: center;
  justify-items: center;
  gap: 2px;
}

.game-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  height: 34px;
}

.board-stage {
  position: relative;
}

.game-side-panel {
  position: absolute;
  top: 0;
  left: calc(100% + var(--space-6));
  min-width: 180px;
}

.game-feedback {
  height: 20px;
  margin: 0;
  line-height: 20px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-align: center;
}

.game-result {
  animation: game-result-enter 220ms ease-out;
}

.game-announcement {
  width: 100%;
  height: 32px;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .game-view {
    height: 100svh;
    min-height: 100svh;
  }

  .game-main {
    align-items: flex-start;
    padding: 6px var(--space-2);
  }

  .game-layout {
    flex-direction: column;
    align-items: center;
  }

  .game-area {
    gap: 4px;
  }

  .game-action-area {
    grid-template-rows: 30px 16px;
    gap: 1px;
    padding-top: 6px;
  }

  .game-controls {
    height: 30px;
  }

  .game-feedback {
    height: 16px;
    line-height: 16px;
    font-size: 0.7rem;
  }

  .game-side-panel {
    position: static;
    width: 100%;
    min-width: 0;
  }

  .game-announcement {
    height: 24px;
    font-size: 1rem;
  }
}

@keyframes game-result-enter {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
