# Chart exploration study

The later [modal overview contract](modal-overview.md#accepted-behavior) replaces the disclosure
and separate expansion access described in this historical study. Other accepted behavior remains binding.

Status: Whitney approved pan and zoom behavior for this line-chart type. Other chart families,
production implementation, and the compact-layout consistency defects remain pending.

## Accepted pan and zoom contract

Whitney: "I approve of the pan and zoom behavior for this chart type."

This approval covers the demonstrated LineChart with a continuous time axis:

- Two fingers pan or pinch to zoom directly on the chart, without switching interaction modes.
- One-finger selection and press-and-hold activation remain available. Starting two-finger
  exploration cancels pending selection/hold, and releasing fingers does not change selection.
- Attached zoom, reset and earlier/later controls change the visible time window. Reset restores
  the full data range; the value axis fits the visible data.
- Overview starts collapsed behind the existing Disclosure. Its window pans the range and its
  edges resize it, with the demonstrated pointer and keyboard operation.
- Selection retains its item identities when months leave the view or the range resets.

Retain the current runnable source as the behavioral reference. Fixture values, exact minimum
window, DOM adapters and implementation technique are flexible. This approval does not accept
known layout defects or extend behavior to other chart families. Public range callbacks, fixed
application bounds and wheel behavior remain unresolved.

## Current direction

Zoom out/in/reset sit at the plot's upper edge beside the visible period. Earlier/later arrows
sit at the time-axis ends. The Overview disclosure opens the existing movable/resizable overview window
below the chart, matched to the plotted width; it begins collapsed. The overview uses the existing Disclosure component, titled Overview, with its standard heading,
trigger, rotating chevron and labeled panel. Its chevron uses the existing accent rail color.
The primary Button choice was rejected as inappropriate for revealing optional content. Controls follow measured axis edges,
with pan arrows beside the Month label and less reserved space above and below the plot.
Controls render in the chart host outside the clipped chart frame, so their hover backgrounds
and focus outlines are not cut off at the canvas boundary. The previous detached toolbar and Select / Move comparison
were removed. One-finger tap/drag retains selection, while two fingers directly pan or pinch the
main chart. The second finger cancels pending selection/hold and clears its reading; remaining
finger release cannot select. Keyboard chart selection and overview/control keyboard paths remain.

## Design

Reuse chart point fills, category underlines and activation pulse, with existing canvas, surface,
text, muted-text and border tokens. Blue #2878ff and the existing orange cost line retain identity.
The 1.5rem heading explains the study; utility text names the period and overview. The overview's
window transitions briefly for button/key changes and tracks dragging directly. Opening it fades
in briefly, with reduced motion. Main geometry updates directly; general data-transition motion
remains a later slice.

## Operate

```sh
npx vite .work/chart-interaction-composition/prototypes/domain-exploration --host 0.0.0.0 --port 5186
```

Open <http://localhost:5186/>. Pinch or move two fingers together on the main chart. One finger
selects, and press-and-hold opens details. On desktop use the zoom/reset and earlier/later controls.
Open Overview to drag its window/edges or choose a range outside it. Focus an edge/window
and use arrows; Shift moves three months. Light appearance and Identify elements remain available.
The initial view contains six months of a 24-month fixture; zoom preserves at least three months.
Selection persists outside the view and through reset. Full monthly values retains all data.

## Direct operation

Operated native touch pinch, two-finger pan, one-finger selection, zoom/reset, overview disclosure
and keyboard edge adjustment at 360px, 420px and 800px viewport widths. Pinching and panning keep
selection unchanged. Inspected dark/light screenshots and date-label bounds. The fixture dates and tick formatting both use UTC, matching the chart time scale. Monthly
ticks align to the actual observations. Measured label spacing tries all labels in one row, then two staggered rows, before reducing
density. It keeps both endpoints and moves selection underlines with their label rows. The
axis title, arrows and disclosure reserve space for the second row. Layout follows geometry changes. The time
axis uses the exact visible interval. These are simulated viewport sizes, not a physical Fold 7.
The latest control revision was also operated at 1390px and 360px: zoom, both pan arrows, reset,
overview open/close and keyboard edge movement. Inspected the aligned controls and expanded strip
in dark and light appearance. Scoped fixture-table CSS to avoid affecting the chart
accessibility table at narrow widths. The clipping fix was operated at 1390px and 360px, including arrow hover, zoom/pan, and
overview open/close. All five navigation buttons received pointer hits near their top and bottom
edges outside the clipped frame. The replacement Disclosure was opened and closed at both widths, with keyboard edge adjustment
inside the panel and dark/light visual inspection. The panel stays aligned with the plot.
The corrected month labels were operated in America/Denver browser time at 360px, 420px and
1000px, with six-month, Mar–Nov 2026 and full 24-month windows. The later staggering revision preserves all six labels in the six-month view and all nine
in the Mar–Nov view at 360px. The full 24-month view fits seven labels across two rows
instead of three. The labels retain their correct date positions. The prior local-time formatter shifted UTC ticks into the
previous month; the prior low tick count also left the full range with only one label.
No agents or production tests were used.

## Boundaries and follow-up

Uses production LineChart with an isolated stable data filter, capture-phase touch adapter,
rendered-label adapter and overview. Selection uses stable month IDs on a continuous time axis.
The synthetic reading dismissal and DOM label thinning are prototype techniques, not proposed
public implementation. Wheel navigation, fixed app bounds, other chart families and the public
range callback contract remain unspecified. The fixture and minimum window are flexible. A residual narrow-page scroll extent from the
chart host remains for the compact-layout audit; the visible controls and overview fit within
the viewport.

Whitney noted that earlier chart reviews did not consistently cover compact widths. A broader
chart-family audit must check axis/legend labels, control access and overflow at narrow and wide
foldable layouts, including previously iterated pie/donut charts. Do not assume this prototype
fix proves the production charts are compact-safe.

The production Cartesian layout only supplies categorical axis labels to its crowding metrics.
Time axes therefore miss automatic staggering. This confirmed consistency defect and an audit
of related label-layout techniques across chart families are tracked in [the map](../map.md).
The prototype adapter does not resolve that production defect.
