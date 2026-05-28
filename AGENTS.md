# Project: Plain Bob Flashcards

## General Instructions

- README.md briefly specifies the purpose of the project.
- /docs/tech-spec.md is the technical specification.

British English is to be used throughout (tech specs, code comments, UI).

The /src folder contains the source files.

When implementing new features, don't take the opportunity to make unrelated changes to existing code unless they are relevant to the new feature. In particular, don't remove what you may consider to be redundant comments. Refactoring existing code is fine when this relates to implementing a new feature.

Target browsers: Only the latest versions of Chrome, Firefox and Safari need to be targeted.
Platforms: Primarily smartphones, then tablets, then desktop browsers.

## Technical Implementation Approach

Use a simple Vue setup. This lightweight reactive framework will be sufficient to handle the data-to-view synchronisation, allowing the development team to write declarative code without committing to a heavy, fragile build pipeline. The goal is modern UI reactivity with minimal structural complexity.

A build step is acceptable. Use Vue 'Single-File Components' (`*.vue` files).

## Coding Style

- Use 2 spaces for indentation.
