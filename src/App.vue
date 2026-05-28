<script setup>
import { ref } from 'vue';
import ClockButtons from './components/ClockButtons.vue';
import ScatteredButtons from './components/ScatteredButtons.vue';

const clockItems = ['Make 2nds', 'Dodge 3-4 Down', 'Long 5ths', 'Dodge 3-4 Up'];
const scatteredItems = ['2nd', '3rd', '4th', '5th', '6th'];

const clockCorrect = ref(null);
const clockIncorrect = ref([]);

const scatteredCorrect = ref(null);
const scatteredIncorrect = ref([]);

function handleClockSelection({ detail }) {
  console.log('Clock selection:', detail);
  if (detail.label === 'Make 2nds') {
    clockCorrect.value = detail.label;
  } else {
    clockIncorrect.value.push(detail.label);
  }
}

function handleScatteredSelection({ detail }) {
  console.log('Scattered selection:', detail);
  if (detail.label === '5th') {
    scatteredCorrect.value = detail.label;
  } else {
    scatteredIncorrect.value.push(detail.label);
  }
}

function reset() {
  clockCorrect.value = null;
  clockIncorrect.value = [];
  scatteredCorrect.value = null;
  scatteredIncorrect.value = [];
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Component Demo</h1>
      <button class="md-button md-button--filled" @click="reset">Reset States</button>
    </header>

    <main>
      <section>
        <h2>ClockButtons Widget</h2>
        <p>Goal: Select "Make 2nds"</p>
        <ClockButtons 
          :items="clockItems" 
          :correct-identifier="clockCorrect"
          :incorrect-identifiers="clockIncorrect"
          @clock-button-selection="handleClockSelection"
        />
      </section>

      <hr />

      <section>
        <h2>ScatteredButtons Widget</h2>
        <p>Goal: Select "5th"</p>
        <ScatteredButtons 
          :items="scatteredItems"
          before="When I am in"
          after="place."
          :correct-identifier="scatteredCorrect"
          :incorrect-identifiers="scatteredIncorrect"
          @clock-button-selection="handleScatteredSelection"
        />
      </section>
    </main>
  </div>
</template>

<style>
header {
  margin-bottom: 2rem;
  text-align: center;
}

section {
  padding: 1rem;
}

h2 {
  color: var(--md-sys-color-primary);
}

hr {
  border: 0;
  border-top: 1px solid var(--md-sys-color-outline);
  margin: 2rem 0;
}
</style>
