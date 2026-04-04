OSCE Simulator split build

Purpose:
This is a controlled modular split of the original single-file acute MI OSCE simulator.

What was split out:
- data/historyTree.js
- data/examTree.js
- state/initialState.js
- utils/patientUtils.js
- utils/feedback.js
- styles/appStyles.js
- components/*.jsx
- App.jsx remains the orchestration layer

Design choice:
This split is intentionally conservative.
Core behavior was preserved while moving pure data, pure helper logic, styling, and UI screens into separate files.
This reduces risk for future surgical edits.

Validation performed:
- JSX/module bundling sanity check with esbuild completed successfully.

Known note:
This is a structure-first refactor, not a behavioral refactor.
The unresolved oxygen/perfusion-collapse issue from the prior project memory was intentionally not changed here.
