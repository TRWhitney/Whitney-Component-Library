# ScatterChart

Compare two quantitative measurements across distinct recorded observations.

## Use for

- each record is one identifiable observation and its two numeric measurements form the comparison

## Do not use for

- categorical codes, part-to-whole data, an ordered trend that needs connection, or coordinates that do not express a meaningful two-variable relationship

## Prefer instead

- Use LineChart for an ordered trend, BubbleChart when one additional numeric measure belongs in mark area, or Histogram for a one-dimensional distribution.

## Composition and parts

- Render ScatterChart inside AppearanceProvider in consumer-owned layout. Provide one record per point, separate id and label accessors, two quantitative axes, and one to six declared series. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple point groups require a visible legend.
- Supply optional visibilityLabels: ChartVisibilityLabels and a named visible legend to enable an eye after each group name, including for a single group.
- Supply optional PointChartInteraction<Datum> through interaction. selection and onActivate are independent. Existing idAccessor supplies stable observation IDs; each selection item has rowId and seriesId. There is no category target or second identity accessor. Consumers own details and may share controlled selection across charts with matching observation identities.
- ScatterChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent shaped points, shared tooltip, polite announcement, and generated native data table.
- Optional visibility adds separate legend eyes and an all-hidden recovery control. The complete native table retains every valid group and identifies hidden groups.
- Optional interaction adds shape-following selection outlines, circular rings joined to the current mark border, filled reading centers, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.

## Preferred higher-level compositions

- Compose the chart with application-owned details and separate controls. Share ChartSelection through controlled selectedItems and onSelectionChange when charts refer to the same target identities. Filtering and zooming remain application-owned.

## Content

- Use stable point ids and labels that identify individual observations. Name both measurements and their units directly. Use groups only when they support comparison.

## States

- Hiding every group retains the caption, legend, full table, and selection summary. Localized allHidden copy distinguishes this state from empty or invalid data, and showAll restores every group.
- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one point group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority only among actual overlapping point shapes. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.
- Each legend eye hides or restores its group independently of name-based emphasis. Hidden entries retain legend order, colors, and shapes. Hidden names cannot emphasize invisible marks. Hiding clears that group pin; restoring does not repin it.
- Hiding a series hides all its observations. Both numeric axes fit visible observations. Bubble areas retain their magnitude interpretation within the visible dataset.
- Automatic numeric bounds fit visible groups with interruptible animation. Explicit consumer domains remain fixed and logarithmic bounds remain positive. Readings retain exact values throughout animation.
- Selections remain attached to hidden items and use the localized hidden selection label. Hidden items cannot be read, selected by dragging, or activated. Visibility, data, or geometry changes cancel pending gestures and stale readings; removed data still prunes selection.
- With selection enabled, click or tap a mark toggles that observation. Control/Command-click activates without changing selection. Touch press-and-hold activates and suppresses selection on release. Without selection, click or tap activates when onActivate is supplied. Empty space has no click target.
- Drag from empty plot space to select observations whose centers are inside the rectangle. A drag replaces selection; Shift or Control/Command adds and Alt removes. Bubble edges alone do not qualify. Escape, pointer cancellation, or a data or geometry change cancels the pending gesture without committing it.
- Shared ChartSelection supports controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems. Supply labels for instructions, clear, empty, summary, item, and hidden. Selected state remains separate from the current reading and activation feedback. Neither selection nor activation changes records, scales, or domains.
- Group visibility remains internal and never mutates consumer data. Stable group IDs retain visibility across data updates. Removing a group ID drops its hidden state; new group IDs begin visible.
- interaction.onActivate receives PointChartActivation<Datum> with item containing rowId and seriesId, the original datum, label, raw numeric x and y, optional raw magnitude for bubbles, and input of pointer, keyboard, or touch. onSelectionChange receives the next selection items. Readings and legend emphasis remain internal; callbacks expose no renderer objects.
- TypeScript requires numeric axis accessors and string id, label, and series accessors. Runtime preparation rejects duplicate point ids, unknown series, invalid domains, missing or non-finite coordinates, and out-of-domain values. Multiple series require seriesAccessor and a legend.
- visibilityLabels requires a named visible legend. Validation uses the full supplied dataset before visibility, so hiding groups does not suppress invalid-data feedback.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches separate legend name and eye controls. Enter or Space on an eye hides or restores its group and retains focus on that eye. Plot navigation visits visible items only. Show all restores every group and returns focus to the first eye.
- Tab reaches one title-named chart boundary. Without interaction, arrow keys move spatially between recorded observations with stable point id as the final tie-breaker. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- With interaction, Left/Right visit observations in data order, including coincident observations; Up/Down move spatially. Home/End reach the first and last observations. With selection enabled, Enter or Space toggles selection. Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.
- title, description, both axis labels, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.
- Localize titles, descriptions, state copy, point and group labels, axis labels, units, and legend text. Use each axis formatTick for locale-specific numeric formatting.
- ChartVisibilityLabels requires hideSeries(label) and showSeries(label) for the next eye action, hidden for table group labels, allHidden with title and description, and showAll for recovery. ChartSelection labels.hidden describes retained hidden selections separately.
- Localize every ChartSelection label and the instructions for the enabled selection and activation behavior.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each point has a translucent group-color fill and a stronger edge. Shape distinguishes groups when color is unavailable or points overlap. Direct reading dims every other point.
- Interactive reading uses a small filled center. Selection outlines follow the full symbol; activation gives finite feedback. All six symbol shapes and bubble magnitude remain unchanged, and interaction cues stay inside the plot.
- Horizontal axes consider formatted labels on categorical, time and numeric scales, using staggered rows before local scrolling. Complete vertical titles reserve space and wrap when needed. The production chart frame scales type, strokes, and plot geometry from measured space. Scatter points keep a bounded readable rendered size as the plot narrows. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary point group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve axes and point boundaries in system colors. Point shapes and the generated table keep groups and values distinguishable without color.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Reduced motion removes point-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.
- Reduced motion settles automatic scale changes immediately, including when the preference changes during an animation. Otherwise axes and marks share the animated scale.
- Reduced motion replaces the activation pulse with a brief static acknowledgment. Selection and reading retain the same meanings.

## Examples

### ScatterChart with explicit statistical meaning

Compare two quantitative measurements across distinct recorded observations.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function ScatterChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
        data={[{id: "north-1", label: "North Monday", loop: "north", temperature: 18, demand: 28}, {id: "south-1", label: "South Monday", loop: "south", temperature: 56, demand: 68}]}
        dataTableLabel="Turbine observations"
        description="Compare temperature and thermal demand for recorded operating periods."
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        idAccessor="id"
        labelAccessor="label"
        legend={{label: "Turbine loops"}}
        series={[{id: "north", label: "North loop"}, {id: "south", label: "South loop", color: "series-2"}]}
        seriesAccessor="loop"
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        title="Temperature and demand"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### ScatterChart with selection and activation

Hide or restore a group with its legend eye, select observations, and open application-owned details independently. Hidden selections remain labeled, and the full table retains hidden groups. Automatic axes fit visible values; Show all series restores every group. The chart owns the uncontrolled selection in this example.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function SelectableScatterChart({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
        data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
        dataTableLabel="Operating observations"
        description="Compare temperature and thermal demand across recorded observations."
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        idAccessor="id"
        labelAccessor="label"

        interaction={{
          onActivate: ({item, label, x, y, input}) =>
            onOpenDetails(`${label} [${item.rowId}, ${item.seriesId}]: ${x} °F, ${y} MWh via ${input}`),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap a mark to select. Drag from empty space to select centers inside the rectangle; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or touch press-and-hold opens details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} observations selected`,
              item: ({rowId, seriesId}) => `${rowId}, ${seriesId}`,
              hidden: (label) => `${label} (hidden)`,
            },
          },
        }}
        legend={{label: "Turbine loops"}}
        series={[{id: "north", label: "North loop"}]}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        title="Temperature and demand observations"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse ScatterChart

categorical codes, part-to-whole data, an ordered trend that needs connection, or coordinates that do not express a meaningful two-variable relationship

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function MisusedScatterChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
        data={[{id: "a", label: "Alpha", productCode: 1, defects: 4}, {id: "b", label: "Beta", productCode: 2, defects: 7}]}
        description="Defects for unrelated products."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        series={[{id: "products", label: "Products"}]}
        title="Product defects"
        xAxis={{accessor: "productCode", label: "Product code", scale: {type: "linear"}}}
        yAxis={{accessor: "defects", label: "Defects", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
