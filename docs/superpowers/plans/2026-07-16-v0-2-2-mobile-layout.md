# V0.2.2 Mobile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the six Innovation Navigation tool cards display in a stable two-column mobile grid and remove touch-triggered icon drift without changing the visual palette.

**Architecture:** Keep the existing static HTML and card markup. Add one final V0.2.2 mobile CSS override in both release stylesheets: it sets a two-column grid, gives cards a card-only press transform, and pins `.service-art` against desktop hover transforms on touch widths. Extend the existing Node static-CSS test to enforce the layout and transform contract.

**Tech Stack:** Static HTML, CSS media queries, Node.js built-in test runner, Playwright screenshots.

## Global Constraints

- Change only layout and touch feedback; keep existing background, color, glass treatment, copy, links, and application assets.
- At widths up to 720px, render two columns and three rows; do not revert to one column at 360px or below.
- Touch feedback applies to the card, not the icon; mobile `.service-art` must not use horizontal or vertical translation.
- Keep root and `production/` CSS byte-identical for the V0.2.2 override.
- Respect the existing reduced-motion rule.

---

### Task 1: Lock the mobile interaction contract with a failing static test

**Files:**
- Modify: `tests/v0-2-1-layout.test.mjs`
- Test: `tests/v0-2-1-layout.test.mjs`

**Interfaces:**
- Consumes: `css/style.css` as the canonical source stylesheet.
- Produces: assertions for the `V0.2.2 mobile layout correction` CSS block.

- [ ] **Step 1: Write the failing test**

Append this test:

```js
test("V0.2.2 uses two mobile columns with card-only press feedback", () => {
	const correction = css.slice(css.lastIndexOf("/* V0.2.2 mobile layout correction"));
	assert.match(correction, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
	assert.match(correction, /\.service-card:active\s*\{[^}]*transform:\s*scale\(0\.96\)/);
	assert.match(correction, /\.service-card:active\s+\.service-art\s*\{[^}]*transform:\s*none/);
	assert.match(correction, /@media\s*\(max-width:\s*360px\)[\s\S]*grid-template-columns:\s*repeat\(2,/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`

Expected: the new V0.2.2 test fails because the V0.2.2 CSS marker does not exist.

- [ ] **Step 3: Commit the test-only red state**

Do not commit the intentional failing state. Keep it local and proceed directly to Task 2.

### Task 2: Implement a two-column mobile layout and fixed icon transform

**Files:**
- Modify: `css/style.css`
- Modify: `production/css/style.css`
- Test: `tests/v0-2-1-layout.test.mjs`

**Interfaces:**
- Consumes: card markup using `.services`, `.service-card`, and `.service-art`.
- Produces: a CSS override marked `V0.2.2 mobile layout correction` in both stylesheets.

- [ ] **Step 1: Add the minimal root CSS override**

Append this focused CSS block to `css/style.css`:

```css
/* V0.2.2 mobile layout correction: two stable columns and card-only press feedback. */
@media (max-width: 720px) {
	.services { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
	.service-card { min-height: clamp(176px, 52vw, 220px); padding: 10px; }
	.service-art { width: clamp(70px, 24vw, 104px); height: clamp(70px, 24vw, 104px); }
	.service-card:active { transform: scale(0.96); }
	.service-card:active .service-art { transform: none; }
	.service-card:hover .service-art,
	.service-card:focus-visible .service-art,
	.service-card.is-key-focused .service-art { transform: none; }
}
@media (max-width: 360px) {
	.services { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

Keep the existing mobile top-row, icon placement, and title rules; only override values that conflict with the two-column contract or card-only press feedback.

- [ ] **Step 2: Mirror the completed root stylesheet**

Copy the resulting root stylesheet to `production/css/style.css` so both release stylesheets are identical.

- [ ] **Step 3: Run the test suite to verify it passes**

Run: `node --test tests/v0-2-1-layout.test.mjs`

Expected: all current tests, including the new V0.2.2 test, pass.

- [ ] **Step 4: Check formatting and stylesheet parity**

Run: `cmp -s css/style.css production/css/style.css && git diff --check`

Expected: exit code 0 with no whitespace errors.

### Task 3: Validate responsive rendering and touch interaction

**Files:**
- Test only: `index.html`

**Interfaces:**
- Consumes: local static server and the final CSS contract.
- Produces: visual confirmation at required breakpoints.

- [ ] **Step 1: Capture responsive screenshots**

Run a local static server and capture `/` at 320×844, 390×844, 414×896, 768×1024, and 1440×900 using Playwright.

- [ ] **Step 2: Exercise card press state in a mobile browser**

Use Playwright to hold the first card pointer down at 390px width and capture its computed `.service-art` transform. Confirm the computed transform remains `none` or a matrix without translation, while the card transform changes during press.

- [ ] **Step 3: Review required outcomes**

Confirm two columns at 320/390/414px, three columns at 768/1440px, no title overflow, and no icon drift during the press state.

- [ ] **Step 4: Run final verification**

Run: `node --test tests/v0-2-1-layout.test.mjs && cmp -s css/style.css production/css/style.css && git diff --check`

Expected: zero failing tests, identical release stylesheets, and no diff formatting errors.
