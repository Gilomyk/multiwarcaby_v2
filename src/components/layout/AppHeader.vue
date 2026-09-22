<template>
  <header class="app-header">
    <div class="header-inner">
      <a href="/" class="logo-link" aria-label="Multiwarcaby home">
        <LogoIcon />
      </a>

      <nav class="nav-links" aria-label="Main navigation">
        <a href="#" class="nav-link">Zagraj</a>
        <a href="#" class="nav-link">Ranking</a>
        <a href="#" class="nav-link">Ustawienia</a>
      </nav>

      <div class="auth-buttons">
        <AppButton variant="outline">Sign in</AppButton>
        <AppButton variant="primary">Register</AppButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoIcon from '@/components/icons/LogoIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
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

  height: clamp(44px, 6vh, 56px);
  padding: 0 clamp(12px, 2vw, 24px);

  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 32px);
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

.auth-buttons {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .nav-links {
    display: none;
  }
}
</style>
