# Component Library Foundation

## Destination

Establish and implement the first coherent release of a reusable component, style, and behavior
library whose APIs and guidance constrain agent-authored applications toward consistent,
appropriate results while preserving deliberate extension through reusable composites and a
propagated application accent.

## Notes

The library is the product. Front-end design work applies to its reusable visual grammar,
interaction contracts, composition rules, and agent-facing affordances rather than to one example
application.

## Decisions so far

- [Supported consumption model](decisions/01-consumption-model.md): Target web applications using
  React and TypeScript, without requiring framework-agnostic distribution in the first release.
- [Style and theme contract](decisions/02-style-and-theme-contract.md): Ship library-owned static
  CSS and expose only typed accent and appearance configuration in the first release, preserving
  the literal accent for suitable identity-bearing uses while deriving role-specific support hues.
- [Behavior and accessibility foundation](decisions/03-behavior-foundation.md): Use React Aria
  privately while owning this library's public API, compositions, styles, and behavior tests.
- [Agent-facing contract](decisions/04-agent-contract.md): Pair narrow TypeScript APIs with
  canonical structured component contracts and deterministic guidance verification.
- [Visual direction and permitted variation](decisions/05-visual-direction.md): Focus + Rail +
  Momentum + Route is accepted under the principle of continuity without conflation.
- [Initial public scope](decisions/06-initial-public-scope.md): Build a breadth-aware operational
  integration fixture while validating the foundation against the wider component territory.
- [Foundation expansion constraints](decisions/07-foundation-expansion-constraints.md): Model hard
  cases across action, input, selection, collection, navigation, overlay, feedback, layout, and
  composition families before freezing shared public foundations.
- [Initial prerelease export catalog](decisions/08-initial-export-catalog.md): Ship the components
  needed by the operational fixture, including a staged-process tracker, without exporting the
  fixture's application arrangement.
- [Distribution and compatibility contract](decisions/09-distribution-and-compatibility.md):
  Ship one ESM-only package with explicit CSS and agent metadata, React 18.3 or 19 peers,
  TypeScript 5.9+, fixed Baseline 2023, Node 22+ tooling, and deterministic SSR hydration.
- [Quality and release boundary](decisions/10-quality-and-release-boundary.md): Keep four `0.x`
  slice milestones explicitly pre-adoption and stabilize `1.0` only after the broad catalog and
  full quality, compatibility, performance, and bundle-isolation gates receive explicit acceptance.
- [Stable catalog model](decisions/11-stable-catalog-model.md): Treat vertical slices as
  pre-release integration evidence while building a wider conventional catalog plus specialized
  Markdown editing and charting before compatibility stabilizes.
- [Markdown editor scope](decisions/12-markdown-editor-scope.md): Ship a Markdown-valued editing
  surface with Live Preview, source and read-only modes, wiki-link callbacks, safe rendering, and a
  bounded extension contract without an Obsidian notes ecosystem.
- [Charting scope](decisions/13-charting-scope.md): Ship an accessible, typed standard chart family,
  including radar charts, with narrow named APIs and a bounded advanced composition layer.
- [Prerelease integration slice set](decisions/14-prerelease-slice-set.md): Require four
  non-exported consumer fixtures before stable release without turning their arrangements into
  public contracts.
- [Date and time value contract](decisions/15-date-and-time-value-contract.md): Keep public civil
  dates, wall-clock times, and inclusive ranges as plain library values; require explicit display
  locale, calendar, hour cycle, and granularity without implying a time-zone-aware instant.
- [Reusable composite boundary](decisions/16-reusable-composite-boundary.md): Publish composites
  that own one recurring concept; keep workflow, workspace, and application arrangements in
  consumer-owned integration fixtures.

## Not yet specified

- None.

## Out of scope

- Designing a single application as the library's primary outcome.
- General consumer customization of the library's visual token system in the first release.
- Re-exporting React Aria components or adopting their complete prop types as this library's public
  interface.
- Agent-output adherence evaluation as a repository responsibility or prescribed consumer
  workflow.
