# CartesianChart

Combine compatible line, area, and column series in one shared Cartesian frame.

## Use for

- compatible line, area, or column series share one category domain, one numeric scale, and one comparison question

## Do not use for

- series with incompatible units or domains, decorative mixed marks, or a case already expressed clearly by one named chart type

## Prefer instead

- Prefer LineChart, AreaChart, ColumnChart, or BarChart when one named mark family expresses the data without a mixed encoding.

## Composition and parts

- Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional. Supply visibilityLabels and a named legend to enable separate eye controls, including for a single series.
- Optional interaction uses ChartInteraction<Datum, Category>, shared with LineChart, BarChart, and ColumnChart. LineChartInteraction remains an exported compatibility alias. Supply target="category" or target="point", getRowId, and independently optional onActivate and selection. Point targeting identifies one row and series, including for area values and columns. Consumers own application details and navigation and may share controlled selection across charts with matching stable identities.
- CartesianChart contains a named figure, visible caption, optional feedback, a required multi-series legend, interactive SVG plot, axes, marks, shared reading tooltip, optional annotations, and a generated native data table.
- Optional interaction adds per-mark reading cues, selection rings, and column frames, category-label underlines, finite activation feedback, and a localized selection summary with Clear selection. Application details and controls remain outside the chart.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.

## Content

- Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable. Hiding every series retains the caption, legend, and complete table with the localized allHidden message and Show all recovery. Visibility does not change input validity.

## Control, events, validation, and forms

- CartesianChart reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports visible series and each numeric reference line on the value axis, and never interpolates values between records or during scale animation.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Repeating the action also clears temporary hover/focus emphasis without moving keyboard focus. Emphasis never hides data, changes a domain, or filters records.
- Optional visibilityLabels enables unboxed open/closed eye buttons alongside series names. Each eye hides or restores its series without changing name-based emphasis. Hidden entries keep their order, color, and pattern. Hiding clears that series pin; restoring it does not repin it.
- Automatic numeric bounds fit visible series with brief, interruptible animation. Explicit consumer domains stay fixed, filled marks keep their zero baseline, and logarithmic bounds remain positive. Stacks recompute from visible series. Normalized plots and readings recompute visible shares on a 0-to-1 scale; the complete table retains shares of the full supplied data.
- Optional interaction enables application activation and selection independently. The chart does not mutate supplied data or own application workflow.
- With selection enabled, click or touch tap toggles the target. Control/Command-click activates without changing selection. Touch press-and-hold activates once; release does not also select. Drag movement or pointer cancellation cancels the pending hold. Without selection, ordinary click or tap activates. Selection and activation do not both fire for the same action.
- Drag horizontally to select an inclusive category range. In point mode, draw a rectangle to select line and area value markers inside it and every column rectangle it intersects. A new drag replaces selection; Shift or Control/Command adds, and Alt removes. Escape or pointer cancellation restores the selection from before the drag. Dragging never activates or changes chart domains.
- Reading previews and activation use the same target. Resolve the nearest visible category, then the actual shapes under the pointer, including sloping area boundaries between categories. Legend emphasis breaks ties only among overlapping shapes under the pointer. A sole hovered shape wins even when another series is pinned. Empty space falls back to the nearest value marker or bar rectangle. Line points have a small nearby hit region so an overlapping column cannot swallow their targets. Hidden series cannot win.
- Category targeting previews all visible series but produces one source-row action. Hidden values remain associated data. Duplicate category coordinates retain input order, without implicit row aggregation.
- CartesianChart manages reading, legend emphasis, and optional series visibility internally. Hiding or restoring series changes automatic bounds and visible readings without changing the supplied records. Stable series ids preserve visibility across value changes; removed series lose their hidden and pinned state, and new series start visible.
- interaction.onActivate receives ChartActivation with item, category, original datum, input method, and associated raw values. An item has rowId and, for an individual value, seriesId. Each associated value has seriesId, label, value, and hidden. Category activation includes all source series values, including hidden ones; point activation includes its own series value. Stacked and normalized positions do not change raw callback values. No renderer objects or persistent inspected state are exposed.
- selection accepts controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. These ownership models cannot be combined. onSelectionChange receives stable item identities independently of activation.
- Stable row and series IDs preserve selection across value updates and reorderings. Internal selection drops deleted rows and series; controlled state remains consumer-owned, with unavailable items omitted from rendering and commands. Hidden values remain selected and named in the summary, and their selection cues return when shown. Data replacement or visibility changes cancel active gestures. Changing target kinds discards incompatible selection.
- TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a named legend for multiple series or visibilityLabels and a representable filled-mark baseline, and gives empty and unavailable states distinct feedback.
- interaction.getRowId must return a unique nonempty stable string for each datum, including repeated category labels. Preserve IDs across sorting and refreshes; change an ID when the underlying identity changes. Category items have rowId; individual values also have seriesId. All interaction geometry stays inside explicit plot domains. Existing area stacking, normalization, scale constraints, and compatible mixed-series combinations remain the input boundary.
- Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.

## Accessibility

- The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, visible series values, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value, including hidden series whose headers identify them as hidden.
- Selection instructions, a localized count, item names, hidden-item labels, and Clear selection expose selection outside the SVG. Keyboard reading cues identify the target without adding a whole-chart focus outline.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary and starts a keyboard reading. Pointer focus does not start a keyboard reading; a pointer press clears any previous keyboard reading. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable. Tab also reaches legend name and eye controls. Enter or Space on an eye changes visibility while keeping focus on that eye; hidden names cannot emphasize invisible data. Show all restores focus to the first eye.
- Left/Right move between categories; in point mode Up/Down move between visible series. Home/End reach category endpoints. Point readings announce the targeted series and value first while retaining the complete category reading. Enter or Space toggles selection when enabled; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading.
- title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.
- Crowded categorical, time and numeric axes use staggered label rows before local scrolling. Numeric and date labels retain complete values.
- Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default. Optional visibilityLabels uses ChartVisibilityLabels: hideSeries(label) and showSeries(label) name the next eye action; hidden labels table headers; allHidden supplies title and description; showAll names the recovery action.
- selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Name selected items using stable IDs and application labels. Describe the enabled gestures, including category ranges or mark selection, modified activation, and touch press-and-hold when selection and activation are both enabled.
- Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.

## Appearance and responsive behavior

- A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.
- Each mark keeps its own interaction cues. Columns use inset reading outlines and outer selection frames; line and area values use filled reading markers and outer selection rings. Area markers follow the plotted upper boundary. Category mode previews all visible values, combining column outlines without internal seams, and underlines selected category labels.
- A brief pulse acknowledges every activation, including repeated activation of the same item. Reading, selection, and whole-series legend emphasis remain distinct in both appearances.
- Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.
- Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Filled point pulses use a ten-screen-pixel base radius with the shared expansion and fade, including compact charts.
- Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Automatic scale changes settle immediately when reduced motion is requested, including when that preference changes during an animation. Otherwise axes and marks share the animated scale while readings retain exact values. Initial geometry appears immediately; general data-shape animation is not provided.
- Each activation restarts finite feedback. Reduced motion uses a brief static acknowledgment without changing callbacks or selection. Reading and selection geometry follow the same visible-data scale as the marks.

## Examples

### CartesianChart with accessible source data

Combine compatible line, area, and column series in one shared Cartesian frame.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CartesianChart} from '@trwhitney/component-library';

export function CartesianChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CartesianChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        legend={{label: "Energy series"}}
        series={[{id: "capacity", kind: "column", label: "Capacity", accessor: "capacity"}, {id: "demand", kind: "line", label: "Demand", accessor: "demand", showPoints: true}]}
        title="Demand within capacity"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### Independent value selection and activation

Select a column or line value with its own frame or ring and open application details independently. Use target="category" to preview both marks and activate one month. The rendered example also offers columns with an area, controlled selection, and independent selection and activation switches.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CartesianChart} from '@trwhitney/component-library';

export function SelectableCartesianChart({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CartesianChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        legend={{label: "Energy series"}}
        interaction={{
          target: "point",
          getRowId: (datum) => datum.month,
          onActivate: ({category, values}) => onOpenDetails(`${category}: ${values.map(({label, value}) => `${label} ${value} MWh`).join(", ")}`),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap to select a value. Drag to select enclosed value markers and intersected columns; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or press and hold to open details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} values selected`,
              item: ({rowId, seriesId}) => `${rowId}, ${seriesId === "demand" ? "Demand" : "Capacity"}`,
              hidden: (label) => `${label} (hidden)`,
            },
          },
        }}
        series={[{id: "capacity", kind: "column", label: "Capacity", accessor: "capacity"}, {id: "demand", kind: "line", label: "Demand", accessor: "demand", color: "series-2", showPoints: true}]}
        title="Demand and capacity"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse CartesianChart

series with incompatible units or domains, decorative mixed marks, or a case already expressed clearly by one named chart type

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CartesianChart} from '@trwhitney/component-library';

export function MisusedCartesianChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CartesianChart
        data={[{month: "Jan", cost: 1200, temperature: 18}, {month: "Feb", cost: 900, temperature: 22}]}
        description="Temperature and cost use unrelated units."
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        legend={{label: "Unrelated series"}}
        series={[{id: "cost", kind: "column", label: "Cost", accessor: "cost"}, {id: "temperature", kind: "line", label: "Temperature", accessor: "temperature"}]}
        title="Cost and temperature"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Mixed values", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
