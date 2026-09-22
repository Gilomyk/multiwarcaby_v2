<template>
  <header class="app-header">
    <div class="header-inner">
      <a href="/" class="logo-link" aria-label="Multiwarcaby home">
        <img :src="logo" alt="Wittam" class="header-logo" />
      </a>

      <nav class="nav-links" aria-label="Main navigation">
        <a href="#" class="nav-link">Zagraj</a>
        <button class="nav-link" type="button" @click="showRules = true">Zasady gry</button>

        <a href="#" class="nav-link">Ranking</a>
        <a href="#" class="nav-link">Ustawienia</a>
      </nav>

      <a
        href="https://github.com/Gilomyk/multiwarcaby_v2"
        class="github-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="github-icon">
          <path
            fill="currentColor"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482
      0-.237-.009-.866-.014-1.699-2.782.604-3.369-1.341-3.369-1.341-.455-1.156-1.11-1.464-1.11-1.464
      -.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831
      .091-.646.349-1.087.635-1.337-2.221-.253-4.555-1.111-4.555-4.944
      0-1.092.39-1.985 1.029-2.684-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025
      A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025
      .546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.684
      0 3.842-2.337 4.687-4.566 4.935.359.309.678.92.678 1.855
      0 1.339-.012 2.42-.012 2.75 0 .267.18.578.688.48C19.138 20.162 22 16.417 22 12
      22 6.477 17.523 2 12 2Z"
          />
        </svg>
      </a>

      <div class="auth-buttons">
        <AppButton variant="outline">Sign in</AppButton>
        <AppButton variant="primary">Register</AppButton>
      </div>
    </div>
  </header>
  <RulesModal v-if="showRules" @close="showRules = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/logo.png'
import AppButton from '@/components/ui/AppButton.vue'
import RulesModal from '@/components/game/RulesModal.vue'

const showRules = ref(false)
</script>

<style scoped>
.app-header {
  background: var(--color-surface-dark);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;

  height: clamp(48px, 6vh, 60px);
  padding: 0 clamp(12px, 2vw, 24px);

  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 32px);
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  max-width: 180px;
  height: 100%;
}

.header-logo {
  display: block;
  height: 48px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex: 1;
  justify-content: flex-end;
}

.nav-link {
  color: var(--color-text-nav);
  font-size: var(--font-size-sm);
  font-weight: 400;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--color-text-light);
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  color: var(--color-text-nav);
  border-radius: var(--radius-md);

  transition:
    color 0.15s,
    background-color 0.15s;
}

.github-link:hover {
  color: var(--color-text-light);
  background: var(--color-surface-dark-hover);
}

.github-icon {
  width: 22px;
  height: 22px;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .header-logo {
    height: 24px;
  }

  .nav-links {
    display: none;
  }
}
</style>
