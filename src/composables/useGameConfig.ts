import { computed, ref } from 'vue'
import type { BotStrategy } from '@/bot/types'
import { t } from '@/i18n/useLanguage'

export type GameMode = 'pvp' | 'bot' | 'simulation'
export type BotStarter = 'human' | 'bot' | 'random'

export const gameMode = ref<GameMode>('pvp')
export const botStrategy = ref<BotStrategy>('lookahead-turn')
export const botStarter = ref<BotStarter>('random')
export const botPlayerIndex = ref<0 | 1 | null>(null)
export const simBotOneStrategy = ref<BotStrategy>('greedy-move')
export const simBotTwoStrategy = ref<BotStrategy>('lookahead-turn')
export const simRandomTieBreak = ref(false)
export const gameSessionId = ref(0)

function resolveBotPlayerIndex(starter: BotStarter): 0 | 1 {
  if (starter === 'human') return 1
  if (starter === 'bot') return 0
  return Math.random() < 0.5 ? 0 : 1
}

export function startNewGame(config: {
  mode: GameMode
  strategy: BotStrategy
  starter: BotStarter
  simBot1Strategy?: BotStrategy
  simBot2Strategy?: BotStrategy
  simRandomTieBreak?: boolean
}) {
  gameMode.value = config.mode
  botStrategy.value = config.strategy
  botStarter.value = config.starter
  botPlayerIndex.value = config.mode === 'bot' ? resolveBotPlayerIndex(config.starter) : null

  if (config.simBot1Strategy !== undefined) {
    simBotOneStrategy.value = config.simBot1Strategy
  }
  if (config.simBot2Strategy !== undefined) {
    simBotTwoStrategy.value = config.simBot2Strategy
  }
  if (config.simRandomTieBreak !== undefined) {
    simRandomTieBreak.value = config.simRandomTieBreak
  }

  gameSessionId.value++
}

export function restartCurrentGame() {
  botPlayerIndex.value =
    gameMode.value === 'bot' ? resolveBotPlayerIndex(botStarter.value) : null
  gameSessionId.value++
}

function getStrategyShortLabel(strategy: BotStrategy): string {
  return strategy === 'greedy-move' ? t.value.game.bot.easyShort : t.value.game.bot.hardShort
}

export const playerNames = computed<readonly string[]>(() => {
  if (gameMode.value === 'simulation') {
    return [
      `Bot 1 (${getStrategyShortLabel(simBotOneStrategy.value)})`,
      `Bot 2 (${getStrategyShortLabel(simBotTwoStrategy.value)})`,
    ]
  }

  if (gameMode.value === 'bot' && botPlayerIndex.value !== null) {
    return [
      botPlayerIndex.value === 0 ? t.value.game.bot.name : t.value.game.bot.human,
      botPlayerIndex.value === 1 ? t.value.game.bot.name : t.value.game.bot.human,
    ]
  }

  return [t.value.game.player(1), t.value.game.player(2)]
})
