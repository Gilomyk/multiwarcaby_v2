import type { Board, PlayerIndex, Position } from './types'
import { BOARD_SIZE } from './board'
import { applyMove, validateMove } from './moves'

const DIRECTIONS = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
] as const

export function hasAnyCapture(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row]?.[col] !== 'piece') {
        continue
      }

      const from: Position = { row, col }

      for (const direction of DIRECTIONS) {
        const to: Position = {
          row: row + direction.row * 2,
          col: col + direction.col * 2,
        }

        const result = validateMove(board, from, to)

        if (result.ok && result.type === 'capture') {
          return true
        }
      }
    }
  }

  return false
}

export function hasCapturingCombination(board: Board): boolean {
  /*
   * Przypadek A:
   * bicie jest dostępne już jako pierwszy ruch.
   */
  if (hasAnyCapture(board)) {
    return true
  }

  /*
   * Przypadek B:
   * sprawdzamy każdy legalny zwykły krok jako pierwszy ruch
   * i patrzymy, czy po nim powstaje bicie.
   */
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row]?.[col] !== 'piece') {
        continue
      }

      const from: Position = { row, col }

      for (const direction of DIRECTIONS) {
        const to: Position = {
          row: row + direction.row,
          col: col + direction.col,
        }

        const validation = validateMove(board, from, to)

        if (!validation.ok || validation.type !== 'step') {
          continue
        }

        const moveResult = applyMove(board, from, to)

        if (!moveResult.ok) {
          continue
        }

        if (hasAnyCapture(moveResult.board)) {
          return true
        }
      }
    }
  }

  return false
}

export function getWinner(scores: readonly number[]): PlayerIndex | null {
  if (scores.length === 0) {
    return null
  }

  const maxScore = Math.max(...scores)

  const winners = scores
    .map((score, index) => ({ score, index }))
    .filter(({ score }) => score === maxScore)

  if (winners.length !== 1) {
    return null
  }

  return winners[0]!.index
}
