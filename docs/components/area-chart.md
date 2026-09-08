# AreaChart

Show magnitude across an ordered domain with overlap, stacked, or normalized areas.

## Use for

- magnitude or contribution across an ordered domain benefits from a filled baseline and any stacking relationship is explicit

## Do not use for

- unrelated series where filled overlap obscures comparison, or data where area would falsely imply accumulation or continuity

## Prefer instead

- Use LineChart when precise trend comparison matters more than magnitude, or ColumnChart for discrete category comparison.

## Composition and parts

- Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional. Supply visibilityLabels and a named legend to enable separate eye controls, including for a single series.
- AreaChart contains a named figure, visible caption, optional feedback, a required multi-series legend, interactive SVG plot, axes, marks, shared reading tooltip, optional annotations, and a generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.

## Content

- Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable. Hiding every series retains the caption, legend, and complete table with the localized allHidden message and Show all recovery. Visibility does not change input validity.

## Control, events, validation, and forms

- AreaChart reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports visible series and each numeric reference line on the value axis, and never interpolates values between records or during scale animation.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Emphasis never hides data, changes a domain, or filters records.
- Optional visibilityLabels enables unboxed open/closed eye buttons alongside series names. Each eye hides or restores its series without changing name-based emphasis. Hidden entries keep their order, color, and pattern. Hiding clears that series pin; restoring it does not repin it.
- Automatic numeric bounds fit visible series with brief, interruptible animation. Explicit consumer domains stay fixed, filled marks keep their zero baseline, and logarithmic bounds remain positive. Stacks recompute from visible series. Normalized plots and readings recompute visible shares on a 0-to-1 scale; the complete table retains shares of the full supplied data.
- AreaChart emits no consumer events and does not coordinate selection, mutate data, or own application workflow.
- AreaChart manages reading, legend emphasis, and optional series visibility internally without emitting consumer callbacks. Hiding or restoring series changes automatic bounds and visible readings without changing the supplied records. Stable series ids preserve visibility across value changes; removed series lose their hidden and pinned state, and new series start visible.
- TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a named legend for multiple series or visibilityLabels and a representable filled-mark baseline, and gives empty and unavailable states distinct feedback.
- Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.

## Accessibility

- The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, visible series values, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value, including hidden series whose headers identify them as hidden.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable. Tab also reaches legend name and eye controls. Enter or Space on an eye changes visibility while keeping focus on that eye; hidden names cannot emphasize invisible data. Show all restores focus to the first eye.
- title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.
- Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default. Optional visibilityLabels uses ChartVisibilityLabels: hideSeries(label) and showSeries(label) name the next eye action; hidden labels table headers; allHidden supplies title and description; showAll names the recovery action.
- Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.

## Appearance and responsive behavior

- A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.
- Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.
- Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.
- Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Automatic scale changes settle immediately when reduced motion is requested, including when that preference changes during an animation. Otherwise axes and marks share the animated scale while readings retain exact values. Initial geometry appears immediately; general data-shape animation is not provided.

## Examples

### AreaChart with accessible source data

Show magnitude across an ordered domain with overlap, stacked, or normalized areas.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, AreaChart} from '@trwhitney/component-library';

export function AreaChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AreaChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        legend={{label: "Energy series"}}
        series={[{id: "demand", label: "Demand", accessor: "demand"}]}
        stacking="overlap"
        title="Thermal demand volume"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse AreaChart

unrelated series where filled overlap obscures comparison, or data where area would falsely imply accumulation or continuity

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, AreaChart} from '@trwhitney/component-library';

export function MisusedAreaChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AreaChart
        data={[{candidate: "North", votes: 42}, {candidate: "South", votes: 51}]}
        description="Votes for unrelated candidates."
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        series={[{id: "votes", label: "Votes", accessor: "votes"}]}
        title="Votes by candidate"
        xAxis={{accessor: "candidate", label: "Candidate", scale: {type: "categorical"}}}
        yAxis={{label: "Votes", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
