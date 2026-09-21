import type { Board, Cell, Position } from './types'

export const BOARD_SIZE = 9

const CENTER_INDEX = Math.floor(BOARD_SIZE / 2)

export function isInsideBoard(position: Position): boolean {
  const { row, col } = position

  return (
    Number.isInteger(row) &&
    Number.isInteger(col) &&
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE
  )
}

export function createInitialBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col): Cell =>
      isInitialEmptyPosition({ row, col }) ? 'empty' : 'piece',
    ),
  )
}

function isInitialEmptyPosition(position: Position): boolean {
  const { row, col } = position

  const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1)

  const isCenter = row === CENTER_INDEX && col === CENTER_INDEX

  return isCorner || isCenter
}
