# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through higher-level constructs and a
propagated application accent.

## Current state

Novel-work implementation: Tickets 01 and 02 are delivered. Ticket 03 is ready for an agent and
remains unstarted.

## Progress

The project goals, React + TypeScript consumption model, bounded style and theme contract, private
React Aria behavior foundation, canonical agent-facing contract, Focus + Rail + Momentum + Route
visual direction, and breadth-aware vertical-slice release strategy are accepted. The first slice
supports configure, validate, review, execute, and monitor workflows while broader component
families constrain the foundation before its public APIs freeze. The capability territory,
representative hard cases, initial pre-release export capabilities, and modern ESM distribution
and compatibility contract are now settled. Stable release requires a wider conventional catalog,
several completed slices, an Obsidian-like Markdown editor, and a chart family including radar
charts. The Markdown editor is settled as a library-owned editing surface over a canonical
Markdown string rather than a vault or notes ecosystem. The chart family is settled across common
Cartesian, radial, statistical, heatmap, and compact charts with accessible alternatives.
Operational workflow, data analysis, Markdown authoring, and application workbench are the four
required prerelease integration slices.
Wayfinding is complete with fourteen resolved decisions, zero visible decisions, and no remaining
in-scope fog. The library remains pre-adoption through the four `0.x` slices and stabilizes only
after the broad catalog and accepted quality gates receive explicit review.

An accepted [canonical specification](spec.md) and 32 dependency-ordered [implementation
tickets](tickets/) cover the package and contract spine, conventional catalog, operational
workflow, chart system, data analysis, Markdown editor and authoring, workbench, forward-expansion
probes, and stable-candidate evidence. [Ticket 01](tickets/01-package-provider-and-contract-spine.md)
now enforces one-to-one contract coverage, compiles its canonical examples across the TypeScript
matrix, scans browser output against the full Node built-in set and Node globals, verifies accent
text/focus contrast in both appearances, and imports the public stylesheet in clean Vite browser
builds. Final gate corrections scan all declaration files, recognize static Node imports and
Node-specific globals in owned output, reject retained/externalized Node modules in Vite bundles,
and align the tooling contract with Node `>=22.12.0`. [Ticket
02](tickets/02-layout-and-surface-primitives.md) now provides Stack, InlineGroup, ResponsiveGrid,
Divider, Surface, Section, and ScrollRegion through narrow typed APIs and canonical contracts.
The primitives own bounded spacing, responsive equal-item layout, rounded neutral containment,
semantic sections and dividers, and labeled keyboard-reachable overflow without exposing arbitrary
class, style, token, or breakpoint injection.
Delivery review corrections place forced-color overrides in the effective component layer, make
section actions respond to container space, reject ineffective equal-item alignment combinations,
support the complete HTML heading hierarchy, and put every canonical layout example inside its
required AppearanceProvider. Final intent-review corrections make each primitive's appearance
guidance describe only the roles it actually paints and make the canonical Surface example use
library-owned Stack rhythm. Final release-review corrections make generated snippets import every
related component they use, describe ScrollRegion's subtle surface accurately, and make Stack own
direct-child block rhythm instead of inheriting browser margins. Surface guidance now distinguishes
unnamed visual containment from the nested Section that supplies a visible semantic name.
Both final independent delivery review axes passed with no findings. Ticket 03 is now the sole
ready frontier.

Repository-wide quality gates now run before the existing type, test, generated-artifact, and
compatibility checks. Prettier owns formatting for authored files, ESLint applies type-informed
TypeScript and React Hooks rules alongside JavaScript checks, and Stylelint applies the standard
CSS rule set. Generated component documentation, npm's lockfile, build output, coverage output,
and installed dependencies remain owned by their respective generators rather than Prettier.

## Frontier

See the [decision map](map.md).

## Accepted sources

- Whitney's stated project intent and four design goals in the conversation.
- [Architecture decision: Target React and TypeScript](../../docs/adr/0001-target-react-and-typescript.md)
- [Architecture decision: Own Styles and Bound Theming](../../docs/adr/0002-own-styles-and-bound-theming.md)
- [Architecture decision: Build on React Aria Privately](../../docs/adr/0003-build-on-react-aria-privately.md)
- [Architecture decision: Publish Canonical Component Contracts](../../docs/adr/0004-publish-canonical-component-contracts.md)
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Architecture decision: Ship a Modern ESM Package](../../docs/adr/0006-ship-a-modern-esm-package.md)
- [Architecture decision: Own a Markdown Editing Surface](../../docs/adr/0007-own-a-markdown-editing-surface.md)
- [Architecture decision: Own an Accessible Chart Family](../../docs/adr/0008-own-an-accessible-chart-family.md)
- [Architecture decision: Stabilize After Broad Prerelease Validation](../../docs/adr/0009-stabilize-after-broad-prerelease-validation.md)
- [Component Library Context](../../CONTEXT.md)
- [Research: Accessible React Behavior Foundations](research/behavior-foundations.md)

## Out of scope

- Designing a single application as the library's primary outcome.

## Verification

- `npm run check`: repository formatting, zero-warning code and style linting, source types, 87
  focused and regression tests, generated documentation, exact contract coverage, and canonical
  examples compiled under TypeScript 5.9.3, 6.0.3, and 7.0.2.
- `npm run verify:package`: the actual artifact installed, server-rendered, and hydrated without
  warnings in clean React 18.3.1 and 19.2.8 consumers; both consumers also completed Vite browser
  builds that imported the public stylesheet and emitted its theme rules.
- `npm audit --audit-level=high`: zero known vulnerabilities in the installed dependency graph.
- Browser output passed the full Node built-in/global exclusion scan; public subpaths,
  encapsulation, and private React Aria declarations passed.
- Accent contrast, accent text, and focus contrast passed their thresholds across six
  representative accents and every owned surface in both appearances. Forced-color and
  reduced-motion rules are covered. Packed declarations compile against React 18 and React 19
  types. `git diff --check` passed and no `Any` usage was found in source, tests, or tooling.
- Chromium, Firefox, and WebKit keyboard inspection reached the final inline content of horizontal
  and two-axis ScrollRegions; the two-axis case also reached its final block content and retained a
  visible focus ring without clipping or overflow leakage.
- Chromium, Firefox, and WebKit inspection of the canonical Surface example in both appearances
  confirmed zero semantic-child block margins and an exact 8px regular Stack gap at compact width.
- Chromium, Firefox, and WebKit RTL inspection confirmed logical peer/grid ordering, logical
  Section heading/action placement, and horizontal keyboard scrolling to final inline content.
  The declaration matrix also accepts a runtime boolean for InlineGroup equal sizing while
  rejecting ineffective alignment combinations.

## Continuation

Resume with `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
Begin Ticket 03 in the next request; do not start a later ticket first.

Current branch: `master` (`[Feature] Add layout primitives`).

Owned uncommitted paths: none. No unrelated uncommitted paths are present.

Prototype browser inspection passed for appearance, viewport, accent, error, disabled, dialog,
review, progress, segmented adjacency, the normalized field-to-Profile gap, the gliding rail,
one-shot surge, continuous running pulse, reduced motion, offset wrapper glow, opaque nested panel,
divider-free compact reflow, overflow containment, and semantic status contrast. Route is checked
as a real responsive track with distinct shadow-free endpoints in wide and compact layouts; its
semantic endpoint changes with status without becoming a duplicate status indicator. Exact command
is recorded in the prototype test source.

At planning completion, artifact verification found 32 tickets, exactly one `ready-for-agent`
frontier ticket, 31 blocked tickets, and no missing local Markdown links across the work record,
ADRs, or context.
