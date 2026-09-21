<template>
  <section class="game-result">
    <span class="game-result__label"> Koniec gry </span>

    <strong class="game-result__title">
      {{ resultLabel }}
    </strong>

    <div class="game-result__scores">
      <div
        v-for="playerIndex in playerCount"
        :key="playerIndex"
        :class="['game-result__score', winner === playerIndex - 1 && 'game-result__score--winner']"
      >
        <span>Gracz {{ playerIndex }}</span>
        <strong>{{ scores[playerIndex - 1] ?? 0 }}</strong>
      </div>
    </div>

    <AppButton variant="primary" @click="emit('restart')"> Nowa gra </AppButton>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps<{
  winner: number | null
  playerCount: 2 | 3 | 4
  scores: readonly number[]
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const resultLabel = computed(() =>
  props.winner === null ? 'Remis' : `Wygrywa Gracz ${props.winner + 1}`,
)
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
  gap: var(--space-6);
  color: var(--color-text-light);
}

.game-result__score--winner {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
}
</style>
