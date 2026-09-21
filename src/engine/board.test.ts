import { describe, expect, it } from 'vitest'
import { BOARD_SIZE, createInitialBoard, isInsideBoard } from './board'

describe('createInitialBoard', () => {
  it('creates a 9x9 board', () => {
    const board = createInitialBoard()

    expect(board).toHaveLength(BOARD_SIZE)

    for (const row of board) {
      expect(row).toHaveLength(BOARD_SIZE)
    }
  })

  it('creates exactly 81 cells', () => {
    const board = createInitialBoard()

    const cellCount = board.reduce((sum, row) => sum + row.length, 0)

    expect(cellCount).toBe(81)
  })

  it('creates exactly 76 pieces and 5 empty cells', () => {
    const board = createInitialBoard()

    const cells = board.flat()

    const pieceCount = cells.filter((cell) => cell === 'piece').length
    const emptyCount = cells.filter((cell) => cell === 'empty').length

    expect(pieceCount).toBe(76)
    expect(emptyCount).toBe(5)
  })

  it('leaves the four corners and center empty', () => {
    const board = createInitialBoard()

    expect(board[0]?.[0]).toBe('empty')
    expect(board[0]?.[8]).toBe('empty')
    expect(board[8]?.[0]).toBe('empty')
    expect(board[8]?.[8]).toBe('empty')
    expect(board[4]?.[4]).toBe('empty')
  })

  it('fills every other cell with a piece', () => {
    const board = createInitialBoard()

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isEmptyPosition =
          (row === 0 && col === 0) ||
          (row === 0 && col === 8) ||
          (row === 8 && col === 0) ||
          (row === 8 && col === 8) ||
          (row === 4 && col === 4)

        if (!isEmptyPosition) {
          expect(board[row]?.[col]).toBe('piece')
        }
      }
    }
  })
})

describe('isInsideBoard', () => {
  it('accepts positions inside the board', () => {
    expect(isInsideBoard({ row: 0, col: 0 })).toBe(true)
    expect(isInsideBoard({ row: 4, col: 4 })).toBe(true)
    expect(isInsideBoard({ row: 8, col: 8 })).toBe(true)
  })

  it('rejects positions outside the board', () => {
    expect(isInsideBoard({ row: -1, col: 0 })).toBe(false)
    expect(isInsideBoard({ row: 0, col: -1 })).toBe(false)
    expect(isInsideBoard({ row: 9, col: 0 })).toBe(false)
    expect(isInsideBoard({ row: 0, col: 9 })).toBe(false)
  })

  it('rejects non-integer positions', () => {
    expect(isInsideBoard({ row: 1.5, col: 2 })).toBe(false)
    expect(isInsideBoard({ row: 2, col: 3.5 })).toBe(false)
  })
})
