import type { Action, Position } from '../engine/types'

export type BotStrategy = 'greedy-move' | 'lookahead-turn'

export interface BotOptions {
  strategy?: BotStrategy
  maxNodes?: number /** Maksymalna liczba odwiedzonych stanów w przeszukiwaniu */
  maxTimeMs?: number /** Maksymalny czas obliczeń w ms */
  randomTieBreak?: boolean /** Losowy wybór spośród równie dobrych wariantów */
}

export interface CaptureStep {
  from: Position
  to: Position
}

export interface CaptureSequenceResult {
  captures: number
  steps: CaptureStep[]
  nodesVisited: number
  timedOut: boolean
}

export interface BotTurnPlan {
  actions: Action[]
  expectedCaptures: number
  nodesVisited: number
  timedOut: boolean
}
