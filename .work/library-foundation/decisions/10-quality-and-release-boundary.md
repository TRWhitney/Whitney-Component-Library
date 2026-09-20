# 10 Quality and Release Boundary

**Status:** resolved
**Blocked by:** [Agent-Facing Contract](04-agent-contract.md),
[Visual Direction and Permitted Variation](05-visual-direction.md),
[Foundation Expansion Constraints](07-foundation-expansion-constraints.md),
[Initial Export Catalog](08-initial-export-catalog.md),
[Distribution and Compatibility Contract](09-distribution-and-compatibility.md),
[Markdown Editor Scope](12-markdown-editor-scope.md),
[Charting Scope](13-charting-scope.md),
[Prerelease Integration Slice Set](14-prerelease-slice-set.md)
**Type:** discussion

## Question

Which behavioral, accessibility, visual, type, package, and compatibility evidence must pass before
the first coherent release is publishable, and when should its public API become compatibility
stable?

## Answer

Use successive `0.x` milestones for the catalog and its operational, data-analysis, Markdown, and
application-workbench integration fixtures. Publish prereleases, if published externally, under a
non-default tag such as `next`; the library is not intended for application adoption and `latest`
remains unused until stable release. Breaking changes may occur between `0.x` minors, but each
milestone must pass its applicable quality checks and update affected contracts, generated
guidance, and fixtures.

Component and slice tickets verify their assistive-technology surface through automated semantic,
relationship, state, keyboard, and browser accessibility-tree checks. Manual screen-reader
exercises are consolidated in release-wide accessibility hardening after the catalog and slices
exist and must pass before `1.0`; they are not repeated as an intervention gate for every ticket.
Manual coverage follows distinct library interactions. Integration fixtures are test artifacts,
not applications requiring separate manual acceptance. Use a fixture only when it provides
coverage of library behavior not already established elsewhere.

Per-ticket validation and review remain proportional to the ticket's accepted public behavior.
One complete review examines the documented supported paths, task-owned changes, and material
regression risk. Corrections receive focused revalidation and targeted review of the original
finding plus behavior directly affected by the correction; they do not trigger a new unrestricted
search for unrelated edge cases. A new full review is warranted only when the correction materially
reshapes the public interface, architecture, or accepted scope.

An observation blocks delivery only when it is reachable through a documented supported use,
contradicts an accepted source or causes a material regression, has concrete evidence, and belongs
to the ticket to remedy. Theoretical conformance concerns, exhaustive input or environment
permutations, unsupported consumer misuse, and speculative hardening do not enlarge a ticket.
Record a materially useful out-of-scope concern for later planning instead. Credible security,
data-loss, or accessibility failures on a supported path remain blocking regardless of when they
are discovered.

If targeted re-review produces repeated waves of new blockers, stop delivery and revisit the
ticket's supported boundary with Whitney rather than continuing an open-ended review-remediation
loop. Passing evidence uses representative combinations selected by changed behavior and risk; it
does not require the Cartesian product of every browser, appearance, viewport, state, and input
unless the ticket explicitly makes that matrix part of its acceptance criteria.

Stable `1.0` requires explicit acceptance after all of the following remain true:

- The accepted broad conventional catalog, Markdown editor, and chart family are production-ready.
- All four non-exported integration fixtures use only public package APIs and no external
  component substitutes. Their application arrangements are not release contracts.
- Every export has a complete canonical component contract; human guidance, manifest, and agent
  index regenerate without drift.
- Examples and public declarations pass TypeScript 5.9, 6, and 7 without exposing private React
  Aria, editor, or renderer types.
- Keyboard, pointer, touch, focus, form, validation, overlay, collection, chart, and editor behavior
  passes, together with automated accessibility checks and focused screen-reader exercises for
  complex interactions.
- Chromium, Firefox, and WebKit pass the fixed Baseline 2023 matrix, including light and dark,
  accent, responsive, forced-color, reduced-motion, loading, empty, error, and disabled states.
- React 18.3 and 19 server-render and hydrate without mismatches, and packed-package fixtures verify
  client-rendered and SSR consumption.
- Tree-shaking verification proves that importing ordinary components does not include the private
  Markdown editor or chart renderer JavaScript in application bundles. Those dependencies may
  remain installed; the gate concerns browser download and execution. Specialized CSS receives a
  separate optional entry if including it in the shared stylesheet creates a material cost.
- Representative editor-document and chart-data workloads meet explicit responsiveness budgets.
- No unresolved public API, composition, or compatibility decisions remain.

After `1.0`, normal semantic versioning applies. Additive expansion is preferred; breaking semantic
or structural changes require a major release and migration guidance. Agent-output evaluation is
not a release gate.

## Evidence

- [Agent-Facing Contract](04-agent-contract.md) already requires deterministic contract integrity,
  generated-artifact drift, example compilation, public-type, and component-behavior checks.
- [Visual Direction and Permitted Variation](05-visual-direction.md) defines theme, responsive,
  semantic-state, interaction, and reduced-motion obligations.
- [Foundation Expansion Constraints](07-foundation-expansion-constraints.md) requires representative
  hard cases to challenge shared foundations before they freeze.
- [Distribution and Compatibility Contract](09-distribution-and-compatibility.md) establishes the
  compiler, browser, React, package, SSR, and hydration matrix that release evidence must cover.
- [Prerelease Integration Slice Set](14-prerelease-slice-set.md)
- [Reusable Composite Boundary](16-reusable-composite-boundary.md)
- [Architecture decision: Stabilize After Broad Prerelease Validation](../../../docs/adr/0009-stabilize-after-broad-prerelease-validation.md)
