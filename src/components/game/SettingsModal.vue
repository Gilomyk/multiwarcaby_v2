<template>
  <div class="settings-overlay" @click.self="emit('close')">
    <section
      class="settings-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <header class="settings-modal__header">
        <div>
          <span class="settings-modal__eyebrow">Multiwarcaby</span>
          <h2 id="settings-title">{{ t.settings.title }}</h2>
        </div>

        <button
          class="settings-modal__close-icon"
          type="button"
          :aria-label="t.settings.close"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <div class="settings-modal__content">
        <section class="settings-section">
          <div class="settings-section__heading">
            <span class="settings-section__icon">🌐</span>

            <div>
              <h3>{{ t.settings.language.title }}</h3>
              <p>{{ t.settings.language.description }}</p>
            </div>
          </div>

          <div class="settings-options">
            <button
              type="button"
              class="settings-option"
              :class="{ 'settings-option--active': language === 'pl' }"
              @click="setLanguage('pl')"
            >
              {{ t.settings.language.polish }}
            </button>

            <button
              type="button"
              class="settings-option"
              :class="{ 'settings-option--active': language === 'en' }"
              @click="setLanguage('en')"
            >
              {{ t.settings.language.english }}
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__heading">
            <span class="settings-section__icon">🎨</span>

            <div>
              <h3>{{ t.settings.theme.title }}</h3>
              <p>{{ t.settings.theme.description }}</p>
            </div>
          </div>

          <div class="settings-options settings-options--theme">
            <button
              type="button"
              class="settings-option"
              :class="{ 'settings-option--active': theme === 'light' }"
              @click="setTheme('light')"
            >
              {{ t.settings.theme.light }}
            </button>

            <button
              type="button"
              class="settings-option"
              :class="{ 'settings-option--active': theme === 'dark' }"
              @click="setTheme('dark')"
            >
              {{ t.settings.theme.dark }}
            </button>

            <button
              type="button"
              class="settings-option"
              :class="{ 'settings-option--active': theme === 'system' }"
              @click="setTheme('system')"
            >
              {{ t.settings.theme.system }}
            </button>
          </div>
        </section>
      </div>

      <footer class="settings-modal__footer">
        <AppButton variant="primary" @click="emit('close')">{{ t.settings.close }}</AppButton>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { t, language, setLanguage } from '@/i18n/useLanguage'
import { theme, setTheme } from '@/composables/useTheme'

import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(5, 12, 24, 0.72);
  backdrop-filter: blur(4px);
}

.settings-modal {
  width: min(560px, 100%);

  display: flex;
  flex-direction: column;

  background: var(--color-surface-dark);
  color: var(--color-text-light);

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;

  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);

  overflow: hidden;
}

.settings-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 22px 24px 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.settings-modal__eyebrow {
  display: block;
  margin-bottom: 4px;

  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.settings-modal__header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.settings-modal__close-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;

  background: transparent;
  color: var(--color-text-light);

  font-size: 1.6rem;
  line-height: 1;

  cursor: pointer;
}

.settings-modal__close-icon:hover {
  background: rgba(255, 255, 255, 0.08);
}

.settings-modal__content {
  display: flex;
  flex-direction: column;
  gap: 26px;

  padding: 22px 24px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.settings-section__heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.settings-section__icon {
  font-size: 1.25rem;
  line-height: 1.4;
}

.settings-section h3 {
  margin: 0 0 3px;
  font-size: 1rem;
}

.settings-section p {
  margin: 0;

  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.settings-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.settings-options--theme {
  grid-template-columns: repeat(3, 1fr);
}

.settings-option {
  min-height: 42px;
  padding: 8px 12px;

  border: 1px solid var(--color-settings-option-border);
  border-radius: var(--radius-md);

  background: var(--color-settings-option-bg);
  color: var(--color-text-nav);

  font: inherit;
  font-size: var(--font-size-sm);

  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.settings-option:hover {
  background: var(--color-settings-option-hover);
  color: var(--color-text-light);
}

.settings-option--active {
  background: var(--color-btn-primary);
  border-color: var(--color-btn-primary);
  color: var(--color-text-on-primary);
}

.settings-modal__footer {
  display: flex;
  justify-content: flex-end;

  padding: 16px 24px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 600px) {
  .settings-overlay {
    padding: 12px;
  }

  .settings-modal__header {
    padding: 18px 18px 14px;
  }

  .settings-modal__content {
    padding: 18px;
  }

  .settings-modal__footer {
    padding: 14px 18px;
  }

  .settings-options--theme {
    grid-template-columns: 1fr;
  }
}
</style>
