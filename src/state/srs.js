/**
 * SRS (Spaced Repetition System) Engine (a.k.a. Leitner Framework)
 */

export const BOX_PROBABILITIES = [70, 20, 8, 2];

export class SRSEngine {
  constructor(storageKey = "plain-bob-flashcards-state") {
    this.storageKey = storageKey;
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse SRS state", e);
      }
    }
    return {
      settings: {
        lastSelectedMethod: "DOUBLES",
        lastSelectedFocus: "Everything!",
      },
      tracking: {},
    };
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  getTracking(methodKey) {
    if (!this.state.tracking[methodKey]) {
      this.state.tracking[methodKey] = {
        questions: [],
      };
    }
    return this.state.tracking[methodKey];
  }

  registerQuestions(methodKey, questions) {
    const tracking = this.getTracking(methodKey);
    questions.forEach((q) => {
      const existing = tracking.questions.find((t) => t.id === q.id);
      if (!existing) {
        tracking.questions.push({
          id: q.id,
          box: 1,
          totalAttempts: 0,
          firstTimeSuccesses: 0,
        });
      }
    });
    this.saveState();
  }

  getNextQuestion(methodKey, questions) {
    const tracking = this.getTracking(methodKey);
    const boxes = [[], [], [], []];

    tracking.questions.forEach((t) => {
      const question = questions.find((q) => q.id === t.id);
      if (question) {
        boxes[t.box - 1].push(question);
      }
    });

    const roll = Math.floor(Math.random() * 100) + 1;
    let targetBoxIndex = 0;

    if (roll <= 70) targetBoxIndex = 0;
    else if (roll <= 90) targetBoxIndex = 1;
    else if (roll <= 98) targetBoxIndex = 2;
    else targetBoxIndex = 3;

    // Fallback logic
    for (let i = targetBoxIndex; i >= 0; i--) {
      if (boxes[i].length > 0) {
        return boxes[i][Math.floor(Math.random() * boxes[i].length)];
      }
    }

    // Default to Box 1 if all previous are empty (shouldn't happen if registered)
    return boxes[0][Math.floor(Math.random() * boxes[0].length)];
  }

  recordAttempt(methodKey, questionId, wasCorrect, isFirstAttempt) {
    const tracking = this.getTracking(methodKey);
    const record = tracking.questions.find((t) => t.id === questionId);

    if (record) {
      if (isFirstAttempt) {
        record.totalAttempts++;
        if (wasCorrect) {
          record.firstTimeSuccesses++;
        }
      }

      if (wasCorrect) {
        // Upgrade box
        if (record.box < 4) record.box++;
      } else {
        // Demote to Box 1
        record.box = 1;
      }
      this.saveState();
    }
  }

  getMastery(methodKey) {
    const tracking = this.getTracking(methodKey);
    if (!tracking.questions.length) return 0;
    const mastered = tracking.questions.filter((q) => q.box === 4).length;
    return mastered / tracking.questions.length;
  }
}
