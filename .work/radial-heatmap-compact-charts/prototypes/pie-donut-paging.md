# Pie and donut aggregate-slice prototype

**Status:** accepted

## Question

The prototype resolved these pie and donut choices:

1. Does the bold count sit at the visual center of the pie slice when its angle changes?
2. Should the aggregate keep the earlier smallest navigational size, or should its combined value
   determine its angle by default?
3. Should each page admit 6, 8, or 10 ranked categories before paging?
4. Should legend overflow use the always-visible native scrollbar or ScrollRegion's transient
   scrollbar treatment?

## Accepted decision

The accepted default uses eight ranked categories per page, a proportional aggregate, and
ScrollRegion's transient scrollbar. The aggregate sizing remains consumer-configurable. Consumers
can choose the deliberately smallest aggregate instead. Six and ten categories per page and the
always-visible native scrollbar are rejected.

With more than eight positive categories, page one shows the seven largest categories and the
aggregate. The aggregate angle represents the combined value of every hidden category. Activating
it shows the next eight ranked categories and another aggregate when more remain. Back returns
through prior pages.

## Acceptance contract

### Binding qualities

- Use the standard chart title and description and the existing chart family's reading, state,
  theme, table, focus, reduced-motion, and forced-color conventions.
- Show a bold `+N` on the aggregate slice. In pie mode, place it from the slice's area so it stays
  visually central as the angle changes. Keep it readable at the minimum plot size and let it grow
  modestly as the plot gains room.
- Use proportional aggregation by default. Expose the earlier deliberately smallest aggregate as
  an explicit consumer option. Do not expose the sizing policy in tooltip copy.
- Use eight ranked categories per page. The aggregate occupies the eighth visible place on page
  one. Later pages show up to eight ordinary categories and another aggregate when necessary.
- Activating the aggregate by pointer, touch, Enter, or Space opens the next page. A native Back
  button returns through every previous page. Announce each newly visible category range. Pointer,
  touch, and Back navigation clear the tooltip. Enter or Space reads the first slice on the new
  page.
- Hovering a slice pops it outward, mutes the others, and opens the existing chart tooltip. Pointer
  tooltips follow the cursor and flip at viewport edges. Keyboard and touch tooltips anchor to the
  active slice.
- Hovering or focusing a legend item pops out its slice and mutes the others without opening a
  tooltip. Clicking a legend item pins that state after hover or focus ends. Clicking another item
  replaces the pin, and Escape clears it.
- Ordinary tooltips report the exact value, `Share of total`, and `Share on this page`. The
  aggregate tooltip reports only its hidden category count and combined value.
- Use ScrollRegion's transient scrollbar thumb for legend overflow. Do not add ScrollRegion's
  border, background, padding, rounded container, or outline.
- Treat both available width and height as hard bounds. Short areas keep plot and legend side by
  side, compact the caption, page indicator, Back button, legend text, swatches, gaps, and padding,
  then scroll only the legend if needed. Narrow areas stack only when they have enough height. Keep
  the accepted moderate plot bias rather than prioritizing either chart or legend at every size.
- Keep the donut center total and unit readable as the SVG scales. The unit stays heavier and at
  full text contrast.
- Keep zero records in the complete table but omit their slices. A dataset with no positive values
  uses the empty state. Negative and non-finite values use the chart family's invalid-data behavior.

### Flexible qualities

- Fixture values, prototype controls, query parameters, exact SVG paths, rendering technique,
  centroid formula, plot thresholds, popout distance, transition duration, and exact measurements
  remain implementation details. Production may refine them without changing the binding behavior.

## Prototype boundary

The new radial geometry remains prototype code because no production PieChart or DonutChart exists
yet. Acceptance does not authorize production to copy prototype-only techniques or depart from
existing chart conventions outside the binding qualities above.

## Design plan

The prototype uses the existing canvas, surface, border, text, accent, and six chart-series roles.
It keeps the chart family's body, utility, and caption type roles. The chart and visible-category
key share one size-aware frame. Their arrangement responds to both available dimensions, and the
caption, page indicator, and legend reduce their own density before the legend uses local overflow.
Page changes use a short opacity entry instead of morphing geometry. The dashed aggregate slice and
count distinguish navigation from ordinary data marks in either sizing comparison.

## Run

From the repository root:

```sh
npx vite .work/radial-heatmap-compact-charts/prototypes/pie-donut-paging --host 127.0.0.1
```

The initial view renders the accepted settings. Switch between pie and donut, use the aggregate
sizing option, hover and pin legend entries, hover slices, change appearance and available width or
height, activate the final slice, and use Back to traverse the pages. The page-size and scrollbar
controls retain rejected choices for comparison. Identify regions exposes stable names without
changing the chart layout.

## Checks

```sh
npx vitest run --config .work/radial-heatmap-compact-charts/prototypes/pie-donut-paging/vitest.config.ts
```

The smoke checks exercise remaining-count paging at 6, 8, and 10 categories, both aggregate sizing
modes, the reduced aggregate tooltip, readable donut-center sizing, both legend scrollbar
treatments, legend hover and pinning without a tooltip, radial popout, Back, keyboard activation,
chart kind, appearance, both available dimensions, the complete table, pointer-following placement,
and viewport-edge flipping. Playwright screenshots inspect 300 by
300, 480 by 300, and 300 by 640 chart areas, plus a 375px browser viewport. They establish that the
chart stays inside both bounds, the legend compacts before using local scrolling, and the tall
narrow layout uses the available height. Browser-computed styles confirm that the compact legend
uses 11px text and 12 by 4px pills while the normal layout retains 14px text and 20 by 8px pills.
Browser measurements also confirm that the aggregate count stays near 11px in the minimum chart
area and rises toward 14px in larger chart areas.
They are not production component tests.
