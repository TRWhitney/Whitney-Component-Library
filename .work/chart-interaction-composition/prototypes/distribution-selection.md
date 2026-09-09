# Histogram and box-plot selection prototype

Status: accepted. Whitney confirmed the revised prototype with "Looks good to me."

## Decision

For box-plot rectangle selection, compare Box touched with Median inside. The latter requires the
center of the median line to be inside the rectangle. Histogram bars use the approved rectangle
intersection behavior. Outlier dots use approved centers-inside selection. A box/whisker target is
one group summary; an outlier target is one exceptional value, not the whole group.

## Design plan

Use existing canvas, surface, text, muted text, border, and series-1/series-2 tokens. The study
heading is 1.5rem, explanations 0.9375rem, and utility labels 0.75rem. One real chart fills the main
view, with each segmented control on its own row and reading/selection/details below. Selection
frames follow the statistical box and whiskers; outliers retain rings and filled reading centers.
Brief activation pulses acknowledge opening details, with static feedback for reduced motion.
No whole-chart focus outline. Preserve chart meanings, existing colors, and complete data tables.
This extends approved frame and point cues; it introduces no new color meaning or point fill.

## Run

`npx vite .work/chart-interaction-composition/prototypes/distribution-selection --host 0.0.0.0 --port 5179`

Open <http://localhost:5179>. Source is a disposable DOM adapter around real Histogram/BoxPlot.
Pre-binned restart counts and explicit loop summaries are local demonstration data. This evaluates
interaction, not production callback types or raw-observation identity. No agents or test suites.

## Review flow

Try histogram selection and modified activation, then switch to Box plot. Select a summary and an
outlier separately. Drag through a box edge to exercise the accepted Box touched behavior.
Try touch hold, keyboard navigation, light/dark, compact width, and Identify elements.

## Direct observations

Native Chromium operation selected the 80–120 ms histogram bin and opened its 8-restart detail
with Control-click. The same drag through the left edge of the North box selected nothing with
Median inside and selected North loop summary with Box touched. Clicking the 100-minute outlier
added that distinct target. Touch hold opened its details while retaining selection. Home then
Right visited the first outlier after its group summary. Inspected summary frames, median reading
centers, and outlier rings in dark/light and compact layouts. Identify elements reported Box drag
inclusion. No agents or automated test suites were used. These are prototype observations, not
production acceptance or verification. Callback identities for raw and precomputed distributions
remain production planning work after the interaction choice settles.

## Shared-edge correction

Histogram frames originally expanded into neighboring bins, repeating the overlap defect already
resolved for bars. The adapter now uses the existing frameBar shared-edge geometry for selection
and activation frames. Native operation selected the adjacent 40–80, 80–120, and 120–160 ms bins
and hovered the last one. The initial inspection did not establish the correction: subsequent user feedback reproduced
the overlap. getBBox rounded adjoining edges differently, beyond frameBar's equality tolerance.
The adapter now reads exact SVG rectangle attributes. Native operation repeated the two adjacent
selections from the supplied screenshot. Both frames now meet at x=246.66666666666666 with no
outset into the neighboring bar; the resulting screenshot was inspected. This is a prototype correction; no agents or test suites were used.

## Chosen behavior

Whitney chose Box touched for summary dragging. Its ordered layout makes touching a box more
appropriate than requiring its median center to be inside the drag. Histogram bins retain
rectangle intersection; separate outlier dots retain centers-inside selection.

Remove the reading dot from the median. The inset outline alone communicates the summary reading,
following the histogram/frame language. Keep the actual median line as data. This replaces the
previous median-center cue in the study. The prototype now opens on Box plot with Box touched.
Median inside was rejected and its comparison control has been removed from the retained artifact. Existing click selection, independent
activation, touch hold, and shared histogram edges retain their accepted behavior.

Native operation confirmed Box touched is selected on load. Hovering North's box showed the
inset reading outline with no median dot, and dragging through its left edge selected its summary.
The rendered cue was inspected. No agents or test suites were used.

## Accepted contract

Histogram drag selection includes intersected bin rectangles. Box-plot drag selection includes a
summary when its central box touches the rectangle. Separate outliers use centers-inside selection.
A summary and an outlier are separate targets. The summary reading uses the inset outline and
whisker cues, without a dot on the median. Keep the actual median line as data. Selection uses
frames for bins/summaries and rings for outliers; an outlier reading retains its filled center.

Click/tap toggles selection. Control/Command-click and touch hold activate without changing
selection; ordinary activation applies when selection is disabled. Enter/Space selects, with
Control/Command for independent activation. Arrow navigation reaches summaries and individual
outliers. Drag replaces selection, Shift/Control/Command adds, Alt removes, and Escape cancels.
Activation gives finite feedback, with static acknowledgment under reduced motion. Preserve the
reviewed dark/light and compact treatment and avoid a whole-chart focus outline.

Histogram frames share exact adjoining edges and keep inner reading outlines visible. Preserve
the corrected SVG-coordinate handling in any retained adapter. Production must preserve the
result, rather than the adapter technique. Segmented comparison controls occupy separate rows.

The local fixtures, DOM adapter, and comparison controls are flexible implementation details.
Median inside is a rejected alternative. The production callback and identity boundary is now recorded in [ticket 08](../tickets/08-distribution-interaction.md).
