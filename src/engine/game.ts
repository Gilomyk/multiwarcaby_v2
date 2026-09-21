import type { Action, ActionResult, GameEvent, GameState, PlayerIndex, Position } from './types'
import { createInitialBoard } from './board'
import { applyMove } from './moves'

export function createInitialGameState(playerCount: 2 | 3 | 4): GameState {
  return {
    board: createInitialBoard(),
    playerCount,
    currentPlayer: 0,
    scores: Array.from({ length: playerCount }, () => 0),
    turn: {
      movesUsed: 0,
      sequencePiece: null,
    },
    status: {
      type: 'playing',
    },
  }
}

export function dispatch(state: GameState, action: Action): ActionResult {
  switch (action.type) {
    case 'move':
      return dispatchMove(state, action.from, action.to)

    case 'endSequence':
      return dispatchEndSequence(state)

    case 'endTurn':
      return dispatchEndTurn(state)
  }
}

function dispatchMove(state: GameState, from: Position, to: Position): ActionResult {
  const isSequenceContinuation = state.turn.sequencePiece !== null

  if (!isSequenceContinuation && state.turn.movesUsed === 2) {
    return {
      ok: false,
      error: 'no-moves-left',
    }
  }

  if (isSequenceContinuation && !samePosition(state.turn.sequencePiece!, from)) {
    return {
      ok: false,
      error: 'invalid-move',
    }
  }

  const moveResult = applyMove(state.board, from, to)

  if (!moveResult.ok) {
    return moveResult
  }

  if (isSequenceContinuation && moveResult.type !== 'capture') {
    return {
      ok: false,
      error: 'invalid-move',
    }
  }

  const movesUsed = isSequenceContinuation
    ? state.turn.movesUsed
    : incrementMovesUsed(state.turn.movesUsed)

  const scores = [...state.scores]

  if (moveResult.type === 'capture') {
    scores[state.currentPlayer] = (scores[state.currentPlayer] ?? 0) + 1
  }

  const nextState: GameState = {
    ...state,
    board: moveResult.board,
    scores,
    turn: {
      movesUsed,
      sequencePiece: moveResult.type === 'capture' ? to : null,
    },
  }

  const moveEvent: GameEvent =
    moveResult.type === 'capture'
      ? {
          type: 'capture',
          from,
          over: moveResult.over,
          to,
        }
      : {
          type: 'step',
          from,
          to,
        }

  /*
   * Zwykły krok kończy ruch automatycznie.
   *
   * Jeżeli był to drugi ruch, kończy się również cała tura.
   */
  if (moveResult.type === 'step' && movesUsed === 2) {
    return finishTurn(nextState, [moveEvent])
  }

  /*
   * Capture NIE kończy ruchu automatycznie.
   *
   * Nawet przy movesUsed === 2 seria może być kontynuowana.
   */
  return {
    ok: true,
    state: nextState,
    events: [moveEvent],
  }
}

function dispatchEndSequence(state: GameState): ActionResult {
  if (state.turn.sequencePiece === null) {
    return {
      ok: false,
      error: 'invalid-move',
    }
  }

  const nextState: GameState = {
    ...state,
    turn: {
      ...state.turn,
      sequencePiece: null,
    },
  }

  /*
   * Jeżeli zakończyliśmy serię będącą drugim ruchem,
   * tura jest automatycznie zakończona.
   */
  if (state.turn.movesUsed === 2) {
    return finishTurn(nextState)
  }

  /*
   * Po pierwszej serii gracz nadal ma drugi ruch.
   */
  return {
    ok: true,
    state: nextState,
    events: [],
  }
}

function dispatchEndTurn(state: GameState): ActionResult {
  if (state.turn.movesUsed === 0) {
    return {
      ok: false,
      error: 'must-make-move',
    }
  }

  return finishTurn(state)
}

function finishTurn(state: GameState, previousEvents: GameEvent[] = []): ActionResult {
  const nextPlayer = getNextPlayer(state.currentPlayer, state.playerCount)

  const nextState: GameState = {
    ...state,
    currentPlayer: nextPlayer,
    turn: {
      movesUsed: 0,
      sequencePiece: null,
    },
  }

  return {
    ok: true,
    state: nextState,
    events: [
      ...previousEvents,
      {
        type: 'turn-ended',
        nextPlayer,
      },
    ],
  }
}

function getNextPlayer(currentPlayer: PlayerIndex, playerCount: 2 | 3 | 4): PlayerIndex {
  return (currentPlayer + 1) % playerCount
}

function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col
}

function incrementMovesUsed(movesUsed: 0 | 1 | 2): 1 | 2 {
  return movesUsed === 0 ? 1 : 2
}
