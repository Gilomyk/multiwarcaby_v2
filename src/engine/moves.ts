import type { ActionError, Board, Position, Cell } from './types'
import { isInsideBoard } from './board'

// Function to validate a move on the board. It checks if the move is valid based on the game rules and returns the result.

export type MoveValidationResult =
  | {
      ok: true
      type: 'step'
    }
  | {
      ok: true
      type: 'capture'
      over: Position
    }
  | {
      ok: false
      error: ActionError
    }

export function validateMove(board: Board, from: Position, to: Position): MoveValidationResult {
  if (!isInsideBoard(from) || board[from.row]?.[from.col] !== 'piece') {
    return {
      ok: false,
      error: 'invalid-source',
    }
  }

  if (!isInsideBoard(to)) {
    return {
      ok: false,
      error: 'invalid-destination',
    }
  }

  const rowDistance = Math.abs(to.row - from.row)
  const colDistance = Math.abs(to.col - from.col)

  if (isStepGeometry(rowDistance, colDistance)) {
    if (board[to.row]?.[to.col] !== 'empty') {
      return {
        ok: false,
        error: 'destination-occupied',
      }
    }

    return {
      ok: true,
      type: 'step',
    }
  }

  if (isCaptureGeometry(rowDistance, colDistance)) {
    if (board[to.row]?.[to.col] !== 'empty') {
      return {
        ok: false,
        error: 'destination-occupied',
      }
    }

    const over: Position = {
      row: (from.row + to.row) / 2,
      col: (from.col + to.col) / 2,
    }

    if (board[over.row]?.[over.col] !== 'piece') {
      return {
        ok: false,
        error: 'invalid-move',
      }
    }

    return {
      ok: true,
      type: 'capture',
      over,
    }
  }

  return {
    ok: false,
    error: 'invalid-move',
  }
}

function isStepGeometry(rowDistance: number, colDistance: number): boolean {
  return rowDistance <= 1 && colDistance <= 1 && (rowDistance !== 0 || colDistance !== 0)
}

function isCaptureGeometry(rowDistance: number, colDistance: number): boolean {
  const validRowDistance = rowDistance === 0 || rowDistance === 2
  const validColDistance = colDistance === 0 || colDistance === 2

  return validRowDistance && validColDistance && (rowDistance !== 0 || colDistance !== 0)
}

// Function to apply a move on the board. It updates the board state based on the move and returns the result.

export type ApplyMoveResult =
  | {
      ok: true
      board: Board
      type: 'step'
    }
  | {
      ok: true
      board: Board
      type: 'capture'
      over: Position
    }
  | {
      ok: false
      error: ActionError
    }

export function applyMove(board: Board, from: Position, to: Position): ApplyMoveResult {
  const validation = validateMove(board, from, to)

  if (!validation.ok) {
    return validation
  }

  const nextBoard: Cell[][] = board.map((row) => [...row])

  nextBoard[from.row]![from.col] = 'empty'
  nextBoard[to.row]![to.col] = 'piece'

  if (validation.type === 'capture') {
    nextBoard[validation.over.row]![validation.over.col] = 'empty'

    return {
      ok: true,
      board: nextBoard,
      type: 'capture',
      over: validation.over,
    }
  }

  return {
    ok: true,
    board: nextBoard,
    type: 'step',
  }
}
