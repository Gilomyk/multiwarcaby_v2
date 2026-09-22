<template>
  <div
    ref="pileElement"
    :class="['captured-pile', `captured-pile--${placement}`]"
    :aria-label="t.game.captured.pieces(count)"
  >
    <div class="captured-pile__info">
      <span class="captured-pile__label">
        {{ playerLabel }}
      </span>

      <span class="captured-pile__label">{{ t.game.captured.pieces(count) }}</span>
    </div>
    <div
      v-for="slotIndex in SLOT_COUNT"
      :key="slotIndex - 1"
      class="captured-pile__slot"
      :data-slot="slotIndex - 1"
      :style="getSlotStyle(slotIndex - 1)"
    >
      <PieceGraphic v-if="slotIndex <= count" color="gold" :size="PIECE_SIZE" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PieceGraphic from '@/components/icons/PieceGraphic.vue'
import { t } from '@/i18n/useLanguage'

type Placement = 'top-left' | 'bottom-right'

const props = defineProps<{
  count: number
  placement: Placement
  playerLabel: string
}>()

const SLOT_COUNT = 80
const ROW_COUNT = 10
const COLUMN_COUNT = 8
const PIECE_SIZE = 24

const pileElement = ref<HTMLElement | null>(null)

function getSlotStyle(index: number) {
  const columnIndex = Math.floor(index / ROW_COUNT)
  const rowIndex = index % ROW_COUNT

  if (props.placement === 'bottom-right') {
    return {
      gridColumn: columnIndex + 1,
      gridRow: ROW_COUNT - rowIndex,
    }
  }

  return {
    gridColumn: COLUMN_COUNT - columnIndex,
    gridRow: rowIndex + 1,
  }
}

function getSlotTarget(index: number) {
  if (index < 0 || index >= SLOT_COUNT || pileElement.value === null) {
    return null
  }

  const slot = pileElement.value.querySelector<HTMLElement>(`[data-slot="${index}"]`)

  if (!slot) {
    return null
  }

  const rect = slot.getBoundingClientRect()

  /*
   * Przy responsive display:none stos nie ma wymiarów.
   */
  if (rect.width === 0 || rect.height === 0) {
    return null
  }

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    size: rect.width,
  }
}

defineExpose({
  getSlotTarget,
})
</script>

<style scoped>
.captured-pile {
  --pile-gap: 2px;

  position: absolute;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(8, 24px);
  grid-template-rows: repeat(10, 24px);
  gap: var(--pile-gap);
  pointer-events: none;
}

.captured-pile--top-left {
  top: 0;
  right: calc(100% + var(--space-4));
  transform-origin: top right;
}

.captured-pile--bottom-right {
  bottom: 0;
  left: calc(100% + var(--space-4));
  transform-origin: bottom left;
}

.captured-pile__slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.captured-pile__info {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.captured-pile__label {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  font-weight: 700;
  white-space: nowrap;
}

.captured-pile--top-left .captured-pile__info {
  right: 0;
  bottom: calc(100% + var(--space-2));
  align-items: flex-end;
}

.captured-pile--bottom-right .captured-pile__info {
  left: 0;
  top: calc(100% + var(--space-2));
  align-items: flex-start;
}

/*
 * Przy średnim desktopie zachowujemy cały stos,
 * ale wizualnie go pomniejszamy.
 */
@media (max-width: 1200px) {
  .captured-pile {
    transform: scale(0.72);
  }
}

/*
 * Na wąskim widoku pełne 8x10 zaczęłoby nachodzić
 * na planszę/interfejs. Wynik nadal pozostaje w GameStatus.
 */
@media (max-width: 900px) {
  .captured-pile {
    display: none;
  }
}
</style>
