<script setup>
import { computed } from 'vue';

const props = defineProps({
  sessionStats: {
    type: Object,
    required: true
  },
  mastery: {
    type: Number,
    required: true
  },
  methodName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['restart']);

const timeSpentMinutes = computed(() => {
  const diff = props.sessionStats.endTime - props.sessionStats.startTime;
  return Math.ceil(diff / 60000);
});

const isMastered = computed(() => props.mastery === 1);
</script>

<template>
  <div class="summary-screen">
    <div class="summary-card">
      <h1 class="summary-title">Session Summary</h1>
      
      <div v-if="isMastered" class="mastery-message">
        <p>Congratulations! You have mastered every aspect of a plain course of {{ methodName }}. You're ready for the tower!</p>
      </div>
      
      <div v-else class="stats-message">
        <p>
          Congratulations! You spent {{ timeSpentMinutes }} {{ timeSpentMinutes === 1 ? 'minute' : 'minutes' }} learning {{ methodName }} during this session.
          You answered {{ sessionStats.totalQuestions }} distinct questions — 
          {{ sessionStats.firstTimeSuccesses }} right first time and 
          {{ sessionStats.reAttempts }} needing re-attempts. 
          Come back soon for more practice!
        </p>
      </div>

      <div class="mastery-progress">
        <div class="progress-label">Overall Mastery: {{ (mastery * 100).toFixed(0) }}%</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (mastery * 100) + '%' }"></div>
        </div>
      </div>

      <button class="md-button md-button--filled restart-button" @click="emit('restart')">
        Start again
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.summary-card {
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 28px;
  padding: 2.5rem;
  max-width: 500px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-title {
  color: var(--md-sys-color-primary);
  margin: 0;
}

.mastery-message {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--md-sys-color-primary);
  line-height: 1.6;
}

.stats-message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface-variant);
}

.mastery-progress {
  margin: 1rem 0;
}

.progress-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-on-surface-variant);
}

.progress-bar {
  height: 8px;
  background-color: var(--md-sys-color-surface);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--md-sys-color-primary);
  transition: width 0.5s ease-out;
}

.restart-button {
  align-self: center;
}
</style>
