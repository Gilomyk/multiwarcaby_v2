<template>
  <div class="new-game-overlay" @click.self="emit('close')">
    <section
      class="new-game-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-game-title"
    >
      <header class="new-game-modal__header">
        <div>
          <span class="new-game-modal__eyebrow">{{ t.newGame.appName }}</span>
          <h2 id="new-game-title">{{ t.newGame.title }}</h2>
        </div>

        <button
          class="new-game-modal__close-icon"
          type="button"
          :aria-label="t.newGame.cancel"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <div class="new-game-modal__content">
        <section class="new-game-section">
          <div class="new-game-section__heading">
            <span class="new-game-section__icon">🎮</span>

            <div>
              <h3>{{ t.newGame.mode.title }}</h3>
              <p>{{ t.newGame.mode.description }}</p>
            </div>
          </div>

          <div class="new-game-options">
            <button
              type="button"
              class="new-game-option"
              :class="{ 'new-game-option--active': selectedMode === 'pvp' }"
              @click="selectedMode = 'pvp'"
            >
              {{ t.newGame.mode.pvp }}
            </button>

            <button
              type="button"
              class="new-game-option"
              :class="{ 'new-game-option--active': selectedMode === 'bot' }"
              @click="selectedMode = 'bot'"
            >
              {{ t.newGame.mode.bot }}
            </button>
          </div>
        </section>

        <template v-if="selectedMode === 'bot'">
          <section class="new-game-section">
            <div class="new-game-section__heading">
              <span class="new-game-section__icon">🤖</span>

              <div>
                <h3>{{ t.newGame.difficulty.title }}</h3>
                <p>{{ t.newGame.difficulty.description }}</p>
              </div>
            </div>

            <div class="new-game-options">
              <button
                type="button"
                class="new-game-option"
                :class="{ 'new-game-option--active': selectedStrategy === 'greedy-move' }"
                @click="selectedStrategy = 'greedy-move'"
              >
                {{ t.newGame.difficulty.easy }}
              </button>

              <button
                type="button"
                class="new-game-option"
                :class="{ 'new-game-option--active': selectedStrategy === 'lookahead-turn' }"
                @click="selectedStrategy = 'lookahead-turn'"
              >
                {{ t.newGame.difficulty.hard }}
              </button>
            </div>
          </section>

          <section class="new-game-section">
            <div class="new-game-section__heading">
              <span class="new-game-section__icon">🎲</span>

              <div>
                <h3>{{ t.newGame.starter.title }}</h3>
                <p>{{ t.newGame.starter.description }}</p>
              </div>
            </div>

            <div class="new-game-options new-game-options--three">
              <button
                type="button"
                class="new-game-option"
                :class="{ 'new-game-option--active': selectedStarter === 'human' }"
                @click="selectedStarter = 'human'"
              >
                {{ t.newGame.starter.human }}
              </button>

              <button
                type="button"
                class="new-game-option"
                :class="{ 'new-game-option--active': selectedStarter === 'bot' }"
                @click="selectedStarter = 'bot'"
              >
                {{ t.newGame.starter.bot }}
              </button>

              <button
                type="button"
                class="new-game-option"
                :class="{ 'new-game-option--active': selectedStarter === 'random' }"
                @click="selectedStarter = 'random'"
              >
                {{ t.newGame.starter.random }}
              </button>
            </div>
          </section>
        </template>
      </div>

      <footer class="new-game-modal__footer">
        <AppButton variant="outline" @click="emit('close')">{{ t.newGame.cancel }}</AppButton>
        <AppButton variant="primary" @click="handleStart">{{ t.newGame.start }}</AppButton>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BotStrategy } from '@/bot/types'
import AppButton from '@/components/ui/AppButton.vue'
import {
  botStarter,
  botStrategy,
  gameMode,
  startNewGame,
  type BotStarter,
  type GameMode,
} from '@/composables/useGameConfig'
import { t } from '@/i18n/useLanguage'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const selectedMode = ref<GameMode>(gameMode.value)
const selectedStrategy = ref<BotStrategy>(botStrategy.value)
const selectedStarter = ref<BotStarter>(botStarter.value)

function handleStart() {
  startNewGame({
    mode: selectedMode.value,
    strategy: selectedStrategy.value,
    starter: selectedStarter.value,
  })
  emit('close')
}
</script>

<style scoped>
.new-game-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--space-6);

  background: rgba(5, 12, 24, 0.72);
  backdrop-filter: blur(4px);
}

.new-game-modal {
  width: min(560px, 100%);

  display: flex;
  flex-direction: column;

  background: var(--color-surface-dark);
  color: var(--color-text-light);

  border: 1px solid var(--color-settings-option-border);
  border-radius: var(--radius-lg);

  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.new-game-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);

  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-settings-option-border);
}

.new-game-modal__eyebrow {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.new-game-modal__header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
}

.new-game-modal__close-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.new-game-modal__close-icon:hover {
  background: var(--color-settings-option-hover);
  color: var(--color-text-light);
}

.new-game-modal__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6);
}

.new-game-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.new-game-section__heading {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.new-game-section__icon {
  font-size: 1.25rem;
  line-height: 1.4;
}

.new-game-section__heading h3 {
  margin: 0 0 2px;
  font-size: var(--font-size-base);
  font-weight: 700;
}

.new-game-section__heading p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.new-game-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.new-game-options--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.new-game-option {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-settings-option-border);
  border-radius: var(--radius-md);
  background: var(--color-settings-option-bg);
  color: var(--color-text-light);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.new-game-option:hover {
  background: var(--color-settings-option-hover);
}

.new-game-option--active {
  background: var(--color-btn-primary);
  border-color: var(--color-btn-primary);
  color: var(--color-text-on-primary);
}

.new-game-option--active:hover {
  background: var(--color-btn-primary-hover);
}

.new-game-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-settings-option-border);
}

@media (max-width: 520px) {
  .new-game-options--three {
    grid-template-columns: 1fr;
  }
}
</style>
