<template>
  <aside class="game-status">
    <div class="game-status__turn">
      <span class="game-status__label">{{ t.game.status.currentTurn }}</span>

      <strong class="game-status__player">{{ t.game.player(currentPlayer + 1) }}</strong>

      <div class="game-status__move-row">
        <span class="game-status__move">
          {{ moveLabel }}
        </span>

        <span
          class="game-status__sequence-indicator"
          :class="{ 'game-status__sequence-indicator--active': isSequenceActive }"
          :title="isSequenceActive ? t.game.status.captureSequenceActive : undefined"
        />
      </div>
    </div>

    <div class="game-status__scores">
      <span class="game-status__label">{{ t.game.status.scores }}</span>

      <div
        v-for="playerIndex in playerCount"
        :key="playerIndex"
        :class="[
          'game-status__score',
          playerIndex - 1 === currentPlayer && 'game-status__score--active',
        ]"
      >
        <span>{{ t.game.player(playerIndex) }}</span>

        <strong>
          {{ scores[playerIndex - 1] ?? 0 }}
        </strong>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/i18n/useLanguage'

const props = defineProps<{
  currentPlayer: number
  playerCount: 2 | 3 | 4
  scores: readonly number[]
  movesUsed: 0 | 1 | 2
  isSequenceActive: boolean
}>()

const moveLabel = computed(() => {
  if (props.isSequenceActive) {
    return t.value.game.status.move(props.movesUsed)
  }

  if (props.movesUsed === 0) {
    return t.value.game.status.move(1)
  }

  return t.value.game.status.move(2)
})
</script>

<style scoped>
.game-status {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 180px;
  padding: var(--space-3);
  background: var(--color-status-bg);
  border: 1px solid var(--color-board-border);
  border-radius: var(--radius-sm);
}

.game-status__turn,
.game-status__scores {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.game-status__label {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.game-status__player {
  color: var(--color-status-text);
  font-size: 1.1rem;
}

.game-status__move {
  color: var(--color-status-text);
  font-size: var(--font-size-sm);
}

.game-status__move-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.game-status__sequence {
  align-self: flex-start;
  margin-top: var(--space-1);
  padding: 4px 8px;
  border-radius: var(--radius-sm);

  font-size: var(--font-size-sm);
  font-weight: 600;

  color: #1c1a2e;
  background: var(--color-piece-gold-highlight);
}

.game-status__sequence-indicator {
  width: 8px;
  height: 8px;
  flex-shrink: 0;

  border-radius: 50%;
  background: var(--color-sequence-indicator);

  opacity: 0;
}

.game-status__sequence-indicator--active {
  opacity: 1;
}

.game-status__score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2);
  color: var(--color-status-text);
  border-radius: var(--radius-sm);
}

.game-status__score--active {
  background: var(--color-status-active);
}

@media (max-width: 900px) {
  .game-status {
    flex-direction: row;
    align-items: stretch;
    gap: var(--space-3);

    width: 100%;
    min-width: 0;
    padding: var(--space-2) var(--space-3);
  }

  .game-status__turn,
  .game-status__scores {
    flex: 1;
    min-width: 0;
    gap: var(--space-1);
  }

  .game-status__scores {
    border-left: 1px solid var(--color-board-border);
    padding-left: var(--space-3);
  }

  .game-status__score {
    padding: 2px var(--space-1);
    gap: var(--space-2);
  }

  .game-status__sequence {
    margin-top: 2px;
    padding: 2px 6px;
    font-size: 0.75rem;
  }
}
</style>
