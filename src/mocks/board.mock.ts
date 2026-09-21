import type { CellView, PieceColor } from '@/types/board-view'

const SIZE = 9

// 5 empty cells: center (4,4) and 4 corners of the board
const EMPTY_CELLS = new Set(['0,0', '0,8', '8,0', '8,8', '4,4'])

function pieceColor(_row: number): PieceColor {
  // return row < SIZE / 2 ? 'slate' : 'gold'
  return 'gold'
}

export function createMockBoard(): CellView[][] {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => {
      const isEmpty = EMPTY_CELLS.has(`${row},${col}`)
      const isDark = (row + col) % 2 === 1
      return {
        row,
        col,
        isDark,
        piece: isEmpty ? null : { color: pieceColor(row) },
        isSelected: false,
        isTarget: false,
      } satisfies CellView
    }),
  )
}
