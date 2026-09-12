# BoxPlot

Compare distribution center, spread, whiskers, and outliers across declared groups.

## Use for

- one or more groups need a compact, method-explicit comparison of their numeric distributions

## Do not use for

- groups with too little data for a useful distribution summary, unknown quartile or whisker methods, or a task that requires reading every observation in the plot

## Prefer instead

- Use Histogram to inspect one distribution in detail, ScatterChart for paired observations, or a table when the individual records matter more than a summary.

## Composition and parts

- Render BoxPlot inside AppearanceProvider in consumer-owned layout. Choose raw observations with Tukey or min-max whiskers, or one explicit summary record per declared group with quartiles, median, whiskers, outliers, and whisker method. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple distribution groups require a visible legend.
- Supply optional visibilityLabels: ChartVisibilityLabels and a named visible legend to enable an eye after each group name, including for a single group.
- BoxPlot contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, categorical and quantitative axes, quartile boxes, medians, split whisker tails, separate outlier marks, shared tooltip, polite announcement, and generated native data table.
- Optional visibility adds separate legend eyes and an all-hidden recovery control. The complete native table retains every valid group and identifies hidden groups.
- Optional interaction adds selection frames for bins or summaries, rings joined to the outlier border, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.

## Preferred higher-level compositions

- Compose the chart with application-owned details and separate controls. Share ChartSelection through controlled selectedItems and onSelectionChange when charts refer to the same target identities. Filtering and zooming remain application-owned.

## Content

- Name each distribution group, numeric measure, unit, quartile method, and whisker method accurately. Use outliers as observations outside the declared whiskers, not as decorative points.

## States

- Hiding every group retains the caption, legend, full table, and selection summary. Localized allHidden copy distinguishes this state from empty or invalid data, and showAll restores every group.
- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- selection.presentation chooses one selection view: panel by default or controls for a compact count and clear action. The two views never render together. Both share the same selection and clear behavior; opening the count reveals localized interaction help. The panel keeps item names visible, while compact controls reveal them with the help.
- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one distribution group. Click, Enter, or Space pins it. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.
- Optional BoxPlotInteraction<Datum> requires getOutlierId for both raw and summary distributions. Return a stable nonempty string unique within its group. Its context contains kind, groupId, value, and the original datum; summary mode also supplies outlierIndex. Preserve the ID only while it identifies the same observation. Equal values and array positions are not stable observation identities.
- BoxPlotSelectionItem identifies a group summary with kind: summary and groupId, or a separate outlier with kind: outlier, groupId, and outlierId. Selecting a summary does not select its contributing records or outliers.
- Drag selects a summary when its central quartile box touches the rectangle, including a zero-spread box at its rendered median segment. Outliers are selected only when their centers are inside the rectangle.
- Optional exploration uses the shared ChartExploration labels and controlled or internal window ownership. Histogram windows report original bin boundaries and show complete bins prepared from the full source. Counts, ordinates and boundary inclusivity do not change with navigation. BoxPlot windows report ordered stable group IDs and retain each summary, whisker and outlier.
- The Overview icon opens a horizontal distribution strip in Dialog. Zoom, pan, reset and direct window dragging share one range. Two fingers pan and pinch the main chart without selecting or activating. Closing keeps the range and returns focus. Main-chart dimensions remain stable. Full tables and selections outside the window remain available; visible geometry controls automatic value-axis fitting.
- Each legend eye hides or restores its group independently of name-based emphasis. Hidden entries retain legend order, colors, and shapes. Hidden names cannot emphasize invisible marks. Hiding clears that group pin; restoring does not repin it.
- Hiding a group hides its summary and every outlier together. Remaining categories use declared group order. The numeric axis fits visible summaries and outliers without recomputing statistics across groups.
- Automatic numeric bounds fit visible groups with interruptible animation. Explicit consumer domains remain fixed and logarithmic bounds remain positive. Readings retain exact values throughout animation.
- Selections remain attached to hidden items and use the localized hidden selection label. Hidden items cannot be read, selected by dragging, or activated. Visibility, source-data, or configuration changes cancel pending gestures and stale readings; animation frames preserve active gestures; removed data still prunes selection.
- With selection enabled, click or tap toggles the target. Control/Command-click or touch press-and-hold activates without changing selection. Releasing a hold does not also select. Without selection, click or tap activates when onActivate is supplied.
- Drag replaces selection; Shift or Control/Command adds and Alt removes. Escape, pointer cancellation, or a data or geometry change cancels a pending drag or hold without committing it.
- Use ChartSelection<HistogramSelectionItem> or ChartSelection<BoxPlotSelectionItem> for controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. Supply localized instructions, clear, empty, summary, item, and hidden labels. Existing ChartSelection and ChartSelectionLabels defaults remain compatible.
- Selection stays separate from readings and activation feedback. Retain available identities after data replacement and remove retired items from internal selection. Controlled state remains consumer-owned; unavailable items are omitted from rendering and commands. Selection and activation do not mutate statistics, records, or domains.
- Group visibility remains internal and never mutates consumer data. Stable group IDs retain visibility across data updates. Removing a group ID drops its hidden state; new group IDs begin visible.
- interaction.onActivate receives BoxPlotActivation<Datum> with kind, item, and input of pointer, keyboard, or touch. Summary activation includes summary with lowerWhisker, q1, median, q3, upperWhisker, whisker method, and outliers. Its source is raw with valid contributing data, or summary with the supplied datum. Outlier activation includes value and source of raw with the original datum, or summary with the supplied datum and outlierIndex. Summary inputs cannot reconstruct original observations. onSelectionChange receives named summary or outlier items.
- Raw mode calculates R-7 quartiles and defaults to Tukey 1.5-IQR whiskers; min-max remains explicit. Summary mode requires one ordered finite summary per group and explicit outliers. Runtime preparation rejects unknown or duplicate groups, reversed statistics, invalid values, and values outside an explicit domain. Interactive outlier IDs must be nonempty and unique within their group in either source mode.
- visibilityLabels requires a named visible legend. Validation uses the full supplied dataset before visibility, so hiding groups does not suppress invalid-data feedback.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The complete named source table remains available to assistive technology. Its one-pixel contained layout prevents long headers or many columns from widening the chart or document.
- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches separate legend name and eye controls. Enter or Space on an eye hides or restores its group and retains focus on that eye. Plot navigation visits visible items only. Show all restores every group and returns focus to the first eye.
- Tab reaches one title-named chart boundary. Without interaction, left and Right traverse group summaries in declared order. Direct pointer or touch input can read each outlier separately. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- With interaction, Left/Right and Up/Down traverse each group summary followed by its individual outliers in declared group order, including equal-valued outliers. Home/End reach the first and last targets. Enter or Space toggles selection; add Control/Command to activate independently. Without selection, Enter or Space activates. Escape cancels a drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.
- title, description, both axis labels, and dataTableLabel are required. Group labels must stand alone, and the legend label names their collection. A group tooltip reports its quartiles, median, and whiskers without the method or outlier list. An outlier tooltip reports only its group and that observation. The generated table retains the complete method and outlier data.
- Localize titles, descriptions, state copy, group labels, axis labels, units, and legend text. Use the quantitative axis formatTick for locale-specific summary and outlier formatting.
- ChartVisibilityLabels requires hideSeries(label) and showSeries(label) for the next eye action, hidden for table group labels, allHidden with title and description, and showAll for recovery. ChartSelection labels.hidden describes retained hidden selections separately.
- Localize every ChartSelection label and the instructions for the enabled selection and activation behavior.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each quartile box has a translucent group-color fill and stronger boundary. Whisker tails stop at Q1 and Q3, and their caps paint above the box so short whiskers remain visible. Only the median crosses the box. Outliers remain separate marks and direct reading dims every other mark. An interactive summary reading uses an inset outline and whisker cues, with no dot on the median. Selection frames the box; an outlier reading has a filled center and outlier selection uses a ring.
- aspectRatio changes the plot geometry used by axes, marks, clipping, hit testing, and navigation. Wide or square plots use the available canvas instead of letterboxing a fixed 640-by-360 SVG. minimumSize and overflow still control the legibility limit.
- The production chart frame scales type, strokes, boxes, whiskers, and outliers from measured space while preserving their statistical relationships. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary distribution group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve quartile, median, whisker, and outlier boundaries in system colors. Geometry and the generated table retain every statistical role without color.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Summary statistics and identified outliers animate over 240ms with cubic ease-out. Values and automatic bounds move together; selection and hit testing follow displayed boxes and outliers while readings, tables and callbacks report actual statistics. Updates retarget the current display. Changed group order/membership, outlier membership, configuration and empty states settle directly. Multiple changing outliers without stable IDs also settle directly. Reduced motion settles values and bounds immediately and removes emphasis and scrollbar transitions.
- Reduced motion settles automatic scale changes immediately, including when the preference changes during an animation. Otherwise axes and marks share the animated scale.
- Reduced motion replaces the activation pulse with a brief static acknowledgment. Selection and reading retain the same meanings.

## Examples

### BoxPlot with explicit statistical meaning

Compare distribution center, spread, whiskers, and outliers across declared groups.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BoxPlot} from '@trwhitney/component-library';

export function BoxPlotExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BoxPlot
        data={[{group: "north", value: 43}, {group: "north", value: 48}, {group: "north", value: 52}, {group: "north", value: 54}, {group: "north", value: 57}, {group: "north", value: 104}]}
        description="Compare the center, spread, and outliers of recovery time."
        distribution={{kind: "raw", valueAccessor: "value", whisker: "tukey"}}
        groupAccessor="group"
        groups={[{id: "north", label: "North loop"}]}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        legend={{label: "Turbine loops"}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        title="Recovery-time distribution"
        xAxis={{label: "Turbine loop"}}
        yAxis={{label: "Recovery time", unit: "minutes", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### BoxPlot with selection and activation

Hide or restore a group summary and its outliers together. Select targets and open their source details independently. Hidden selections remain labeled, and the full table retains hidden groups. The automatic value axis fits visible values; Show all series restores every group. The chart owns the uncontrolled selection in this example.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BoxPlot} from '@trwhitney/component-library';

export function SelectableBoxPlot({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BoxPlot
        data={[{id: "n-1", group: "north", value: 43}, {id: "n-2", group: "north", value: 48}, {id: "n-3", group: "north", value: 52}, {id: "n-4", group: "north", value: 54}, {id: "n-5", group: "north", value: 57}, {id: "n-6", group: "north", value: 104}]}
        dataTableLabel="Distribution data"
        description="Read the distribution, select statistical targets, and open their source details."
        distribution={{kind: "raw", valueAccessor: "value", whisker: "tukey"}}
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        groupAccessor="group"
        groups={[{id: "north", label: "North loop"}]}
        interaction={{
          getOutlierId: ({datum}) => datum.id,
          onActivate: (activation) => onOpenDetails(JSON.stringify(activation)),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap to select. Drag to select touched boxes and outlier centers inside the rectangle; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or touch hold opens details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} targets selected`,
              item: (item) => item.kind === "summary" ? `${item.groupId} summary` : `${item.groupId} outlier ${item.outlierId}`,
              hidden: (label) => `${label} (hidden)`,
            },
          },
        }}
        legend={{label: "Turbine loops"}}
        visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}
        title="Recovery-time distribution"
        xAxis={{label: "Turbine loop"}}
        yAxis={{label: "Recovery time", unit: "minutes", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse BoxPlot

groups with too little data for a useful distribution summary, unknown quartile or whisker methods, or a task that requires reading every observation in the plot

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BoxPlot} from '@trwhitney/component-library';

export function MisusedBoxPlot() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BoxPlot
        data={[{group: "north", value: 4}, {group: "south", value: 7}]}
        description="Each group contains one observation."
        distribution={{kind: "raw", valueAccessor: "value"}}
        groupAccessor="group"
        groups={[{id: "north", label: "North"}, {id: "south", label: "South"}]}
        legend={{label: "Groups"}}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        title="Single observations"
        xAxis={{label: "Group"}}
        yAxis={{label: "Value", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
