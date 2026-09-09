# RadarChart

Compare a few subjects across ordered qualities on one shared radial scale.

## Use for

- comparing a few subjects across three or more ordered qualities that share one meaningful nonnegative scale

## Do not use for

- dimensions with unrelated units, precise value comparison, fewer than three dimensions, negative measures, too many spokes, or enough overlapping series to obscure their shapes

## Prefer instead

- Use BarChart or ColumnChart for precise comparison, LineChart for change over an ordered domain, separate charts for unrelated units, or a native Table when many dimensions or series must remain exact.

## Composition and parts

- Render RadarChart inside AppearanceProvider in consumer-owned layout. A dimension is one measured quality and one spoke. A series is one subject and one polygon. Supply at least three ordered dimensions, one to six series records, stable ids, labels, one shared value meaning, state copy, a legend label, and a table label.
- RadarChart contains a named figure, visible caption, optional feedback, shared polygon guide and spokes, exact source points, one polygon per valid series, visible legend, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose RadarChart with separate filters and application-owned layout. Keep cross-chart selection and filtering outside the component.

## Content

- Keep dimension and series labels short. Use one unit and one shared interpretation for every value. Order dimensions deliberately because their adjacency shapes the polygon. Limit spokes and overlapping series to what remains readable.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. An all-zero valid series remains in the table but draws no polygon or points. Invalid series are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Hidden profiles stay in the complete table with a localized hidden label. All-hidden recovery keeps the caption, legend, table and selected summary; Show all restores profiles and focuses the first eye. Hidden profiles cannot be read, selected by a gesture, activated or traversed by keyboard. Removing a profile ID drops its visibility state; value updates retain it.
- Pointer and touch readings emphasize one profile on one axis. Point mode reports the chosen profile; dimension mode reports all visible profiles on that axis. Radial guides reach exact values. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins it; another legend choice replaces it. A pinned series receives pointer priority where values are close or overlap. Repeat the pinned choice or press Escape to clear it. Repeating the choice also clears temporary hover/focus emphasis without moving keyboard focus. Emphasis never hides source data. Optional visibilityLabels adds a separate eye after each legend name. Hiding clears its pin and keeps its legend position, color and pattern. Hidden names cannot gain emphasis.
- Optional interaction targets one point or a whole dimension. Click or tap selects when selection is enabled; Control/Command-click activates independently. Touch press-and-hold activates without changing selection on release. Without selection, click or tap activates directly.
- Drag a visible rectangle to select positive value centers inside. In dimension mode, one included center qualifies the dimension. A drag replaces selection, Shift or Control/Command adds, Alt removes, and Escape or pointer cancellation restores the prior selection. Dragging never activates.
- Zero and missing-as-zero values remain keyboard targets and belong to whole-dimension selection. Pointer clicks target visible positive value dots. The shared center and visual shoulders are not pointer targets; rectangle selection uses positive centers only.
- Selected points use rings joined to their colored borders. Selected dimensions underline their labels. Neutral filled centers preview the exact target while profile hover stays independent of target mode. Legend focus and pinning prioritize only profiles that overlap the pointer.
- interaction.selection accepts ChartSelection<RadarSelectionItem>. Each item contains a stable dimensionId and, for point targets, seriesId. Omit selectedItems for internal selection or supply selectedItems with onSelectionChange for application ownership. Selection survives reordering, retains zero values and hidden profiles, and retires removed or invalid targets. Hidden selections use selection.labels.hidden. A selected dimension keeps its identity when profiles are hidden. Changing target mode retires incompatible items.
- interaction.onActivate receives RadarActivation<Datum> with item, dimension id and label, input, and values. Each value has seriesId, label, exact value, and the original datum record. A point activation includes one profile; a dimension activation includes all visible profiles, including zeros. Activation is independent of persistent selection.
- Data, visibility, geometry, presentation, target, and enabled interaction changes cancel pending gestures and activation feedback. Replacing a callback alone preserves a pending gesture and uses the current callback. Readings and legend emphasis remain internal and never mutate consumer records.
- TypeScript requires at least three dimensions and limits data to one through six series. Runtime preparation requires unique usable ids and labels. A missing dimension becomes zero. A negative or non-finite dimension value invalidates the entire series.
- RadarChart is not a form control and does not submit, validate, or reset values. Place dataset controls beside it in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the comparison. One title-named keyboard boundary announces the active dimension and every visible series value. The SVG is hidden from assistive technology, and a generated native table lists dimensions as rows and series as columns.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right traverse dimensions and stop at the ends. With interaction, Up and Down traverse profiles, including zero values, and Home and End reach the first and last dimension. Enter or Space selects; Control/Command plus Enter or Space activates independently. Without selection, Enter or Space activates directly. Escape cancels a drag or clears a reading. Focus appears at the current value without outlining the whole chart. Legend buttons retain their own focus, pin, replacement, and Escape behavior.
- title, description, dataTableLabel, value label, dimension heading, legend label, and state copy are required. Dimension and series ids stay stable while their labels provide readable names.
- Localize all visible and announced copy, dimension labels, series labels, and units. value.formatValue controls locale-specific number formatting. visibilityLabels supplies hideSeries, showSeries, hidden, showAll and allHidden copy.
- Caption, legend, tooltip, and table content follow inherited writing direction. Declared dimension order remains fixed around the chart.

## Appearance and responsive behavior

- Every series uses the same nonnegative scale. Exact source values place the points. Direct hover draws a center-to-point guide and mutes the other series. Its neutral reading fill reaches the inside of the point border at each rendered size. When an isolated positive point would collapse a fill into a line, small shoulders shape the neighboring corners. These shoulders are visual-only and never change exact points, readings, or table values.
- Like other chart figures, the default area stays bounded instead of filling an arbitrarily wide parent. Available width and height bound the chart. Compact layouts reduce caption, legend type, swatches, gaps, and padding while increasing SVG label size enough to survive plot scaling. Long plot labels may shorten while the table keeps their complete text. Tall narrow areas stack the legend below the plot. minimumSize and overflow retain the chart family local-scroll choice, and the legend uses the transient ScrollRegion scrollbar behavior without container chrome.

## Accent, forced colors, and reduced motion

- Application accent identifies the first series. Later series use the role-aware chart palette. Line patterns supplement color when polygons overlap.
- Forced colors preserve guides, spokes, point boundaries, and polygon line patterns in system colors. The generated table remains the complete non-color representation.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Filled point pulses use a ten-screen-pixel base radius with the shared expansion and fade, including compact charts.
- Point activation briefly pulses its marker. Dimension activation grows a radial guide from the center through the furthest actual value, holds at full length, then fades. An all-zero dimension briefly underlines its label because it has no line extent. Reduced motion uses brief static activation feedback and removes series-emphasis and scrollbar-fade transitions. With visibility enabled, one interruptible 240ms animation fits the shared zero-based scale to visible profiles. Restored marks stay inside the outer radar edge while the scale expands. Reduced motion settles the scale immediately. Exact readings and table values do not change.

## Examples

### RadarChart with complete and missing dimensions

Compare subjects across ordered dimensions on one shared, nonnegative score scale.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadarChart} from '@trwhitney/component-library';

export function RadarChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadarChart
        data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3}, {id: "scout", label: "Scout", speed: 2, range: 5}]}
        dataTableLabel="Vehicle profile data"
        description="Courier and Scout scores across shared vehicle qualities."
        dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}
        emptyState={{title: "No scores", description: "Choose vehicles with recorded scores."}}
        idAccessor="id"
        invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}
        labelAccessor="label"
        labels={{dimension: "Quality"}}
        legend={{label: "Vehicles"}}
        visibilityLabels={{hidden: "Hidden", hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, showAll: "Show all profiles", allHidden: {title: "All profiles hidden", description: "Use an eye to restore a profile."}}}
        title="Vehicle profiles"
        value={{label: "Score", unit: "points"}}
      />
    </AppearanceProvider>
  );
}
```

### RadarChart activation with original profile data

Use the original profile record from a point activation to open application-owned details. Add interaction.selection to enable independent persistent selection.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadarChart} from '@trwhitney/component-library';

export function RadarActivationExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadarChart
        data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3, detailsUrl: "/vehicles/courier"}]}
        dataTableLabel="Vehicle profile data"
        description="Open a measured value to view its vehicle."
        dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}
        emptyState={{title: "No scores", description: "Choose a vehicle with scores."}}
        idAccessor="id"
        interaction={{target: "point", onActivate: ({values}) => { const profile = values[0]; if (profile) window.location.assign(profile.datum.detailsUrl); }}}
        invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}
        labelAccessor="label"
        labels={{dimension: "Quality"}}
        legend={{label: "Vehicles"}}
        title="Open vehicle details"
        value={{label: "Score", unit: "points"}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not mix unrelated measures in RadarChart

Use separate charts or a table when the dimensions use unrelated units or need precise comparison.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadarChart} from '@trwhitney/component-library';

export function MisusedRadarChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadarChart
        data={[{id: "site-a", label: "Site A", cost: 4200, temperature: 18, satisfaction: 4}]}
        dataTableLabel="Site readings"
        description="Cost, temperature, and satisfaction use unrelated scales."
        dimensions={[{id: "cost", label: "Cost", accessor: "cost"}, {id: "temperature", label: "Temperature", accessor: "temperature"}, {id: "satisfaction", label: "Satisfaction", accessor: "satisfaction"}]}
        emptyState={{title: "No readings", description: "Choose a site with readings."}}
        idAccessor="id"
        invalidData={{title: "Invalid readings", description: "Correct negative or non-finite readings."}}
        labelAccessor="label"
        labels={{dimension: "Measure"}}
        legend={{label: "Sites"}}
        title="Site comparison"
        value={{label: "Mixed reading"}}
      />
    </AppearanceProvider>
  );
}
```
