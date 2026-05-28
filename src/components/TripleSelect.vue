<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  workingBells: {
    type: Array,
    required: true
  },
  correctAnswer: {
    type: Object, // { followed, course, after }
    required: true
  },
  promptPart2: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['validation']);

const followed = ref('');
const course = ref('');
const after = ref('');

const followedCorrect = ref(false);
const courseCorrect = ref(false);
const afterCorrect = ref(false);
const hasValidatedAtLeastOnce = ref(false);

const options = computed(() => {
  return props.workingBells.map(b => b.toString());
});

// Dropdown 1 options
const followedOptions = computed(() => [
  ...options.value,
  '1',
  'None of the above - I will lead!'
]);

function checkValidation() {
  if (followed.value && course.value && after.value) {
    hasValidatedAtLeastOnce.value = true;
    followedCorrect.value = followed.value === props.correctAnswer.followed;
    courseCorrect.value = course.value === props.correctAnswer.course;
    afterCorrect.value = after.value === props.correctAnswer.after;

    const isCorrect = followedCorrect.value && courseCorrect.value && afterCorrect.value;
    
    emit('validation', { isCorrect, values: { followed: followed.value, course: course.value, after: after.value } });
  }
}

watch([followed, course, after], () => {
  if (!props.isCompleted) {
    checkValidation();
  }
});

function reset() {
  followed.value = '';
  course.value = '';
  after.value = '';
  followedCorrect.value = false;
  courseCorrect.value = false;
  afterCorrect.value = false;
  hasValidatedAtLeastOnce.value = false;
}

defineExpose({ reset });
</script>

<template>
  <div class="triple-select" :class="{ 'is-completed': isCompleted }">
    <div class="select-field">
      <label>Bell initially followed:</label>
      <select 
        v-model="followed" 
        :disabled="isCompleted"
        :class="{ 'is-correct': followedCorrect && hasValidatedAtLeastOnce }"
      >
        <option value="" disabled>Select...</option>
        <option v-for="opt in followedOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <p v-if="promptPart2" class="prompt-part2">{{ promptPart2 }}</p>

    <div class="select-field">
      <label>Course bell (you take off the lead):</label>
      <select 
        v-model="course" 
        :disabled="isCompleted"
        :class="{ 'is-correct': courseCorrect && hasValidatedAtLeastOnce }"
      >
        <option value="" disabled>Select...</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div class="select-field">
      <label>After bell (takes you off the lead):</label>
      <select 
        v-model="after" 
        :disabled="isCompleted"
        :class="{ 'is-correct': afterCorrect && hasValidatedAtLeastOnce }"
      >
        <option value="" disabled>Select...</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.triple-select {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 1.5rem auto;
  text-align: left;
}

.prompt-part2 {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--md-sys-color-on-background);
  margin: 0.5rem 0;
  text-align: center;
}

.select-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-field label {
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
}

select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  transition: background-color 0.2s, border-color 0.2s;
}

select.is-correct {
  border-color: var(--md-sys-color-success);
  background-color: var(--md-sys-color-success-container);
}

.is-completed select {
  border-color: var(--md-sys-color-success);
  background-color: var(--md-sys-color-success-container);
  pointer-events: none;
}
</style>
