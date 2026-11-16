import { computed, ref } from 'vue'
import type { BotStrategy } from '@/bot/types'
import { t } from '@/i18n/useLanguage'

export type GameMode = 'pvp' | 'bot'
export type BotStarter = 'human' | 'bot' | 'random'

export const gameMode = ref<GameMode>('pvp')
export const botStrategy = ref<BotStrategy>('lookahead-turn')
export const botStarter = ref<BotStarter>('random')
export const botPlayerIndex = ref<0 | 1 | null>(null)
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
}) {
  gameMode.value = config.mode
  botStrategy.value = config.strategy
  botStarter.value = config.starter
  botPlayerIndex.value = config.mode === 'bot' ? resolveBotPlayerIndex(config.starter) : null
  gameSessionId.value++
}

export function restartCurrentGame() {
  botPlayerIndex.value =
    gameMode.value === 'bot' ? resolveBotPlayerIndex(botStarter.value) : null
  gameSessionId.value++
}

export const playerNames = computed<readonly string[]>(() => {
  if (gameMode.value === 'bot' && botPlayerIndex.value !== null) {
    return [
      botPlayerIndex.value === 0 ? t.value.game.bot.name : t.value.game.bot.human,
      botPlayerIndex.value === 1 ? t.value.game.bot.name : t.value.game.bot.human,
    ]
  }

  return [t.value.game.player(1), t.value.game.player(2)]
})
