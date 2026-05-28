<script setup>
import { ref, onMounted } from 'vue';
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

function handleStartSession(config) {
  sessionConfig.value = config;
  currentView.value = VIEW.QUESTION;
}

function handleFinishSession(stats) {
  sessionStats.value = stats;
  mastery.value = srs.value.getMastery(sessionConfig.value.method);
  currentView.value = VIEW.SUMMARY;
}

function handleRestart() {
  currentView.value = VIEW.START;
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
