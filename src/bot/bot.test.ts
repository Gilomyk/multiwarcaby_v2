import { describe, expect, it } from 'vitest'
import { BOARD_SIZE } from '../engine/board'
import { createInitialGameState, dispatch } from '../engine/game'
import type { Board, Cell, GameState } from '../engine/types'
import { planBotTurn } from './bot'
import { findBestCaptureSequence, toFastBoard } from './fastBoard'

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): Cell => 'empty'),
  )
}

function createStateWithBoard(board: Board): GameState {
  const base = createInitialGameState(2)
  return {
    ...base,
    board,
  }
}

function applyPlan(state: GameState, actions: ReturnType<typeof planBotTurn>['actions']): GameState {
  let current = state
  for (const action of actions) {
    const result = dispatch(current, action)
    expect(result.ok).toBe(true)
    if (result.ok) {
      current = result.state
    }
  }
  return current
}

describe('fastBoard & findBestCaptureSequence', () => {
  it('znajduje najdłuższą sekwencję bić i nie mutuje tablicy FastBoard', () => {
    const board = createEmptyBoard()
    // Pionek na (4, 0) może zbić (4, 1) -> (4, 2), a potem (4, 3) -> (4, 4)
    board[4]![0] = 'piece'
    board[4]![1] = 'piece'
    board[4]![3] = 'piece'
    // Osobne pojedyncze bicie w innym miejscu
    board[0]![0] = 'piece'
    board[0]![1] = 'piece'

    const fast = toFastBoard(board)
    const snapshot = new Uint8Array(fast)

    const result = findBestCaptureSequence(fast)

    expect(result.captures).toBe(2)
    expect(result.steps).toEqual([
      { from: { row: 4, col: 0 }, to: { row: 4, col: 2 } },
      { from: { row: 4, col: 2 }, to: { row: 4, col: 4 } },
    ])
    expect(fast).toEqual(snapshot)
  })
})

describe('planBotTurn (greedy-move / Wersja 1)', () => {
  it('wykonuje legalną pełną turę na planszy początkowej i przekazuje turę dalej', () => {
    const state = createInitialGameState(2)
    const plan = planBotTurn(state, { strategy: 'greedy-move' })

    expect(plan.expectedCaptures).toBeGreaterThanOrEqual(2)
    expect(plan.actions.length).toBeGreaterThan(0)

    const nextState = applyPlan(state, plan.actions)
    expect(nextState.currentPlayer).toBe(1)
    expect(nextState.scores[0]).toBe(plan.expectedCaptures)
    expect(nextState.turn.movesUsed).toBe(0)
    expect(nextState.turn.sequencePiece).toBeNull()
  })

  it('kończy turę wcześniej po 1. ruchu, gdy w 2. ruchu nie ma już żadnego bicia', () => {
    const board = createEmptyBoard()
    board[2]![2] = 'piece'
    board[2]![3] = 'piece'
    // Dodatkowe odległe pionki, żeby gra nie zakończyła się przedwcześnie po 1 biciu?
    // Tu po zbiciu zostaną 1 pionek, więc gra może się skończyć po endTurn, ale sama tura musi się zamknąć legalnie.
    const state = createStateWithBoard(board)

    const plan = planBotTurn(state, { strategy: 'greedy-move' })

    expect(plan.expectedCaptures).toBe(1)
    expect(plan.actions).toEqual([
      { type: 'move', from: { row: 2, col: 2 }, to: { row: 2, col: 4 } },
      { type: 'endTurn' },
    ])

    const nextState = applyPlan(state, plan.actions)
    expect(nextState.scores[0]).toBe(1)
    expect(nextState.turn.movesUsed).toBe(0)
  })

  it('wykonuje dwa niezależne bicia w jednej turze, gdy w 2. ruchu dostępne jest kolejne bicie', () => {
    const board = createEmptyBoard()
    // Pierwsze bicie: (0,0) -> (0,2) nad (0,1)
    board[0]![0] = 'piece'
    board[0]![1] = 'piece'
    // Drugie bicie: (6,6) -> (6,8) nad (6,7)
    board[6]![6] = 'piece'
    board[6]![7] = 'piece'

    const state = createStateWithBoard(board)
    const plan = planBotTurn(state, { strategy: 'greedy-move' })

    expect(plan.expectedCaptures).toBe(2)

    const nextState = applyPlan(state, plan.actions)
    expect(nextState.currentPlayer).toBe(1)
    expect(nextState.scores[0]).toBe(2)
  })
})

describe('planBotTurn (lookahead-turn / Wersja 2)', () => {
  it('wykonuje legalną turę na planszy początkowej w ramach budżetu', () => {
    const state = createInitialGameState(2)
    const plan = planBotTurn(state, { strategy: 'lookahead-turn' })

    expect(plan.expectedCaptures).toBeGreaterThanOrEqual(2)
    expect(plan.timedOut).toBe(false)

    const nextState = applyPlan(state, plan.actions)
    expect(nextState.currentPlayer).toBe(1)
    expect(nextState.scores[0]).toBe(plan.expectedCaptures)
    expect(nextState.turn.movesUsed).toBe(0)
  })

  it('potrafi poświęcić natychmiastowe 1 bicie na rzecz przygotowania serii 3 bić w 2. ruchu', () => {
    const board = createEmptyBoard()
    // Pułapka dla wersji zachłannej: pojedyncze bicie (0,0) -> (0,2) nad (0,1)
    board[0]![0] = 'piece'
    board[0]![1] = 'piece'

    // Układ przygotowawczy: przesunięcie (4,0) -> (4,1) otwiera serię 3 bić:
    // (4,1) -> (4,3) nad (4,2) -> (4,5) nad (4,4) -> (4,7) nad (4,6)
    board[4]![0] = 'piece'
    board[4]![2] = 'piece'
    board[4]![4] = 'piece'
    board[4]![6] = 'piece'

    const state = createStateWithBoard(board)

    const greedyPlan = planBotTurn(state, { strategy: 'greedy-move' })
    const lookaheadPlan = planBotTurn(state, { strategy: 'lookahead-turn' })

    expect(greedyPlan.expectedCaptures).toBe(1)
    expect(lookaheadPlan.expectedCaptures).toBe(3)

    const nextState = applyPlan(state, lookaheadPlan.actions)
    expect(nextState.currentPlayer).toBe(1)
    expect(nextState.scores[0]).toBe(3)
  })

  it('przy remisie punktowym preferuje bicie w 1. ruchu i wcześniejsze zakończenie tury', () => {
    const board = createEmptyBoard()
    board[2]![2] = 'piece'
    board[2]![3] = 'piece'

    const state = createStateWithBoard(board)
    const plan = planBotTurn(state, { strategy: 'lookahead-turn' })

    expect(plan.expectedCaptures).toBe(1)
    expect(plan.actions).toEqual([
      { type: 'move', from: { row: 2, col: 2 }, to: { row: 2, col: 4 } },
      { type: 'endTurn' },
    ])
  })
})
