# Responsive chart sizing prototype

## Question

Can one content-aware sizing rule use the available chart region, category count, and legibility
limits to size chart typography and marks together, while reserving local scrolling for data that
cannot fit at the minimum readable size?

## Possibilities

- **Content-aware:** Chart type, marks, points, labels, margins, and hit tolerance share a bounded
  presentation scale. Every categorical label remains visible. Labels use one row when they fit,
  alternate between two rows when that resolves collisions, and make the canvas overflow when two
  rows cannot fit. Four-category showcase data fits from 320px through wide regions without local
  scrolling.
- **Current hybrid:** A fixed 640 by 360 coordinate model scales some SVG geometry while
  non-scaling strokes and breakpoint-specific type corrections remain fixed or counter-scale.

The tooltip stays in a fixed viewport overlay in both comparisons. It never belongs to the local
scrolling region.

## Authority boundary

The artifact renders the production LineChart. Its shared reading needle, value nodes, tooltip
content and placement, reference annotation, legend, colors, keyboard behavior, and touch behavior
remain authoritative from the accepted chart implementation. Prototype code owns only the
available-width calculation, categorical label rows, overflow threshold, proportional presentation
sizes, and experimental line hit stroke.

## Run

```text
npx vite .work/chart-interactivity/prototypes/responsive-chart-sizing
```

Open the local URL, drag **Available width**, switch among 4, 8, and 16 categories, and compare
**Content-aware** with **Current hybrid**. Hover close to either line to inspect the proportional
hit area and pointer-following tooltip. Switch appearance and use **Identify regions** when naming
feedback.

## Decision evidence

- At 320px, 4 categories must fit without local scrolling and retain readable labels.
- Every existing showcase example must fit its specimen without local scrolling.
- Additional width may enlarge type and marks within bounded limits, then gives the plot more room.
- Increasing data density preserves every categorical label, adds a second label row when needed,
  and introduces local scrolling when both rows reach their legible spacing limit.
- When scrolling is unavoidable, only the chart canvas scrolls. The tooltip remains outside it.
- Leaving a line clears its direct series emphasis while the production shared reading remains
  active across the plot. Leaving the plot clears the pointer reading.
- The accepted line hit target is three times the rendered line width. This adds one full rendered
  line width of tolerance on either side and keeps the acquisition area proportional as the chart
  changes size.
- The lower categorical row keeps a modest gap from the X-axis label without moving the production
  axis label or adding blank frame padding.
- When dense content requires local scrolling, the production chart uses ScrollRegion's labeled,
  keyboard-focusable native-region semantics and transient scrollbar treatment. The prototype does
  not replace that production component contract.

## Acceptance

Accepted after direct review. The content-aware comparison, alternating label rows, overflow
threshold, lower-row spacing, and three-times-line hit target are binding. Production reading,
tooltip, legend, annotation, color, keyboard, and touch behavior remains authoritative and must not
be replaced by incidental prototype behavior.
