# Browser checks

Optional helpers for checks using your existing `playwright` installation. Import the testing
subpath from a Node check script. It does not import Playwright, add a test runner, or change
component behavior.

```js
import {
  waitForFocus,
  waitForVisualState,
  assertTextContrast,
} from '@trwhitney/component-library/testing';

await page.getByRole('button', {name: 'Cancel', exact: true}).click();
await waitForFocus(page.getByRole('button', {name: 'Edit', exact: true}));

// After an appearance change, settle animations before screenshots or style assertions.
await waitForVisualState(page);
await page.screenshot({path: 'appearance.png'});

// This assertion also waits for visual settling. Import it directly; no source extraction.
const samples = await assertTextContrast(page.locator('main'));
console.log(Math.min(...samples.map((sample) => sample.ratio)));
```

`waitForFocus(locator)` resolves the locator on each sample and requires matching focus across
at least three frame-separated samples spanning 80ms. Call it before moving to another control
after dialog closure. Missing or permanently wrong focus fails; multiple matches fail immediately.

`waitForVisualState(page)` requires no pending or running document animations and loaded fonts
for the same sampling window. It never disables animation. Continuous animation times out.
Both waits accept `{timeout: 4000, stableFor: 80}` in milliseconds.

`assertTextContrast(locator)` checks visible direct text and input values under one root against
composited ancestor backgrounds over white. It requires 4.5:1, or 3:1 for large text. Empty roots,
low contrast, and unsupported opacity, images, gradients, filters, clipping, blending, or text
shadows throw. It returns the passing samples.

Wait for your application's expected state first. These helpers cannot predict future network
updates or arbitrary timers. Focus sampling does not prove continuous focus between samples.
Use top-level document locators. Frames, shadow trees, placeholders, generated content, SVG,
canvas, disabled controls, hidden and inert content, overlapping elements and non-ancestor
backgrounds need separate checks. Rendered `aria-hidden` text is included. Computed contrast is
not an accessibility audit; inspect screenshots and focus visibility too.
