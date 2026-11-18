<template>
  <section class="game-result">
    <div class="game-result__summary">
      <span class="game-result__label">{{ t.game.result.gameOver }}</span>

      <strong class="game-result__title">
        {{ resultLabel }}
      </strong>
    </div>

    <div class="game-result__scores">
      <div
        v-for="playerIndex in playerCount"
        :key="playerIndex"
        :class="['game-result__score', winner === playerIndex - 1 && 'game-result__score--winner']"
      >
        <span>{{ playerNames?.[playerIndex - 1] ?? t.game.player(playerIndex) }}</span>

        <div class="game-result__score-metrics">
          <span
            class="game-result__score-max"
            :title="t.game.status.maxSequenceTitle(maxSequenceCaptures?.[playerIndex - 1] ?? 0)"
          >
            {{ t.game.status.maxSequence(maxSequenceCaptures?.[playerIndex - 1] ?? 0) }}
          </span>
          <strong>{{ scores[playerIndex - 1] ?? 0 }}</strong>
        </div>
      </div>
    </div>

    <AppButton class="game-result__restart" variant="primary" @click="emit('restart')">
      {{ t.game.result.newGame }}
    </AppButton>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { t } from '@/i18n/useLanguage'

const props = defineProps<{
  winner: number | null
  playerCount: 2 | 3 | 4
  scores: readonly number[]
  playerNames?: readonly string[]
  maxSequenceCaptures?: readonly number[]
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const resultLabel = computed(() => {
  if (props.winner === null) {
    return t.value.game.result.draw
  }

  const winnerName = props.playerNames?.[props.winner]
  return winnerName
    ? t.value.game.result.winnerName(winnerName)
    : t.value.game.result.winner(props.winner + 1)
})
</script>

<style scoped>
.game-result {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 220px;
  padding: var(--space-5);
  background: var(--color-board-bg);
  border: 1px solid var(--color-board-border);
  border-radius: var(--radius-sm);
}

.game-result__summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.game-result__label {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.game-result__title {
  color: var(--color-text-light);
  font-size: 1.25rem;
}

.game-result__scores {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.game-result__score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: 2px var(--space-1);
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
}

.game-result__score-metrics {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.game-result__score-max {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.game-result__score--winner {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 900px) {
  .game-result {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      'summary scores'
      'restart scores';
    align-items: center;
    gap: var(--space-2) var(--space-3);

    width: 100%;
    min-width: 0;
    padding: var(--space-2) var(--space-3);
  }

  .game-result__summary {
    grid-area: summary;
    gap: 2px;
  }

  .game-result__title {
    font-size: 1rem;
  }

  .game-result__scores {
    grid-area: scores;
    gap: var(--space-1);
    border-left: 1px solid var(--color-board-border);
    padding-left: var(--space-3);
  }

  .game-result__score {
    gap: var(--space-2);
    font-size: var(--font-size-sm);
  }

  .game-result__restart {
    grid-area: restart;
    justify-self: start;
  }
}
</style>
