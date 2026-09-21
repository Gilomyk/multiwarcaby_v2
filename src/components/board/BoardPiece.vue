<template>
  <div class="piece-wrapper">
    <PieceGraphic :color="color" :size="pieceSize" />
  </div>
</template>

<script setup lang="ts">
import PieceGraphic from '@/components/icons/PieceGraphic.vue'
import type { PieceColor } from '@/types/board-view'

defineProps<{ color: PieceColor }>()

const pieceSize = 54
</script>

<style scoped>
.piece-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
