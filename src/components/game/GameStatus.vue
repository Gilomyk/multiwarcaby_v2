<template>
  <aside class="game-status">
    <div class="game-status__turn">
      <span class="game-status__label"> Aktualna tura </span>

      <strong class="game-status__player"> Gracz {{ currentPlayer + 1 }} </strong>

      <span class="game-status__move">
        {{ moveLabel }}
      </span>

      <span v-if="isSequenceActive" class="game-status__sequence"> Seria bić aktywna </span>
    </div>

    <div class="game-status__scores">
      <span class="game-status__label"> Wyniki </span>

      <div
        v-for="playerIndex in playerCount"
        :key="playerIndex"
        :class="[
          'game-status__score',
          playerIndex - 1 === currentPlayer && 'game-status__score--active',
        ]"
      >
        <span> Gracz {{ playerIndex }} </span>

        <strong>
          {{ scores[playerIndex - 1] ?? 0 }}
        </strong>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPlayer: number
  playerCount: 2 | 3 | 4
  scores: readonly number[]
  movesUsed: 0 | 1 | 2
  isSequenceActive: boolean
}>()

const moveLabel = computed(() => {
  if (props.isSequenceActive) {
    return `Ruch ${props.movesUsed} / 2`
  }

  if (props.movesUsed === 0) {
    return 'Ruch 1 / 2'
  }

  return 'Ruch 2 / 2'
})
</script>

<style scoped>
.game-status {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 180px;
  padding: var(--space-5);
  background: var(--color-board-bg);
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
  color: var(--color-text-light);
  font-size: 1.1rem;
}

.game-status__move {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
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

.game-status__score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2);
  color: var(--color-text-light);
  border-radius: var(--radius-sm);
}

.game-status__score--active {
  background: rgba(255, 255, 255, 0.08);
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
