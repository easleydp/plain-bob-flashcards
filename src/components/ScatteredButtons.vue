<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  before: {
    type: String,
    default: ''
  },
  after: {
    type: String,
    default: ''
  },
  correctIdentifier: {
    type: String,
    default: null
  },
  incorrectIdentifiers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['clock-button-selection']);

const gridCols = 3;
const gridRows = Math.ceil(props.items.length / gridCols);
const cellWidth = 85;
const cellHeight = 70;

const jitteredItems = computed(() => {
  const shuffled = [...props.items].sort(() => Math.random() - 0.5);

  return shuffled.map((label, i) => {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;
    
    const offsetX = (Math.random() - 0.5) * cellWidth * 0.3;
    const offsetY = (Math.random() - 0.5) * cellHeight * 0.3;
    const rotation = (Math.random() - 0.5) * 60;
    
    const x = col * cellWidth + cellWidth / 2 + offsetX;
    const y = row * cellHeight + cellHeight / 2 + offsetY;
    
    return {
      label,
      index: i,
      style: {
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
      }
    };
  });
});

function handleSelection(item) {
  if (props.correctIdentifier || props.incorrectIdentifiers.includes(item.label)) return;
  emit('clock-button-selection', { detail: { index: item.index, label: item.label } });
}

function getButtonClass(label) {
  if (label === props.correctIdentifier) return 'is-correct';
  if (props.incorrectIdentifiers.includes(label)) return 'is-incorrect';
  return '';
}

function isBtnDisabled(label) {
  return !!props.correctIdentifier || props.incorrectIdentifiers.includes(label);
}
</script>

<template>
  <div class="scattered-buttons-wrapper">
    <span v-if="before" class="context-text before">{{ before }}</span>
    
    <div 
      class="scattered-buttons-container" 
      :style="{ width: (gridCols * cellWidth) + 'px', height: (gridRows * cellHeight) + 'px' }"
      role="group"
      aria-label="Selection of place options"
    >
      <button
        v-for="item in jitteredItems"
        :key="item.index"
        class="scattered-button md-button md-button--tonal"
        :class="getButtonClass(item.label)"
        :style="item.style"
        @click="handleSelection(item)"
        :disabled="isBtnDisabled(item.label)"
        :aria-disabled="isBtnDisabled(item.label)"
      >
        {{ item.label }}
      </button>
    </div>
    
    <span v-if="after" class="context-text after">{{ after }}</span>
  </div>
</template>

<style scoped>
.scattered-buttons-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 2rem auto;
}

.context-text {
  font-size: 1.1rem;
  color: var(--md-sys-color-on-surface-variant);
}

.scattered-buttons-container {
  position: relative;
}

.scattered-button {
  position: absolute;
  min-width: 64px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background-color 0.2s, opacity 0.2s, transform 0.2s;
}

.scattered-button.is-correct {
  background-color: var(--md-sys-color-success-container) !important;
  color: var(--md-sys-color-on-success-container) !important;
  opacity: 1 !important;
  pointer-events: none;
}

.scattered-button.is-incorrect {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  opacity: 0.8;
  pointer-events: none;
}
</style>
