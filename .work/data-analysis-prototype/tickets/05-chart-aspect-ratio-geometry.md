# 05 Make chart aspect ratios shape the plot

**What to build:** Let a public chart aspect ratio change usable plot geometry without leaving a fixed-proportion drawing centered inside a differently shaped canvas.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

The first comparison layout used `aspectRatio={3}`. Its chart container was wide, but the drawn plot occupied a much narrower central region. This contributed to the unused space in Whitney's screenshot.

Cartesian charts apply the requested aspect ratio to the canvas through CSS while retaining an SVG viewBox based on 640 × 360 coordinates, except for extra categorical height. The SVG retains its default aspect-preserving fit. A wide canvas therefore changes the space around that fixed-proportion drawing. Statistical charts use the same fixed viewBox approach.

The revised client keeps charts near the library's native ratio and fills the analysis pane's width. Short panes scroll locally. This avoids an oversized drawing without changing library styles. The client cannot make an arbitrary short, wide plot use its canvas through a public geometry option.

## Acceptance

- [x] Changing the public aspect ratio changes the usable plot's proportions instead of adding aspect-fit margins around a fixed-proportion plot.
- [x] Markers, readable labels, stroke widths, pointer coordinates, and touch targets retain their intended sizes and behavior.
- [x] Axis titles, tick labels, category overflow, selection, exploration, and tooltips remain aligned after resize.
- [x] Check a short wide comparison and a narrower, taller chart using the same data. Cover Cartesian and statistical chart families sharing this behavior.
- [x] Update affected chart contracts and rendered showcase examples.

## Accepted sources

- [Approved library fix specification](../spec.md).

- [LineChart contract](../../../docs/components/line-chart.md).
- [ScatterChart contract](../../../docs/components/scatter-chart.md).
- [Cartesian chart renderer](../../../src/charts/cartesian-chart.tsx).
- [Statistical chart renderer](../../../src/charts/statistical-chart.tsx).
- [Prototype design](../design.md).

## Implementation evidence

Cartesian and statistical renderers derive SVG height and plot bounds from the public aspect ratio. Axis label layout uses that height. Default canvas proportions now agree with the existing 640 by 360 drawing. Point radius and stroke scaling remain tied to canvas width. Focused coverage checks wide and square geometry for line and scatter charts without stretching markers. The rendered `ChartApplicationGeometryExample` supplies both proportions for each family; the parent change wires it into the showcase.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
