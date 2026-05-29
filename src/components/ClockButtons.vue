<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (arr) => arr.length >= 4 && arr.length <= 6
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

const containerSize = 320;
const radius = 100;
const centerX = containerSize / 2;
const centerY = containerSize / 2;

const positions = computed(() => {
  const n = props.items.length;
  return props.items.map((label, i) => {
    const theta = (2 * Math.PI * i) / n - Math.PI / 2;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    return { x, y, label, index: i, theta };
  });
});

const arcs = computed(() => {
  const n = props.items.length;
  const arcRadius = radius; // Align with button midpoints
  const paths = [];
  
  const angularStep = (2 * Math.PI) / n;
  const offset = (angularStep / 2) * 0.85;

  for (let i = 0; i < n; i++) {
    const startTheta = (angularStep * i) - Math.PI / 2 + offset;
    const endTheta = (angularStep * (i + 1)) - Math.PI / 2 - offset;
    
    const x1 = centerX + arcRadius * Math.cos(startTheta);
    const y1 = centerY + arcRadius * Math.sin(startTheta);
    const x2 = centerX + arcRadius * Math.cos(endTheta);
    const y2 = centerY + arcRadius * Math.sin(endTheta);
    
    paths.push(`M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 0 1 ${x2} ${y2}`);
  }
  return paths;
});

function handleSelection(item) {
  // Ignore if already correct or already marked incorrect
  if (props.correctIdentifier || props.incorrectIdentifiers.includes(item.label)) return;
  emit('clock-button-selection', { detail: { index: item.index, label: item.label } });
}

function getButtonClass(label) {
  if (label === props.correctIdentifier) return 'is-correct';
  if (props.incorrectIdentifiers.includes(label)) return 'is-incorrect';
  return '';
}

function isBtnDisabled(label) {
  // Disable all buttons if correct answer found, or specifically this button if incorrect
  return !!props.correctIdentifier || props.incorrectIdentifiers.includes(label);
}
</script>

<template>
  <div 
    class="clock-buttons-container" 
    :style="{ width: containerSize + 'px', height: containerSize + 'px' }"
    role="group"
    aria-label="Circle of work items"
  >
    <svg class="clock-arcs" :width="containerSize" :height="containerSize">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--md-sys-color-outline)" />
        </marker>
      </defs>
      <path 
        v-for="(path, i) in arcs" 
        :key="i" 
        :d="path" 
        fill="none" 
        stroke="var(--md-sys-color-outline)" 
        stroke-width="2" 
        stroke-dasharray="4 4"
        marker-end="url(#arrowhead)"
      />
    </svg>
    
    <button
      v-for="pos in positions"
      :key="pos.index"
      class="clock-button md-button md-button--outline"
      :class="getButtonClass(pos.label)"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      @click="handleSelection(pos)"
      :disabled="isBtnDisabled(pos.label)"
      :aria-disabled="isBtnDisabled(pos.label)"
    >
      {{ pos.label }}
    </button>
  </div>
</template>

<style scoped>
.clock-buttons-container {
  position: relative;
  margin: 2rem auto;
}

.clock-arcs {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.clock-button {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 100px;
  height: auto;
  min-height: 48px;
  padding: 8px;
  font-size: 0.85rem;
  line-height: 1.2;
  text-align: center;
  border-radius: 12px;
  z-index: 2;
  transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;
}

.clock-button.is-correct {
  background-color: var(--md-sys-color-success-container) !important;
  color: var(--md-sys-color-on-success-container) !important;
  border-color: var(--md-sys-color-success) !important;
  opacity: 1 !important;
  pointer-events: none;
}

.clock-button.is-incorrect {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: var(--md-sys-color-error);
  opacity: 0.8;
  pointer-events: none;
}
</style>
