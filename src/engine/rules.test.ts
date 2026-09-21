import { describe, expect, it } from 'vitest'
import type { Cell } from './types'
import { BOARD_SIZE } from './board'
import { getWinner, hasAnyCapture, hasCapturingCombination } from './rules'

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): Cell => 'empty'),
  )
}

describe('hasAnyCapture', () => {
  it('detects an immediate horizontal capture', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    expect(hasAnyCapture(board)).toBe(true)
  })

  it('detects an immediate diagonal capture', () => {
    const board = createEmptyBoard()

    board[2]![2] = 'piece'
    board[3]![3] = 'piece'

    expect(hasAnyCapture(board)).toBe(true)
  })

  it('does not detect a capture when all possible landing fields are occupied', () => {
    const board = createEmptyBoard()

    for (let col = 0; col < BOARD_SIZE; col++) {
      board[4]![col] = 'piece'
    }

    expect(hasAnyCapture(board)).toBe(false)
  })

  it('returns false when no capture exists', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    expect(hasAnyCapture(board)).toBe(false)
  })
})

describe('hasCapturingCombination', () => {
  it('returns true when a capture is immediately available', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    expect(hasCapturingCombination(board)).toBe(true)
  })

  it('returns true when the first move can prepare a horizontal capture', () => {
    const board = createEmptyBoard()

    /*
     * Początkowo:
     *
     * P _ P _ _
     *
     * Nie ma bezpośredniego bicia.
     *
     * Pierwszy ruch:
     *
     * P: (4,1) -> (4,2)
     *
     * _ P P _ _
     *
     * Następnie pionek z (4,2) może zbić
     * pionek z (4,3), lądując na (4,4).
     */

    board[4]![1] = 'piece'
    board[4]![3] = 'piece'

    expect(hasAnyCapture(board)).toBe(false)
    expect(hasCapturingCombination(board)).toBe(true)
  })

  it('returns true when the first move can prepare a diagonal capture', () => {
    const board = createEmptyBoard()

    /*
     * Początkowo pionki:
     *
     * (2,2)
     * (4,4)
     *
     * Nie sąsiadują ze sobą.
     *
     * Pierwszy ruch:
     * (2,2) -> (3,3)
     *
     * Następnie:
     * (3,3) -> (5,5)
     *
     * przez pionek na (4,4).
     */

    board[2]![2] = 'piece'
    board[4]![4] = 'piece'

    expect(hasAnyCapture(board)).toBe(false)
    expect(hasCapturingCombination(board)).toBe(true)
  })

  it('returns false when there is only one piece on the board', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    expect(hasCapturingCombination(board)).toBe(false)
  })

  it('returns false when two pieces are too far apart to prepare a capture in one move', () => {
    const board = createEmptyBoard()

    board[0]![0] = 'piece'
    board[8]![8] = 'piece'

    expect(hasAnyCapture(board)).toBe(false)
    expect(hasCapturingCombination(board)).toBe(false)
  })
})

describe('getWinner', () => {
  it('returns the player with the highest unique score', () => {
    expect(getWinner([5, 2])).toBe(0)
    expect(getWinner([1, 4, 2])).toBe(1)
    expect(getWinner([1, 2, 7, 3])).toBe(2)
  })

  it('returns null when two players share the highest score', () => {
    expect(getWinner([4, 4])).toBe(null)
    expect(getWinner([5, 2, 5])).toBe(null)
  })

  it('returns null when all players have the same score', () => {
    expect(getWinner([0, 0])).toBe(null)
    expect(getWinner([3, 3, 3, 3])).toBe(null)
  })
})
