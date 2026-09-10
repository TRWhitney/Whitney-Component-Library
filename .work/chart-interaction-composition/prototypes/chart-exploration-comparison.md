# Pan and zoom across chart types

## Decision

Does the approved line-chart navigation work for area, grouped columns, stacked columns and
columns with a line, with the overview drawn in the corresponding chart form?

Whitney requested one combined prototype for this phase. This study offers all four forms and a
line reference in one chart-type RadioGroup. It preserves the viewport and selected month IDs
when switching. Whitney approved this group after the selection-preview and control-stacking corrections.
The behavior below is binding for the demonstrated horizontal monthly exploration.

## Applied design

Retain the accepted line study's plot-attached zoom controls, axis-end movement arrows and
collapsed-by-default Disclosure overview. Use existing RadioGroup choices on their own line.
The overview's line, area or column shapes distinguish the selected chart type. The fixture
names two additive revenue streams so stacking has a coherent meaning.

Use the existing canvas, surface, text, muted-text and border tokens, plus accent `#2878ff`.
Body typography uses the production body face; chart labels and dates use the utility face at
14 rendered pixels. Keep the shared production selection and activation cues. Overview movement
retains the accepted 180ms transition and reduced-motion treatment.

The chart uses a 16:9 canvas to fit the SVG proportions. The previous study's 3:1 setting reduced
its drawn plot and text at wide widths. A prototype-only month-label adapter uses exact UTC date
positions and staggered rows before reducing density. Edge labels stay inside the canvas. This
adapter is not a proposed public API or a replacement for the delivered production fitting fixes.

## Accepted behavior

- Zoom and pan move through whole months. Column groups remain complete at viewport boundaries.
- The vertical scale fits the currently visible months; stacked columns fit their sums.
- Each chart retains its production selection marks, click activation and legend focus.
- One-finger interaction selects or holds to activate. Two fingers pan or pinch without changing
  selection. Desktop dragging selects; Control/Command-click activates.
- The overview starts closed. Its window, edges, outside-range drag and keyboard controls update
  the same viewport. Selection persists outside the visible range.
- Light appearance and element identification are available in the same preview.

## Operated artifact

[Source](chart-exploration-comparison/main.tsx), [styles](chart-exploration-comparison/styles.css).

From the repository root:

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/chart-exploration-comparison --host 0.0.0.0 --port 5186
```

Direct browser operation covered all five choices, zoom/reset, range selection, Control-click
activation, two-finger pinch and pan, overview range/edge dragging and keyboard movement.
A first touch hold opened details without selecting.
Selection remained unchanged during pinch. Inspected dark mobile and light wide renders at
390px and 1100px; neither root overflowed horizontally. The full mobile range displayed eight
month labels in two rows, with all six months retained in the initial window. Screenshots were
inspection aids and are not retained. No agents or production tests were used for the prototype.

## Limits

This compares horizontal monthly exploration. Horizontal bars, histogram/box windows, scatter
and bubble two-axis navigation, and heatmap navigation remain separate decisions. Wheel gestures,
application bounds, range callbacks and production integration remain unspecified. The retained
approved line study is unchanged. The label and touch adapters are isolated prototype techniques.

## Selection and control fidelity correction

Whitney reported missing column month underlines, absent live drag previews and zoom buttons
losing hover/click response. The pan/zoom semantics themselves were reported to work well.
The original prototype checks observed committed selection, but missed its mid-drag appearance
and the control stacking order after chart-type switches.

The prototype no longer hides production category selection marks or creates committed-state
replacements. It positions production's own marks beneath the fitted month labels for every
chart type, including live replacement previews while dragging. A dedicated stacking level keeps
the zoom controls above the chart drawing after type changes.

Direct browser operation at 390px covered all five types with a previous selection outside a new
drag range. During the drag, only the pending months were underlined; release retained those same
marks. The grouped-column staggered-row preview was visually inspected. Both zoom buttons kept
pointer targeting and changed the window after each type switch. A wide 1100px hover/click also
worked. This was a prototype correction, with no production changes, agents or regression suite.

## Acceptance

Whitney's "looks good" accepts the corrected artifact. Bind the demonstrated controls, collapsed
overview, month-preserving viewport, selection retention, live replacement preview, activation,
touch separation, responsive labels and themes. Fixture values and the isolated DOM/touch
adapters remain flexible implementation details. The explicit public API is separate work.
