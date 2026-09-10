# Compact chart layout audit

## Question and scope

Which production charts apply existing space-saving techniques consistently, and which compact
layout defects should be fixed before extending the accepted line-chart exploration behavior?

This is a bounded source and browser audit, not production verification or a prototype redesign.
The approved pan/zoom study remains unchanged. No agents or production regression tests were run.

## Findings

Four defects require follow-up. Ordinary showcase fixtures do not expose all of them; crowded
fixtures using unmodified production components do.

| Finding                                                                  | Evidence                                                                                                                                                                                                                              | Next work                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Continuous axes skip label crowding treatment                            | A 12-month time axis at a 360px viewport has six overlapping label pairs. A numeric axis with 12 six-digit ticks has 23 overlapping pairs at that width and still overlaps at 768px. Categorical months use two rows without overlap. | Ticket 22                                                          |
| Box plots calculate staggering but do not render it                      | Six long group names grow the canvas to 590px, but every tick stays on one row and is shortened. The layout reports that staggering is needed; its Axis invocation omits the setting.                                                 | Ticket 22                                                          |
| Vertical-axis titles extend outside the canvas                           | At a 320px canvas, the Revenue title extends 6px left of its SVG boundary and is clipped. The shared renderer places rotated titles at a fixed coordinate while increasing the SVG font to preserve readable screen size.             | Ticket 23                                                          |
| Radar dimension labels shrink below the other charts' readable text size | Existing showcase examples render dimension labels at 7.33 CSS pixels at a 360px viewport and 6.93px at 768px. Cartesian/statistical ticks in the same showcase remain about 14px.                                                    | Focused radar layout follow-up; preserve approved interaction cues |

The timestamp mismatch found earlier belonged to the exploration fixture's local formatting.
It is not evidence that production converts every application's dates incorrectly. Production
uses UTC scales; applications' formatting must agree with the intended date meaning.

## Source evidence

- [Cartesian crowding input](../../../src/charts/cartesian-chart.tsx#L1767) supplies labels only
  for categorical horizontal axes. Time and numeric axes pass no labels to the metrics.
- [Presentation metrics](../../../src/charts/cartesian-chart.tsx#L469) estimate label width,
  choose staggering, preserve readable font size and allocate a larger scrolling canvas.
- [Axis rendering](../../../src/charts/cartesian-chart.tsx#L537) accepts staggering and shortens
  categorical labels. The rotated vertical title uses a fixed x coordinate near line 644.
- [Box metrics](../../../src/charts/statistical-chart.tsx#L1740) receive group names, but the
  [box Axis call](../../../src/charts/statistical-chart.tsx#L2248) does not pass staggerLabels.
- [Radar compact layout](../../../src/charts/radar-chart.tsx#L567) depends on width and height.
  [Dimension labels](../../../src/charts/radar-chart.tsx#L1047) shorten long names in compact mode.
  [Radar font rules](../../../src/styles.css#L6893) set SVG font sizes, which still shrink with
  the viewBox. The browser measurements above include that transformation.

## Coverage and intentional differences

The production showcase contains 16 rendered chart examples covering 14 chart types. Examined
at 360px and 768px viewports in Chromium, with a 1000px viewport height and America/Denver time.
Showcase chart containers were approximately 278px and 416–426px wide respectively. These are
simulated narrow and wider foldable layouts, not measurements on a physical Fold 7.

| Family                              | Current fitting behavior                                                                              | Assessment                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Line, area, column, mixed Cartesian | Readable fonts, categorical staggering/shortening and local horizontal scroll                         | Continuous-axis gap confirmed; default small fixtures show no tick collisions                         |
| Horizontal bar                      | Shortened category labels and label-width-based left margin                                           | No tick collisions in the existing fixture; vertical title shares Ticket 23                           |
| Scatter, bubble, histogram          | Shared numeric projection and axis renderer, fixed requested/default tick count, minimum-width scroll | Same continuous-axis crowding omission; ordinary fixture values happen to fit                         |
| Box plot                            | Computes group-name crowding and canvas width; shortens rendered names                                | Staggering setting is dropped                                                                         |
| Pie and donut                       | Category pagination, compact/stacked layout, wrapped and bounded legend                               | These are appropriate differences from axis staggering; no new defect confirmed in inspected fixtures |
| Radar                               | Compact label shortening, responsive legend placement, local scrolling                                | Dimension labels become too small after SVG scaling                                                   |
| Heatmap                             | Compact grid cells, shortened headers, local grid scrolling, suppressed cell values when dense        | Appropriate grid-specific behavior; hidden headers are not equivalent to skipping time ticks          |
| Sparkline                           | Axis-free compact trend with caption and reading cues                                                 | Axis-label staggering is not applicable                                                               |

The browser inventory measured tick intersections and local overflow across all 16 examples.
Visual inspection focused on the box, radar, heatmap, pie and crowded continuous-axis cases.
Horizontal scrolling at a width below a component's configured minimum is an existing fallback,
not itself a defect. The sampled roots kept overflow within their chart frames. This does not
close the separately noted exploration-host page scroll issue or prove every combination of
legend content, visibility, locale, theme and embedding size is correct.

## Reproduce the crowded cases

[Source fixture](compact-layout-probe/main.tsx) imports unmodified production LineChart and BoxPlot.
It compares 12 categorical months, 12 UTC months, 12 large numeric ticks and six named box groups.

```sh
npx vite .work/chart-interaction-composition/research/compact-layout-probe --host 0.0.0.0 --port 5187
```

Open the local page at 360px and 768px viewport widths. Compare horizontal tick rows, pan the
local scrollbar to see all categories, and inspect the left edge of vertical-axis titles.
This diagnostic fixture is not an alternative UI proposal or an acceptance source.

## Implications

Fix shared axis fitting and vertical-title placement before treating chart exploration as ready
for production. Use existing space-saving techniques before reducing label density. Preserve
unambiguous dates and numeric values, item positions and selection identities. Different chart
families may need different geometry; they should not silently omit an applicable technique.

Radar needs a focused follow-up on rendered text size and plot allocation, with its accepted
hover, filled dots, selection underlines and activation motion preserved. Cross-chart exploration
applicability and public range contracts remain planning work.

## Resolution

The findings above describe the pre-fix source and measurements. Tickets
[22](../tickets/22-consistent-axis-label-fitting.md),
[23](../tickets/23-visible-axis-titles.md) and
[24](../tickets/24-readable-radar-labels.md) deliver the fixes with passing production
validation and independent intent/engineering reviews. Their completion evidence records the
final measurements. The sampled-scope limitations above still apply.
