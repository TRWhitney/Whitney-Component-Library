# Sparkline

Show one compact ordered trend with exact current and observed-range context.

## Use for

- showing one compact trend whose ordered position, value range, current value, and observed extrema are explained by the nearby title and description

## Do not use for

- multiple series, tasks requiring visible axes or persistent values, unordered records, categorical comparison without trend meaning, or claims that direction is favorable or unfavorable without consumer-written context

## Prefer instead

- Use LineChart when visible axes, multiple series, annotations, or fuller trend comparison are required. Use BarChart or ColumnChart for precise discrete comparison, or a native Table when exact records are the primary task.

## Composition and parts

- Render Sparkline inside AppearanceProvider in consumer-owned layout. Supply one ordered record series, typed position and value accessors, position scale, value meaning, localized summary and missing labels, state copy, and a table label. Use valueRange when several sparklines need one fixed comparison range. Optional interaction requires getRowId to identify each record and can enable selection, activation, or both.
- Sparkline contains a named figure, standard visible caption, optional feedback, compact axis-free line, hollow current cue, directional half-filled range cues, cue-completing and ordinary temporary reading points, shared tooltip, polite announcement, derived summary, optional selection summary and clear control, and generated native data table.

## Preferred higher-level compositions

- Compose Sparkline with nearby consumer-owned metric context and filters. Give comparable sparklines the same valueRange and explain that shared range in their descriptions.

## Content

- Use a specific title and one factual sentence that explains the domain and trend without claiming that change is good or bad. Keep one value meaning and unit throughout. Use a fixed range only when it preserves the same comparison meaning across charts.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Missing values remain table rows and visual gaps. Non-finite values are omitted and reported; a nonempty series without a finite value becomes unavailable.

## Control, events, validation, and forms

- selection.presentation chooses one selection view: panel by default or controls for a compact count and clear action. The two views never render together. Both share the same selection and clear behavior; opening the count reveals localized interaction help. The panel keeps item names visible, while compact controls reveal them with the help.
- Pointer reads the nearest recorded position and follows the cursor. Touch retains an exact reading until another reading or an outside press replaces it. Missing positions remain readable and report the localized missing label. Tooltips add the localized lowest or highest label when the active value matches an observed extreme and add no range label otherwise.
- With interaction.selection, click or tap toggles a recorded value. Horizontal dragging selects recorded values between its starting and ending positions. A drag replaces selection; Shift or Control/Command adds and Alt removes. Escape, pointer cancellation, or changes to data, geometry, status or interaction cancel the preview. Missing readings remain readable gaps and cannot be selected or activated; zero remains a target.
- Control/Command-click or touch press-and-hold activates independently when selection is enabled. Without selection, ordinary click or tap activates. Selection supports controlled selectedItems and onSelectionChange or uncontrolled defaultSelectedItems. Removed or missing readings are pruned by stable row ID without transferring selection to replacement records.
- interaction.onActivate receives the stable row item, original datum, typed position, finite value and input method. Selection onSelectionChange returns row items. Sparkline never mutates consumer records.
- Runtime preparation preserves source order. Negative values and zero are valid. Missing values remain gaps. Non-finite values and invalid positions are omitted and reported. Fixed value ranges and numeric or time position domains must be ascending and finite. Interaction requires nonblank stable row IDs that are unique among prepared records. Distinct IDs can share a position and remain reachable in keyboard source order.
- Sparkline is not a form control and does not submit, validate, or reset values. Place dataset and range controls beside it in consumer-owned composition.

## Accessibility

- The complete named source table remains available to assistive technology. Its one-pixel contained layout prevents long headers or many columns from widening the chart or document.
- The standard visible title names one figure and the description explains the domain and trend meaning. One title-named keyboard boundary announces exact position and value readings. A localized derived summary exposes first, last, lowest, and highest valid values, and a generated native table preserves every valid position including missing values.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right move through records in source order and stop at the ends. Home and End reach the sequence endpoints. Missing positions remain readable. Enter or Space selects when selection is enabled; Control/Command plus Enter or Space activates independently. Without selection, Enter or Space activates. Escape clears the reading or cancels a drag. Pointer focus does not start a reading at the first record.
- title, description, dataTableLabel, position and value labels, first, last, lowest, highest, and missing labels, plus state copy are required. Position and value formatters provide exact readable values.
- Localize all visible and announced copy, summary labels, missing copy, and units. position.formatValue and value.formatValue control locale-specific formatting. Selection labels provide localized instructions, clearing, empty and count summaries, and reading names.
- Caption, tooltip, summary, and table follow inherited writing direction. The plotted series and keyboard reading retain source order.

## Appearance and responsive behavior

- One restrained line shows the ordered series without axes or a legend. Missing values break the line. The current valid record uses a hollow circle. Every other observed low fills the lower half of its circle, while every other observed high fills the upper half, including ties. Reading one of those cues fills its open area with the foreground color; an ordinary active reading uses the same solid foreground point. Neutral selection rings meet existing cue outlines without a gap; ordinary selected readings gain a base circle. Exact values remain in the tooltip, summary, announcement, and table.
- Like other chart figures, Sparkline keeps a bounded default area instead of filling an arbitrarily wide parent. It retains the standard caption and a legible line while omitting axes and a legend at every size. It never uses local scrolling. Its compact default and consumer minimumSize preserve the hollow current cue, directional half-filled low and high cues, and temporary reading points.

## Accent, forced colors, and reduced motion

- The application accent identifies the single line, directional observed-range cues, and hollow current cue. Filling the upper half for highs and lower half for lows separates the extrema without implying semantic good or bad.
- Forced colors preserve the line, directional half-filled low and high cues, hollow current cue, completed cue readings, ordinary foreground reading point, reading needle, selection rings and drag region in system colors. The current reading indicates keyboard focus without a whole-chart outline. The summary and table retain exact non-color meaning.
- Source values animate over 240ms with cubic ease-out. Stable interactive row IDs, or unique positions without interaction, retain identity. Selection follows the displayed line; text, tables and callbacks use supplied readings immediately. Minimum and maximum cues stay attached to their readings and crossfade when the extreme changes identity. Repeated updates retarget the current display. Reduced motion settles values and cues immediately; initial, position/order, gap, configuration and empty-state changes settle directly.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Current and observed-range cues remain still until their data changes. Reduced motion removes reading transitions while pointer, touch, keyboard, focus, tooltip, summary, and table behavior stays the same.

## Examples

### Sparkline selection with a missing position

Select recorded readings with stable month IDs while preserving the missing February position, current cue, observed range and complete structured reading. Applications can add onActivate to open details independently.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Sparkline} from '@trwhitney/component-library';

export function SparklineExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Sparkline
        interaction={{getRowId: datum => datum.month, selection: {labels: {instructions: "Click or tap to select. Drag across recorded values. Shift adds; Alt removes.", clear: "Clear selection", empty: "Nothing selected", summary: count => `${count} readings selected`, item: item => item.rowId, hidden: label => label}}}}
        data={[{month: "Jan", demand: 42}, {month: "Feb", demand: null}, {month: "Mar", demand: 51}]}
        dataTableLabel="Thermal demand history"
        description="Monthly thermal demand; February has no recorded reading."
        emptyState={{title: "No history", description: "Record demand to begin."}}
        invalidData={{title: "Invalid history", description: "Correct non-finite readings."}}
        labels={{first: "First", last: "Last", lowest: "Lowest", highest: "Highest", missing: "No reading"}}
        position={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        title="Thermal demand"
        value={{accessor: "demand", label: "Demand", unit: "MWh"}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not compress a full comparison into Sparkline

Use LineChart when several series, visible axes, annotations, or more detailed comparison context are required.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Sparkline} from '@trwhitney/component-library';

export function MisusedSparkline() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Sparkline
        data={[{month: "Jan", demand: 42, capacity: 58}]}
        dataTableLabel="Demand and capacity history"
        description="Demand and capacity over time."
        emptyState={{title: "No history", description: "Add records."}}
        invalidData={{title: "Invalid history", description: "Correct non-finite values."}}
        labels={{first: "First", last: "Last", lowest: "Lowest", highest: "Highest", missing: "No reading"}}
        position={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        title="Demand and capacity"
        value={{accessor: "demand", label: "Demand", unit: "MWh"}}
      />
    </AppearanceProvider>
  );
}
```
