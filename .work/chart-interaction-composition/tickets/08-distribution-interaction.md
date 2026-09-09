# 08 Histogram and box-plot activation and selection

**What to build:** Deliver the approved histogram and box-plot interaction through public components, with useful source-aware callbacks and matching showcase examples.

**Blocked by:** none

**Status:** complete

- [x] Histogram bins use rectangle intersection, shared-edge frames, inset reading outlines, independent activation, and complete interval payloads.
- [x] Box summaries use Box touched and outline/whisker reading cues without a median dot. Outlier dots remain separate center-selected targets.
- [x] Click/tap, modified activation, touch hold, keyboard access to every target, additive/subtractive drag, and cancellation preserve the accepted prototype.
- [x] Callbacks identify their statistical target and source mode and contain raw numeric data, source records when available, and input method.
- [x] Controlled/uncontrolled selection, stable target identity, source-data replacement, and current geometry remain distinct from transient readings and activation feedback.
- [x] Existing supported raw and precomputed distributions, duplicate values, empty bins, explicit scales, zero-spread summaries, table content, and statistical calculations retain their meanings.
- [x] Guides, public types, and the rendered showcase describe the completed behavior. Relevant regressions, repository/build/package checks, native production inspection, and independent production reviews pass.

## Callback and identity boundary

Whitney chose "Require stable IDs for outliers". The approved prototype and this boundary make
this ticket ready for production implementation.

A histogram activation identifies the lower/upper interval edges, whether the upper edge is
inclusive, the displayed ordinate value and its kind, and the input method. Raw distributions
also expose the original records assigned to that bin; pre-binned distributions expose the supplied
bin record. Never describe a density or proportion as a count. Identity follows the full interval,
including its upper-edge inclusion rule. Changing thresholds does not silently transfer a selection
to a different range. Ordinary changes to a count leave the interval's identity intact.

A box-summary activation identifies its declared group and reports the median, quartiles, whiskers,
whisker method, and outlier values. Raw mode exposes contributing valid source records. Summary
mode exposes the supplied summary record. Neither mode expands a summary selection into individual
record selections.

An outlier activation identifies its group, value, and individual target. Raw mode can expose the
original observation; summary mode can expose the supplied summary record and outlier position,
but cannot reconstruct an original observation that the application did not supply. Equal values
must not be mistaken for equal record identities.

Accepted identity policy: require an application-supplied stable outlier ID for interactive box
plots, unique within its group. Raw callers can derive it from their observation; summary callers
can associate IDs with the entries of their outlier list. Group-summary and histogram identities
already follow group IDs and interval edges. The alternative without outlier IDs is rejected. Do not implement a
value-only or array-index identity that silently carries a selection onto a different observation.

Reuse existing selection ownership and localized labels while giving consumers named statistical
items rather than requiring them to decode opaque renderer IDs. Public item types distinguish a
bin, group summary, and outlier. Existing Cartesian/scatter selection interfaces remain compatible.
No new public category/point targeting switch is needed for these statistical units.

## Accepted sources

- [Accepted prototype contract](../prototypes/distribution-selection.md#accepted-contract)
- [Existing specification](../spec.md)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Histogram public contract](../../../docs/components/histogram.md)
- [BoxPlot public contract](../../../docs/components/box-plot.md)

## Testing decisions

Use the public components as the regression boundary. Cover raw/precomputed callbacks and exact
bin membership, equal-valued outliers with different identities, input reordering, retained and
retired selections, zero-height/zero-spread geometry, shared histogram borders, and summary reading
without a median dot. Exercise actual pointer/keyboard/touch actions and reduced-motion feedback.
Keep prototype acceptance separate from production tests and independent production review.

## Completion evidence

Production implementation is complete with 74 focused/affected tests passing across six chart suites. The first six public regressions were observed failing before implementation. They established interval callbacks, final-boundary membership, shared frames, equal outlier identities after reorder, Box touched selection without a median dot, and ID validation. Further coverage verifies controlled ownership, retired intervals, zero-height bins/boxes, touch hold/source cancellation, and precomputed summary/outlier payloads. Native inspection and full validation are recorded below.

The applied visual direction reuses the accepted prototype: accent and series colors, `--wcl-text` cue contrast, existing surface/grid/text-muted tokens, existing chart axis and reading typography, and unchanged chart/caption/control layout. Histogram frames share exact numeric borders; dashed inset outlines mark readings. Box summaries use the same outline plus whiskers. Outlier circles retain filled centers and selection rings. Activation uses the established 620 ms pulse with reduced-motion static feedback. Light/dark, forced-color, compact and native input states require inspection.

### Validation

- `npm run check` passed: formatting, code/style lint, typecheck, 634 tests in 39 files,
  generated-doc drift, TypeScript 5/6/7 public-example matrix, and chart bundle isolation.
- `npm run showcase:build` passed. Its existing large-chunk advisory remains.
- `npm run verify:package` passed packed SSR, hydration, types and browser builds with React 18.3.1 and 19.2.8.
- Native Chromium on the production showcase selected adjacent histogram bins and activated a bin's
  source records independently. It selected a summary by dragging across its box edge, visited and
  activated an outlier by keyboard, and held a summary to open its details while retaining selection.
- Inspected selection/shared edges and inset readings in dark/light, box and outlier meanings,
  forced-color frames, compact layout without page overflow at 480 px, and reduced-motion static
  activation. Inspected chart role, keyboard shortcuts, selection instructions/list, callback details,
  and complete tables. Repeated the supplied adjacent-bin overlap flow in the collaborative browser.
  Screenshots were inspected and removed; none are retained as completion artifacts.
- Canonical contract guidance and generated histogram/box-plot guides now document required stable
  outlier IDs, statistical payloads, geometry and gestures. Shared reading guidance in scatter/bubble
  guides was regenerated. The showcase includes controlled selection and independent details;
  generated contract examples demonstrate uncontrolled selection.

### Review

Independent intent review passed with no findings. Engineering review identified an unchanged-center
geometry cancellation defect: changing a single bin's explicit X domain resized its rectangle
without invalidating a pending hold or drag. The focused regression reproduced the unwanted touch
activation. Gesture identity now includes projected bounds and whiskers. All 634 tests and the full
repository/showcase/package checks pass after the correction. Native Chromium held a bin, changed
its width from 755 to 378.75 px with its center fixed at 476.875 px, and observed no activation or
selection. It also observed the drag preview clear on the reverse domain change without a commit.
The resulting interface was inspected. Engineering correction review passed with no findings. The initial intent review remains passing;
the correction preserves the accepted cancellation contract. There are no unresolved blockers or
judgments. Parent Ticket 22 stays open.
