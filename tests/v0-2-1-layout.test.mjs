import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const production = readFileSync(new URL("../production/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
const rootTokens = readFileSync(new URL("../css/tokens.css", import.meta.url), "utf8");
const productionTokens = readFileSync(new URL("../production/css/tokens.css", import.meta.url), "utf8");

test("V0.2.1 ships six liquid-logo tool cards in both release files", () => {
	for (const html of [root, production]) {
		assert.equal((html.match(/class="service-card/g) || []).length, 6);
		assert.equal((html.match(/class="service-art/g) || []).length, 6);
		assert.match(html, /css\/tokens\.css/);
	}
	assert.match(root, /innovation-navigation-share-v0-2-1\.webp/);
	assert.match(production, /innovation-navigation-share-v0-2-1\.webp/);
});

test("V0.2.1 token system and cards support liquid glass with reduced motion", () => {
	for (const name of ["--glass-base", "--glass-refract", "--focus-ring", "--ease-out", "--grid-mobile-columns"]) {
		assert.match(rootTokens, new RegExp(name));
	}
	assert.equal(rootTokens, productionTokens);
	assert.match(css, /backdrop-filter/);
	assert.match(css, /prefers-reduced-motion:\s*reduce/);
	assert.match(css, /\.service-copy[\s\S]*text-align:\s*center/);
});

test("mobile rules retain three tool columns", () => {
	const liquidOverride = css.slice(css.indexOf("/* V0.2.1"));
	assert.match(liquidOverride, /grid-template-columns:\s*repeat\(var\(--grid-mobile-columns\),\s*minmax\(0,\s*1fr\)\)/);
});

test("liquid-card focus and icon treatment do not add extra blue or white frames", () => {
	const liquidOverride = css.slice(css.indexOf("/* V0.2.1"));
	const correction = liquidOverride.slice(liquidOverride.lastIndexOf("V0.2.1 correction"));
	assert.doesNotMatch(correction, /outline:\s*3px\s+solid/);
	assert.match(correction, /\.service-art\s*\{[^}]*padding:\s*0/);
	assert.match(correction, /\.service-art\s*\{[^}]*background:\s*none/);
	assert.match(correction, /\.service-art\s*\{[^}]*border:\s*0/);
});

test("responsive typography and glass finish have explicit stability safeguards", () => {
	const correction = css.slice(css.lastIndexOf("/* V0.2.1 layout and glass polish"));
	assert.match(correction, /text-wrap:\s*balance/);
	assert.match(correction, /overflow-wrap:\s*anywhere/);
	assert.match(correction, /service-badge[\s\S]*service-status[\s\S]*text-overflow:\s*ellipsis/);
	assert.match(correction, /backdrop-filter:\s*blur\([^)]*\)\s+saturate\(/);
	assert.match(correction, /background-blend-mode:\s*screen/);
});

test("V0.2.2 uses two mobile columns with card-only press feedback", () => {
	const correction = css.slice(css.lastIndexOf("/* V0.2.2 mobile layout correction"));
	assert.match(correction, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
	assert.match(correction, /\.service-card:active\s*\{[^}]*transform:\s*scale\(0\.96\)/);
	assert.match(correction, /\.service-card:active\s+\.service-art\s*\{[^}]*transform:\s*none/);
	assert.match(correction, /@media\s*\(max-width:\s*360px\)[\s\S]*grid-template-columns:\s*repeat\(2,/);
});

test("V0.2.2 reference-layout refinement anchors mobile card content without icon drift", () => {
	const refinement = css.slice(css.lastIndexOf("/* V0.2.2 reference-layout refinement"));
	assert.match(refinement, /\.service-badge,\s*\.service-status\s*\{[\s\S]*position:\s*absolute/);
	assert.match(refinement, /\.service-art\s*\{[\s\S]*inset-inline:\s*0[\s\S]*margin-inline:\s*auto[\s\S]*transform:\s*none/);
	assert.match(refinement, /\.service-copy\s*\{[\s\S]*text-align:\s*left/);
	assert.match(refinement, /color-mix\(in oklch, var\(--glass-deep\) 86%, transparent\)/);
});
