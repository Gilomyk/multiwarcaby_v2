<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <span class="footer-copy">Blablabla copyright<sup>TM</sup></span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  flex-shrink: 0;
  background: var(--color-surface-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  padding: clamp(6px, 1vh, 12px) clamp(12px, 2vw, 24px);
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
