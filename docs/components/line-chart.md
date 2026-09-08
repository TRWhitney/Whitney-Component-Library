# LineChart

Show change across an ordered or continuous domain with one or more lines.

## Use for

- one or more numeric series must show trend or change across an ordered category, numeric, logarithmic, or time domain

## Do not use for

- isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have

## Prefer instead

- Use AreaChart for accumulated magnitude, ColumnChart for discrete comparison, or CartesianChart only when compatible mark types share one honest scale.

## Composition and parts

- Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional. Supply visibilityLabels and a named legend to enable separate eye controls, including for a single series.
- Supply interaction with target="category" or target="point", getRowId, and independently optional onActivate and selection. Application details, navigation, and other callback responses belong outside the chart. Share controlled selection between charts when their stable item identities represent the same records.
- LineChart contains a named figure, visible caption, optional feedback, a required multi-series legend, interactive SVG plot, axes, marks, shared reading tooltip, optional annotations, and a generated native data table.
- Optional interaction adds category underlines, point selection rings, temporary activation feedback, and a localized selection summary with Clear selection. Application details and experiment controls are consumer-owned composition.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.

## Content

- Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable. Hiding every series retains the caption, legend, and complete table with the localized allHidden message and Show all recovery. Visibility does not change input validity.

## Control, events, validation, and forms

- LineChart reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports visible series and each numeric reference line on the value axis, and never interpolates values between records or during scale animation.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Emphasis never hides data, changes a domain, or filters records.
- Optional visibilityLabels enables unboxed open/closed eye buttons alongside series names. Each eye hides or restores its series without changing name-based emphasis. Hidden entries keep their order, color, and pattern. Hiding clears that series pin; restoring it does not repin it.
- Automatic numeric bounds fit visible series with brief, interruptible animation. Explicit consumer domains stay fixed, filled marks keep their zero baseline, and logarithmic bounds remain positive. Stacks recompute from visible series. Normalized plots and readings recompute visible shares on a 0-to-1 scale; the complete table retains shares of the full supplied data.
- Optional interaction enables application activation and selection independently. The chart does not mutate supplied data or own application workflow.
- With selection enabled, ordinary click or touch tap toggles an item. Control/Command-click activates without changing selection. On touchscreens, press and hold activates once; release does not also select. Drag movement and pointer cancellation cancel a pending hold. Without selection, ordinary click or tap activates. Selection and activation never both fire merely because both capabilities are enabled.
- Drag horizontally to select a category range or draw a rectangle to select points. A new drag replaces selection. Shift or Control/Command adds; Alt removes. Escape or pointer cancellation restores the selection from before the drag. Dragging never activates and selection does not change chart domains.
- Reading previews and activation resolve the same nearest visible category, then the nearest visible point vertically for point targeting. Duplicate category coordinates use input order for category ties; point ties use input order then visible series order. Hidden points cannot be targeted. No rows are implicitly aggregated.
- LineChart manages reading, legend emphasis, and optional series visibility internally. Hiding or restoring series changes automatic bounds and visible readings without changing the supplied records. Stable series ids preserve visibility across value changes; removed series lose their hidden and pinned state, and new series start visible.
- interaction.onActivate receives ChartActivation with item, category, original datum, input method, and associated raw values. The item has rowId and, for a point, seriesId. Each value contains seriesId, label, value, and hidden. A category produces one callback for one source row with all its series values, including hidden associated values. A point identifies its own series value. No renderer objects are exposed and no inspected state persists.
- selection accepts controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. These ownership models cannot be combined. onSelectionChange receives item identities independently of activation.
- Stable row and series IDs preserve selection through value updates and reorderings. Internal selection drops deleted rows and series; controlled state remains consumer-owned while unavailable items are omitted from rendering and commands. Hidden items remain selected and identified in the summary. Data replacement or visibility changes cancel active gestures. Changing target kinds discards incompatible selection.
- TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a named legend for multiple series or visibilityLabels and a representable filled-mark baseline, and gives empty and unavailable states distinct feedback.
- interaction.getRowId must return a unique nonempty stable string for each datum, including when category labels repeat. Preserve IDs across sorting and refreshes and change an ID when its underlying identity changes. A category selection has rowId; a point selection also has seriesId. Selection geometry stays within explicit plotted domains.
- Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.

## Accessibility

- The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, visible series values, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value, including hidden series whose headers identify them as hidden.
- Selection instructions describe the available gestures. A localized count, item names, hidden-item labels, and Clear selection expose the persistent selection outside the SVG. Application activation and selection are separate actions with keyboard equivalents.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary and starts a keyboard reading. Pointer focus does not start a keyboard reading; a pointer press clears any previous keyboard reading. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable. Tab also reaches legend name and eye controls. Enter or Space on an eye changes visibility while keeping focus on that eye; hidden names cannot emphasize invisible data. Show all restores focus to the first eye.
- Point readings announce the targeted series and value first while retaining the complete category reading. For interaction, Left/Right move between categories; point targeting also uses Up/Down to move between visible series. Home/End reach category endpoints. With selection enabled, Enter or Space toggles selection; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading.
- title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.
- Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default. Optional visibilityLabels uses ChartVisibilityLabels: hideSeries(label) and showSeries(label) name the next eye action; hidden labels table headers; allHidden supplies title and description; showAll names the recovery action.
- selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Name selections from stable IDs with application labels. Instructions must describe the gestures enabled by this chart, including Control/Command activation and touch press-and-hold when activation and selection are both present.
- Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.

## Appearance and responsive behavior

- A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.
- Filled point centers identify the current reading. Outer rings identify selected points; underlines identify selected categories. Fills and selection rings meet the marker outline without background gaps in light and dark appearances. A finite pulse acknowledges each activation and does not create a persistent inspected state. Optional idle point markers remain optional.
- Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.
- Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.
- Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Automatic scale changes settle immediately when reduced motion is requested, including when that preference changes during an animation. Otherwise axes and marks share the animated scale while readings retain exact values. Initial geometry appears immediately; general data-shape animation is not provided.
- Repeated activation restarts finite feedback. Reduced motion replaces the activation pulse with a brief static acknowledgment while preserving callback and selection behavior.

## Examples

### LineChart with accessible source data

Show change across an ordered or continuous domain with one or more lines.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, LineChart} from '@trwhitney/component-library';

export function LineChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <LineChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        legend={{label: "Energy series"}}
        series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}
        title="Thermal demand"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### Independent activation and category selection

Keep application details separate from chart selection. Ordinary clicks select a month; modified clicks or touch holds update the application detail without changing selection.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, LineChart} from '@trwhitney/component-library';

import {useState} from "react";

export function SelectableDemandChart() {
  const [detail, setDetail] = useState<string | null>(null);
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <LineChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        interaction={{
          target: "category",
          getRowId: (datum) => datum.month,
          onActivate: ({datum}) => setDetail(`${datum.month}: ${datum.demand} MWh`),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap to select. Drag to select a range; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or press and hold to open details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} months selected`,
              item: ({rowId}) => rowId,
              hidden: (label) => `${label} (hidden)`,
            },
          },
        }}
        series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}
        title="Thermal demand"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
      {detail ? <p>{detail}</p> : null}
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse LineChart

isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, LineChart} from '@trwhitney/component-library';

export function MisusedLineChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <LineChart
        data={[{product: "Alpha", defects: 4}, {product: "Beta", defects: 7}]}
        description="Defects for unrelated products."
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        series={[{id: "defects", label: "Defects", accessor: "defects"}]}
        title="Product defects"
        xAxis={{accessor: "product", label: "Product", scale: {type: "categorical"}}}
        yAxis={{label: "Defects", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
