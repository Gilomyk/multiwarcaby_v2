import { describe, expect, it } from 'vitest'
import type { Cell, GameState } from './types'
import { BOARD_SIZE } from './board'
import { createInitialGameState, dispatch } from './game'

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): Cell => 'empty'),
  )
}

function createTestState(board: Cell[][] = createEmptyBoard()): GameState {
  return {
    ...createInitialGameState(2),
    board,
  }
}

describe('createInitialGameState', () => {
  it('creates a game for two players', () => {
    const state = createInitialGameState(2)

    expect(state.playerCount).toBe(2)
    expect(state.currentPlayer).toBe(0)
    expect(state.scores).toEqual([0, 0])
  })

  it('creates a game for three players', () => {
    const state = createInitialGameState(3)

    expect(state.playerCount).toBe(3)
    expect(state.scores).toEqual([0, 0, 0])
  })

  it('creates a game for four players', () => {
    const state = createInitialGameState(4)

    expect(state.playerCount).toBe(4)
    expect(state.scores).toEqual([0, 0, 0, 0])
  })

  it('starts with no moves used', () => {
    const state = createInitialGameState(2)

    expect(state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })
  })

  it('starts with playing status', () => {
    const state = createInitialGameState(2)

    expect(state.status).toEqual({
      type: 'playing',
    })
  })

  it('creates the initial board', () => {
    const state = createInitialGameState(2)

    expect(state.board).toHaveLength(9)

    const cells = state.board.flat()

    expect(cells.filter((cell) => cell === 'piece')).toHaveLength(76)
    expect(cells.filter((cell) => cell === 'empty')).toHaveLength(5)
  })
})

describe('dispatch - normal moves', () => {
  it('uses one move after a normal step', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const state = createTestState(board)

    const result = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 4 },
      to: { row: 4, col: 5 },
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.turn).toEqual({
      movesUsed: 1,
      sequencePiece: null,
    })

    expect(result.state.currentPlayer).toBe(0)
    expect(result.state.board[4]?.[4]).toBe('empty')
    expect(result.state.board[4]?.[5]).toBe('piece')

    expect(result.events).toEqual([
      {
        type: 'step',
        from: { row: 4, col: 4 },
        to: { row: 4, col: 5 },
      },
    ])
  })

  it('automatically ends the turn after the second normal move', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'
    board[2]![2] = 'piece'

    const state = createTestState(board)

    const firstMove = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 4 },
      to: { row: 4, col: 5 },
    })

    expect(firstMove.ok).toBe(true)

    if (!firstMove.ok) {
      return
    }

    const secondMove = dispatch(firstMove.state, {
      type: 'move',
      from: { row: 2, col: 2 },
      to: { row: 2, col: 3 },
    })

    expect(secondMove.ok).toBe(true)

    if (!secondMove.ok) {
      return
    }

    expect(secondMove.state.currentPlayer).toBe(1)

    expect(secondMove.state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })

    expect(secondMove.events).toEqual([
      {
        type: 'step',
        from: { row: 2, col: 2 },
        to: { row: 2, col: 3 },
      },
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
    ])
  })

  it('does not mutate the previous state', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const state = createTestState(board)

    const result = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 4 },
      to: { row: 4, col: 5 },
    })

    expect(result.ok).toBe(true)

    expect(state.board[4]?.[4]).toBe('piece')
    expect(state.board[4]?.[5]).toBe('empty')
    expect(state.turn.movesUsed).toBe(0)
  })
})

describe('dispatch - capture sequence', () => {
  it('starts a capture sequence and increases score', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    const state = createTestState(board)

    const result = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 2 },
      to: { row: 4, col: 4 },
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.scores).toEqual([1, 0])

    expect(result.state.turn).toEqual({
      movesUsed: 1,
      sequencePiece: { row: 4, col: 4 },
    })

    expect(result.events).toEqual([
      {
        type: 'capture',
        from: { row: 4, col: 2 },
        over: { row: 4, col: 3 },
        to: { row: 4, col: 4 },
      },
    ])
  })

  it('continues a capture sequence without using another move', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'
    board[4]![3] = 'piece'

    const state = createTestState(board)

    const firstCapture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(firstCapture.ok).toBe(true)

    if (!firstCapture.ok) {
      return
    }

    const secondCapture = dispatch(firstCapture.state, {
      type: 'move',
      from: { row: 4, col: 2 },
      to: { row: 4, col: 4 },
    })

    expect(secondCapture.ok).toBe(true)

    if (!secondCapture.ok) {
      return
    }

    expect(secondCapture.state.turn).toEqual({
      movesUsed: 1,
      sequencePiece: { row: 4, col: 4 },
    })

    expect(secondCapture.state.scores).toEqual([2, 0])
  })

  it('rejects moving another piece during an open capture sequence', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'
    board[2]![2] = 'piece'

    const state = createTestState(board)

    const firstCapture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(firstCapture.ok).toBe(true)

    if (!firstCapture.ok) {
      return
    }

    const result = dispatch(firstCapture.state, {
      type: 'move',
      from: { row: 2, col: 2 },
      to: { row: 2, col: 3 },
    })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })

  it('rejects a normal step as continuation of a capture sequence', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'

    const state = createTestState(board)

    const firstCapture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(firstCapture.ok).toBe(true)

    if (!firstCapture.ok) {
      return
    }

    const result = dispatch(firstCapture.state, {
      type: 'move',
      from: { row: 4, col: 2 },
      to: { row: 4, col: 3 },
    })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })
})

describe('dispatch - endSequence', () => {
  it('ends the first capture sequence and allows a second move', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'

    const state = createTestState(board)

    const capture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(capture.ok).toBe(true)

    if (!capture.ok) {
      return
    }

    const result = dispatch(capture.state, {
      type: 'endSequence',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.currentPlayer).toBe(0)

    expect(result.state.turn).toEqual({
      movesUsed: 1,
      sequencePiece: null,
    })

    expect(result.events).toEqual([])
  })

  it('automatically ends the turn when ending the second capture sequence', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'
    board[2]![0] = 'piece'
    board[2]![1] = 'piece'

    const state = createTestState(board)

    const firstCapture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(firstCapture.ok).toBe(true)

    if (!firstCapture.ok) {
      return
    }

    const endFirstSequence = dispatch(firstCapture.state, {
      type: 'endSequence',
    })

    expect(endFirstSequence.ok).toBe(true)

    if (!endFirstSequence.ok) {
      return
    }

    const secondCapture = dispatch(endFirstSequence.state, {
      type: 'move',
      from: { row: 2, col: 0 },
      to: { row: 2, col: 2 },
    })

    expect(secondCapture.ok).toBe(true)

    if (!secondCapture.ok) {
      return
    }

    expect(secondCapture.state.turn.movesUsed).toBe(2)

    const endSecondSequence = dispatch(secondCapture.state, {
      type: 'endSequence',
    })

    expect(endSecondSequence.ok).toBe(true)

    if (!endSecondSequence.ok) {
      return
    }

    expect(endSecondSequence.state.currentPlayer).toBe(1)

    expect(endSecondSequence.state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })

    expect(endSecondSequence.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
    ])
  })

  it('rejects endSequence when no capture sequence is open', () => {
    const state = createTestState()

    const result = dispatch(state, {
      type: 'endSequence',
    })

    expect(result).toEqual({
      ok: false,
      error: 'invalid-move',
    })
  })
})

describe('dispatch - endTurn', () => {
  it('allows ending the turn after one move', () => {
    const board = createEmptyBoard()

    // pionek używany w teście ruchu
    board[4]![4] = 'piece'

    // niezależne bicie, żeby gra nie zakończyła się po turze
    board[7]![5] = 'piece'
    board[7]![6] = 'piece'

    const state = createTestState(board)

    const move = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 4 },
      to: { row: 4, col: 5 },
    })

    expect(move.ok).toBe(true)

    if (!move.ok) {
      return
    }

    const result = dispatch(move.state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.currentPlayer).toBe(1)

    expect(result.state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })

    expect(result.state.status).toEqual({
      type: 'playing',
    })

    expect(result.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
    ])
  })

  it('allows ending the turn during an open capture sequence', () => {
    const board = createEmptyBoard()

    board[4]![0] = 'piece'
    board[4]![1] = 'piece'

    const state = createTestState(board)

    const capture = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 0 },
      to: { row: 4, col: 2 },
    })

    expect(capture.ok).toBe(true)

    if (!capture.ok) {
      return
    }

    const result = dispatch(capture.state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.currentPlayer).toBe(1)

    expect(result.state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })
  })

  it('rejects ending the turn before making any move', () => {
    const state = createTestState()

    const result = dispatch(state, {
      type: 'endTurn',
    })

    expect(result).toEqual({
      ok: false,
      error: 'must-make-move',
    })
  })
})

describe('dispatch - player order', () => {
  it('cycles correctly through three players', () => {
    const initialState = createInitialGameState(3)

    const firstTurnState: GameState = {
      ...initialState,
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const firstEnd = dispatch(firstTurnState, {
      type: 'endTurn',
    })

    expect(firstEnd.ok).toBe(true)

    if (!firstEnd.ok) {
      return
    }

    expect(firstEnd.state.currentPlayer).toBe(1)

    const secondTurnState: GameState = {
      ...firstEnd.state,
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const secondEnd = dispatch(secondTurnState, {
      type: 'endTurn',
    })

    expect(secondEnd.ok).toBe(true)

    if (!secondEnd.ok) {
      return
    }

    expect(secondEnd.state.currentPlayer).toBe(2)

    const thirdTurnState: GameState = {
      ...secondEnd.state,
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const thirdEnd = dispatch(thirdTurnState, {
      type: 'endTurn',
    })

    expect(thirdEnd.ok).toBe(true)

    if (!thirdEnd.ok) {
      return
    }

    expect(thirdEnd.state.currentPlayer).toBe(0)
  })
})

describe('dispatch - game over', () => {
  it('finishes the game when no capturing combination exists', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const state: GameState = {
      ...createTestState(board),
      scores: [3, 1],
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const result = dispatch(state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.status).toEqual({
      type: 'finished',
      winner: 0,
    })

    expect(result.state.currentPlayer).toBe(1)

    expect(result.state.turn).toEqual({
      movesUsed: 0,
      sequencePiece: null,
    })

    expect(result.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
      {
        type: 'game-over',
        winner: 0,
      },
    ])
  })

  it('finishes the game as a draw when the highest score is tied', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const state: GameState = {
      ...createTestState(board),
      scores: [2, 2],
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const result = dispatch(state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.status).toEqual({
      type: 'finished',
      winner: null,
    })

    expect(result.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
      {
        type: 'game-over',
        winner: null,
      },
    ])
  })

  it('does not finish the game when a first move can prepare a capture', () => {
    const board = createEmptyBoard()

    board[4]![1] = 'piece'
    board[4]![3] = 'piece'

    /*
     * Nie ma teraz bicia:
     *
     * P _ P
     *
     * Ale:
     *
     * (4,1) -> (4,2)
     *
     * daje:
     *
     * _ P P _
     *
     * i wtedy możliwe jest:
     *
     * (4,2) -> (4,4)
     */

    const state: GameState = {
      ...createTestState(board),
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const result = dispatch(state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.status).toEqual({
      type: 'playing',
    })

    expect(result.state.currentPlayer).toBe(1)

    expect(result.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
    ])
  })

  it('does not finish the game when an immediate capture exists', () => {
    const board = createEmptyBoard()

    board[4]![2] = 'piece'
    board[4]![3] = 'piece'

    const state: GameState = {
      ...createTestState(board),
      turn: {
        movesUsed: 1,
        sequencePiece: null,
      },
    }

    const result = dispatch(state, {
      type: 'endTurn',
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.state.status).toEqual({
      type: 'playing',
    })

    expect(result.events).toEqual([
      {
        type: 'turn-ended',
        nextPlayer: 1,
      },
    ])
  })

  it('rejects actions after the game has finished', () => {
    const board = createEmptyBoard()

    board[4]![4] = 'piece'

    const state: GameState = {
      ...createTestState(board),
      status: {
        type: 'finished',
        winner: 0,
      },
    }

    const result = dispatch(state, {
      type: 'move',
      from: { row: 4, col: 4 },
      to: { row: 4, col: 5 },
    })

    expect(result).toEqual({
      ok: false,
      error: 'game-finished',
    })
  })
})
