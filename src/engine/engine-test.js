import { METHODS } from './methods.js';
import { QuestionGenerator, FOCUS_AREAS } from './generator.js';

// Mock localStorage for node environment
global.localStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = value.toString(); },
  clear() { this.data = {}; }
};

import { SRSEngine } from '../state/srs.js';

function runTests() {
  console.log('--- Phase 1: Engine & State Foundation Test ---');

  const generator = new QuestionGenerator(METHODS);
  const srs = new SRSEngine();

  // Test 1: Question Generation
  console.log('Test 1: Generating questions for Plain Bob Doubles...');
  const doublesQuestions = generator.generateAll('DOUBLES', FOCUS_AREAS.EVERYTHING);
  console.log(`- Generated ${doublesQuestions.length} questions.`);
  if (doublesQuestions.length === 0) throw new Error('No questions generated');

  // Test 2: SRS Registration
  console.log('Test 2: Registering questions with SRS...');
  srs.registerQuestions('DOUBLES', doublesQuestions);
  const tracking = srs.getTracking('DOUBLES');
  console.log(`- Registered ${tracking.questions.length} question records.`);
  if (tracking.questions.length !== doublesQuestions.length) throw new Error('Registration mismatch');

  // Test 3: Next Question Selection
  console.log('Test 3: Selecting next question...');
  const nextQ = srs.getNextQuestion('DOUBLES', doublesQuestions);
  console.log(`- Selected: ${nextQ.prompt}`);
  if (!nextQ) throw new Error('Failed to select next question');

  // Test 4: Record Attempt (Success)
  console.log('Test 4: Recording successful attempt (Box 1 -> Box 2)...');
  const qId = nextQ.id;
  srs.recordAttempt('DOUBLES', qId, true, true);
  const record = srs.getTracking('DOUBLES').questions.find(t => t.id === qId);
  console.log(`- New Box: ${record.box}, Total Attempts: ${record.totalAttempts}`);
  if (record.box !== 2) throw new Error('Box upgrade failed');

  // Test 5: Record Attempt (Failure)
  console.log('Test 5: Recording failed attempt (Box 2 -> Box 1)...');
  srs.recordAttempt('DOUBLES', qId, false, false); // Not first attempt of session logic usually, but here just testing state
  console.log(`- New Box: ${record.box}`);
  if (record.box !== 1) throw new Error('Box demotion failed');

  // Test 6: Mastery Calculation
  console.log('Test 6: Checking mastery...');
  const mastery = srs.getMastery('DOUBLES');
  console.log(`- Mastery: ${(mastery * 100).toFixed(1)}%`);

  console.log('--- ALL TESTS PASSED ---');
}

try {
  runTests();
} catch (e) {
  console.error('TEST FAILED:', e.message);
  process.exit(1);
}
