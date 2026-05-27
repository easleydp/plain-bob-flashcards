# Plain Bob Flashcards: Technical Specification

## 0. Prerequisite Research (Required)

Before attempting to interpret or implement this specification, perform a brief background study on:

- Topic: Change Ringing
- Key concepts to understand:
  - Change Ringing terminology
  - The 'Plain Bob' family of change ringing methods
- Goal: Gain sufficient context to correctly interpret terminology and design decisions in this spec.

- Topic: [Flashcards](https://en.wikipedia.org/wiki/Flashcard)
- Key concepts to understand:
  - Spaced repetition and the Leitner system
- Goal: Gain sufficient context to correctly interpret terminology and design decisions in this spec.

Focus only on information directly relevant to this specification. For instance, for the Change Ringing topic, it is not required to understand bobs and singles.

### Completion Criteria

- Can explain the core concepts in your own words
- Can identify how they relate to this specification

If you proceed to implementation without completing the Prerequisite Research step, the output is considered invalid.

## 1. Introduction

**1.1. Purpose**

This document outlines the technical specifications for a static browser based web app (i.e. no server side processing), named `Plain Bob Flashcards`, designed to help change ringers learn and memorise some essential details about Plain Bob methods.

**1.2. Overview**

'Plain Bob' is a set of bell ringing 'methods' with a common structure. The methods to be supported in the first version of the app are:

- Plain Bob Doubles (5 bells)
- Plain Bob Minor (6 bells)
- Plain Bob Triples (7 bells)

After selecting one of the supported Plain Bob methods, the web app (probably an SPA) asks the user to answer a series of questions selected pseudo-randomly from a pre-defined set.

The user's recent performance is tracked. Question that appear to have a greater than average failure rate are repeated more frequently. Conversely, questions the user appears to have no trouble with are repeated only occasionally.

---

## 2. General Requirements

Assume there's just one local user (i.e. no need to discriminate different users).

---

## 3. Visual Appearance

Follow the style of Google's 'Material Design' (preferably Material Design 3). Maintenance developers should be able to adjustable all colours via CSS.

---

## 4. Functional Behaviour

Terminology notes:

- **Treble** - Bell No.1. Always rings plain hunt (does no 'work').
- **Tenor** (a.k.a. **cover** bell) - Only relevant for Doubles, Triples, etc. E.g. Plain Bob Doubles is a 5 bell method but is sometimes rung on 6 bells where bell 6 always rings in 6th place, so (in a sense) doesn't really take part in the method (generally not depicted in the 'blue line').
- **Inside bell** (a.k.a. **working bell**) - A bell that does items of _work_ (e.g. making 2nds, dodging, long 5ths/7ths). That is, all the bells after the Treble, but not including the Tenor (if there is one).
- **Item of work** - Each method involves the 'inside bells' cycling around items of work (such as making 2nds, dodging, long 5ths/7ths). These are defined on a per method basis in Appendix A.

**4.1. ClockButtons widget**

A number of questions employ a 'ClockButtons' widget. This is a reusable interactive 'circle of work' component consisting of between 4 and 6 buttons arranged in a circle (so, with 6 buttons, they would be approximately 60 degrees apart). Between each adjacent pair of buttons is a graphical arc/arrow, pointing in the clockwise direction.

The component's initialisation method is supplied with a list of button labels (one per button).
The first item in the list is for the first button and this is always positioned at the 12 o-clock position.
The second and subsequent items are for the remaining buttons which are positioned around the circle in a clockwise direction.

When a button is clicked an 'event' should be emitted. Use standard JavaScript CustomEvents (detail payload containing index and text) or accept a callback function during initialization.

The component has an API that allows the client code to highlight a button (specified by text or index) as either 'correct' (e.g. button goes green) or 'incorrect' (e.g. button goes red). Once a button is marked as 'incorrect' it is disabled (although the text should remain just as visible as before).

Implementation note: ./src/ClockButtons-demo.html provides some sample component rendering code, in case useful. However, it does not implement the event firing or correct/incorrect button highlighting functionality.

**4.2. ScatteredButtons widget**

A number of questions employ a 'ScatteredButtons' widget. This is a reusable interactive component consisting of between 2 to 6 buttons scattered randomly in a cluster.

The buttons are positioned in an apparently random jumble. Each button's text will never be more than 6 characters. The buttons should be rendered in a tight cluster. They can be slightly overlapping as long as the button text is never obscured. Each button should have a random rotation, though never exceeding +/- 30 degrees deviation from the horizontal. The overall effect should be as if some cards have been tossed in to the air and allowed to land randomly on the floor (though with all the text fortuitously still readable!)

Implementation note: To avoid excessive overlapping: Use a basic collision-avoidance boundary or a grid-jitter approach where buttons are assigned to a loose invisible grid and randomly offset/rotated within their respective cells.

The component's initialisation method is supplied with:

1. A list of button labels (one per button). Note that the specified order does not affect the positioning, which is random.
2. 'before' text and 'after' text. These are simply to be rendered on either side (left and right respectively) of the button cluster, vertically aligned with the (approximate) centre of the cluster.

Example: A question might ask: "You're following the other bells in turn after making 2nds. When will you pass the treble while hunting up?"
The ScatteredButtons widget would then follow, initialised with:

- `["3rds", "4ths", "5ths", "6ths", "7ths"]`
- `{before: "When I am in", after: "place."}`

> Aside (Instructional design principle): <br>This widget is intended for questions where we'd rather the learner tried to simply pluck the correct answer from their rote learned memory, rather than work their way methodically through a list considering each option in turn.

When a button is clicked an 'event' should be emitted. Use standard JavaScript CustomEvents (detail payload specifying the text and the button's index w.r.t. the originally supplied array) or accept a callback function during initialization.

The component has an API that allows the client code to highlight a button (specified by text or index) as either 'correct' (e.g. button goes green) or 'incorrect' (e.g. button goes red). Once a button is marked as 'incorrect' it is disabled (although the text should remain just as visible as before).

Implementation note: ./src/ScatteredButtons-demo.html provides some sample component rendering code, in case useful. However, it does not implement the event firing or correct/incorrect button highlighting functionality.

**4.3. Spaced Repetition**

TODO: Insert details here of how a Flashcards 'spaced repetition' technique should be used, incorporating increasing time intervals between each review of a question in order to harness the 'spacing effect'.

Possible approach:

- Use the Leitner system.
- Define 3 to 5 virtual "boxes" in the JSON schema.
- Specify how a correct answer promotes a card to the next box, and how an incorrect answer demotes it back to Box 1.
- Define the pseudo-random selection weightings (e.g., Box 1 cards have an 80% chance of being picked, Box 2 has 15%, Box 3 has 5%).

**4.4. Performance Tracking**

Performance data needs to be tracked for the following purposes:

1. TODO: Insert details here of the data that should be collected in order to implement the chosen 'spaced repetition' technique.

2. To support the "congratulations!" message displayed on the 'Summary Screen' it is also necessary to track which questions have been asked during the current session.

Implementation note: Performance data should be stored in local storage and reloaded when the app starts. Prefer easily readable JSON format data to aid problem diagnosis.

---

## 5. User Interface

**5.1. Start screen**

On launching the app a start screen is rendered consisting of (from top to bottom):

1. the app title "Plain Bob Flashcards"

2. "Select Plain Bob method": vertically oriented radio button selector with an option for each supported PB method (from least bells to most bells).

   If a previously selected option is recorded (in local storage) then this should be selected by default, otherwise the first option shall be the default selection.

3. "Focus on": vertically oriented radio button selector with three options: **Circle of work**; **Passing the treble**; **Everything!**

   To the right of each class option (i.e. all bar "Everything!") is displayed the number of questions in parenthesis.

   If a previously selected option is recorded (in local storage) then this should be selected by default, otherwise "Everything!" shall be the default selection.

4. A "Start" button

   On clicking this button the user moves to the Question screen (see next).

The whole Start Screen scrolls vertically if necessary.

**5.2. Question screen**

This is populated with the next pseudo-randomly selected question. The content may need to scroll vertically.

If the user answers incorrectly, some suitable visual feedback is given and they get to try again until successful.

When the user answers a question correctly: (i) some suitable visual feedback is given; (ii) a "Next" button appears, anchored towards the bottom of the viewport (i.e. position in the viewport remains fixed even if the content is scrolled).
NOTE: As far as performance tracking is concerned, it's the **initial** attempt that counts (i.e. user must get the question right first time for it to be recorded as correctly answered).

Note: the persistent performance tracking data should be updated after each (initial) answer (in case the app crashes or the user simply abandons the session).

**5.3. Summary screen**

From top to bottom:

1. the user's stats for this session:

"Congratulations! You spent N minutes learning `<method name>` during this session. You answered M distinct questions - P right first time and Q needing re-attempts. Come back soon for more practice!"

Special override message, to be used if the tracking data indicates that every question for the selected method has been answered successfully: "Congratulations! You have mastered every aspect of a plain course of `<method name>`. You're ready for the tower!"

2. A link back to the Start screen - "Start again". (Implementation note: Regardless of what the 'link' looks like, use a `<button>`. Modern A11y (accessibility) and semantic HTML guidelines state that links (`<a>`) are for navigating to a new URL/document, whereas buttons (`<button>`) are for triggering an action or state change on the current page.) If the user selects this option then the effect should be as if they close and restart the app (i.e. new session commences).

---

# 6. Questions

There are two question classes:

- Circle of Work
- Passing the Treble

The following sub-sections describe all the questions related to each class.

Unless specified otherwise, each question description (such as the one titled "First piece of work") is actually an abstract sub-class of question. The actual concrete questions should be procedurally generally based on (i) the selected Plain Bob method and (ii) the multiplicity of possibilities specified for that method in Appendix A (e.g., one concrete instance per inside bell).

**6.1. 'Circle of Work' related questions**

**6.1.1. First piece of work**

Question text: "Starting in `<Nth>` place, what is the first piece of work?"

Beneath the question text, render the ClockButtons widget initialised with the work items relating to the selected PB method (in the cyclical order given in Appendix A). If the user clicks the correct work item button, the button is set as correct and the Next question button is displayed. Otherwise, the button is marked as incorrect and a "Try again" toast message is briefly displayed.

Concrete examples: For Plain Bob Doubles, "`<Nth>`" in the question text would be one of: 2nd, 3rd, 4th, 5th.
And the respective correct answer (first piece of work) would be:
3-4 Down, Long 5ths, 3-4 Up, Make 2nds

**6.1.2. Next work**

Question text: "In a plain course, what is the next work after `<work item>`?"

Beneath the question text, render a vertically oriented list of radio button options, one per possible answer. The order of these options should be randomised. If the user selects the correct answer, the option is highlighted as correct and the Next question button is displayed. Otherwise, the option is highlighted as incorrect, deselected and disabled, and a "Try again" toast message is briefly displayed.

Concrete example: For Plain Bob Doubles, "`<work item>`" in the question text might be "3-4 Up". In which case the correct answer would be "Make 2nds".

**6.1.3. Course and After bells**

Question text: "In a plain course, if you are on bell `<bell number>` the first bell you will follow is:"

Beneath this question text, render a drop-down list (DDL) containing all the other working bell numbers (in order), plus a special option: "None of the above - I will lead!". (That special option is always the correct answer when `<bell number>` is 2.)

Beneath this first DDL, further question text: "... and your **course** and **after** bells are:

Beneath this question text, render a two vertically aligned DDLs containing all the other working bell numbers, in order. The first should be followed by hint text "(you take off the lead)"; the second should be followed by hint text "(takes you off the lead)".

Once the user has chosen a bell number for all three DDLs: those that are correct are highlighted as correct; if all are correct the Next question button is displayed. Otherwise, the incorrect DDLs are highlighted as incorrect and a "Try again" toast message is briefly displayed. On making a subsequent attempt for a particular DDL, the 'incorrect' highlight is removed when they first open the DDL, and then potentially re-applied if they get it wrong again. When all are correct the Next question button is displayed

Concrete example: For Plain Bob Doubles, if "`<bell number>`" in the question text is 3, then the first bell you will follow is 4, course bell is 5, after bell is 2.

**6.2. 'Passing the Treble' related questions**

**6.2.1. Passing treble on the way up after making 2nds**

Question text: "Hunting up after making 2nds, when will you pass the treble"?

Beneath the question text, render the ScatteredButtons widget initialised with `{before: "When I am in", after: "place."}` and with all the possible places that make sense for the selected PB method. So, for PB Doubles: "2nd", "3rd", "4th", 5th". If the user clicks the correct work item button, the button is set as correct and the Next question button is displayed. Otherwise, the button is marked as incorrect and a "Try again" toast message is briefly displayed.

Only one instance of this question is needed per PB method.

Concrete example: For Plain Bob Doubles the correct answer would be "5th".

**6.2.2. Passing treble after a long place**

Question text: "After `<long place name>`, when will you next follow the treble (while hunting down to lead)?"
('long place name' means e.g. "Long 5ths" for PB Doubles, "Long 7ths" for PB Triples.)

Beneath the question text, render the ScatteredButtons widget initialised with `{before: "When I am in", after: "place."}` and with all the possible places (so, "4th" to "2nd" for PB Doubles, "6th" to "2nd" for PB Triples). If the user clicks the correct work item button, the button is set as correct and the Next question button is displayed. Otherwise, the button is marked as incorrect and a "Try again" toast message is briefly displayed.

Only one instance of this question is needed per PB method.

Concrete example: For Plain Bob Doubles, "`<long place name>`" in the question text would be "Long 5ths", and the correct answer would be "4th".

**6.2.3. Noticing where you pass treble on the way up**

Question text: "You notice you've passed the treble in `<Nth>` place while hunting up. What work is coming next?

Beneath the question text, render the ClockButtons widget initialised with the work items relating to the selected PB method (in the cyclical order given in Appendix A). If the user clicks the correct work item button, the button is set as correct and the Next question button is displayed. Otherwise, the button is marked as incorrect and a "Try again" toast message is briefly displayed.

Concrete examples: For Plain Bob Doubles, "`<Nth>`" in the question text would be one of: 5th, 4th, 3rd, 2nd.
And the respective correct answer (next work) would be:
3-4 Down, Long 5ths, 3-4 Up, Make 2nds

**6.2.4. Passing treble on the way down**

Question text: "You've just `<work item action>`. When will you next pass the treble while hunting down to lead?" where `<work item action>` is one of (e.g. for PB Doubles): "made 2nds", "done the 3-4 down dodge", "done long 5ths", "done the 3-4 up dodge"

Beneath the question text, render the ScatteredButtons widget initialised with `{before: "When I am in", after: "place."}` and with all the possible places that make sense for the given question. So, for down dodges, only those places remaining beneath the dodge (e.g. after the 3-4 down dodge in PB Doubles, the only possible answers are 3rds and 2nds). For all other work items (making 2nds, up dodges, long place at the back) - all positions are valid (e.g. for PB Doubles: 5ths, 4ths, 3rds and 2nds). If the user clicks the correct work item button, the button is set as correct and the Next question button is displayed. Otherwise, the button is marked as incorrect and a "Try again" toast message is briefly displayed.

If the user selects the correct answer, the option is highlighted as correct and the Next question button is displayed. Otherwise, the option is highlighted as incorrect, deselected and disabled, and a "Try again" toast message is briefly displayed.

A concrete instance of this question should be generated for each 'down' dodge of the selected Plain Bob method.

---

## Appendix A: Plain Bob method particulars

Implementation note: The data tables presented here are provided for the convenience of readers of this specification. For the implementation code, better to determine the general patterns (common to all PB methods) rather than hard-code the data! This will be particularly beneficial if the app is ever extended to support other PM methods (e.g. Minimus, Major).

**Method: Plain Bob Doubles**

Rung on 5 bells (treble plus 4 inside bells) plus an optional cover. The 4 inside bells cycle through the following items of work:

1. **Make 2nds**
2. **Dodge 3-4 Down**
3. **Long 5ths**
4. **Dodge 3-4 Up**

The following table specifies the 'starts', i.e. the first item of work for each inner/working bell:

| Starting Place / Bell | Work item      |
| :-------------------- | :------------- |
| 2nds                  | Dodge 3-4 Down |
| 4ths                  | Long 5ths      |
| 5ths                  | Dodge 3-4 Up   |
| 3rds                  | Make 2nds      |

The following table specifies (i) the bell initially followed (after leaving 'rounds') and (ii) 'course' and 'after' bells (for plain a course):

| Bell | Bell initially followed | Course bell | After bell |
| :--- | :---------------------- | :---------- | :--------- |
| 2    | None (lead!)            | 3           | 4          |
| 3    | 4                       | 5           | 2          |
| 4    | 1                       | 2           | 5          |
| 5    | 3                       | 4           | 3          |

The following table specifies the next piece of work to be performed according to where you last rang over the treble while hunting up. The third column specifies when you then next ring over the treble while hunting down (after performing the piece of work).

| Meet Treble on the way up | Next work      | Meet Treble on the way down |
| :------------------------ | :------------- | :-------------------------- |
| 5                         | Dodge 3-4 Down | 3                           |
| 4                         | Long 5ths      | 4                           |
| 3                         | Dodge 3-4 Up   | 5                           |
| 2                         | Make 2nds      | 2                           |

**Method: Plain Bob Minor**

Rung on 6 bells (treble plus 5 inside bells). The 5 inside bells cycle through the following items of work:

1. **Make 2nds**
2. **Dodge 3-4 Down**
3. **Dodge 5-6 Down**
4. **Dodge 5-6 Up**
5. **Dodge 3-4 Up**

The following table specifies the 'starts', i.e. the first item of work for each inner/working bell:

| Starting Place / Bell | Work item      |
| :-------------------- | :------------- |
| 2nds                  | Dodge 3-4 Down |
| 4ths                  | Dodge 5-6 Down |
| 6ths                  | Dodge 5-6 Up   |
| 5ths                  | Dodge 3-4 Up   |
| 3rds                  | Make 2nds      |

The following table specifies (i) the bell initially followed (after leaving 'rounds') and (ii) 'course' and 'after' bells (for plain a course):

| Bell | Bell initially followed | Course bell | After bell |
| :--- | :---------------------- | :---------- | :--------- |
| 2    | None (lead!)            | 3           | 4          |
| 3    | 4                       | 5           | 2          |
| 4    | 1                       | 2           | 6          |
| 5    | 6                       | 6           | 3          |
| 6    | 3                       | 4           | 5          |

The following table specifies the next piece of work to be performed according to where you last rang over the treble while hunting up. The third column specifies when you then next ring over the treble while hunting down (after performing the piece of work).

| Meet Treble on the way up | Next work      | Meet Treble on the way down |
| :------------------------ | :------------- | :-------------------------- |
| 6                         | Dodge 3-4 Down | 3                           |
| 5                         | Dodge 5-6 Down | 4                           |
| 4                         | Dodge 5-6 Up   | 5                           |
| 3                         | Dodge 3-4 Up   | 6                           |
| 2                         | Make 2nds      | 2                           |

**Method: Plain Bob Triples**

Rung on 7 bells (treble plus 6 inside bells) plus an optional cover. The 6 inside bells cycle through the following items of work:

1. **Make 2nds**
2. **Dodge 3-4 Down**
3. **Dodge 5-6 Down**
4. **Long 7ths**
5. **Dodge 5-6 Up**
6. **Dodge 3-4 Up**

The following table specifies the 'starts', i.e. the first item of work for each inner/working bell:

| Starting Place / Bell | Work item      |
| :-------------------- | :------------- |
| 2nds                  | Dodge 3-4 Down |
| 4ths                  | Dodge 5-6 Down |
| 6ths                  | Long 7ths      |
| 7ths                  | Dodge 5-6 Up   |
| 5ths                  | Dodge 3-4 Up   |
| 3rds                  | Make 2nds      |

The following table specifies (i) the bell initially followed (after leaving 'rounds') and (ii) 'course' and 'after' bells (for plain a course):

| Bell | Bell initially followed | Course bell | After bell |
| :--- | :---------------------- | :---------- | :--------- |
| 2    | None (lead!)            | 3           | 4          |
| 3    | 4                       | 5           | 2          |
| 4    | 1                       | 2           | 6          |
| 5    | 6                       | 7           | 3          |
| 6    | 3                       | 4           | 7          |
| 7    | 5                       | 6           | 5          |

The following table specifies the next piece of work to be performed according to where you last rang over the treble while hunting up. The third column specifies when you then next ring over the treble while hunting down (after performing the piece of work).

| Meet Treble on the way up | Next work      | Meet Treble on the way down |
| :------------------------ | :------------- | :-------------------------- |
| 7                         | Dodge 3-4 Down | 3                           |
| 6                         | Dodge 5-6 Down | 4                           |
| 5                         | Long 7ths      | 5                           |
| 4                         | Dodge 5-6 Up   | 6                           |
| 3                         | Dodge 3-4 Up   | 7                           |
| 2                         | Make 2nds      | 2                           |

<!-- End -->
