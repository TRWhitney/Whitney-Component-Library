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
- ScatterChart<Datum, LineDatum> accepts an optional ScatterChartLine<LineDatum> through line. Supply its id, label, data, idAccessor, labelAccessor, xAccessor and yAccessor. Observation and line data types, sample counts and x positions may differ. The line joins its own samples in input order on the observation axes; the library does not calculate a fit or join observations. Line and observation series together use at most six identities and require a visible legend.
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

- selection.presentation chooses one selection view: panel by default or controls for a compact count and clear action. The two views never render together. Both share the same selection and clear behavior; opening the count reveals localized interaction help. The panel keeps item names visible, while compact controls reveal them with the help.
- Optional exploration uses independent numeric x and y windows through ChartRectangularExploration. Supply labels for navigation, corners and the complete range. Use defaultWindow for internal state, or window with required onWindowChange for application control. onWindowChange emits one rectangle per live change; onWindowChangeEnd reports completed gestures or commands. minimumSpan sets a fractional minimum for each axis.
- The Overview icon opens a proportional full-data map in Dialog. Drag the window or its corners directly, or draw a new rectangle. Closing keeps the range and restores focus. Two fingers pan or pinch the main chart and cancel pending selection or hold activation. Pointer navigation follows immediately, keyboard and reset changes animate, and reduced motion removes those transitions.
- Navigation keeps the complete source table and selections outside the window. Only visible observations can be read or activated. Empty windows retain axes and navigation. Full valid visible observations define reset bounds, explicit axis limits constrain exploration, and logarithmic windows navigate in log space. Bubble magnitude sizing is independent of the viewport. Hidden groups leave the plot and map together.
- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one point group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority only among actual overlapping point shapes. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.
- Each legend eye hides or restores its group independently of name-based emphasis. Hidden entries retain legend order, colors, and shapes. Hidden names cannot emphasize invisible marks. Hiding clears that group pin; restoring does not repin it.
- Hiding a series hides all its observations. Both numeric axes fit visible observations. Bubble areas retain their magnitude interpretation within the visible dataset.
- Automatic numeric bounds fit visible groups with interruptible animation. Explicit consumer domains remain fixed and logarithmic bounds remain positive. Readings retain exact values throughout animation.
- Selections remain attached to hidden items and use the localized hidden selection label. Hidden items cannot be read, selected by dragging, or activated. Visibility, source-data, or configuration changes cancel pending gestures and stale readings; animation frames preserve active gestures; removed data still prunes selection.
- With selection enabled, click or tap a mark toggles that observation. Control/Command-click activates without changing selection. Touch press-and-hold activates and suppresses selection on release. Without selection, click or tap activates when onActivate is supplied. Empty space has no click target.
- Drag from empty plot space to select observations whose centers are inside the rectangle. A drag replaces selection; Shift or Control/Command adds and Alt removes. Bubble edges alone do not qualify. Escape, pointer cancellation, or a source-data or configuration change cancels the pending gesture without committing it.
- Shared ChartSelection supports controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems. Supply labels for instructions, clear, empty, summary, item, and hidden. Selected state remains separate from the current reading and activation feedback. Neither selection nor activation changes records, scales, or domains.
- Both datasets participate in shared selection and automatic axis fitting. Segments crossing the viewport remain visible. A click near a line segment resolves to a visible supplied endpoint, never a fabricated interpolated record. A crossing segment with both endpoints outside the viewport remains context until a sample becomes visible. Legend priority resolves only actual overlaps. Drag selection includes visible sample centers inside the rectangle, retaining the shared preview, modifiers, keyboard, touch hold and two-finger navigation behavior.
- Group visibility remains internal and never mutates consumer data. Stable group IDs retain visibility across data updates. Removing a group ID drops its hidden state; new group IDs begin visible.
- interaction.onActivate receives PointChartActivation<Datum> with item containing rowId and seriesId, the original datum, label, raw numeric x and y, optional raw magnitude for bubbles, and input of pointer, keyboard, or touch. onSelectionChange receives the next selection items. Readings and legend emphasis remain internal; callbacks expose no renderer objects.
- Observation activation uses interaction.onActivate. Supplied sample activation uses line.onActivate with PointChartActivation<LineDatum>, including the original line datum and its supplied coordinates. Both use the shared selection state from interaction.selection. Public items retain rowId and seriesId; identical row IDs in different datasets remain distinct.
- TypeScript requires numeric axis accessors and string id, label, and series accessors. Runtime preparation rejects duplicate point ids, unknown series, invalid domains, missing or non-finite coordinates, and out-of-domain values. Multiple series require seriesAccessor and a legend.
- visibilityLabels requires a named visible legend. Validation uses the full supplied dataset before visibility, so hiding groups does not suppress invalid-data feedback.
- Line sample IDs must be stable, nonempty and unique within the line dataset. Duplicate coordinates are allowed. Missing or invalid line coordinates break the line without joining across the gap. Nonfinite, invalid-scale or out-of-domain values use invalidData feedback. Complete source readings remain in the data table when series are hidden or the viewport changes.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The complete named source table remains available to assistive technology. Its one-pixel contained layout prevents long headers or many columns from widening the chart or document.
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
- The supplied line has a line swatch and circular sample markers. Its eye removes the line and its samples from both plot and rectangular modal Overview. With a supplied line and exploration, Up sits above Down in a reserved gutter beside the plot; Left and Right stay below.
- aspectRatio changes the plot geometry used by axes, marks, clipping, hit testing, and navigation. Wide or square plots use the available canvas instead of letterboxing a fixed 640-by-360 SVG. minimumSize and overflow still control the legibility limit.
- Horizontal axes consider formatted labels on categorical, time and numeric scales, using staggered rows before local scrolling. Complete vertical titles reserve space and wrap when needed. The production chart frame scales type, strokes, and plot geometry from measured space. Scatter points keep a bounded readable rendered size as the plot narrows. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary point group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve axes and point boundaries in system colors. Point shapes and the generated table keep groups and values distinguishable without color.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Reduced motion removes point-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.
- Source point coordinates and bubble areas animate over 240ms with cubic ease-out. Stable observation IDs retain identity through reordering. Arrivals and departures fade; departing points cannot receive interaction. Automatic axes and selection follow displayed geometry, while readings and callbacks report supplied values immediately. Repeated updates start at the current display and reduced motion settles immediately. Initial, empty, configuration and missing-sample topology changes remain immediate. Supplied-line values move with their sample marks; adding or removing samples updates line adjacency immediately while the sample marks fade.
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

### Observations with a supplied target

Observation records and supplied target samples have separate types and callbacks. The rendered showcase demonstrates shared selection, both eyes and the rectangular Overview.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function ScatterTargetExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
        data={[{id: "observed", label: "Monday", temperature: 12, energy: 60}]}
        idAccessor="id" labelAccessor="label" series={[{id: "observations", label: "Observations"}]}
        line={{id: "target", label: "Target", data: [{key: "low", name: "Cool target", x: 5, y: 85}, {key: "high", name: "Mild target", x: 20, y: 45}], idAccessor: "key", labelAccessor: "name", xAccessor: "x", yAccessor: "y", onActivate: event => console.log(event.datum)}}
        legend={{label: "Energy series"}} title="Temperature and energy" description="Observed energy and supplied targets."
        dataTableLabel="Energy readings"
        emptyState={{title: "No readings", description: "Add readings."}}
        invalidData={{title: "Invalid readings", description: "Check supplied coordinates."}}
        xAxis={{label: "Temperature", accessor: "temperature", unit: "°C", scale: {type: "linear"}}}
        yAxis={{label: "Energy", accessor: "energy", unit: "kWh", scale: {type: "linear"}}}
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
