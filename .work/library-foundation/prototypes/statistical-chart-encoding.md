# Statistical chart visual encoding prototype

## Question

Should statistical marks use translucent or solid series-color fills?

## Possibilities

- **Translucent marks:** Series color fills points, bubbles, bins, quartile boxes, and outliers at
  30% opacity. Marks underneath remain visible.
- **Solid marks:** The same series color fills each mark at full opacity.

The comparison keeps exact coordinates, area-scaled bubble magnitude, contiguous histogram bins,
box-plot statistics, the accepted role-aware palette, and one chart reading boundary fixed.

Bubble area is proportional to stored energy, rather than compressed by a fixed radius offset.
Compact regions compensate point radii for SVG scaling so scatter marks remain visible and directly
targetable instead of shrinking in lockstep with the plot.

## Compact design plan

- Colors use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`,
  `--wcl-border`, and the existing role-aware chart series tokens.
- Chart titles use the library body face at 1rem and 700 weight. Axes and readings use the utility
  face at the chart's accepted 14px rendered floor.
- One plot owns the page's visual weight. Controls remain in a quiet band above it. Readings use the
  delivered viewport tooltip and hidden polite announcement, and appear only for a directly hovered
  mark, a retained direct touch, or keyboard reading.
- Direct mark reading mutes every other mark. Legend hover or focus temporarily emphasizes one
  group; legend click pins that group. A pinned group is painted and hit-tested above other groups
  so it wins when marks overlap. Geometry does not animate.
- The signature element is a measurement rail. Histogram boundaries, box whiskers, and medians use
  deliberate connected strokes instead of treating each statistic as an unrelated decoration.
  Box-plot tails stop at Q1 and Q3; no whisker crosses the box, leaving only the median inside it.

This plan preserves the chart family's current typography, palette roles, tooltip hierarchy,
responsive canvas, and single keyboard boundary. It does not introduce gradients, decorative
motion, jitter that changes coordinates, or application-level chart containers.

## Run

```text
npx vite .work/library-foundation/prototypes/statistical-chart-encoding --host 127.0.0.1
```

Open the printed local URL. The guide above the plot explains what every mark means, including the
loop shapes in scatter and bubble charts. Compare Translucent marks and Solid marks for every chart
type. Exercise light and dark appearance, wide and compact regions, overlapping points, direct mark
hover, legend hover and pinning, keyboard arrows, Home, End, Escape, touch retention, and Identify
regions.

## Status

The first comparison was inconclusive. It used the vague labels "Structure-led" and "Solid fields,"
did not explain that shape and color both identify the turbine loop, and described each chart with
statistical jargon instead of teaching the reader how to read it.

The next revision still diverged from the accepted charts. It added a visible reading below the
plot, invented tooltip styling, omitted scaled axis ticks, left the last pointer reading above later
marks, and described opaque neutral point centers as if they revealed overlapping marks. That
evidence is also invalid.

The current revision uses the delivered chart axis rails, tick marks, tick labels, axis labels,
viewport tooltip, definition-list values, hidden polite announcement, keyboard boundary, touch
retention, and legend semantics. Both treatments now use series-color fills; only opacity changes.
Box plots use separate series colors, and summaries and outliers are independent reading targets.
Whitney accepted translucent marks for production. The solid treatment remains only as comparison
evidence. Production must preserve the recorded behavior and visual decisions through the existing
Cartesian chart architecture rather than copying prototype-only structure or measurements.

Direct Chromium operation covers 32 combinations of chart type, treatment, region size, and
appearance. A tooltip appears only over a direct mark and clears in blank plot space or on exit.
Direct reading mutes every other mark. Group-level legend emphasis and pinning work independently;
the pinned group receives paint and hit-test priority at identical coordinates. Keyboard reading,
Escape clearing, retained direct touch, independent box-summary and outlier readings, reduced
motion, forced colors, and a 390px viewport pass without console errors or document overflow.

Accepted as planning evidence for Ticket 20.
