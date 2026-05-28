<script setup>
import { ref } from 'vue';

const props = defineProps({
  methodKey: {
    type: String,
    required: true
  },
  focusArea: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['finish-session']);

function handleFinish() {
  // Placeholder session stats
  emit('finish-session', {
    startTime: Date.now() - 300000, // 5 minutes ago
    endTime: Date.now(),
    totalQuestions: 10,
    firstTimeSuccesses: 8,
    reAttempts: 2
  });
}
</script>

<template>
  <div class="question-screen">
    <div class="placeholder-card">
      <h2>Session in Progress</h2>
      <p>Method: {{ methodKey }}</p>
      <p>Focus: {{ focusArea }}</p>
      <p class="placeholder-note">
        This is a placeholder for the interactive question engine (Phase 4).
      </p>
      <button class="md-button md-button--filled" @click="handleFinish">
        Finish Session
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.placeholder-card {
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 28px;
  padding: 2rem;
  text-align: center;
}

.placeholder-note {
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--md-sys-color-on-surface-variant);
}
</style>
