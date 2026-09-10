# Distribution and category navigation

## Question and status

Does the approved compact overview work for fixed histogram intervals, box groups, horizontal
categories and a heatmap grid when windows snap to whole items? The blanket scatter/bubble overview treatment was rejected.
Whitney approved the revised combined study with "looks good, continue" after the horizontal
station strip and Room-label correction. The contract below, including visibility fidelity and
fixed main-chart dimensions, is accepted. The existing horizontal monthly and scatter/bubble
approvals remain binding.

## Accepted behavior

- Histogram navigation moves through fixed 20 ms intervals. It neither recomputes their counts
  nor changes their boundaries. The count axis fits the visible intervals.
- Box navigation moves through whole loop groups. Supplied summaries and stable outlier IDs stay
  unchanged; the value axis fits the visible summaries and outliers.
- Horizontal bars move through whole stations vertically. The value axis fits the visible data.
- Heatmaps move through whole rows and columns. The full-data color domain remains 0 to 30 °C;
  missing cells and zero retain their existing meanings and interaction.
- Histogram and box plot use long horizontal overview strips, following the earlier monthly
  overview. They have two range handles and no popout. Whitney explicitly clarified this direction
  after rejecting the scatter/bubble treatment on these charts.
- Horizontal bars use a fixed-height horizontal overview strip below the chart, with no popout.
  Its left-to-right station order maps to top-to-bottom order on the main chart. The main chart
  keeps fixed dimensions across viewport changes and opening or closing Overview.
- Heatmap retains the centered rectangular map and expanded Dialog. All overviews start closed.
  Move the window, resize handles, click outside to recenter or drag outside to choose a range.
- Production eye controls are enabled for box groups, bar series and heatmap tracks. Hidden
  series disappear from both displays; hidden box groups and heatmap tracks close their gaps in
  the full overview. The production closed-eye restoration controls remain available while
  navigating. Histogram has no series visibility control, consistent with production.
- Keyboard arrows move a focused map window or handle one item at a time. Shift moves two.
- One finger and mouse dragging retain production selection and its live replacement preview.
  Two fingers pan or pinch. Control/Command-click and the first touch hold open details without
  changing selection. Selection survives navigation outside the visible window.
- Switching chart types resets this disposable fixture's window and selection because the four
  charts describe different data. Reset view preserves selection within a chart.

The minimum window contains three intervals, stations or heatmap tracks, or two box groups.
These fixture limits and the short station/room codes are flexible, not public API restrictions.
The box example explores categories, not a cropped numeric value range.

## Source and run instructions

[Source](remaining-exploration/main.tsx), [styles](remaining-exploration/styles.css),
[isolated build adapters](remaining-exploration/vite.config.ts).

From the repository root:

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/remaining-exploration --config .work/chart-interaction-composition/prototypes/remaining-exploration/vite.config.ts --host 0.0.0.0 --port 5188
```

## Direct operation

Operated all four chart choices at 390px and 1100px: zoom, reset, movement buttons, compact map
movement and resizing, map keyboard movement and resizing, expanded dialog and dismissal. Used
mouse rectangle selection, inspected its in-progress frames and drag region, and retained selected
items when moving them out of view. Operated two-finger pan, pinch and first-hold activation for
all four charts. Holds opened details with selection unchanged. Inspected mobile dark and desktop
light rendering. The final full heatmap fits 390px without page overflow. Temporary screenshots
were inspected and removed. No agents or production regression tests were used.

## Prototype boundaries and findings

Production components own selection, activation, hover, statistical summaries and data rendering.
Filtering and touch arbitration are local experimental adapters. No public component source or
showcase was changed in this pass.

The required Vite configuration preserves histogram interval inclusivity from the full fixture,
so a newly exposed last bin does not change identity as the window moves. Production currently
assigns upper inclusivity to the last supplied interval; this needs an explicit full-data model
in the implementation.

The horizontal bar study reserves height for the full 12-station fixture by extending both its
plot bounds and SVG viewBox in the isolated build. The axis title and pointer conversion follow
that enlarged geometry; directly clicking and activating station S10 reached S10. The height no longer depends on visible station count. Changing only aspectRatio adds blank space
around the fixed production geometry. Long station labels also crowded the vertical title in the
first compact fixture; the review fixture uses short station codes. Arbitrary long labels and
responsive vertical category spacing remain production concerns, not declared fixes.

The heatmap's local CSS fits the complete grid into the navigation viewport. Full mobile views
rotate time labels and omit printed cell values when too narrow; reading and details retain them.
This differs from the production heatmap's existing local-scroll layout. Arbitrary application data, empty views, controlled range callbacks and wheel behavior
still need production planning. The experimental adapters are not the proposed implementation.

## Overview correction and visibility fidelity

The initial scatter-style thumbnails and popouts on histogram and box plot are rejected. The
current sources implement Whitney's requested long horizontal strips without popouts. The bar
chart's dynamic height and temporary sidebar layout were also removed.

A [prototype visibility bridge](remaining-exploration/visibility-store.ts) shares state between
production eye controls and overview data. The isolated Vite adapter changes only visibility state
ownership; existing eye rendering, hide/restore actions and chart interaction remain production
code. Hidden groups/tracks remain in the supplied model for production restoration controls while
the viewport windows over the remaining visible items. This is not a new public API.

Directly operated hide/restore for a box group, bar series and heatmap row. The box overview
changed from six groups to five; hiding Supply left only Returned in both bar displays; the
heatmap overview changed from 64 to 56 cells. Restored each using its production eye controls.
Measured the bar SVG at 332 by 289 pixels before and after opening Overview and zooming. Both
measurements stayed unchanged. Histogram/box have no expansion buttons; heatmap retains one.

## Transposed bar overview and heatmap corner

Whitney requested a horizontal bar overview matching the other one-axis strips. The strip is 80px
high; its horizontal window and handles transpose to the chart's vertical station range. Moving
right by keyboard advanced stations 4–9 to 5–10; pointer dragging advanced to 6–11, and moving the
right handle left reduced the range to 6–10. Main-chart navigation and fixed size are unchanged.

The heatmap row-label track now reserves 100px for Room, the closed eye and its hidden count.
The Room text cannot flex-shrink into an ellipsis. After hiding A3 at 390px, the corner's client
and scroll widths both measured 100px, and Room's client and scroll widths both measured 27px.
Inspected both revised mobile views and removed temporary screenshots.
