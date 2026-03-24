# Running Achievements Home Limit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show only the top five running achievements on the home page after sorting by `No.` descending, while keeping the achievements detail page unchanged.

**Architecture:** Extract the sorting and limiting logic into a small pure helper so the behavior is testable without a browser DOM. Keep the rendering flow in `app.js`, but make the index page pass a limit of `5` and the achievements detail page pass no limit.

**Tech Stack:** Static HTML, vanilla JavaScript, Node built-in test runner

---

### Task 1: Add a failing test for achievement selection

**Files:**
- Create: `tests/achievements.test.mjs`
- Test: `tests/achievements.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareAchievementsForDisplay } from '../assets/js/achievements.js';

test('sorts achievements by no descending and limits to five rows', () => {
  const rows = [
    { no: '1' }, { no: '6' }, { no: '3' }, { no: '2' }, { no: '5' }, { no: '4' }
  ];

  const result = prepareAchievementsForDisplay(rows, 5);

  assert.deepEqual(result.map(row => row.no), ['6', '5', '4', '3', '2']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/achievements.test.mjs`
Expected: FAIL because `../assets/js/achievements.js` does not exist yet

### Task 2: Implement the helper and wire it into page initialization

**Files:**
- Create: `assets/js/achievements.js`
- Modify: `assets/js/app.js`
- Test: `tests/achievements.test.mjs`

- [ ] **Step 1: Write minimal implementation**

Create a helper that sorts by numeric `no` descending and applies an optional limit.

- [ ] **Step 2: Update rendering code**

Make `updateAchievements` use the helper. Pass `5` on the home page path and no limit on the achievements detail page path.

- [ ] **Step 3: Run test to verify it passes**

Run: `node --test tests/achievements.test.mjs`
Expected: PASS

### Task 3: Verify the integrated behavior

**Files:**
- Modify: `assets/js/app.js`
- Test: `tests/achievements.test.mjs`

- [ ] **Step 1: Run the targeted test again**

Run: `node --test tests/achievements.test.mjs`
Expected: PASS

- [ ] **Step 2: Review the rendered code paths**

Confirm the index page calls `updateAchievements(..., 5)` and the detail page keeps `updateAchievements(...)`.
