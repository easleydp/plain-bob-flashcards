<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { METHODS } from '../engine/methods.js';
import { QuestionGenerator } from '../engine/generator.js';
import ClockButtons from '../components/ClockButtons.vue';
import ScatteredButtons from '../components/ScatteredButtons.vue';
import RadioList from '../components/RadioList.vue';
import TripleSelect from '../components/TripleSelect.vue';

const props = defineProps({
  methodKey: {
    type: String,
    required: true
  },
  focusArea: {
    type: String,
    required: true
  },
  srs: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['finish-session']);

const generator = new QuestionGenerator(METHODS);
const allQuestions = generator.generateAll(props.methodKey, props.focusArea);

const currentQuestion = ref(null);
const correctIdentifier = ref(null);
const incorrectIdentifiers = ref([]);
const showNext = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

// Session tracking
const stats = ref({
  startTime: Date.now(),
  totalQuestions: 0,
  firstTimeSuccesses: 0,
  reAttempts: 0,
  distinctQuestionIds: new Set()
});

const isFirstAttemptForQuestion = ref(true);

function getQuestionIdFromHash() {
  const hash = window.location.hash;
  const parts = hash.replace(/^#\/?/, '').split('/');
  return parts[1] || null;
}

function loadQuestionFromHashOrSRS() {
  const hashQId = getQuestionIdFromHash();
  if (hashQId) {
    const question = allQuestions.find(q => q.id === hashQId);
    if (question) {
      if (currentQuestion.value && currentQuestion.value.id === question.id) {
        return;
      }
      displayQuestion(question);
      return;
    }
  }
  loadNextQuestion();
}

function getNextSequentialQuestion() {
  if (!allQuestions || allQuestions.length === 0) return null;
  if (!currentQuestion.value) {
    return allQuestions[0];
  }
  const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.value.id);
  if (currentIndex === -1) {
    return allQuestions[0];
  }
  const nextIndex = (currentIndex + 1) % allQuestions.length;
  return allQuestions[nextIndex];
}

function displayQuestion(question) {
  currentQuestion.value = question;
  correctIdentifier.value = null;
  incorrectIdentifiers.value = [];
  showNext.value = false;
  isFirstAttemptForQuestion.value = true;
  
  if (!stats.value.distinctQuestionIds.has(question.id)) {
    stats.value.totalQuestions++;
    stats.value.distinctQuestionIds.add(question.id);
  }
}

function loadNextQuestion() {
  const isSequential = new URLSearchParams(window.location.search).has('sequential');
  let next = null;

  if (isSequential) {
    next = getNextSequentialQuestion();
  } else {
    next = props.srs.getNextQuestion(props.methodKey, allQuestions);
  }

  if (!next) {
    handleFinish();
    return;
  }

  const newHash = `#/${props.methodKey}/${next.id}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, null, newHash);
  }

  displayQuestion(next);
}

function handleHashChange() {
  loadQuestionFromHashOrSRS();
}

onMounted(() => {
  props.srs.registerQuestions(props.methodKey, allQuestions);
  loadQuestionFromHashOrSRS();
  window.addEventListener('hashchange', handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});

function handleSelection(payload) {
  const selected = payload.detail.label;
  const isCorrect = selected === currentQuestion.value.answer;
  
  processResult(isCorrect, selected);
}

function handleTripleValidation(payload) {
  const { isCorrect } = payload;
  if (isCorrect) {
    correctIdentifier.value = 'CORRECT'; // Dummy value to trigger completed state
    processResult(true, 'CORRECT');
  } else {
    // For triple select, we don't necessarily highlight incorrect individual dropdowns 
    // in a way that maps to incorrectIdentifiers easily, but we can show the toast.
    if (isFirstAttemptForQuestion.value) {
      stats.value.reAttempts++;
      isFirstAttemptForQuestion.value = false;
      props.srs.recordAttempt(props.methodKey, currentQuestion.value.id, false, true);
    }
    showToastMessage('Try again');
  }
}

function processResult(isCorrect, identifier) {
  if (isCorrect) {
    correctIdentifier.value = identifier;
    if (isFirstAttemptForQuestion.value) {
      stats.value.firstTimeSuccesses++;
      props.srs.recordAttempt(props.methodKey, currentQuestion.value.id, true, true);
    } else {
      props.srs.recordAttempt(props.methodKey, currentQuestion.value.id, true, false);
    }
    showNext.value = true;
  } else {
    if (!incorrectIdentifiers.value.includes(identifier)) {
      incorrectIdentifiers.value.push(identifier);
    }
    
    if (isFirstAttemptForQuestion.value) {
      stats.value.reAttempts++;
      isFirstAttemptForQuestion.value = false;
      props.srs.recordAttempt(props.methodKey, currentQuestion.value.id, false, true);
    }
    showToastMessage('Try again');
  }
}

function showToastMessage(msg) {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
}

function handleNext() {
  const isSequential = new URLSearchParams(window.location.search).has('sequential');
  const limit = isSequential ? allQuestions.length : 10;
  if (stats.value.distinctQuestionIds.size >= limit || stats.value.distinctQuestionIds.size >= allQuestions.length) {
    handleFinish();
  } else {
    loadNextQuestion();
  }
}

function handleFinish() {
  emit('finish-session', {
    startTime: stats.value.startTime,
    endTime: Date.now(),
    totalQuestions: stats.value.totalQuestions,
    firstTimeSuccesses: stats.value.firstTimeSuccesses,
    reAttempts: stats.value.reAttempts
  });
}

const workingBells = computed(() => METHODS[props.methodKey].workingBells);
</script>

<template>
  <div class="question-screen">
    <Transition name="fade" mode="out-in">
      <div v-if="currentQuestion" :key="currentQuestion.id" class="question-card">
        <h2 class="question-prompt">{{ currentQuestion.prompt }}</h2>
        
        <div class="widget-container">
          <ClockButtons
            v-if="currentQuestion.type === 'CLOCK_BUTTONS'"
            :items="currentQuestion.options"
            :correct-identifier="correctIdentifier"
            :incorrect-identifiers="incorrectIdentifiers"
            @clock-button-selection="handleSelection"
          />

          <ScatteredButtons
            v-else-if="currentQuestion.type === 'SCATTERED_BUTTONS'"
            :items="currentQuestion.options"
            :before="currentQuestion.before"
            :after="currentQuestion.after"
            :correct-identifier="correctIdentifier"
            :incorrect-identifiers="incorrectIdentifiers"
            @clock-button-selection="handleSelection"
          />

          <RadioList
            v-else-if="currentQuestion.type === 'RADIO_LIST'"
            :options="currentQuestion.options"
            :correct-identifier="correctIdentifier"
            :incorrect-identifiers="incorrectIdentifiers"
            @selection="handleSelection"
          />

          <TripleSelect
            v-else-if="currentQuestion.type === 'TRIPLE_SELECT'"
            :working-bells="workingBells"
            :correct-answer="currentQuestion.answer"
            :prompt-part2="currentQuestion.promptPart2"
            :is-completed="!!correctIdentifier"
            @validation="handleTripleValidation"
          />
        </div>

        <Transition name="slide-up">
          <button 
            v-if="showNext" 
            class="md-button md-button--filled next-button" 
            @click="handleNext"
          >
            Next
          </button>
        </Transition>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showToast" class="toast" role="alert" aria-live="assertive">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.question-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
  position: relative;
}

.question-card {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.question-prompt {
  font-size: 1.4rem;
  text-align: center;
  color: var(--md-sys-color-on-background);
  margin-top: 1rem;
}

.question-prompt-part2 {
  font-size: 1.1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  margin-top: -1rem;
}

.widget-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.next-button {
  position: fixed;
  bottom: 2rem;
  width: 200px;
  box-shadow: var(--md-sys-shadow-level2);
  z-index: 10;
}

.toast {
  position: fixed;
  bottom: 6rem;
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: var(--md-sys-shadow-level1);
  z-index: 100;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
