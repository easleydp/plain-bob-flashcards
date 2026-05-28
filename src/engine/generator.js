/**
 * Procedural Question Generation Engine
 */

export const FOCUS_AREAS = {
  CIRCLE: 'Circle of work',
  TREBLE: 'Passing the treble',
  EVERYTHING: 'Everything!'
};

export class QuestionGenerator {
  constructor(methods) {
    this.methods = methods;
  }

  generateAll(methodKey, focusArea) {
    const method = this.methods[methodKey];
    if (!method) return [];

    let questions = [];

    if (focusArea === FOCUS_AREAS.CIRCLE || focusArea === FOCUS_AREAS.EVERYTHING) {
      questions = [...questions, ...this.generateCircleOfWork(method, methodKey)];
    }

    if (focusArea === FOCUS_AREAS.TREBLE || focusArea === FOCUS_AREAS.EVERYTHING) {
      questions = [...questions, ...this.generatePassingTheTreble(method, methodKey)];
    }

    return questions;
  }

  generateCircleOfWork(method, methodKey) {
    const questions = [];

    // 6.1.1 First Piece of Work
    Object.entries(method.starts).forEach(([place, work]) => {
      questions.push({
        id: `${methodKey}_circle_first_work_${place}`,
        type: 'CLOCK_BUTTONS',
        prompt: `Starting in ${this.getOrdinal(place)} place, what is your first piece of work?`,
        options: method.workItems,
        answer: work,
        method: method.name,
        focus: FOCUS_AREAS.CIRCLE
      });
    });

    // 6.1.2 Next Work Element Sequence
    method.workItems.forEach((work, index) => {
      const nextIndex = (index + 1) % method.workItems.length;
      questions.push({
        id: `${methodKey}_circle_next_work_${index}`,
        type: 'RADIO_LIST',
        prompt: `In a plain course, what is the next work after ${work}?`,
        options: [...method.workItems].sort(() => Math.random() - 0.5),
        answer: method.workItems[nextIndex],
        method: method.name,
        focus: FOCUS_AREAS.CIRCLE
      });
    });

    // 6.1.3 Course and After Bells Matrix
    method.workingBells.forEach(bell => {
      const data = method.following[bell];
      questions.push({
        id: `${methodKey}_circle_following_${bell}`,
        type: 'TRIPLE_SELECT',
        prompt: `In a plain course, if you are on bell ${bell}, the first bell you will follow is:`,
        promptPart2: `... and your course and after bells are:`,
        // Dropdown 1: bell followed, Dropdown 2: course, Dropdown 3: after
        answer: {
          followed: data.followed === null ? 'None of the above - I will lead!' : data.followed.toString(),
          course: data.course.toString(),
          after: data.after.toString()
        },
        method: method.name,
        focus: FOCUS_AREAS.CIRCLE
      });
    });

    return questions;
  }

  generatePassingTheTreble(method, methodKey) {
    const questions = [];

    // 6.2.1 Upward Hunt From Lead Pass Point
    questions.push({
      id: `${methodKey}_treble_up_from_2nds`,
      type: 'SCATTERED_BUTTONS',
      prompt: `Hunting up after making 2nds, when will you pass the treble?`,
      before: 'When I am in',
      after: 'place.',
      options: this.getPlaceOptions(method),
      answer: this.getMaxPlace(method),
      method: method.name,
      focus: FOCUS_AREAS.TREBLE
    });

    // 6.2.2 Long Place Downward Transition
    const longPlace = method.workItems.find(w => w.startsWith('Long'));
    if (longPlace) {
      const maxPlaceNum = parseInt(this.getMaxPlace(method));
      questions.push({
        id: `${methodKey}_treble_down_from_long`,
        type: 'SCATTERED_BUTTONS',
        prompt: `After ${longPlace}, when will you next follow the treble (while hunting down to lead)?`,
        before: 'When I am in',
        after: 'place.',
        options: this.getPlaceOptions(method),
        answer: (maxPlaceNum - 1).toString() + (maxPlaceNum - 1 === 2 ? 'nd' : (maxPlaceNum - 1 === 3 ? 'rd' : 'th')),
        method: method.name,
        focus: FOCUS_AREAS.TREBLE
      });
    }

    // 6.2.3 Upward Visual Identification Cue
    method.trebleCollision.forEach((collision, index) => {
      questions.push({
        id: `${methodKey}_treble_up_cue_${index}`,
        type: 'CLOCK_BUTTONS',
        prompt: `You notice you've passed the treble in ${collision.up} place while hunting up. What work is coming next?`,
        options: method.workItems,
        answer: collision.nextWork,
        method: method.name,
        focus: FOCUS_AREAS.TREBLE
      });
    });

    // 6.2.4 Downward Pass Point Determination
    method.trebleCollision.forEach((collision, index) => {
      // Map work items to past-tense actions
      const action = collision.nextWork
        .replace('Make', 'made')
        .replace('Dodge', 'done the')
        .replace('Long', 'done');
      
      const isDodge = collision.nextWork.includes('Dodge');
      let options = this.getPlaceOptions(method);
      
      if (isDodge) {
        // Filter options below dodge position
        const dodgeMatch = collision.nextWork.match(/(\d)-(\d)/);
        if (dodgeMatch) {
          const limit = parseInt(dodgeMatch[2]);
          options = options.filter(o => parseInt(o) <= limit);
        }
      }

      questions.push({
        id: `${methodKey}_treble_down_pass_${index}`,
        type: 'SCATTERED_BUTTONS',
        prompt: `You've just ${action}. When will you next pass the treble while hunting down to lead?`,
        before: 'When I am in',
        after: 'place.',
        options: options,
        answer: collision.down,
        method: method.name,
        focus: FOCUS_AREAS.TREBLE
      });
    });

    return questions;
  }

  getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  getMaxPlace(method) {
    const num = parseInt(method.scale.split('+')[1]) + 1;
    return this.getOrdinal(num);
  }

  getPlaceOptions(method) {
    const max = parseInt(method.scale.split('+')[1]) + 1;
    const options = [];
    for (let i = 2; i <= max; i++) {
      options.push(this.getOrdinal(i));
    }
    return options;
  }
}
