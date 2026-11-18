import { planBotTurn } from '../src/bot/bot'
import type { BotStrategy } from '../src/bot/types'
import { createInitialGameState, dispatch } from '../src/engine/game'

interface MatchupConfig {
  label: string
  bot1: BotStrategy
  bot2: BotStrategy
}

interface SingleGameStats {
  turns: number
  moveActions: number
  scores: [number, number]
  maxStreak: [number, number]
  winner: number | null
}

interface AggregateStats {
  games: number
  avgTurns: number
  avgMoveActions: number
  avgScore1: number
  avgScore2: number
  avgMaxStreak1: number
  avgMaxStreak2: number
  wins1: number
  wins2: number
  draws: number
  durationMs: number
}

const MATCHUPS: readonly MatchupConfig[] = [
  { label: 'Łatwy vs Łatwy', bot1: 'greedy-move', bot2: 'greedy-move' },
  { label: 'Łatwy vs Trudny', bot1: 'greedy-move', bot2: 'lookahead-turn' },
  { label: 'Trudny vs Łatwy', bot1: 'lookahead-turn', bot2: 'greedy-move' },
  { label: 'Trudny vs Trudny', bot1: 'lookahead-turn', bot2: 'lookahead-turn' },
]

const MAX_TURNS_PER_GAME = 500

function parseGamesArg(argv: readonly string[]): number {
  const arg = argv.find((item) => item.startsWith('--games='))
  if (!arg) return 100

  const parsed = Number.parseInt(arg.slice('--games='.length), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 100
}

function playSingleGame(
  bot1: BotStrategy,
  bot2: BotStrategy,
  randomTieBreak: boolean,
): SingleGameStats {
  let state = createInitialGameState(2)
  let turns = 0
  let moveActions = 0
  const maxStreak: [number, number] = [0, 0]

  while (state.status.type === 'playing' && turns < MAX_TURNS_PER_GAME) {
    const player = state.currentPlayer
    const strategy = player === 0 ? bot1 : bot2
    const plan = planBotTurn(state, { strategy, randomTieBreak })

    if (plan.actions.length === 0) {
      break
    }

    let currentStreak = 0

    for (const action of plan.actions) {
      if (state.status.type !== 'playing') break

      const result = dispatch(state, action)
      if (!result.ok) {
        throw new Error(`Nielegalna akcja bota (${strategy}): ${result.error}`)
      }

      if (action.type === 'move') {
        moveActions++
      }

      const hasCapture = result.events.some((e) => e.type === 'capture')
      const hasStep = result.events.some((e) => e.type === 'step')
      const hasTurnEnded = result.events.some((e) => e.type === 'turn-ended')

      if (hasCapture) {
        currentStreak++
        if (currentStreak > maxStreak[player]!) {
          maxStreak[player] = currentStreak
        }
      } else if (hasStep || action.type === 'endSequence' || action.type === 'endTurn') {
        currentStreak = 0
      }

      if (hasTurnEnded) {
        currentStreak = 0
      }

      state = result.state
    }

    turns++
  }

  return {
    turns,
    moveActions,
    scores: [state.scores[0] ?? 0, state.scores[1] ?? 0],
    maxStreak,
    winner: state.status.type === 'finished' ? state.status.winner : null,
  }
}

function renderProgressBar(
  label: string,
  completed: number,
  total: number,
): void {
  const width = 20
  const ratio = total > 0 ? completed / total : 1
  const filled = Math.round(ratio * width)
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
  const pct = (ratio * 100).toFixed(1).padStart(5, ' ')
  process.stdout.write(`\r${label.padEnd(18, ' ')} [${bar}] ${pct}% (${completed}/${total})`)
}

function runBatch(
  matchup: MatchupConfig,
  games: number,
  randomTieBreak: boolean,
  onProgress?: (completedInBatch: number) => void,
): AggregateStats {
  const startMs = performance.now()

  let totalTurns = 0
  let totalMoveActions = 0
  let totalScore1 = 0
  let totalScore2 = 0
  let totalMaxStreak1 = 0
  let totalMaxStreak2 = 0
  let wins1 = 0
  let wins2 = 0
  let draws = 0

  for (let i = 0; i < games; i++) {
    const game = playSingleGame(matchup.bot1, matchup.bot2, randomTieBreak)
    totalTurns += game.turns
    totalMoveActions += game.moveActions
    totalScore1 += game.scores[0]
    totalScore2 += game.scores[1]
    totalMaxStreak1 += game.maxStreak[0]
    totalMaxStreak2 += game.maxStreak[1]

    if (game.winner === 0) wins1++
    else if (game.winner === 1) wins2++
    else draws++

    onProgress?.(i + 1)
  }

  return {
    games,
    avgTurns: totalTurns / games,
    avgMoveActions: totalMoveActions / games,
    avgScore1: totalScore1 / games,
    avgScore2: totalScore2 / games,
    avgMaxStreak1: totalMaxStreak1 / games,
    avgMaxStreak2: totalMaxStreak2 / games,
    wins1,
    wins2,
    draws,
    durationMs: performance.now() - startMs,
  }
}

function formatPct(part: number, total: number): string {
  return `${((part / total) * 100).toFixed(1)}%`
}

function printResults(title: string, games: number, randomTieBreak: boolean): void {
  console.log(`\n=== ${title} (gier na parę: ${games}) ===`)

  const totalAllGames = games * MATCHUPS.length
  let completedAllGames = 0
  const showProgress = games > 1 && process.stdout.isTTY

  const rows = MATCHUPS.map((matchup) => {
    const stats = runBatch(matchup, games, randomTieBreak, () => {
      completedAllGames++
      if (showProgress) {
        renderProgressBar(matchup.label, completedAllGames, totalAllGames)
      }
    })
    return {
      Para: matchup.label,
      'Śr. tur': stats.avgTurns.toFixed(1),
      'Śr. ruchów': stats.avgMoveActions.toFixed(1),
      'Śr. wynik B1': stats.avgScore1.toFixed(2),
      'Śr. wynik B2': stats.avgScore2.toFixed(2),
      'Śr. max seria B1': stats.avgMaxStreak1.toFixed(2),
      'Śr. max seria B2': stats.avgMaxStreak2.toFixed(2),
      'Wygrane B1': `${stats.wins1} (${formatPct(stats.wins1, stats.games)})`,
      'Wygrane B2': `${stats.wins2} (${formatPct(stats.wins2, stats.games)})`,
      Remisy: `${stats.draws} (${formatPct(stats.draws, stats.games)})`,
      'Czas [ms]': Math.round(stats.durationMs),
    }
  })

  if (showProgress) {
    process.stdout.write('\r\x1b[K')
  }

  console.table(rows)
}

const gamesCount = parseGamesArg(process.argv.slice(2))

printResults('TRYB LOSOWY (randomTieBreak = true)', gamesCount, true)
printResults('TRYB DETERMINISTYCZNY (randomTieBreak = false)', 1, false)
