export interface Position {
  row: number
  col: number
} // 0..8, row 0 = góra planszy

export type Cell = 'empty' | 'piece' // pionki są neutralne
export type Board = readonly (readonly Cell[])[] // 9×9
export type PlayerIndex = number // 0..playerCount-1

export interface TurnState {
  movesUsed: 0 | 1 | 2
  sequencePiece: Position | null // pionek w otwartej serii bić
}

export type GameStatus = { type: 'playing' } | { type: 'finished'; winner: PlayerIndex | null } // null = remis

export interface GameState {
  board: Board
  playerCount: 2 | 3 | 4
  currentPlayer: PlayerIndex
  scores: readonly number[]
  turn: TurnState
  status: GameStatus
}

export type Action =
  | { type: 'move'; from: Position; to: Position } // krok albo skok, silnik rozpoznaje po odległości
  | { type: 'endSequence' }
  | { type: 'endTurn' }

export type GameEvent =
  | { type: 'step'; from: Position; to: Position }
  | { type: 'capture'; from: Position; over: Position; to: Position }
  | { type: 'turn-ended'; nextPlayer: PlayerIndex }
  | { type: 'game-over'; winner: PlayerIndex | null }

export type ActionError =
  | 'destination-occupied'
  | 'invalid-source'
  | 'invalid-destination'
  | 'invalid-move'
  | 'no-moves-left'
  | 'must-make-move'

export type ActionResult =
  { ok: true; state: GameState; events: GameEvent[] } | { ok: false; error: ActionError }
