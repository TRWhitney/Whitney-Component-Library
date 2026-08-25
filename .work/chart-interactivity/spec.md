# Shared Cartesian chart reading

## Problem Statement

The Cartesian charts provide complete static data through a generated table, but their visible
marks and legends do not respond to pointer, keyboard, or touch input. A reader cannot inspect an
exact plotted value without tracing it back to an axis, and overlapping or thin series are hard to
distinguish. The existing generic Tooltip is intentionally a short supplemental description for a
named Button; it cannot express a structured category reading and should not be stretched into a
chart data surface.

## Solution

Give every ready Cartesian chart a chart-owned shared reading interaction. A pointer anywhere in the
plot selects the nearest recorded category rather than interpolating between records. A thin reading
needle and value nodes connect that category to a contained tooltip listing every series label and
its formatted value. Hovering a specific mark may emphasize its series row, but it does not reduce
the shared reading to one value.

Mouse tooltips render in a fixed overlay outside the chart's scrolling frame and follow the cursor
with a small gap. They flip near viewport edges. Moving within one category can therefore move the
tooltip away from marks without changing the reading, and the tooltip cannot create chart
scrollbars. Keyboard and touch readings have no moving cursor, so their tooltip stays anchored to
the selected category through the same viewport overlay.

Provide the same information through a single named keyboard boundary. Focus opens the first
category; orientation-appropriate arrow keys traverse recorded categories; Home and End reach the
endpoints; Escape clears the visible reading without moving focus. A polite announcement conveys
the category and all series values while the existing generated table remains the complete static
alternative. Touch selects and retains a category until another selection or a press outside the
chart dismisses it.

Turn each legend entry into a real button. Hover and focus temporarily emphasize its series. Click,
Enter, or Space pins or unpins that emphasis, and Escape clears it. A pinned series takes precedence
over transient mark hover, but the tooltip continues to list every series. Legend interaction never
hides data or changes the chart domain.

## User Stories

1. As a chart reader, I want to point anywhere near a category and see its exact values, so I do not
   have to acquire a thin mark or estimate from an axis.
2. As a keyboard or screen-reader user, I want one predictable chart boundary and equivalent value
   announcements, so I can inspect the chart without traversing dozens of marks.
3. As a reader comparing overlapping series, I want the legend to emphasize and pin one series, so
   its marks remain identifiable without removing the surrounding context.
4. As a touch user, I want a reading to persist after a tap and dismiss conventionally, so the data
   remains available long enough to read.

## Implementation Decisions

- Shared category reading is the default for LineChart, AreaChart, BarChart, ColumnChart, and mixed
  CartesianChart. There is no public direct/shared mode or configuration required to receive it.
- Selection always resolves to an existing valid datum. It never synthesizes an interpolated value.
- Tooltip rows use the configured label, value formatter, and unit. They include every series plus
  numeric reference lines on the value axis, because those lines have comparable chart-domain
  values. Normalized layouts report normalized shares; stacked layouts report each component value
  rather than cumulative geometry.
- Vertical and category-x plots use Left and Right to traverse categories. Horizontal bars use Up
  and Down because their category axis is vertical. Home and End select the first and last datum.
- The interactive boundary is named from the chart title. SVG marks may remain hidden from assistive
  technology because the boundary announces current readings and the generated table preserves the
  complete static representation.
- The visible tooltip is structured, noninteractive, and owned by the chart. It is not an instance
  of the generic Button Tooltip.
- Pointer departure clears transient reading unless keyboard focus or touch owns the current state.
  A press outside the chart dismisses retained touch reading.
- Legend items remain a semantic list of real buttons. Pinned emphasis outranks transient mark
  emphasis. Neither interaction hides series, recalculates domains, nor emits consumer actions.
- Mouse tooltip placement follows the cursor in a fixed provider-level overlay and flips at viewport
  edges. Keyboard and touch placement uses the selected category as its anchor. No tooltip
  participates in chart layout or scrolling.
- Chart presentation size considers both the available region and the space required by its data,
  labels, and axes. Typography, marks, points, strokes, margins, and interaction tolerance follow
  one bounded scale instead of mixing scaled geometry with fixed strokes.
- Charts preserve every categorical label. Labels use one row when they fit, alternate between two
  rows when that resolves collisions, and make the canvas locally scroll when both rows reach their
  legible spacing limit. Numeric axes may reduce tick density. Every chart example in the component
  showcase fits its specimen without local scrolling. When local scrolling is required, the chart
  uses the same labeled native-region semantics and transient scrollbar treatment as ScrollRegion;
  the tooltip remains in its viewport overlay outside that region.
- A line's pointer target is three times its rendered stroke width, adding one full rendered line
  width of tolerance on either side. Both the visible stroke and its pointer target follow the
  chart's bounded presentation scale.
- Emphasis may use opacity, outline, and line-weight changes over one short transition. Reduced
  motion removes the transition. Plot geometry does not morph.
- Existing series colors, point shapes, and dash patterns remain the identity system. Forced colors
  must retain the needle, nodes, focus indicator, and non-color distinctions.

## Testing Decisions

- Verify nearest-category pointer reading and all-series tooltip content for line, area, bar, column,
  and mixed charts, including direct-mark row emphasis.
- Verify configured labels, value formatters, units, numeric value-axis reference lines, normalized
  shares, stacked component values, invalid-row omission, and loading, empty, and error states.
- Verify one keyboard stop, orientation-appropriate category traversal, Home, End, Escape, accessible
  naming, and polite equivalent announcements.
- Verify touch persistence, category replacement, and outside-press dismissal.
- Verify legend hover, focus, click, Enter, Space, Escape, pinned precedence, and `aria-pressed`
  without hiding a series or changing the domain.
- Verify pointer-following placement, viewport-edge flipping, category anchoring for keyboard and
  touch, and unchanged local scroll geometry in light and dark appearances. Also verify focus,
  forced-colors, and reduced-motion treatments.
- Verify proportional typography, marks, strokes, hit tolerance, margins, and categorical label
  rows across compact and wide regions. Verify every categorical label remains present, showcase
  examples do not scroll, and dense data scrolls only after two label rows reach their legible
  minimum. Verify an overflowing canvas remains a labeled keyboard-reachable native region and
  matches ScrollRegion's idle, active, focused, reduced-motion, and forced-color scrollbar states.
- Retain package build, type, unit, server-rendering, hydration, generated-table, and renderer-bundle
  isolation coverage.

## Out of Scope

- Direct-mark-only reading as a public mode
- Visibility toggles, filtering, selection callbacks, drill-down, or data mutation
- Zooming, panning, brushing, range selection, or coordinated charts
- Replacing the generated data table
- Application cards, dashboards, workflow composition, or other chart-adjacent layout
- Geometry transition animation

## Further Notes

The [accepted prototype](prototypes/chart-reading-interactions.md) records the visual and behavioral
comparison. Its controls, alternate direct mode, explanatory layout, and identify-regions aid are
planning scaffolding and do not enter the showcase. The showcase demonstrates the accepted public
interaction only.

The [accepted responsive sizing prototype](prototypes/responsive-chart-sizing.md) composes the
production LineChart so sizing decisions cannot replace accepted reading behavior. Its controls
and comparison layout are planning scaffolding and do not enter the component showcase.
