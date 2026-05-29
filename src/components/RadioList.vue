<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
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

const emit = defineEmits(['selection']);

function handleSelect(label) {
  if (props.correctIdentifier || props.incorrectIdentifiers.includes(label)) return;
  emit('selection', { detail: { label } });
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
  <div class="radio-list" role="group" aria-label="Work assignment options">
    <button
      v-for="label in options"
      :key="label"
      class="md-button md-button--outline radio-list-item"
      :class="getButtonClass(label)"
      @click="handleSelect(label)"
      :disabled="isBtnDisabled(label)"
    >
      {{ label }}
    </button>
  </div>
</template>

<style scoped>
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 300px;
  margin: 1.5rem auto;
}

.radio-list-item {
  justify-content: flex-start;
  text-align: left;
  border-radius: 12px;
}

.radio-list-item.is-correct {
  background-color: var(--md-sys-color-success-container) !important;
  color: var(--md-sys-color-on-success-container) !important;
  border-color: var(--md-sys-color-success) !important;
  opacity: 1 !important;
}

.radio-list-item.is-incorrect {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: var(--md-sys-color-error);
  opacity: 0.8;
}
</style>
