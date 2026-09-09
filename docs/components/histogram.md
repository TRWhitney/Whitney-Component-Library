# Histogram

Show a numeric distribution through contiguous intervals and an explicit ordinate.

## Use for

- frequency, proportion, or density across meaningful numeric intervals is the question

## Do not use for

- unrelated categories, pre-aggregated values presented as raw observations, overlapping intervals, or unequal-width bins with unscaled counts

## Prefer instead

- Use ColumnChart for unrelated categories, ScatterChart for paired measurements, or BoxPlot to compare compact distribution summaries across groups.

## Composition and parts

- Render Histogram inside AppearanceProvider in consumer-owned layout. Choose raw observations with explicit or automatic thresholds, or pre-binned records with lower, upper, ordinate accessor, and count, proportion, or density meaning. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel.
- Histogram contains a named figure, visible caption, optional feedback, interactive SVG plot, two quantitative axes, contiguous translucent bins, shared tooltip, polite announcement, and generated native data table.
- Optional interaction adds selection frames for bins or summaries, rings joined to the outlier border, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.

## Preferred higher-level compositions

- Compose the chart with application-owned details and separate controls. Share ChartSelection through controlled selectedItems and onSelectionChange when charts refer to the same target identities. Filtering and zooming remain application-owned.

## Content

- Name the measured variable, its unit, and the ordinate directly. Choose thresholds that produce meaningful intervals. Do not describe unrelated categories as bins or pass pre-aggregated values as raw observations.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Optional HistogramInteraction<Datum> enables independent activation and selection. HistogramSelectionItem identifies a bin with kind: bin, lower, upper, and upperInclusive. Identity follows that complete interval, including its inclusion rule. Count updates preserve identity; changing thresholds does not transfer selection to a different interval.
- Drag selects bin rectangles that intersect the drag rectangle, including zero-height bins at their rendered baseline.
- With selection enabled, click or tap toggles the target. Control/Command-click or touch press-and-hold activates without changing selection. Releasing a hold does not also select. Without selection, click or tap activates when onActivate is supplied.
- Drag replaces selection; Shift or Control/Command adds and Alt removes. Escape, pointer cancellation, or a data or geometry change cancels a pending drag or hold without committing it.
- Use ChartSelection<HistogramSelectionItem> or ChartSelection<BoxPlotSelectionItem> for controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. Supply localized instructions, clear, empty, summary, item, and hidden labels. Existing ChartSelection and ChartSelectionLabels defaults remain compatible.
- Selection stays separate from readings and activation feedback. Retain available identities after data replacement and remove retired items from internal selection. Controlled state remains consumer-owned; unavailable items are omitted from rendering and commands. Selection and activation do not mutate statistics, records, or domains.
- interaction.onActivate receives HistogramActivation<Datum> with the interval item, raw displayed value, ordinate of count, proportion, or density, and input of pointer, keyboard, or touch. source.kind is raw with data containing the valid original records in the bin, or binned with datum containing the supplied bin record. onSelectionChange receives named interval items. Density and proportion are never reported as counts.
- The discriminated distribution contract separates raw and binned inputs. Runtime validation rejects invalid thresholds, overlapping or reversed intervals, negative ordinates, proportions above one, out-of-domain values, and unequal-width count bins. Raw bins use lower-inclusive intervals; the final bin includes its upper bound.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Without interaction, left and Right traverse bins in domain order. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- With interaction, Left/Right and Up/Down traverse bins in interval order. Home/End reach the first and last targets. Enter or Space toggles selection; add Control/Command to activate independently. Without selection, Enter or Space activates. Escape cancels a drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.
- title, description, both axis labels, and dataTableLabel are required. The horizontal label names the measured variable and unit; the vertical label names the count, proportion, or density being plotted.
- Localize titles, descriptions, state copy, axis labels, and units. Use each axis formatTick for locale-specific interval and ordinate formatting.
- Localize every ChartSelection label and the instructions for the enabled selection and activation behavior.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Contiguous translucent bins share the numeric baseline and use stronger boundaries to keep adjacent intervals distinct. Direct reading dims every other bin and uses an inset outline. Selection frames meet at exact shared edges without covering the neighboring reading outline.
- The production chart frame scales type, strokes, and plot geometry from measured space while bin boundaries remain aligned to their numeric intervals. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent colors the histogram bins. Count, proportion, or density remains explicit in the axis, tooltip, and generated table rather than depending on color.
- Forced colors preserve axes and bin boundaries in system colors. Interval and ordinate values remain complete in the generated table.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Reduced motion removes bin-emphasis and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.
- Reduced motion replaces the activation pulse with a brief static acknowledgment. Selection and reading retain the same meanings.

## Examples

### Histogram with explicit statistical meaning

Show a numeric distribution through contiguous intervals and an explicit ordinate.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Histogram} from '@trwhitney/component-library';

export function HistogramExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Histogram
        data={[{latency: 8}, {latency: 21}, {latency: 44}, {latency: 47}]}
        description="See which restart-latency ranges occurred most often."
        distribution={{kind: "raw", accessor: "latency", thresholds: [0, 20, 40, 60]}}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        title="Restart latency"
        xAxis={{label: "Restart latency", unit: "ms", scale: {domain: [0, 60], type: "linear"}}}
        yAxis={{label: "Restarts", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

### Histogram with selection and activation

Select statistical targets and receive their values, source records, and input method in an independent activation callback. The chart owns the uncontrolled selection in this example.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Histogram} from '@trwhitney/component-library';

export function SelectableHistogram({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Histogram
        data={[{latency: 8}, {latency: 21}, {latency: 44}, {latency: 47}]}
        dataTableLabel="Distribution data"
        description="Read the distribution, select statistical targets, and open their source details."
        distribution={{kind: "raw", accessor: "latency", thresholds: [0, 20, 40, 60]}}
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        interaction={{
          onActivate: (activation) => onOpenDetails(JSON.stringify(activation)),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap to select. Drag to select intersected bins; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or touch hold opens details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} targets selected`,
              item: ({lower, upper, upperInclusive}) => `[${lower}, ${upper}${upperInclusive ? "]" : ")"} ms`,
              hidden: (label) => `${label} (hidden)`,
            },
          },
        }}
        title="Restart latency"
        xAxis={{label: "Restart latency", unit: "ms", scale: {domain: [0, 60], type: "linear"}}}
        yAxis={{label: "Restarts", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse Histogram

unrelated categories, pre-aggregated values presented as raw observations, overlapping intervals, or unequal-width bins with unscaled counts

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Histogram} from '@trwhitney/component-library';

export function MisusedHistogram() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Histogram
        data={[{productCode: 1}, {productCode: 2}, {productCode: 3}]}
        description="Product codes are unrelated categories."
        distribution={{kind: "raw", accessor: "productCode"}}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        title="Products"
        xAxis={{label: "Product code", scale: {type: "linear"}}}
        yAxis={{label: "Products", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
