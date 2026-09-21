<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <span class="footer-copy">Blablabla copyright<sup>TM</sup></span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-surface-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: var(--space-3) var(--space-6);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-copy {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 600;
}
</style>
