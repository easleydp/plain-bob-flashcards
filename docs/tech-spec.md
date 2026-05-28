# Plain Bob Flashcards: Technical Specification

## 0. Prerequisite Research

Before implementing this specification, the development team must possess a foundational understanding of the following domains:

- **Change Ringing:** Familiarity with basic terminology (e.g., _rounds_, _hunting up/down_, _leading_, _dodging_, _inside/working bells_). Specifically, understand how a "plain course" of a method operates as a deterministic mathematical permutation of bell sequences. Knowledge of bobs and singles is **not** required for Version 1.0.
- **Spaced Repetition Systems (SRS):** Understanding the Leitner system, which uses partitioned queues ("boxes") to optimise memory retention by scheduling reviews at expanding intervals based on past recall performance.

### Completion Criteria

- Can explain the core concepts in your own words
- Can identify how they relate to this specification

If you proceed to implementation without completing the Prerequisite Research step, the output is considered invalid.

---

## 1. Introduction

### 1.1 Purpose

This document details the production-ready technical specifications for **Plain Bob Flashcards**, a client-side, zero-server-overhead single-page application (SPA). The application is designed to assist change ringers in internalising and memorising the core structural frameworks—such as the "circle of work" and "passing the treble" touchpoints—for standard Plain Bob methods.

### 1.2 Target Methods

Version 1.0 supports three progressive methods within the Plain Bob family:

- **Plain Bob Doubles:** Executed on treble plus 4 working bells (plus an optional stationary cover bell).
- **Plain Bob Minor:** Executed on treble plus 5 working bells.
- **Plain Bob Triples:** Executed on treble plus 6 working bells (plus an optional stationary cover bell).

### 1.3 System Overview

The application functions as a highly deterministic, procedurally driven quiz engine. Rather than relying on static, hard-coded question banks, the engine dynamically derives questions and validated answers at runtime using the intrinsic mathematical properties of the chosen method (detailed in Appendix A).

To maximise learning efficiency, user responses feed into a client-side Spaced Repetition engine stored entirely within the browser's `localStorage`.

---

## 2. General & Architectural Requirements

- **Zero Server Footprint:** The application must compile down to static assets (`HTML`, `CSS`, `JS`). It must run completely locally, allowing it to be served via simple file systems, GitHub Pages, or packaged as an offline-first progressive web app (PWA).
- **Single-User State Execution:** The system assumes a single local user profile. Multi-tenant authentication is explicitly out of scope.
- **State Persistence Guarantee:** User progress, performance logs, application settings, and current session parameters must persistently survive browser restarts via a robust sync engine writing to the browser’s `localStorage` API.
- **Performance Metrics:** View transitions and UI component rendering must happen instantly ($<50\text{ms}$ latency) to maintain a highly responsive, fluid user experience.

---

## 3. Visual Appearance & Theming

- **Design Framework:** Implement using **Material Design 3 (MD3)** design tokens and structural patterns. Components (e.g., Cards, Buttons, Radio Lists, and Dialogs) must conform to MD3 layouts, touch-target minimums ($48\times48\text{px}$), and shadow treatments.
- **CSS Variable Architecture:** The design must use a unified CSS Custom Property (variables) theme map. Colors must not be hardcoded within component layouts. Developers or future maintainers must be able to change themes entirely by altering a central `:root` declaration block (supporting Light/Dark system configurations seamlessly).
- **Accessibility (A11y):** All text elements must strictly adhere to WCAG 2.1 AA contrast ratios ($4.5:1$ for normal text, $3:1$ for large text). Form controls, buttons, and custom interactive widgets must support native keyboard navigation (`Tab`, `Space`, `Enter`) and expose correct ARIA states (`aria-checked`, `aria-disabled`, `aria-live`).

---

## 4. Core Functional Components & Algorithmic Design

### 4.1 ClockButtons Widget

This component visually models the cyclical nature of change ringing work items by rendering an interactive "circle of work".

```
    [12:00 / Item 1] ────────► [03:00 / Item 2]
           ▲                          │
           │                          │
           │                          ▼
    [09:00 / Item 4] ◄──────── [06:00 / Item 3]
```

- **Layout Engine:** Dynamically calculates layout positions for a variable array of 4 to 6 items. Components are positioned radially at equidistant angular steps around a central anchor point:

$$\theta_i = \frac{2\pi \cdot i}{N} - \frac{\pi}{2}$$

_(where $i$ is the 0-indexed position, $N$ is total elements, and subtracting $\pi/2$ locks the first item precisely at the 12 o'clock apex)._

- **Visual Elements:** Renders crisp SVG graphical arcs or directional arrows between adjacent nodes pointing strictly clockwise, emphasising the forward flow of the method.
- **Event Model:** Emits a standard JavaScript `CustomEvent` named `clock-button-selection` containing a payload detailing the clicked element's label and index position:

```json
{ "detail": { "index": 2, "label": "Dodge 5-6 Down" } }
```

- **API Interface:** Exposes public methods to modify button states cleanly:
- `highlightCorrect(identifier)`: Turns target green, leaves interactive.
- `highlightIncorrect(identifier)`: Turns target red, applies an explicit `disabled` state attribute, updates `aria-disabled="true"`, but preserves text visibility/contrast.

### 4.2 ScatteredButtons Widget

This component presents selection choices in an organic, non-linear cluster, intentionally disrupting spatial memory to enforce deep structural recall over simple positional scanning.

- **Layout Engine (Grid-Jitter Collision Avoidance):** To balance an organic look with rigorous UI readability, the widget must not use purely random coordinates. Instead, it maps items to an internal, invisible structural grid (e.g., $3\times2$ cells). Each item is assigned its own cell bounding box, then subjected to a constrained layout calculation:
- **Position Offset:** Random translation within $\pm15\%$ of cell dimensions.
- **Rotation Jitter:** Random rotation between $-30^\circ$ and $+30^\circ$.

- **Inline Structural Context:** Accepts `before` and `after` string properties. These strings are rendered as persistent inline text elements framing the left and right boundaries of the button cluster, creating a natural syntax sentence:
- _Example:_ `[When I am in]` -> `{Cluster of randomised place buttons}` -> `[place.]`

- **Event & Interaction States:** Matches the identical `CustomEvent` payload structure and color-state highlighting API of the `ClockButtons` component.

### 4.3 Spaced Repetition Engine (Leitner Framework)

The app uses a 4-Box Leitner optimisation algorithm to schedule questions dynamically. All questions within a chosen method tracking matrix are assigned to a virtual box queue.

```
+-----------------------------------+
|              BOX 1                | <-- Default starting point
| Selection Probability: 70%        | <-- Incorrect answers always demoted here
+-----------------------------------+
                 │ (On Correct Answer)
                 ▼
+-----------------------------------+
|              BOX 2                |
| Selection Probability: 20%        |
+-----------------------------------+
                 │ (On Correct Answer)
                 ▼
+-----------------------------------+
|              BOX 3                |
| Selection Probability: 8%         |
+-----------------------------------+
                 │ (On Correct Answer)
                 ▼
+-----------------------------------+
|              BOX 4 (Mastered)     |
| Selection Probability: 2%         |
+-----------------------------------+

```

#### Algorithmic Behaviour Matrix

1. **Initialisation:** On the first launch of a specific method, all unique generated question instances are registered into **Box 1**.
2. **Queue Probability Distribution:** When selecting the next question, the application rolls a value between 1 and 100 to determine which Box array to read from based on targeted probabilistic allocations:

- **Box 1:** 70% probability hook (Value 1–70)
- **Box 2:** 20% probability hook (Value 71–90)
- **Box 3:** 8% probability hook (Value 91–98)
- **Box 4:** 2% probability hook (Value 99–100)
  _(If the rolled box is currently empty, the engine sequentially falls back to the nearest populated lower box number; if all higher boxes are empty, it defaults back to Box 1)._

3. **State Upgrades/Downgrades:**

- **Correct Response:** The question moves up one box tier (e.g., Box 1 $\rightarrow$ Box 2), capping out at Box 4.
- **Incorrect Response:** The question is immediately stripped of its tier and demoted directly back to **Box 1** to maximise short-term exposure.

### 4.4 Data Schema & Analytics Performance Tracking

A single, clean JSON record structure tracks progress within `localStorage`. Developers must design actions around a unified schema model:

```json
{
  "settings": {
    "lastSelectedMethod": "Plain Bob Minor",
    "lastSelectedFocus": "Circle of work"
  },
  "tracking": {
    "Plain Bob Minor": {
      "questions": [
        {
          "id": "pbm_circle_next_dodge_3_4_down",
          "box": 2,
          "totalAttempts": 4,
          "firstTimeSuccesses": 2
        }
      ]
    }
  }
}
```

---

## 5. View States & Navigation Flow

The single-page application manages user progress through three discrete view structures:

```
+-------------------+      "Start" Button Click      +-------------------+
|   Start Screen    | ─────────────────────────────> |  Question Screen  |
+-------------------+                                +-------------------+
          ▲                                                    │
          │                                                    │ All Questions
          │ "Start Again" Button Click                         │ Completed in
          │ (Resets Current Session)                           │ Current Stack
          │                                                    ▼
          └─────────────────────────────────────────── +-------------------+
                                                       |  Summary Screen   |
                                                       +-------------------+

```

### 5.1 Start Screen

- **Header Module:** Displays the title `"Plain Bob Flashcards"`.
- **Method Selector Configuration:** A vertical radio group allowing selection of the target method. By default, it reads and highlights `settings.lastSelectedMethod` from storage. If empty, it defaults to the first available selection (_Plain Bob Doubles_).
- **Focus Scope Configuration:** A vertical radio control interface containing three filtering vectors:
- `Circle of work` _(Displays item count dynamically evaluated from generator rules)_
- `Passing the treble` _(Displays item count)_
- `Everything!` _(Default state fallback)_

- **Execution Trigger:** A single primary action button labelled `"Start"`. Clicking initialises the session data arrays, flags the current time stamp, and renders the first question interface.

### 5.2 Question Screen

- **Dynamic Layout Rendering:** Reads the selected question object structure, compiles string contexts procedurally, and instantiates the specific interactive widget requested (`ClockButtons`, `ScatteredButtons`, or standard randomised multiple-choice arrays).
- **Session State Logging Rules:**
- An input attempt is logged to the persistent state engine **only on the user's initial interaction** with that specific question.
- If correct on the first attempt, `firstTimeSuccesses` increments alongside `totalAttempts`. The question immediately triggers its specific visual success states.
- If incorrect on the first attempt, `totalAttempts` increments, but `firstTimeSuccesses` remains unchanged. The interface applies local validation penalties (e.g., turning a button red, disabling it), showing a temporary user-facing toast notification saying `"Try again"`, and holding the user inside the current card interface until they identify the correct solution.

- **Session Progress Advance:** Upon a successful input, a fixed action button labelled `"Next"` slides up or fades in at the base of the viewport. It remains fixed during scrolling, ensuring immediate access to advance the view state.

### 5.3 Summary Screen

- **Analytical Session Breakdown Reporting:** Displays targeted operational text maps summarising performance details calculated from the current run:

  > `"Congratulations! You spent N minutes learning [Method Name] during this session. You answered M distinct questions — P right first time and Q needing re-attempts. Come back soon for more practice!"`

- **Mastery State Override Trigger:** If evaluation metrics confirm that every distinct procedural question mapped to the targeted method is safely inside **Box 4** of the Leitner array, the summary block swaps its copy cleanly out for a specialised milestone message:

  > `"Congratulations! You have mastered every aspect of a plain course of [Method Name]. You're ready for the tower!"`

- **Session Demolition/Reset Action:** Provides an explicit application restart action mapped cleanly to a semantic HTML `<button>` styled as an explicit primary flat layout element textually labelled `"Start again"`. Activating this element wipes active runtime session configurations and redirects back to a fresh instance of the Start Screen.

---

## 6. Procedural Question Generation Engine

Questions are generated procedurally using the method frameworks listed in Appendix A.

### 6.1 'Circle of Work' Template Classes

#### 6.1.1 First Piece of Work

- **Abstract Prompt Construction:** `"Starting in [Starting Place] place, what is your first piece of work?"`
- **Component Interaction Target:** Instantiates a `ClockButtons` component. Labels are mapped from the complete ordered cyclical array of work items matching that specific method.
- **Evaluation Hook:** The correct target button corresponds directly to the precise work item cross-referenced with the starting place lookup map.

#### 6.1.2 Next Work Element Sequence

- **Abstract Prompt Construction:** `"In a plain course, what is the next work after [Work Item X]?"`
- **Component Interaction Target:** A standard vertical list of radio options populated with all possible work assignments for the method. The display order must be completely randomised on each render pass.
- **Evaluation Hook:** The correct selection is the next sequential item index wrapped inside the method's cyclical array (looping back to index 0 if evaluating the terminal index item).

#### 6.1.3 Course and After Bells Matrix

- **Abstract Prompt Construction:** Part 1: `"In a plain course, if you are on bell [Bell Number], the first bell you will follow is:"` followed by Part 2: `"... and your course and after bells are:"`
- **Component Interaction Target:** Combines three independent dropdown selector interfaces (`<select>`).
- Dropdown 1 lists all available working bell IDs, alongside a dedicated conditional fallback label: `"None of the above - I will lead!"`.
- Dropdown 2 lists working bell IDs, accompanied by helper context: `"(you take off the lead)"`.
- Dropdown 3 lists working bell IDs, accompanied by helper context: `"(takes you off the lead)"`.

- **Evaluation Hook:** Validation checking triggers only after a user inputs data selections across all three drop-down nodes. Fields are evaluated against the specific Method Matrix columns: `Bell initially followed`, `Course bell`, and `After bell`. To assist the user in working towards the correct combination, any individual dropdown that is correct should be visually highlighted (e.g., green background) immediately upon validation, even if the overall triplet is not yet fully correct.

### 6.2 'Passing the Treble' Template Classes

#### 6.2.1 Upward Hunt From Lead Pass Point

- **Abstract Prompt Construction:** `"Hunting up after making 2nds, when will you pass the treble?"`
- **Component Interaction Target:** Standardises on a `ScatteredButtons` layout model.
- `before` config payload: `"When I am in"`
- `after` config payload: `"place."`
- Button labels: An array of strings representing all possible operational place steps (`"2nd"`, `"3rd"`, `"4th"`, etc.) up to the maximum grid size of the targeted method.

- **Evaluation Hook:** Resolves to the maximum structural position step possible within the method (e.g., `"5th"` for Doubles).

#### 6.2.2 Long Place Downward Transition

- **Abstract Prompt Construction:** `"After [Long Place Name], when will you next follow the treble (while hunting down to lead)?"` _(e.g., "Long 5ths" for Doubles)._
- **Component Interaction Target:** `ScatteredButtons` widget configuration setup identically to 6.2.1.
- **Evaluation Hook:** Resolves directly to the numeric place step tracking immediately below the back-most placement point (e.g., `"4th"` place for Plain Bob Doubles).

#### 6.2.3 Upward Visual Identification Cue

- **Abstract Prompt Construction:** `"You notice you've passed the treble in [Nth] place while hunting up. What work is coming next?"`
- **Component Interaction Target:** Uses a `ClockButtons` component displaying the ordered method work cycle.
- **Evaluation Hook:** Maps to the `Next work` column value matching the row where the treble interaction took place during the upward hunt phase.

#### 6.2.4 Downward Pass Point Determination

- **Abstract Prompt Construction:** `"You've just [Work Item Action]. When will you next pass the treble while hunting down to lead?"` _(e.g., Action strings map to past-tense labels like "made 2nds", "done the 3-4 down dodge")._
- **Component Interaction Target:** `ScatteredButtons` component.
- _Adaptive Options Rule:_ For down-dodges, filter and include only the place numbers that exist below that dodge's position. For all other items, include all valid place options.

- **Evaluation Hook:** Validates calculations against the exact terminal position values catalogued inside column 3 of the Treble Collision structural tables.

---

## Appendix A: Plain Bob Method Particulars

### Method: Plain Bob Doubles

- **Scale:** Treble + 4 working bells (2, 3, 4, 5).
- **Cyclical Work Pattern Items:**

1. Make 2nds
2. Dodge 3-4 Down
3. Long 5ths
4. Dodge 3-4 Up

#### Bell Starts Matrix

| Starting Place / Bell | Assigned First Work |
| --------------------- | ------------------- |
| 2                     | Dodge 3-4 Down      |
| 4                     | Long 5ths           |
| 5                     | Dodge 3-4 Up        |
| 3                     | Make 2nds           |

#### Lead Lead-Out Following Tracker

| Operating Bell ID | Bell Initially Followed    | Course Bell | After Bell |
| ----------------- | -------------------------- | ----------- | ---------- |
| 2                 | _None (Leads immediately)_ | 3           | 4          |
| 3                 | 4                          | 5           | 2          |
| 4                 | 1                          | 2           | 5          |
| 5                 | 3                          | 4           | 3          |

#### Treble Collision Coordinates Mapping

| Meet Treble on the way up | Next work item | Meet Treble on the way down |
| ------------------------- | -------------- | --------------------------- |
| 5th Place                 | Dodge 3-4 Down | 3rd Place                   |
| 4th Place                 | Long 5ths      | 4th Place                   |
| 3rd Place                 | Dodge 3-4 Up   | 5th Place                   |
| 2nd Place                 | Make 2nds      | 2nd Place                   |

---

### Method: Plain Bob Minor

- **Scale:** Treble + 5 working bells (2, 3, 4, 5, 6).
- **Cyclical Work Pattern Items:**

1. Make 2nds
2. Dodge 3-4 Down
3. Dodge 5-6 Down
4. Dodge 5-6 Up
5. Dodge 3-4 Up

#### Bell Starts Matrix

| Starting Place / Bell | Assigned First Work |
| --------------------- | ------------------- |
| 2                     | Dodge 3-4 Down      |
| 4                     | Dodge 5-6 Down      |
| 6                     | Dodge 5-6 Up        |
| 5                     | Dodge 3-4 Up        |
| 3                     | Make 2nds           |

#### Lead Lead-Out Following Tracker

| Operating Bell ID | Bell Initially Followed    | Course Bell | After Bell |
| ----------------- | -------------------------- | ----------- | ---------- |
| 2                 | _None (Leads immediately)_ | 3           | 4          |
| 3                 | 4                          | 5           | 2          |
| 4                 | 1                          | 2           | 6          |
| 5                 | 6                          | 6           | 3          |
| 6                 | 3                          | 4           | 5          |

#### Treble Collision Coordinates Mapping

| Meet Treble on the way up | Next work item | Meet Treble on the way down |
| ------------------------- | -------------- | --------------------------- |
| 6th Place                 | Dodge 3-4 Down | 3rd Place                   |
| 5th Place                 | Dodge 5-6 Down | 4th Place                   |
| 4th Place                 | Dodge 5-6 Up   | 5th Place                   |
| 3rd Place                 | Dodge 3-4 Up   | 6th Place                   |
| 2nd Place                 | Make 2nds      | 2nd Place                   |

---

### Method: Plain Bob Triples

- **Scale:** Treble + 6 working bells (2, 3, 4, 5, 6, 7).
- **Cyclical Work Pattern Items:**

1. Make 2nds
2. Dodge 3-4 Down
3. Dodge 5-6 Down
4. Long 7ths
5. Dodge 5-6 Up
6. Dodge 3-4 Up

#### Bell Starts Matrix

| Starting Place / Bell | Assigned First Work |
| --------------------- | ------------------- |
| 2                     | Dodge 3-4 Down      |
| 4                     | Dodge 5-6 Down      |
| 6                     | Long 7ths           |
| 7                     | Dodge 5-6 Up        |
| 5                     | Dodge 3-4 Up        |
| 3                     | Make 2nds           |

#### Lead Lead-Out Following Tracker

| Operating Bell ID | Bell Initially Followed    | Course Bell | After Bell |
| ----------------- | -------------------------- | ----------- | ---------- |
| 2                 | _None (Leads immediately)_ | 3           | 4          |
| 3                 | 4                          | 5           | 2          |
| 4                 | 1                          | 2           | 6          |
| 5                 | 6                          | 7           | 3          |
| 6                 | 3                          | 4           | 7          |
| 7                 | 5                          | 6           | 5          |

#### Treble Collision Coordinates Mapping

| Meet Treble on the way up | Next work item | Meet Treble on the way down |
| ------------------------- | -------------- | --------------------------- |
| 7th Place                 | Dodge 3-4 Down | 3rd Place                   |
| 6th Place                 | Dodge 5-6 Down | 4th Place                   |
| 5th Place                 | Long 7ths      | 5th Place                   |
| 4th Place                 | Dodge 5-6 Up   | 6th Place                   |
| 3rd Place                 | Dodge 3-4 Up   | 7th Place                   |
| 2nd Place                 | Make 2nds      | 2nd Place                   |

<!-- End -->
