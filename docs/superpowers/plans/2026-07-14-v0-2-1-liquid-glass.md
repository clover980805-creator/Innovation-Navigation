# V0.2.1 Liquid Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the static Innovation Navigation page to a high-impact, accessible liquid-glass visual system while preserving all current tool data and local-only release boundaries.

**Architecture:** Keep the existing static HTML and keyboard-navigation JavaScript. Introduce a named-token stylesheet that both root and `production/` bundles load, then remodel the current service-card structure and styles in place. Use node built-in tests for static layout contracts and a local browser run for responsive rendering evidence.

**Tech Stack:** Static HTML, CSS custom properties, inline browser JavaScript, Node.js built-in test runner, local HTTP server, Playwright/browser capture.

## Global Constraints

- Work only on branch `codex/V0.2.1`; do not push, merge `main`, or deploy to VPS.
- Preserve every current tool URL, title, description, availability state, and keyboard-navigation behavior.
- Use named CSS tokens for all new colors, typography, radii, motion, and spacing values.
- Mobile widths 320 / 375 / 414 / 768px retain a three-column, two-row tool grid without horizontal overflow.
- Validate desktop 1440×900, 1920×1080, and 2560×1440 plus mobile/landscape layouts.
- Respect `prefers-reduced-motion: reduce`; focus indication and core text meet WCAG AA.

---

### Task 1: Lock static layout and release-parity contracts

**Files:**
- Create: `tests/v0-2-1-layout.test.mjs`
- Modify: `index.html`
- Modify: `production/index.html`

**Interfaces:**
- Consumes: root and production HTML release files.
- Produces: executable assertions for six cards, token stylesheet loading, semantic image wrappers, and equivalent root/production release structure.

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const root = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const production = readFileSync(new URL("../production/index.html", import.meta.url), "utf8");

test("V0.2.1 ships six liquid-logo tool cards in both release files", () => {
  for (const html of [root, production]) {
    assert.equal((html.match(/class=\"service-card/g) || []).length, 6);
    assert.equal((html.match(/class=\"service-art/g) || []).length, 6);
    assert.match(html, /css\/tokens\.css/);
  }
  assert.match(root, /innovation-navigation-share-v0-2-1\.webp/);
  assert.match(production, /innovation-navigation-share-v0-2-1\.webp/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: FAIL because neither release file loads `css/tokens.css`.

- [ ] **Step 3: Add token stylesheet loading while preserving current content**

Add the shared token stylesheet before `css/style.css` in both HTML heads. Keep all six existing service-card elements, links, status text, and script behavior unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: PASS.

### Task 2: Define the shared liquid-glass token system

**Files:**
- Create: `css/tokens.css`
- Create: `production/css/tokens.css`
- Modify: `css/style.css`
- Modify: `production/css/style.css`

**Interfaces:**
- Consumes: current violet/cyan brand signals and the document's accessibility requirements.
- Produces: named tokens used by page styles for glass layers, type, spacing, radii, motion, and focus states.

- [ ] **Step 1: Extend the failing test with release-token parity**

```js
const rootTokens = readFileSync(new URL("../css/tokens.css", import.meta.url), "utf8");
const productionTokens = readFileSync(new URL("../production/css/tokens.css", import.meta.url), "utf8");

test("V0.2.1 token system names liquid-glass, focus, motion, and grid values", () => {
  for (const name of ["--glass-base", "--glass-refract", "--focus-ring", "--ease-out", "--grid-mobile-columns"]) {
    assert.match(rootTokens, new RegExp(name));
  }
  assert.equal(rootTokens, productionTokens);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: FAIL because `css/tokens.css` does not exist.

- [ ] **Step 3: Implement shared tokens and consume them from the page CSS**

Define a dark translucent base, refractive white edge, tool-color accent variables, high-contrast text variables, 4px-based spacing, card/icon radii no larger than 16px, three named easing variables, and three-column mobile grid token. Replace the root CSS variables that overlap these definitions with aliases or token references; copy the completed styles to the production bundle.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: PASS.

### Task 3: Build the liquid-glass cards, icon treatment, and centered type

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `production/index.html`
- Modify: `production/css/style.css`

**Interfaces:**
- Consumes: `.service-card`, `.service-art`, `.service-copy`, and tool-specific accent values.
- Produces: a shared icon vessel, layered glass card, centered tool copy, accessible focus state, and reduced-motion behavior.

- [ ] **Step 1: Extend the failing test for liquid-card markup and style contracts**

```js
const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");

test("cards expose a liquid vessel and support reduced motion", () => {
  assert.match(root, /service-art[^>]*>/);
  assert.match(css, /\.service-art\s*\{/);
  assert.match(css, /backdrop-filter/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.service-copy[\s\S]*text-align:\s*center/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: FAIL because the current service copy is left-aligned and icon art retains a dark outline/shadow.

- [ ] **Step 3: Implement the visual layer**

Use pseudo-elements to create a restrained refraction edge and controlled colored caustic inside each card. Make the logo vessel and image scale identical across cards; remove the old dark outline and heavy black shadow. Center the label and description below the icon. Limit hover feedback to a brightness/refraction shift and icon translate transform, with an immediate visible focus ring.

- [ ] **Step 4: Sync the shared styles and run static tests**

Run: `cp css/style.css production/css/style.css && cp css/tokens.css production/css/tokens.css && node --test tests/v0-2-1-layout.test.mjs`  
Expected: PASS.

### Task 4: Enforce responsive three-by-two composition and run visual QA

**Files:**
- Modify: `css/style.css`
- Modify: `production/css/style.css`
- Test: `tests/v0-2-1-layout.test.mjs`

**Interfaces:**
- Consumes: established grid and liquid-card rules.
- Produces: no-overflow layouts at target widths, preserved interactive links, and screenshot evidence.

- [ ] **Step 1: Extend the failing test with mobile-grid contract**

```js
test("mobile media rules retain three tool columns", () => {
  const mobileSection = css.slice(css.indexOf("@media (max-width: 720px)"));
  assert.match(mobileSection, /grid-template-columns:\s*repeat\(var\(--grid-mobile-columns\),\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(mobileSection, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: FAIL because current mobile CSS uses two columns and then one column at 360px.

- [ ] **Step 3: Implement compact mobile and landscape card rules**

At max 720px, retain three columns, reduce gaps/padding/icon dimensions via `clamp()`, and set a compact fixed card height. Remove the 360px single-column override. Add a landscape-height media query that compresses the header and card height without altering the three-column order.

- [ ] **Step 4: Run static test suite and local browser checks**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: PASS.

Run a local static server and capture 320×844, 375×812, 414×896, 768×1024, 844×390, 1440×900, 1920×1080, and 2560×1440 screenshots. Check that six cards render, no viewport has horizontal overflow, no text overlaps, tool links remain usable, and the console has no errors.

### Task 5: Update share icon asset and verify final release parity

**Files:**
- Create or Modify: `img/share/innovation-navigation-share-v0-2-1.webp`
- Create or Modify: `production/img/share/innovation-navigation-share-v0-2-1.webp`
- Modify: `index.html`
- Modify: `production/index.html`
- Modify: `tests/v0-2-1-layout.test.mjs`

**Interfaces:**
- Consumes: the new liquid-glass icon proportions and the page's existing Open Graph metadata.
- Produces: a 600×600 share image aligned to the new icon language and referenced by both release HTML files.

- [ ] **Step 1: Extend the failing test for a versioned Open Graph image**

```js
test("sharing metadata points to the V0.2.1 liquid-glass share image", () => {
  assert.match(root, /innovation-navigation-share-v0-2-1\.webp/);
  assert.match(production, /innovation-navigation-share-v0-2-1\.webp/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: FAIL because the current Open Graph image still points to the old JPG/WebP file.

- [ ] **Step 3: Generate and wire the share asset**

Create a square 600×600 share image using the existing Innovation Navigation mark without a dark outline, centered over a dark refractive liquid-glass field. Update Open Graph image URL/type metadata in both release HTML files while preserving their existing root-versus-production asset path conventions.

- [ ] **Step 4: Complete regression checks**

Run: `node --test tests/v0-2-1-layout.test.mjs`  
Expected: PASS.

Run a full SHA-256 comparison of root and `production/` HTML/CSS/token/share assets and inspect `git diff --check`.
