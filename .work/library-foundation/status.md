# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through higher-level constructs and a
propagated application accent.

## Current state

Novel-work implementation: Tickets 01 through 03 are delivered. The requested repository-local
component showcase has current completion evidence, clean final independent review axes, and is
preserved in the current HEAD with its maintenance instruction. Ticket 04 has not started.

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
Ticket 02's final independent delivery review axes passed with no findings.

[Ticket 03](tickets/03-action-family.md) now provides Button, IconButton, Link, ToggleButton,
ButtonGroup, and Toolbar through narrow semantic APIs. Commands remain native buttons with explicit
form behavior; navigation remains a native destination; pressed state represents persistent binary
selection; ordinary groups preserve each tab stop; and toolbars own orientation-aware arrow
navigation. Icon-only commands require one accessible label and reuse it in a provider-scoped
tooltip. Stable pending labels retain focus and announce localized progress while a warning rail
communicates motion without replacing the application accent. The visual treatment preserves
rail-only selection, consistent adjacent dimensions, wrapping without compact clipping,
non-moving hover and press feedback, and forced-color and reduced-motion meaning. Canonical action
contracts direct agents among every alternative without exposing the private React Aria foundation.
Ticket 03 delivery review found that inherited RTL navigation, pending and disabled state
ownership, pending announcement structure, arbitrary-accent state visibility, forced-color
selection, and variant-use guidance were not yet fully enforced. Focused regressions are green
after correcting those boundaries. Complete repository, package, and direct-browser validation
passed before repeat independent review found that JSX erases the concrete child identities claimed
by the composite TypeScript types. The accepted correction preserves ordinary JSX and consumer
components that render valid direct action DOM children, while behavior-owning composites validate
the resulting DOM relationship at runtime. Review also found untested white-accent primary emphasis
and saturated-accent hover contrast defects; those corrections now have current evidence. A later
engineering review found that Toolbar navigation used the global DOM realm. A focused iframe
regression now passes with event targets resolved from the Toolbar's owning window, and its affected
completion gates passed on repetition.

The repository now includes a runnable human-facing showcase for every contracted public component.
It uses the library's accepted visual language, provides working light and dark examples at wide
and compact widths, and derives its catalog from an explicit specimen inventory. A focused test
compares rendered specimens with the canonical component contracts so catalog drift fails the
repository checks. The local `AGENTS.md` requires the showcase to change with public components.

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
- [Architecture decision: Preserve Consumer Composition Boundaries](../../docs/adr/0010-preserve-consumer-composition-boundaries.md)
- [Component Library Context](../../CONTEXT.md)
- [Research: Accessible React Behavior Foundations](research/behavior-foundations.md)

## Out of scope

- Designing a single application as the library's primary outcome.

## Verification

- `npm run check`: repository formatting, zero-warning code and style linting, strict source types,
  111 focused and regression tests, generated documentation, exact contract coverage, and public
  examples under TypeScript 5.9.3, 6.0.3, and 7.0.2.
- `npm run verify:package`: the actual artifact installed, server-rendered, and hydrated without
  warnings in clean React 18.3.1 and 19.2.8 consumers; both consumers also completed Vite browser
  builds that imported the public stylesheet and emitted its theme rules.
- `npm audit --audit-level=high`: zero known vulnerabilities in the installed dependency graph.
- Browser output passed the full Node built-in/global exclusion scan; public subpaths,
  encapsulation, and private React Aria declarations passed.
- Accent fill, contrast, accent text, focus, and rail roles passed their thresholds across seven
  representative accents, every owned surface, and the accent-soft hover surface in both
  appearances. Forced-color and reduced-motion rules are covered. Packed declarations compile
  against React 18 and React 19 types. `git diff --check` passed and no `Any` usage was found in
  source, tests, or tooling.
- Chromium, Firefox, and WebKit keyboard inspection reached the final inline content of horizontal
  and two-axis ScrollRegions; the two-axis case also reached its final block content and retained a
  visible focus ring without clipping or overflow leakage.
- Chromium, Firefox, and WebKit inspection of the canonical Surface example in both appearances
  confirmed zero semantic-child block margins and an exact 8px regular Stack gap at compact width.
- Chromium, Firefox, and WebKit RTL inspection confirmed logical peer/grid ordering, logical
  Section heading/action placement, and horizontal keyboard scrolling to final inline content.
  The declaration matrix also accepts a runtime boolean for InlineGroup equal sizing while
  rejecting ineffective alignment combinations.
- Direct Chromium, Firefox, and WebKit action-family inspection passed in light wide, dark compact,
  reduced-motion, and forced-color presentations. It exercised pending transitions, stable labels,
  warning-matching accents, surface-matching selection accents, provider-scoped tooltip focus,
  vertical navigation, and inherited DOM RTL navigation under an English browser locale. Structure
  and screenshots confirmed readable forced-color labels, visible pending and selected rails,
  stable adjacent dimensions, wrapping without clipping, and no overflow. Temporary validation
  artifacts were removed.
- Fresh Chromium, Firefox, and WebKit inspection confirms that white-on-light and black-on-dark
  accents retain distinct primary emphasis, saturated-red selected hover remains readable with its
  rail visible, and consumer components can contribute wrapper-free action bundles without changing
  direct DOM geometry, arrow navigation, equal sizing, compact wrapping, or overflow behavior.
- Fresh Chromium, Firefox, and WebKit operation confirms privately registered consumer actions
  retain direct geometry and arrow navigation, a consumer bundle that later introduces a wrapper
  reaches the application error boundary, and forged public styling markers are rejected. The
  resulting valid and rejected screens were inspected for wrapping, clipping, overflow, and style
  leakage, then the temporary fixture was moved to Trash.
- Installed-package verification passes with `MutationObserver` resolved from the composite's
  owning DOM window in both React 18.3.1 and React 19.2.8 consumers.
- Direct Chromium, Firefox, and WebKit operation of a Toolbar rendered into an RTL iframe confirms
  that `ArrowLeft` moves focus from Undo to Redo in the owning document. Structural inspection
  confirms two direct button children, equal heights, inherited RTL direction, and no overflow;
  screenshots show a visible focus indicator without clipping in every engine. Temporary validation
  artifacts were moved to Trash.
- Final independent intent and engineering review axes passed with no findings.
- `npm run check` passes formatting, zero-warning code and style linting, strict types, generated
  artifacts, the TypeScript 5.9/6/7 matrix, and 113 tests including separate rendered-specimen and
  navigation-catalog coverage for all 14 contracted public components. `npm run showcase:build`
  produces a clean Vite artifact.
- Package verification still passes in clean React 18.3.1 and React 19.2.8 consumers, the dependency
  audit reports zero vulnerabilities, `git diff --check` passes, and the showcase introduces no
  `Any` usage.
- Direct Chromium, Firefox, and WebKit inspection covers dark wide and light compact layouts,
  appearance switching, catalog navigation, hover feedback, and the icon-button tooltip. Every
  engine renders all 14 specimens, reaches the Toolbar from the compact catalog, contains document
  overflow at 390px, and presents the inspected states without clipping or style leakage. Temporary
  screenshots, scripts, and build artifacts were moved to Trash.
- Final independent intent and engineering review axes passed with no findings after navigation
  catalog coverage was enforced separately from rendered-specimen coverage.

## Continuation

Resume with `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
The showcase addition is delivered. Begin Ticket 04 only when Whitney explicitly requests the next
ticket.

Current branch: `master`.

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
