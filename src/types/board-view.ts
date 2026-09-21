import type { Position } from '@/engine/types'

export type PieceColor = 'gold' | 'slate'

export interface PieceView {
  color: PieceColor
}

export interface CellView {
  row: number
  col: number
  isDark: boolean
  piece: PieceView | null
  isSelected: boolean
  isTarget: boolean
}

export interface PieceMoveView {
  from: Position
  to: Position
}
