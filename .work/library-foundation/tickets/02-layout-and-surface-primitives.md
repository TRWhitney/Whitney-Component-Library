# 02 Layout and Surface Primitives

**What to build:** Public stack, inline group, responsive grid, divider, surface/panel, section, and
scroll-region primitives that express the accepted spatial grammar without arbitrary styling APIs.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md)

**Status:** delivered

- [x] Each primitive has a narrow typed API and complete canonical contract.
- [x] Spacing and responsive choices come from bounded semantic options rather than arbitrary
      consumer token or class injection.
- [x] Adjacent equivalent content can maintain consistent dimensions and alignment.
- [x] Surfaces and sections preserve rounded containment, density, and continuity rules.
- [x] Scroll regions preserve keyboard access, visible focus, and content reachability.
- [x] Light, dark, accent, compact, wide, forced-color, and reduced-motion checks pass where
      applicable.
- [x] Server output and hydration are deterministic under both supported React majors.
- [x] Focused examples compile and demonstrate appropriate and inappropriate composition.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

- `Stack`, `InlineGroup`, `ResponsiveGrid`, `Divider`, `Surface`, `Section`, and `ScrollRegion`
  expose bounded public props from the root package. Each has one canonical contract, generated
  human documentation, manifest guidance, an agent-index entry, and compiling examples and
  counterexamples.
- `npm run check` passed formatting, zero-warning code and style linting, source types, 87 tests,
  generated-documentation drift, exact contract coverage, and the TypeScript 5.9.3, 6.0.3, and
  7.0.2 declaration/example matrix.
- `npm run verify:package` packed the actual artifact and passed public types, server rendering,
  hydration without warnings, and Vite browser builds in clean React 18.3.1 and 19.2.8 consumers.
- Direct Chromium, Firefox, and WebKit inspection covered dark wide and light compact rendering,
  focus, native keyboard scrolling, nested narrow-section reflow, heading hierarchy, equal peers,
  responsive grid alignment, and overflow containment. Chromium additionally covered forced colors
  and reduced motion. Every screenshot was inspected and removed.
- In every engine, an overflowing `ScrollRegion` accepted keyboard focus and moved its native scroll
  position with Page Down and End until the final content was reachable.
- In every engine, horizontal and two-axis `ScrollRegion` variants reached their final inline
  content with native Arrow Right input; the two-axis variant also reached its final block content
  with Page Down. Final focus and content visibility were inspected in each engine.
- The corrected canonical `Surface` composition rendered in both appearances at compact width in
  Chromium, Firefox, and WebKit. In every engine, `Stack` neutralized semantic-child block margins
  and applied the exact 8px regular gap; all six rendered surfaces were inspected.
- Direct RTL inspection in Chromium, Firefox, and WebKit confirmed logical InlineGroup and grid
  ordering, logical Section heading/action placement, and keyboard reachability of the final inline
  content in a horizontal ScrollRegion. Every final RTL screenshot was inspected and removed.
- The declaration fixture accepts a runtime boolean for `InlineGroup.equalItems` while retaining
  the compile-time rejection of an ineffective non-stretch alignment combination.
- Surface guidance distinguishes its visual containment from nested Section semantics: a Surface
  does not name itself, while a Section inside it can provide the visible semantic name.
- `git diff --check` passed and no `Any` usage was found in source, tests, or tooling.
- Post-delivery ScrollRegion refinement preserves native overflow detection, scroll position, wheel
  input, and keyboard input while revealing the native thumb for pointer or scroll activity and
  fading it after 900ms idle. Focus within keeps the thumb visible, reduced motion disables the
  transition, forced colors retains the system scrollbar, and no new public props or callbacks are
  exposed. Its human showcase specimen explicitly explains activity reveal, idle fade, and focus
  persistence. A zero-specificity inheritance boundary prevents this treatment from changing
  consumer-provided nested scrollers while preserving their explicit scrollbar styling.
- The renewed `npm run check` passes 130 tests plus formatting, zero-warning linters, strict types,
  generated guidance, and the TypeScript 5.9/6/7 matrix. Showcase and packed-package builds,
  React 18.3.1 and 19.2.8 SSR/hydration/type/browser consumers, the dependency audit, and diff checks
  pass. Direct Chromium, Firefox, and WebKit operation confirms the opaque-to-transparent idle
  transition, focus persistence, native scroll movement, both appearances, and compact reflow;
  inspected temporary artifacts were discarded.
- Final fresh independent intent and engineering review axes report no findings after the showcase,
  nested-scroller inheritance boundary, evidence, and durable workflow handoff corrections.
