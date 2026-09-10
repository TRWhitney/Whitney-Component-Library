# BubbleChart

Compare two quantitative coordinates while a third positive measure controls mark area.

## Use for

- each point has a third positive numeric measure whose proportional area materially aids comparison

## Do not use for

- arbitrary ranking, record order, signed values, or another measure whose area would not support honest proportional comparison

## Prefer instead

- Use ScatterChart when area adds no necessary measure, Histogram for one-dimensional frequency, or a generated table when precise comparison of three measurements is the primary task.

## Composition and parts

- Render BubbleChart inside AppearanceProvider in consumer-owned layout. Provide the ScatterChart point contract plus one positive finite magnitude accessor, its label, and an optional unit. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple bubble groups require a visible legend.
- Supply optional visibilityLabels: ChartVisibilityLabels and a named visible legend to enable an eye after each group name, including for a single group.
- Supply optional PointChartInteraction<Datum> through interaction. selection and onActivate are independent. Existing idAccessor supplies stable observation IDs; each selection item has rowId and seriesId. There is no category target or second identity accessor. Consumers own details and may share controlled selection across charts with matching observation identities.
- BubbleChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent proportional bubbles, shared tooltip, polite announcement, and generated native data table.
- Optional visibility adds separate legend eyes and an all-hidden recovery control. The complete native table retains every valid group and identifies hidden groups.
- Optional interaction adds shape-following selection outlines, circular rings joined to the current mark border, filled reading centers, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.

## Preferred higher-level compositions

- Compose the chart with application-owned details and separate controls. Share ChartSelection through controlled selectedItems and onSelectionChange when charts refer to the same target identities. Filtering and zooming remain application-owned.

## Content

- Use stable point ids and labels that identify individual observations. Name both coordinates, the magnitude, and their units directly. Use area only for a positive measure that supports proportional comparison.

## States

- Hiding every group retains the caption, legend, full table, and selection summary. Localized allHidden copy distinguishes this state from empty or invalid data, and showAll restores every group.
- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one bubble group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority only among actual overlapping bubble shapes. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.
- Each legend eye hides or restores its group independently of name-based emphasis. Hidden entries retain legend order, colors, and shapes. Hidden names cannot emphasize invisible marks. Hiding clears that group pin; restoring does not repin it.
- Hiding a series hides all its observations. Both numeric axes fit visible observations. Bubble areas retain their magnitude interpretation within the visible dataset.
- Automatic numeric bounds fit visible groups with interruptible animation. Explicit consumer domains remain fixed and logarithmic bounds remain positive. Readings retain exact values throughout animation.
- Selections remain attached to hidden items and use the localized hidden selection label. Hidden items cannot be read, selected by dragging, or activated. Visibility, data, or geometry changes cancel pending gestures and stale readings; removed data still prunes selection.
- With selection enabled, click or tap a mark toggles that observation. Control/Command-click activates without changing selection. Touch press-and-hold activates and suppresses selection on release. Without selection, click or tap activates when onActivate is supplied. Empty space has no click target.
- Drag from empty plot space to select observations whose centers are inside the rectangle. A drag replaces selection; Shift or Control/Command adds and Alt removes. Bubble edges alone do not qualify. Escape, pointer cancellation, or a data or geometry change cancels the pending gesture without committing it.
- Shared ChartSelection supports controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems. Supply labels for instructions, clear, empty, summary, item, and hidden. Selected state remains separate from the current reading and activation feedback. Neither selection nor activation changes records, scales, or domains.
- Group visibility remains internal and never mutates consumer data. Stable group IDs retain visibility across data updates. Removing a group ID drops its hidden state; new group IDs begin visible.
- interaction.onActivate receives PointChartActivation<Datum> with item containing rowId and seriesId, the original datum, label, raw numeric x and y, optional raw magnitude for bubbles, and input of pointer, keyboard, or touch. onSelectionChange receives the next selection items. Readings and legend emphasis remain internal; callbacks expose no renderer objects.
- BubbleChart applies the point-chart validation and requires every valid magnitude to be positive and finite. Radius uses a square-root mapping so rendered area remains proportional to the source magnitude.
- visibilityLabels requires a named visible legend. Validation uses the full supplied dataset before visibility, so hiding groups does not suppress invalid-data feedback.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches separate legend name and eye controls. Enter or Space on an eye hides or restores its group and retains focus on that eye. Plot navigation visits visible items only. Show all restores every group and returns focus to the first eye.
- Tab reaches one title-named chart boundary. Without interaction, arrow keys move spatially between recorded observations with stable point id as the final tie-breaker. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- With interaction, Left/Right visit observations in data order, including coincident observations; Up/Down move spatially. Home/End reach the first and last observations. With selection enabled, Enter or Space toggles selection. Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.
- title, description, both axis labels, magnitude label, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.
- Localize titles, descriptions, state copy, point and group labels, axis and magnitude labels, units, and legend text. Use axis formatTick and magnitude formatValue for locale-specific numeric formatting.
- ChartVisibilityLabels requires hideSeries(label) and showSeries(label) for the next eye action, hidden for table group labels, allHidden with title and description, and showAll for recovery. ChartSelection labels.hidden describes retained hidden selections separately.
- Localize every ChartSelection label and the instructions for the enabled selection and activation behavior.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each bubble has a translucent group-color fill and a stronger edge. Shape distinguishes groups, while proportional area expresses magnitude. Direct reading dims every other bubble.
- Interactive reading uses a small filled center. Selection outlines follow the full symbol; activation gives finite feedback. All six symbol shapes and bubble magnitude remain unchanged, and interaction cues stay inside the plot.
- Horizontal axes consider formatted labels on categorical, time and numeric scales, using staggered rows before local scrolling. Complete vertical titles reserve space and wrap when needed. The production chart frame scales type, strokes, and plot geometry from measured space. Bubble area remains proportional to source magnitude while the maximum rendered radius stays bounded across widths. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary bubble group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve axes and bubble boundaries in system colors. Point shapes and the generated table keep groups, coordinates, and source magnitudes distinguishable without color.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Reduced motion removes bubble-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.
- Reduced motion settles automatic scale changes immediately, including when the preference changes during an animation. Otherwise axes and marks share the animated scale.
- Reduced motion replaces the activation pulse with a brief static acknowledgment. Selection and reading retain the same meanings.

## Examples

### BubbleChart with explicit statistical meaning

Compare two quantitative coordinates while a third positive measure controls mark area.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BubbleChart} from '@trwhitney/component-library';

export function BubbleChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BubbleChart
        data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
        description="Compare temperature, demand, and stored energy."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        magnitude={{accessor: "stored", label: "Stored energy", unit: "MWh"}}
        series={[{id: "north", label: "North loop"}]}
        legend={{label: "Turbine loops"}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        title="Stored energy"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### BubbleChart with selection and activation

Hide or restore a group with its legend eye, select observations, and open application-owned details independently. Hidden selections remain labeled, and the full table retains hidden groups. Automatic axes fit visible values; Show all series restores every group. The chart owns the uncontrolled selection in this example.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BubbleChart} from '@trwhitney/component-library';

export function SelectableBubbleChart({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BubbleChart
        data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
        dataTableLabel="Operating observations"
        description="Compare temperature and thermal demand across recorded observations."
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        idAccessor="id"
        labelAccessor="label"
        magnitude={{accessor: "stored", label: "Stored energy", unit: "MWh"}}

        interaction={{
          onActivate: ({item, label, x, y, input, magnitude}) =>
            onOpenDetails(`${label} [${item.rowId}, ${item.seriesId}]: ${x} °F, ${y} MWh, ${magnitude} MWh stored via ${input}`),
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
        title="Stored energy observations"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse BubbleChart

arbitrary ranking, record order, signed values, or another measure whose area would not support honest proportional comparison

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BubbleChart} from '@trwhitney/component-library';

export function MisusedBubbleChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BubbleChart
        data={[{id: "a", label: "Alpha", x: 18, y: 28, rowNumber: 1}, {id: "b", label: "Beta", x: 56, y: 68, rowNumber: 2}]}
        description="Row number changes mark area."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        magnitude={{accessor: "rowNumber", label: "Row number"}}
        series={[{id: "records", label: "Records"}]}
        title="Measurements by row"
        xAxis={{accessor: "x", label: "X", scale: {type: "linear"}}}
        yAxis={{accessor: "y", label: "Y", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
