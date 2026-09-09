# 13 Select and activate heatmap cells

**What to build:** Deliver the accepted heatmap interaction through the public component, preserving exact cell readings and numeric colors.

**Blocked by:** none

**Status:** complete

- [x] Optional interaction supports controlled or uncontrolled cell selection, stable row/column IDs, localized summaries and clearing. Removed IDs are pruned without selecting replacement cells.
- [x] Click/tap selects; Control/Command-click and touch hold activate independently. Without selection, ordinary activation works. Callbacks expose row/column labels, optional recorded value, optional original record and input method. Zero and every rendered missing cell are targets.
- [x] Box touched dragging has a visible rectangle, replacement/addition/removal modifiers, cancellation and pointer capture. Data, geometry, status or interaction changes cancel pending gestures.
- [x] Keyboard navigation retains the declared grid order and row/grid endpoints, with separate selection and activation shortcuts and no whole-chart focus border or pointer-induced jump to the first cell.
- [x] Dashed inner reading outlines, solid cell selection frames and shared activation motion match the accepted study across dark/light, compact, missing, reduced-motion and forced-color states. Existing tooltip, table and overflow behavior remain available.
- [x] Public types, contracts, generated guides and showcase examples describe and demonstrate the behavior. Production tests, direct browser inspection, repository/package checks and independent production reviews pass.

## Accepted sources

- [Heatmap interaction specification](../spec.md#heatmap-cell-interaction)
- [Accepted heatmap study](../prototypes/heatmap-selection.md)
- [Shared activation motion](../spec.md#shared-activation-motion)

## Completion evidence

The six initial public interaction tests failed before implementation. All eleven interaction tests
now pass, with existing heatmap and affected chart coverage. They exercise zero/missing activation,
source-record identity, controlled selection and coordinate pruning, drag modifiers and cancellation,
touch hold, keyboard shortcuts, finite pulse lifetime and cancellation after layout/status changes.
Type coverage checks optional missing-cell data, coordinate IDs and controlled ownership.

Direct production browser operation confirms exact-cell pointer targeting, independent activation,
visible Box touched preview and commit, Escape cancellation, keyboard grid endpoints, and touch hold
without selection changes. Shared feedback uses 620ms timing and three-pixel travel per edge;
reduced motion uses a static cue. Dark, compact light, forced-color, sequential and two-sided views
were inspected. A 198px viewport into a 320px grid scrolls to the keyboard target without losing the
cell reading. Screenshot files were inspected and removed. The accepted study received no tests or
agent reviews.

Build, showcase and packed React 18/19 SSR, hydration, type and browser checks pass. `npm run check`
passes all 686 tests across 42 files, formatting, lint, generated-output checks, TypeScript 5/6/7
and chart-isolation checks. One concurrent validation run hit the existing showcase test timeout;
the full suite passes with package checks run separately. Independent intent review passes with no findings. Engineering review found that native scrolling
cleared the keyboard tooltip anchor. A new public regression reproduced the loss, and the scroll
handler now refreshes that anchor while cancelling pending drags. Native replay confirms that the
last cell remains active and its tooltip stays visible after scrolling. Renewed repository and package checks pass with 686 tests; independent engineering correction review passes with no findings.
