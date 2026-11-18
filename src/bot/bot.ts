import type { Action, GameState } from '../engine/types'
import {
  TOTAL_CELLS,
  applyStepsOnFastBoard,
  countPieces,
  createSearchBudget,
  findApproachStepMoves,
  findBestCaptureSequence,
  findMove1Candidates,
  toFastBoard,
} from './fastBoard'
import type { BotOptions, BotTurnPlan, CaptureStep } from './types'

/**
 * Planuje całą turę bota (listę akcji do przekazania do `dispatch`).
 * Obsługuje zarówno Wersję 1 (`greedy-move`), jak i Wersję 2 (`lookahead-turn`).
 */
export function planBotTurn(state: GameState, options: BotOptions = {}): BotTurnPlan {
  const strategy = options.strategy ?? 'greedy-move'

  if (strategy === 'lookahead-turn') {
    return planLookaheadTurn(state, options)
  }

  return planGreedyMoveTurn(state, options)
}

function buildTurnActions(
  move1Steps: readonly CaptureStep[],
  move1Captures: number,
  move2Steps: readonly CaptureStep[],
  move2Captures: number,
): Action[] {
  const actions: Action[] = []

  for (const step of move1Steps) {
    actions.push({ type: 'move', from: step.from, to: step.to })
  }

  if (move2Captures > 0) {
    if (move1Captures > 0) {
      actions.push({ type: 'endSequence' })
    }
    for (const step of move2Steps) {
      actions.push({ type: 'move', from: step.from, to: step.to })
    }
    actions.push({ type: 'endSequence' })
  } else {
    // Po 1. ruchu bez bić w 2. ruchu kończymy turę wcześniej
    actions.push({ type: 'endTurn' })
  }

  return actions
}

interface EvaluatedTurn {
  move1Steps: CaptureStep[]
  move1Captures: number
  move2Steps: CaptureStep[]
  move2Captures: number
  totalCaptures: number
}

function compareEvaluatedTurns(a: EvaluatedTurn, b: EvaluatedTurn): number {
  if (a.totalCaptures !== b.totalCaptures) {
    return a.totalCaptures - b.totalCaptures
  }

  // Remis w sumie bić: preferujemy krótszą turę (zakończenie po 1. ruchu)
  const aEndsEarly = a.move2Captures === 0 ? 1 : 0
  const bEndsEarly = b.move2Captures === 0 ? 1 : 0
  if (aEndsEarly !== bEndsEarly) {
    return aEndsEarly - bEndsEarly
  }

  // Dalej: preferujemy więcej bić już w 1. ruchu
  return a.move1Captures - b.move1Captures
}

function planLookaheadTurn(state: GameState, options: BotOptions): BotTurnPlan {
  const budget = createSearchBudget(options.maxNodes, options.maxTimeMs)
  const baseBoard = toFastBoard(state.board)
  const initialPieces = countPieces(baseBoard)
  const candidates = findMove1Candidates(baseBoard, budget)

  if (candidates.length === 0) {
    return {
      actions: [],
      expectedCaptures: 0,
      nodesVisited: budget.nodesVisited,
      timedOut: budget.timedOut,
    }
  }

  const workBoard = new Uint8Array(TOTAL_CELLS)
  let bestPlans: EvaluatedTurn[] = []

  for (const candidate of candidates) {
    if (budget.timedOut) break

    const currentBestTotal = bestPlans[0]?.totalCaptures ?? -1
    const maxPossibleAfterMove1 = initialPieces - candidate.captures - 1
    const upperBound = candidate.captures + Math.max(0, maxPossibleAfterMove1)

    // Proste przycinanie: jeśli nie da się już pobić rekordu, pomijamy ocenę 2. ruchu
    if (upperBound < currentBestTotal) {
      continue
    }

    workBoard.set(baseBoard)
    applyStepsOnFastBoard(workBoard, candidate.steps)

    const move2 = findBestCaptureSequence(workBoard, budget)
    const evaluated: EvaluatedTurn = {
      move1Steps: candidate.steps,
      move1Captures: candidate.captures,
      move2Steps: move2.steps,
      move2Captures: move2.captures,
      totalCaptures: candidate.captures + move2.captures,
    }

    if (bestPlans.length === 0) {
      bestPlans.push(evaluated)
      continue
    }

    const cmp = compareEvaluatedTurns(evaluated, bestPlans[0]!)
    if (cmp > 0) {
      bestPlans = [evaluated]
    } else if (cmp === 0 && options.randomTieBreak) {
      bestPlans.push(evaluated)
    }
  }

  const chosen =
    options.randomTieBreak && bestPlans.length > 1
      ? bestPlans[Math.floor(Math.random() * bestPlans.length)]!
      : bestPlans[0]!

  return {
    actions: buildTurnActions(
      chosen.move1Steps,
      chosen.move1Captures,
      chosen.move2Steps,
      chosen.move2Captures,
    ),
    expectedCaptures: chosen.totalCaptures,
    nodesVisited: budget.nodesVisited,
    timedOut: budget.timedOut,
  }
}

function planGreedyMoveTurn(state: GameState, options: BotOptions): BotTurnPlan {
  const budget = createSearchBudget(options.maxNodes, options.maxTimeMs)
  const board = toFastBoard(state.board)
  const randomTieBreak = options.randomTieBreak ?? false

  // --- RUCH 1 ---
  const move1Capture = findBestCaptureSequence(board, budget, randomTieBreak)

  if (move1Capture.captures > 0) {
    applyStepsOnFastBoard(board, move1Capture.steps)
    const move2Capture = findBestCaptureSequence(board, budget, randomTieBreak)

    return {
      actions: buildTurnActions(
        move1Capture.steps,
        move1Capture.captures,
        move2Capture.steps,
        move2Capture.captures,
      ),
      expectedCaptures: move1Capture.captures + move2Capture.captures,
      nodesVisited: budget.nodesVisited,
      timedOut: budget.timedOut,
    }
  }

  // Brak bicia w 1. ruchu -> zbliżamy się pionkiem do innego pionka w obrębie 2 kratek
  const stepMoves = findApproachStepMoves(board)
  const firstStep =
    stepMoves.length === 0
      ? undefined
      : randomTieBreak && stepMoves.length > 1
        ? stepMoves[Math.floor(Math.random() * stepMoves.length)]
        : stepMoves[0]

  if (!firstStep) {
    return {
      actions: [],
      expectedCaptures: 0,
      nodesVisited: budget.nodesVisited,
      timedOut: budget.timedOut,
    }
  }

  applyStepsOnFastBoard(board, [firstStep])
  const move2Capture = findBestCaptureSequence(board, budget, randomTieBreak)

  return {
    actions: buildTurnActions([firstStep], 0, move2Capture.steps, move2Capture.captures),
    expectedCaptures: move2Capture.captures,
    nodesVisited: budget.nodesVisited,
    timedOut: budget.timedOut,
  }
}
