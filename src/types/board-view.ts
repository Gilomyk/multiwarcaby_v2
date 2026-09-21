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
