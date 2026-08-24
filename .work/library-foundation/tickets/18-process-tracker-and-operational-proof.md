# 18 Process Tracker and Operational Integration Proof

**What to build:** A public status-only ProcessTracker for an ordered staged process, plus a
non-exported operational fixture that proves existing public components can configure, validate,
review, execute, and monitor an operation without a library-owned workflow layout.

**Blocked by:** [Action Family](03-action-family.md),
[Field and Text Entry Family](04-field-and-text-entry-family.md), [Choice Controls](05-choice-controls.md),
[Select and Combobox](06-select-and-combobox.md), [Status, Progress, and Alerts](10-status-progress-and-alerts.md),
[Dialog and Drawer Overlays](12-dialog-and-drawer-overlays.md), [Application Structure](17-application-structure.md)

**Status:** complete

- [x] ProcessTracker accepts an ordered immutable stage collection with unique stable ids, labels,
      optional descriptions, and complete, active, pending, warning, or failed status.
- [x] The component exposes one named process relationship and each stage's position and status to
      assistive technology without presenting stages as interactive navigation.
- [x] Announcement defaults to off and supports the shared polite or assertive modes without
      duplicating the visible stage content.
- [x] At most one stage may be active. Empty collections, duplicate ids, invalid labels, and
      contradictory active state fail through clear public type or runtime boundaries.
- [x] Complete, active, pending, warning, and failed stages remain distinct without relying on
      color; semantic warning and failure stay independent from the application accent.
- [x] Active-stage motion persists only while that stage is active. Reduced motion removes it
      without removing current-stage meaning, and status changes do not move surrounding content.
- [x] The tracker remains usable in wide and compact containers, long localized labels, right-to-left
      direction, forced colors, light and dark appearance, and arbitrary supported accents.
- [x] The showcase explains ProcessTracker as a status display, distinguishes it from interactive
      step navigation and ProgressBar, and demonstrates representative process states.
- [x] A non-exported fixture composes public fields, choices, validation, Dialog, actions,
      PageHeader, ProcessTracker, status, and progress into one operational flow. Its layout and
      state coordination are fixture-owned and are not copied into a component contract.
- [x] The packed-package fixture uses no private import or external substitute component.
- [x] Behavior, accessibility, theme, browser, SSR, hydration, public type, generated-guidance,
      package, and affected regression checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Initial Prerelease Export Catalog](../decisions/08-initial-export-catalog.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Reusable Composite Boundary](../decisions/16-reusable-composite-boundary.md)
- [Architecture decision: Own Reusable Concepts, Not Applications](../../../docs/adr/0012-own-reusable-concepts-not-applications.md)
- [Interactive visual reference](../prototypes/visual-directions.html), limited to its staged
  process treatment and established library visual language

## Completion evidence

`npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, 417 tests
across 25 files, generated guidance, and public declarations under TypeScript 5.9, 6, and 7.
`npm run showcase:build`, `npm run verify:package`, and `git diff --check` pass. Packed React 18.3.1
and 19.2.8 consumers pass SSR, hydration, public types, semantic assertions, and browser builds
using only package exports. The packed proof rejects an invalid configuration, accepts corrected
native field data, opens review in Dialog, records acceptance, unlocks execution, and moves
PageHeader, ProcessTracker, StatusIndicator, and ProgressBar into one coherent monitoring state.

Direct Chromium inspection covers light and dark appearance, two active-pulse frames, compact
layout, reduced motion, forced colors, and long Arabic text under local RTL direction. The active
marker retains its filled center while the prototype-derived ring expands and fades. The 33%
accent rail connects evenly spaced markers, including warning between descriptionless complete and
failed stages. The two named ordered lists expose three stages each, only the active stage carries
`aria-current="step"`, and the specimen adds no focus target. Compact and RTL cases have no
document or specimen overflow. Reduced motion reports no marker animation, and forced colors uses
system colors for the active marker and rail. Temporary screenshots were inspected and discarded.

Direct Chromium, Firefox, and WebKit accessibility snapshots expose the tracker as one named list
with three noninteractive list items. A live Chromium status transition under accent `#d14f00`
moves the active marker from source acquisition to validation without changing the tracker's
122.55-pixel height or the following content position. The active core resolves to the exact
alternate accent, `rgb(209, 79, 0)`. Before and after screenshots confirm the
filled center, connected rail, unchanged surrounding geometry, and correct completed, active, and
pending marker treatment; inspected screenshots and the temporary harness were discarded.
