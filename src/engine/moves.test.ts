import { describe, expect, it } from 'vitest'
import type { Board, Cell } from './types'
import { BOARD_SIZE } from './board'
import { validateMove, applyMove } from './moves'

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): Cell => 'empty'),
  )
}

describe('validateMove - step', () => {
  it('allows a one-cell horizontal move', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = validateMove(board, { row: 4, col: 4 }, { row: 4, col: 5 })

    expect(result).toEqual({
      ok: true,
      type: 'step',
    })
  })

  it('allows a one-cell vertical move', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = validateMove(board, { row: 4, col: 4 }, { row: 5, col: 4 })

    expect(result).toEqual({
      ok: true,
      type: 'step',
    })
  })

  it('allows a one-cell diagonal move', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = validateMove(board, { row: 4, col: 4 }, { row: 5, col: 5 })

    expect(result).toEqual({
      ok: true,
      type: 'step',
    })
  })

  it('rejects a move to an occupied destination', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'
    board[4]![5] = 'piece'

    const result = validateMove(board, { row: 4, col: 4 }, { row: 4, col: 5 })

    expect(result).toEqual({
      ok: false,
      error: 'destination-occupied',
    })
  })
})

describe('validateMove - capture', () => {
  it('allows a horizontal capture', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    const result = validateMove(board, { row: 4, col: 2 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: true,
      type: 'capture',
      over: { row: 4, col: 3 },
    })
  })

  it('allows a diagonal capture', () => {
    const board = createEmptyBoard()

    board[2]![2] = 'piece'
    board[3]![3] = 'piece'

    const result = validateMove(board, { row: 2, col: 2 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: true,
      type: 'capture',
      over: { row: 3, col: 3 },
    })
  })

  it('rejects a capture when there is no piece to jump over', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'

    const result = validateMove(board, { row: 4, col: 2 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })

  it('rejects a capture when the destination is occupied', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'
    board[4]![4] = 'piece'

    const result = validateMove(board, { row: 4, col: 2 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: false,
      error: 'destination-occupied',
    })
  })
})

describe('validateMove - invalid positions', () => {
  it('rejects an empty source cell', () => {
    const board = createEmptyBoard()

    const result = validateMove(board, { row: 4, col: 4 }, { row: 4, col: 5 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-source',
    })
  })

  it('rejects a source outside the board', () => {
    const board = createEmptyBoard()

    const result = validateMove(board, { row: -1, col: 4 }, { row: 0, col: 4 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-source',
    })
  })

  it('rejects a destination outside the board', () => {
    const board = createEmptyBoard()

    board[0]![0] = 'piece'

    const result = validateMove(board, { row: 0, col: 0 }, { row: -1, col: 0 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-destination',
    })
  })

  it('rejects movement longer than two cells', () => {
    const board = createEmptyBoard()

    board[4]![1] = 'piece'

    const result = validateMove(board, { row: 4, col: 1 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })

  it('rejects moving to the same cell', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = validateMove(board, { row: 4, col: 4 }, { row: 4, col: 4 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })
})

describe('applyMove', () => {
  it('moves a piece during a normal step', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = applyMove(board, { row: 4, col: 4 }, { row: 4, col: 5 })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.type).toBe('step')
    expect(result.board[4]?.[4]).toBe('empty')
    expect(result.board[4]?.[5]).toBe('piece')
  })

  it('removes the captured piece', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    const result = applyMove(board, { row: 4, col: 2 }, { row: 4, col: 4 })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.type).toBe('capture')
    expect(result.board[4]?.[2]).toBe('empty')
    expect(result.board[4]?.[3]).toBe('empty')
    expect(result.board[4]?.[4]).toBe('piece')
  })

  it('returns the captured piece position', () => {
    const board = createEmptyBoard()

    board[2]![2] = 'piece'
    board[3]![3] = 'piece'

    const result = applyMove(board, { row: 2, col: 2 }, { row: 4, col: 4 })

    expect(result).toMatchObject({
      ok: true,
      type: 'capture',
      over: { row: 3, col: 3 },
    })
  })

  it('does not mutate the original board', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = applyMove(board, { row: 4, col: 4 }, { row: 4, col: 5 })

    expect(result.ok).toBe(true)

    expect(board[4]?.[4]).toBe('piece')
    expect(board[4]?.[5]).toBe('empty')
  })

  it('returns an error for an invalid move without changing the board', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const result = applyMove(board, { row: 4, col: 4 }, { row: 4, col: 7 })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })

    expect(board[4]?.[4]).toBe('piece')
  })
})
