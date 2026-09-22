<template>
  <button :class="['app-btn', `app-btn--${variant}`]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
}>()
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
  border: 1.5px solid transparent;
  white-space: nowrap;
}

.app-btn--primary {
  background: var(--color-btn-primary);
  color: var(--color-text-on-primary);
  border-color: var(--color-btn-primary);
}

.app-btn--primary:hover {
  background: var(--color-btn-primary-hover);
  border-color: var(--color-btn-primary-hover);
}

.app-btn--secondary {
  background: var(--color-btn-secondary);
  color: var(--color-text-light);
  border-color: var(--color-btn-secondary-border);
}

.app-btn--secondary:hover {
  background: var(--color-btn-secondary-hover);
  border-color: var(--color-btn-secondary-border);
}

.app-btn--outline {
  background: transparent;
  color: var(--color-text-light);
  border-color: var(--color-btn-outline-border);
}

.app-btn--outline:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>
