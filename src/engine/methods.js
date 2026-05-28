/**
 * Appendix A: Plain Bob Method Particulars
 */

export const METHODS = {
  DOUBLES: {
    name: 'Plain Bob Doubles',
    scale: 'Treble + 4',
    workingBells: [2, 3, 4, 5],
    workItems: [
      'Make 2nds',
      'Dodge 3-4 Down',
      'Long 5ths',
      'Dodge 3-4 Up'
    ],
    starts: {
      2: 'Dodge 3-4 Down',
      4: 'Long 5ths',
      5: 'Dodge 3-4 Up',
      3: 'Make 2nds'
    },
    following: {
      2: { followed: null, course: 3, after: 4 }, // None (Leads immediately)
      3: { followed: 4, course: 5, after: 2 },
      4: { followed: 1, course: 2, after: 5 },
      5: { followed: 3, course: 4, after: 3 }
    },
    trebleCollision: [
      { up: '5th', nextWork: 'Dodge 3-4 Down', down: '3rd' },
      { up: '4th', nextWork: 'Long 5ths', down: '4th' },
      { up: '3rd', nextWork: 'Dodge 3-4 Up', down: '5th' },
      { up: '2nd', nextWork: 'Make 2nds', down: '2nd' }
    ]
  },
  MINOR: {
    name: 'Plain Bob Minor',
    scale: 'Treble + 5',
    workingBells: [2, 3, 4, 5, 6],
    workItems: [
      'Make 2nds',
      'Dodge 3-4 Down',
      'Dodge 5-6 Down',
      'Dodge 5-6 Up',
      'Dodge 3-4 Up'
    ],
    starts: {
      2: 'Dodge 3-4 Down',
      4: 'Dodge 5-6 Down',
      6: 'Dodge 5-6 Up',
      5: 'Dodge 3-4 Up',
      3: 'Make 2nds'
    },
    following: {
      2: { followed: null, course: 3, after: 4 },
      3: { followed: 4, course: 5, after: 2 },
      4: { followed: 1, course: 2, after: 6 },
      5: { followed: 6, course: 6, after: 3 },
      6: { followed: 3, course: 4, after: 5 }
    },
    trebleCollision: [
      { up: '6th', nextWork: 'Dodge 3-4 Down', down: '3rd' },
      { up: '5th', nextWork: 'Dodge 5-6 Down', down: '4th' },
      { up: '4th', nextWork: 'Dodge 5-6 Up', down: '5th' },
      { up: '3rd', nextWork: 'Dodge 3-4 Up', down: '6th' },
      { up: '2nd', nextWork: 'Make 2nds', down: '2nd' }
    ]
  },
  TRIPLES: {
    name: 'Plain Bob Triples',
    scale: 'Treble + 6',
    workingBells: [2, 3, 4, 5, 6, 7],
    workItems: [
      'Make 2nds',
      'Dodge 3-4 Down',
      'Dodge 5-6 Down',
      'Long 7ths',
      'Dodge 5-6 Up',
      'Dodge 3-4 Up'
    ],
    starts: {
      2: 'Dodge 3-4 Down',
      4: 'Dodge 5-6 Down',
      6: 'Long 7ths',
      7: 'Dodge 5-6 Up',
      5: 'Dodge 3-4 Up',
      3: 'Make 2nds'
    },
    following: {
      2: { followed: null, course: 3, after: 4 },
      3: { followed: 4, course: 5, after: 2 },
      4: { followed: 1, course: 2, after: 6 },
      5: { followed: 6, course: 7, after: 3 },
      6: { followed: 3, course: 4, after: 7 },
      7: { followed: 5, course: 6, after: 5 }
    },
    trebleCollision: [
      { up: '7th', nextWork: 'Dodge 3-4 Down', down: '3rd' },
      { up: '6th', nextWork: 'Dodge 5-6 Down', down: '4th' },
      { up: '5th', nextWork: 'Long 7ths', down: '5th' },
      { up: '4th', nextWork: 'Dodge 5-6 Up', down: '6th' },
      { up: '3rd', nextWork: 'Dodge 3-4 Up', down: '7th' },
      { up: '2nd', nextWork: 'Make 2nds', down: '2nd' }
    ]
  }
};
