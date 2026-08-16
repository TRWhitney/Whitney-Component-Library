# 03 Action Family

**What to build:** Button, icon button, link, toggle button, button group, and toolbar exports with
clear command, navigation, and persistent-selection semantics.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** complete

- [x] Command buttons and navigation links cannot be confused through a polymorphic escape hatch.
- [x] Icon-only actions require an accessible name and provide consistent tooltip guidance where
      appropriate.
- [x] Toggle actions expose pressed state distinctly from ordinary activation and disabled state.
- [x] Button groups and toolbars own applicable grouping and keyboard-navigation semantics.
- [x] Button groups and toolbars permit consumer components that render valid direct action DOM
      children while rejecting rendered wrappers or controls that change their owned relationships.
- [x] Hover, focus, press, pending, disabled, and reduced-motion behavior follows the visual
      contract without layout movement or adjacent overlap.
- [x] Public APIs translate rather than extend React Aria prop types.
- [x] Form submission and reset behavior remains native and explicit.
- [x] Contracts direct agents among button, link, toggle, group, and toolbar alternatives.
- [x] Behavior, accessibility, theme, SSR, hydration, and public-type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Architecture decision: Preserve Consumer Composition Boundaries](../../../docs/adr/0010-preserve-consumer-composition-boundaries.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Repeat independent review found two appearance defects and exposed a composition-enforcement
decision. The accepted ordinary-JSX correction, consumer component boundary, surface-distinct
primary fill, and hover-surface text contrast have current evidence. Private action identity and
continuous direct-child observation are corrected and the repeated intent review is clean. A later
engineering review found that horizontal Toolbar navigation assumed the global DOM realm; a focused
iframe regression now passes with event targets resolved from the Toolbar's owning window. Current
repository, package, and direct-browser evidence passes. Final independent intent and engineering
review axes pass with no findings.

- The public root exports Button, IconButton, Link, ToggleButton, ButtonGroup, and Toolbar through
  narrow library-owned types. Public type fixtures reject polymorphic command links, command
  callbacks on links, unnamed icon actions and toolbars, arbitrary variants, class injection, and
  pending buttons without localized progress descriptions or with conflicting native-disabled
  state.
- Focused behavior covers native command and navigation elements, explicit submit and reset,
  accessible icon tooltips inside the active appearance scope, controlled and uncontrolled pressed
  state, ordinary group tab stops, inherited-direction toolbar navigation, stable focusable pending
  commands, a persistent sibling live-status transition, and deterministic server rendering and
  hydration.
- Static visual checks cover bounded regular and compact sizing, non-moving interaction feedback,
  contrast-safe rail-only persistent selection, two-role warning-colored continuous pending motion,
  reduced motion, forced colors, surface-distinct primary emphasis, readable saturated-accent
  hover text, equal adjacent sizing, toolbars, links, and tooltips.
- Consumer components that render fragment-level action bundles preserve the Toolbar and
  ButtonGroup direct DOM relationship, while navigation, arbitrary content, and DOM-producing
  wrappers fail with composite-specific runtime errors. Pending announcement support remains valid
  within those relationships.
- Direct Chromium, Firefox, and WebKit inspection covered light and dark appearances, wide and
  compact containers, adjacent hover and selected states, horizontal, vertical, and inherited DOM
  RTL keyboard navigation under an English browser locale, provider-scoped tooltip placement,
  pending and disabled controls, warning- and surface-matching accents, equal action dimensions,
  reduced motion, forced colors, wrapping, clipping, and overflow. Stable labels and state rails
  remained readable, and temporary screenshots and fixtures were removed afterward.
- `npm run check` passes formatting, zero-warning linting, strict source types, 111 tests, generated
  documentation, and public examples under TypeScript 5.9.3, 6.0.3, and 7.0.2.
- `npm run verify:package` passes installed-package SSR, hydration, public types, and Vite browser
  builds in clean React 18.3.1 and 19.2.8 consumers. `npm audit --audit-level=high` reports zero
  vulnerabilities, and `git diff --check` passes.
- Fresh Chromium, Firefox, and WebKit operation confirms surface-distinct primary controls for a
  white accent in light appearance and a black accent in dark appearance, readable selected hover
  treatment with a saturated red accent, and wrapper-free consumer action bundles with working
  arrow navigation and equal adjacent sizing at wide and compact widths. Every screenshot was
  inspected for alignment, hierarchy, wrapping, clipping, overflow, and style leakage, then the
  temporary fixture was removed.
- Fresh Chromium, Firefox, and WebKit operation confirms that only privately registered direct
  actions participate in toolbar navigation, consumer-bundle DOM changes are continuously checked,
  and forged public styling markers are rejected through the application error boundary. The
  installed package resolves observation from its owning DOM window under React 18.3.1 and 19.2.8.
- Fresh Chromium, Firefox, and WebKit operation of a Toolbar rendered into an RTL iframe confirms
  `ArrowLeft` moves focus from Undo to Redo in the iframe document. The rendered toolbar retains two
  direct equal-height buttons, inherited RTL direction, visible focus, and no clipping or overflow.
