<script setup>
import { ref, onMounted } from 'vue';
import { METHODS } from '../engine/methods.js';
import { FOCUS_AREAS } from '../engine/generator.js';

const props = defineProps({
  srs: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['start-session']);

const selectedMethod = ref(props.srs.state.settings.lastSelectedMethod || 'DOUBLES');
const selectedFocus = ref(props.srs.state.settings.lastSelectedFocus || FOCUS_AREAS.EVERYTHING);

function handleStart() {
  props.srs.state.settings.lastSelectedMethod = selectedMethod.value;
  props.srs.state.settings.lastSelectedFocus = selectedFocus.value;
  props.srs.saveState();
  
  emit('start-session', {
    method: selectedMethod.value,
    focus: selectedFocus.value
  });
}
</script>

<template>
  <div class="start-screen">
    <header class="hero">
      <h1 class="md-typescale-h1">Plain Bob Flashcards</h1>
      <p class="md-typescale-body-large">Master the art of change ringing.</p>
    </header>

    <div class="config-card">
      <section class="config-section">
        <h2 class="section-title">Select Method</h2>
        <div class="radio-group">
          <label v-for="(method, key) in METHODS" :key="key" class="radio-item" :class="{ selected: selectedMethod === key }">
            <input type="radio" :value="key" v-model="selectedMethod" name="method" />
            <span class="label-text">{{ method.name }}</span>
          </label>
        </div>
      </section>

      <section class="config-section">
        <h2 class="section-title">Focus Scope</h2>
        <div class="radio-group">
          <label v-for="(label, key) in FOCUS_AREAS" :key="key" class="radio-item" :class="{ selected: selectedFocus === label }">
            <input type="radio" :value="label" v-model="selectedFocus" name="focus" />
            <span class="label-text">{{ label }}</span>
          </label>
        </div>
      </section>

      <button class="md-button md-button--filled start-button" @click="handleStart">
        Start
      </button>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-top: 2rem;
}

.hero {
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-primary);
}

.config-card {
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 28px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: var(--md-sys-color-surface);
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid transparent;
}

.radio-item:hover {
  background-color: var(--md-sys-color-secondary-container);
}

.radio-item.selected {
  background-color: var(--md-sys-color-primary-container);
  border-color: var(--md-sys-color-primary);
}

.radio-item input {
  margin-right: 1rem;
}

.label-text {
  font-size: 1rem;
  color: var(--md-sys-color-on-surface);
}

.start-button {
  width: 100%;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }
}
</style>
