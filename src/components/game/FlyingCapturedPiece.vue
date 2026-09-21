<template>
  <div class="flying-captured-piece" :style="animationStyle">
    <PieceGraphic color="gold" :size="PIECE_SIZE" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PieceGraphic from '@/components/icons/PieceGraphic.vue'

const PIECE_SIZE = 54

const props = defineProps<{
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  targetSize: number
  durationMs: number
}>()

const animationStyle = computed(() => {
  const deltaX = props.to.x - props.from.x
  const deltaY = props.to.y - props.from.y

  const targetScale = props.targetSize / PIECE_SIZE

  return {
    left: `${props.from.x - PIECE_SIZE / 2}px`,
    top: `${props.from.y - PIECE_SIZE / 2}px`,
    '--capture-dx': `${deltaX}px`,
    '--capture-dy': `${deltaY}px`,
    '--capture-scale': `${targetScale}`,
    '--capture-duration': `${props.durationMs}ms`,
  }
})
</script>

<style scoped>
.flying-captured-piece {
  position: fixed;
  z-index: 1000;
  width: 54px;
  height: 54px;
  pointer-events: none;

  animation: captured-piece-flight var(--capture-duration) ease-in-out forwards;
}

@keyframes captured-piece-flight {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(var(--capture-dx), var(--capture-dy)) scale(var(--capture-scale));
  }
}
</style>
