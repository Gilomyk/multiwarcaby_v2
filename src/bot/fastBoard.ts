import { BOARD_SIZE } from '../engine/board'
import type { Board, Position } from '../engine/types'
import type { CaptureSequenceResult, CaptureStep } from './types'

/**
 * Lekka jednowymiarowa reprezentacja planszy 9x9:
 * 0 = puste pole, 1 = pionek.
 */
export type FastBoard = Uint8Array

export const EMPTY_CELL = 0
export const PIECE_CELL = 1
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE

export const DIRECTIONS: readonly (readonly [number, number])[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export function toIndex(row: number, col: number): number {
  return row * BOARD_SIZE + col
}

export function toPosition(index: number): Position {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  }
}

export function toFastBoard(board: Board): FastBoard {
  const fast = new Uint8Array(TOTAL_CELLS)

  for (let row = 0; row < BOARD_SIZE; row++) {
    const boardRow = board[row]
    if (!boardRow) continue

    for (let col = 0; col < BOARD_SIZE; col++) {
      if (boardRow[col] === 'piece') {
        fast[toIndex(row, col)] = PIECE_CELL
      }
    }
  }

  return fast
}

export interface SearchBudget {
  nodesVisited: number
  maxNodes: number
  deadlineMs: number
  timedOut: boolean
}

export function createSearchBudget(maxNodes = 50_000, maxTimeMs = 50): SearchBudget {
  return {
    nodesVisited: 0,
    maxNodes,
    deadlineMs: performance.now() + maxTimeMs,
    timedOut: false,
  }
}

function isBudgetExhausted(budget: SearchBudget): boolean {
  if (budget.timedOut) return true

  budget.nodesVisited++
  if (budget.nodesVisited >= budget.maxNodes) {
    budget.timedOut = true
    return true
  }

  // Sprawdzamy zegar co 256 węzłów, żeby nie wywoływać performance.now() zbyt często
  if ((budget.nodesVisited & 255) === 0 && performance.now() >= budget.deadlineMs) {
    budget.timedOut = true
    return true
  }

  return false
}

function findLongestCaptureStepsFromPiece(
  board: FastBoard,
  startIdx: number,
  budget: SearchBudget,
): CaptureStep[] {
  let bestSteps: CaptureStep[] = []
  const currentPath: number[] = []

  function dfs(fromIdx: number): void {
    if (isBudgetExhausted(budget)) return

    const fromRow = Math.floor(fromIdx / BOARD_SIZE)
    const fromCol = fromIdx % BOARD_SIZE
    let extended = false

    for (let d = 0; d < DIRECTIONS.length; d++) {
      const [dr, dc] = DIRECTIONS[d]!
      const overRow = fromRow + dr
      const overCol = fromCol + dc
      const toRow = fromRow + dr * 2
      const toCol = fromCol + dc * 2

      if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
        continue
      }

      const overIdx = overRow * BOARD_SIZE + overCol
      const toIdx = toRow * BOARD_SIZE + toCol

      if (board[overIdx] !== PIECE_CELL || board[toIdx] !== EMPTY_CELL) {
        continue
      }

      extended = true

      // Make capture
      board[fromIdx] = EMPTY_CELL
      board[overIdx] = EMPTY_CELL
      board[toIdx] = PIECE_CELL
      currentPath.push(fromIdx, toIdx)

      dfs(toIdx)

      // Unmake capture
      currentPath.pop()
      currentPath.pop()
      board[toIdx] = EMPTY_CELL
      board[overIdx] = PIECE_CELL
      board[fromIdx] = PIECE_CELL

      if (budget.timedOut) return
    }

    if (!extended) {
      const captures = currentPath.length / 2
      if (captures > bestSteps.length) {
        bestSteps = []
        for (let i = 0; i < currentPath.length; i += 2) {
          bestSteps.push({
            from: toPosition(currentPath[i]!),
            to: toPosition(currentPath[i + 1]!),
          })
        }
      }
    }
  }

  dfs(startIdx)
  return bestSteps
}

/**
 * Szuka najdłuższej sekwencji bić możliwej do wykonania w pojedynczym ruchu.
 * Wykorzystuje make/unmake na tablicy FastBoard bez alokacji kopii planszy.
 */
export function findBestCaptureSequence(
  board: FastBoard,
  budget: SearchBudget = createSearchBudget(),
  randomTieBreak = false,
): CaptureSequenceResult {
  let bestLength = 0
  let bestCandidates: CaptureStep[][] = []

  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (board[idx] !== PIECE_CELL) continue
    const candidateSteps = findLongestCaptureStepsFromPiece(board, idx, budget)

    if (candidateSteps.length > bestLength) {
      bestLength = candidateSteps.length
      bestCandidates = [candidateSteps]
    } else if (randomTieBreak && candidateSteps.length > 0 && candidateSteps.length === bestLength) {
      bestCandidates.push(candidateSteps)
    }

    if (budget.timedOut) break
  }

  const chosenSteps =
    bestCandidates.length === 0
      ? []
      : randomTieBreak && bestCandidates.length > 1
        ? bestCandidates[Math.floor(Math.random() * bestCandidates.length)]!
        : bestCandidates[0]!

  return {
    captures: chosenSteps.length,
    steps: chosenSteps,
    nodesVisited: budget.nodesVisited,
    timedOut: budget.timedOut,
  }
}

/**
 * Zwraca listę wszystkich legalnych zwykłych przesunięć (o 1 pole).
 */
export function findAllStepMoves(board: FastBoard): CaptureStep[] {
  const steps: CaptureStep[] = []

  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (board[idx] !== PIECE_CELL) continue

    const row = Math.floor(idx / BOARD_SIZE)
    const col = idx % BOARD_SIZE

    for (let d = 0; d < DIRECTIONS.length; d++) {
      const [dr, dc] = DIRECTIONS[d]!
      const toRow = row + dr
      const toCol = col + dc

      if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
        continue
      }

      const toIdx = toRow * BOARD_SIZE + toCol
      if (board[toIdx] === EMPTY_CELL) {
        steps.push({
          from: { row, col },
          to: { row: toRow, col: toCol },
        })
      }
    }
  }

  return steps
}

/**
 * Zwraca zwykłe kroki zbliżające pionek w stronę innego pionka oddalonego o 2 pola
 * (np. gdy cel jest 1 pole w bok i 2 poniżej, dopuszcza ruch w dół lub po przekątnej w dół).
 * W razie braku takich par spada do ruchów pionków mających sąsiada w promieniu 2 pól,
 * a ostatecznie do wszystkich legalnych kroków.
 */
export function findApproachStepMoves(board: FastBoard): CaptureStep[] {
  const approachSteps: CaptureStep[] = []
  const nearbyPieceSteps: CaptureStep[] = []
  const seenApproach = new Set<number>()

  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (board[idx] !== PIECE_CELL) continue

    const row = Math.floor(idx / BOARD_SIZE)
    const col = idx % BOARD_SIZE

    const distance2Targets: { row: number; col: number }[] = []
    let hasAnyNearbyPiece = false

    const minRow = Math.max(0, row - 2)
    const maxRow = Math.min(BOARD_SIZE - 1, row + 2)
    const minCol = Math.max(0, col - 2)
    const maxCol = Math.min(BOARD_SIZE - 1, col + 2)

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const otherIdx = r * BOARD_SIZE + c
        if (otherIdx === idx || board[otherIdx] !== PIECE_CELL) continue

        hasAnyNearbyPiece = true
        const dist = Math.max(Math.abs(r - row), Math.abs(c - col))
        if (dist === 2) {
          distance2Targets.push({ row: r, col: c })
        }
      }
    }

    if (!hasAnyNearbyPiece) continue

    for (let d = 0; d < DIRECTIONS.length; d++) {
      const [dr, dc] = DIRECTIONS[d]!
      const toRow = row + dr
      const toCol = col + dc

      if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
        continue
      }

      const toIdx = toRow * BOARD_SIZE + toCol
      if (board[toIdx] !== EMPTY_CELL) continue

      const step: CaptureStep = { from: { row, col }, to: { row: toRow, col: toCol } }
      nearbyPieceSteps.push(step)

      const movesAdjacentToTarget = distance2Targets.some(
        (target) => Math.max(Math.abs(target.row - toRow), Math.abs(target.col - toCol)) === 1,
      )

      if (movesAdjacentToTarget) {
        const key = idx * TOTAL_CELLS + toIdx
        if (!seenApproach.has(key)) {
          seenApproach.add(key)
          approachSteps.push(step)
        }
      }
    }
  }

  if (approachSteps.length > 0) return approachSteps
  if (nearbyPieceSteps.length > 0) return nearbyPieceSteps
  return findAllStepMoves(board)
}

/**
 * Aplikuje sekwencję bić lub zwykły krok na FastBoard (mutuje planszę).
 */
export function applyStepsOnFastBoard(board: FastBoard, steps: readonly CaptureStep[]): void {
  for (const step of steps) {
    const fromIdx = toIndex(step.from.row, step.from.col)
    const toIdx = toIndex(step.to.row, step.to.col)
    const rowDiff = Math.abs(step.to.row - step.from.row)
    const colDiff = Math.abs(step.to.col - step.from.col)

    board[fromIdx] = EMPTY_CELL
    board[toIdx] = PIECE_CELL

    if (rowDiff === 2 || colDiff === 2) {
      const overRow = (step.from.row + step.to.row) / 2
      const overCol = (step.from.col + step.to.col) / 2
      board[toIndex(overRow, overCol)] = EMPTY_CELL
    }
  }
}

export interface Move1Candidate {
  steps: CaptureStep[]
  captures: number
}

export function countPieces(board: FastBoard): number {
  let count = 0
  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (board[idx] === PIECE_CELL) count++
  }
  return count
}

function hasOtherPieceInRadius2(board: FastBoard, centerIdx: number, ignoredIdx: number): boolean {
  const centerRow = Math.floor(centerIdx / BOARD_SIZE)
  const centerCol = centerIdx % BOARD_SIZE
  const minRow = Math.max(0, centerRow - 2)
  const maxRow = Math.min(BOARD_SIZE - 1, centerRow + 2)
  const minCol = Math.max(0, centerCol - 2)
  const maxCol = Math.min(BOARD_SIZE - 1, centerCol + 2)

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const idx = r * BOARD_SIZE + c
      if (idx !== centerIdx && idx !== ignoredIdx && board[idx] === PIECE_CELL) {
        return true
      }
    }
  }

  return false
}

/**
 * Generuje kandydatów na 1. ruch dla Wersji 2 (wariant kompromisowy):
 * 1. Bicia: dla każdego pionka 1-krokowe bicia oraz najdłuższa pełna sekwencja bić.
 * 2. Zwykłe ruchy: przefiltrowane lokalnością (w promieniu 2 pól od `from` lub `to` jest inny pionek).
 */
export function findMove1Candidates(board: FastBoard, budget: SearchBudget): Move1Candidate[] {
  const captureCandidates: Move1Candidate[] = []
  const stepCandidates: Move1Candidate[] = []
  const allSteps: CaptureStep[] = []

  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (board[idx] !== PIECE_CELL) continue

    const row = Math.floor(idx / BOARD_SIZE)
    const col = idx % BOARD_SIZE
    let hasImmediateCapture = false

    for (let d = 0; d < DIRECTIONS.length; d++) {
      const [dr, dc] = DIRECTIONS[d]!

      // 1) Sprawdź zwykły krok
      const stepRow = row + dr
      const stepCol = col + dc
      if (stepRow >= 0 && stepRow < BOARD_SIZE && stepCol >= 0 && stepCol < BOARD_SIZE) {
        const stepIdx = stepRow * BOARD_SIZE + stepCol
        if (board[stepIdx] === EMPTY_CELL) {
          const step: CaptureStep = { from: { row, col }, to: { row: stepRow, col: stepCol } }
          allSteps.push(step)

          if (
            hasOtherPieceInRadius2(board, stepIdx, idx) ||
            hasOtherPieceInRadius2(board, idx, idx)
          ) {
            stepCandidates.push({ steps: [step], captures: 0 })
          }
        }
      }

      // 2) Sprawdź pojedyncze bicie
      const capRow = row + dr * 2
      const capCol = col + dc * 2
      if (capRow >= 0 && capRow < BOARD_SIZE && capCol >= 0 && capCol < BOARD_SIZE) {
        const overIdx = (row + dr) * BOARD_SIZE + (col + dc)
        const capIdx = capRow * BOARD_SIZE + capCol
        if (board[overIdx] === PIECE_CELL && board[capIdx] === EMPTY_CELL) {
          hasImmediateCapture = true
          captureCandidates.push({
            steps: [{ from: { row, col }, to: { row: capRow, col: capCol } }],
            captures: 1,
          })
        }
      }
    }

    // 3) Jeśli pionek może bić, dodaj też jego najdłuższą pełną sekwencję (jeśli ma > 1 bicie)
    if (hasImmediateCapture && !budget.timedOut) {
      const longestSteps = findLongestCaptureStepsFromPiece(board, idx, budget)
      if (longestSteps.length > 1) {
        captureCandidates.push({
          steps: longestSteps,
          captures: longestSteps.length,
        })
      }
    }
  }

  // Fallback: gdyby filtr lokalności odfiltrował wszystkie kroki (np. 1 pionek na planszy)
  if (stepCandidates.length === 0 && allSteps.length > 0) {
    for (const step of allSteps) {
      stepCandidates.push({ steps: [step], captures: 0 })
    }
  }

  return [...captureCandidates, ...stepCandidates]
}
