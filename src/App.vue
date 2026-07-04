<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { SRSEngine } from './state/srs.js';
import { METHODS } from './engine/methods.js';
import StartScreen from './views/StartScreen.vue';
import QuestionScreen from './views/QuestionScreen.vue';
import SummaryScreen from './views/SummaryScreen.vue';

const VIEW = {
  START: 'START',
  QUESTION: 'QUESTION',
  SUMMARY: 'SUMMARY'
};

const currentView = ref(VIEW.START);
const srs = ref(new SRSEngine());

const sessionConfig = ref({
  method: 'DOUBLES',
  focus: ''
});

const sessionStats = ref(null);
const mastery = ref(0);

function parseHash() {
  const hash = window.location.hash;
  if (!hash || hash === '#/' || hash === '#') {
    currentView.value = VIEW.START;
    return;
  }

  // Expecting format: #/METHOD_KEY or #/METHOD_KEY/question_id
  const parts = hash.replace(/^#\/?/, '').split('/');
  const methodKey = parts[0].toUpperCase();

  if (METHODS[methodKey]) {
    sessionConfig.value = {
      method: methodKey,
      focus: sessionConfig.value.focus || 'Everything!'
    };
    currentView.value = VIEW.QUESTION;
  } else {
    currentView.value = VIEW.START;
  }
}

onMounted(() => {
  parseHash();
  window.addEventListener('hashchange', parseHash);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', parseHash);
});

function handleStartSession(config) {
  sessionConfig.value = config;
  window.location.hash = `#/${config.method}`;
}

function handleFinishSession(stats) {
  sessionStats.value = stats;
  mastery.value = srs.value.getMastery(sessionConfig.value.method);
  currentView.value = VIEW.SUMMARY;
}

function handleRestart() {
  window.location.hash = '#/';
}
</script>

<template>
  <div id="app">
    <Transition name="fade" mode="out-in">
      <StartScreen 
        v-if="currentView === VIEW.START" 
        :srs="srs" 
        @start-session="handleStartSession" 
      />
      
      <QuestionScreen 
        v-else-if="currentView === VIEW.QUESTION" 
        :key="sessionConfig.method"
        :method-key="sessionConfig.method"
        :focus-area="sessionConfig.focus"
        :srs="srs"
        @finish-session="handleFinishSession"
      />
      
      <SummaryScreen 
        v-else-if="currentView === VIEW.SUMMARY" 
        :session-stats="sessionStats"
        :mastery="mastery"
        :method-name="METHODS[sessionConfig.method].name"
        @restart="handleRestart"
      />
    </Transition>
  </div>
</template>

<style>
/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure MD3 layout fills screen */
body {
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
}
</style>
