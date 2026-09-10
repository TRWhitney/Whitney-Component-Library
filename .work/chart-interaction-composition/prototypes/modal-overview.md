# Modal overview access

## Approval

Whitney approved this design with "Looks good, I prefer this" after choosing the icon-only trigger and the correction to touch dragging. This contract replaces the earlier disclosure and separate expansion access patterns for all demonstrated chart types. Other navigation approvals remain valid.

## Accepted behavior

Use the existing quiet IconButton beside zoom/reset, with an accent window icon and Overview as its accessible label and tooltip. Whitney requested an icon-only trigger matching the adjacent controls.
Open the existing Dialog directly. Its content is Overview, the current range, the full-data
reference, Reset view and Done. Closing keeps the adjusted range and restores trigger focus.
Horizontal charts retain horizontal strips; scatter, bubble and heatmap retain rectangular maps.
There is no disclosed duplicate overview or second expand action.

Retain the established canvas, surface, border, text and muted-text tokens, accent `#2878ff`,
and series-2 orange. Body text and controls use the library body face; ranges and axis values use
its utility face. The page heading is 1.5rem; the Overview icon and target match the neighboring controls.
The range and control row stack on narrow screens above the plot. The window icon is the only new
visual cue. Existing dialog and range motion retain reduced-motion behavior. This uses the existing
chart language and dialog, without explanatory sales copy or a new control style.

## Source and operation

[Source and controls](modal-overview/shared.tsx), [monthly charts](modal-overview/monthly.tsx),
[scatter/bubble](modal-overview/points.tsx), [remaining charts](modal-overview/remaining.tsx),
[styles](modal-overview/styles.css), [build adapters](modal-overview/vite.config.ts).

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/modal-overview --config .work/chart-interaction-composition/prototypes/modal-overview/vite.config.ts --host 0.0.0.0 --port 5189
```

The single chart-type control includes all eleven variants. It reloads the disposable fixture when
switching charts. Light appearance and Identify elements are available on their own row.
Existing fixture data, selection, activation and touch navigation are reused from the accepted
studies. This is isolated prototype code, including its visibility and viewport adapters.

Opened the dialog for line, scatter, bubble, histogram, box and horizontal bars and heatmap at
390px. Operated window keyboard movement and Done. Dragged the window for area, grouped and
stacked columns, mixed columns/line, heatmap and scatter; ranges changed and Done returned focus to
Overview. Inspected compact dark charts and dialogs, plus a wide light line chart and dialog.
Horizontal strips remain short; map proportions stay intact. Hidden series follow production eyes
in both the main chart and overview. No production changes, regression suite or subagent reviews.

## Direct dragging

Touch dragging left the map's 180ms transition enabled because the browser did not apply `:active`.
The overview now marks the actual gesture from pointer-down through release or cancellation.
Window movement and resizing have no transition during that gesture; keyboard and reset animation
remain. The same correction covers the monthly, point and remaining-chart overview adapters.
