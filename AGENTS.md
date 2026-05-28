# Project: Plain Bob Flashcards

## Purpose

Refer to `README.md` for a concise description of the project.

The authoritative technical specification is in `/docs/tech-spec.md`.
If there is any conflict, the technical specification takes precedence.

## General Instructions

- Use British English throughout (technical documentation, code comments, and UI text).
- The `/src` folder contains all application source code.
- Keep changes **focused and minimal**:

  - Do not make unrelated changes when implementing a feature.
  - Do not remove existing comments unless they are incorrect or obsolete.
  - Refactoring is permitted only when it directly supports the feature being implemented.

- Prefer clarity over cleverness. Write code that is easy to understand and maintain.

## Target Environment

- Browsers: latest versions of Chrome, Firefox, and Safari only.
- Primary platform: smartphones
- Secondary platforms: tablets, then desktop

Design decisions should prioritise small screens and touch interaction.

## Technical Approach

- Use Vue with Single-File Components (`.vue` files).
- A lightweight approach is required:

  - Avoid unnecessary dependencies.
  - Avoid complex or fragile build tooling.

- A build step is acceptable (e.g. Vite), but keep configuration simple.

## Project Structure (Expected)

- `/src/components` — reusable Vue components
- `/src/views` — top-level views/pages (if applicable)
- `/src/state` or `/src/store` — application state (keep simple; avoid heavy frameworks unless justified)
- `/src/assets` — static assets (images, etc.)

Follow this structure unless there is a clear reason to deviate.

## Coding Style

- Use 2 spaces for indentation.
- Use consistent, descriptive naming.
- Prefer small, focused components.
- Avoid deeply nested logic in templates; move complexity into script sections.

## State and Data Handling

- Keep state management simple and local where possible.
- Avoid introducing global state unless clearly necessary.
- Ensure data flow is predictable and easy to follow.

## UI and UX

- Prioritise responsiveness and fast load times.
- Ensure touch targets are appropriate for mobile use.
- Avoid unnecessary animations or visual complexity.

## Definition of Done

A feature is complete when:

- It satisfies the technical specification.
- It works on all target browsers.
- It does not introduce regressions.
- The code is clear and maintainable.

## When Unsure

- Consult `/docs/tech-spec.md`.
- Prefer the simplest solution that meets requirements.
- Do not introduce new technologies or patterns without clear justification.
