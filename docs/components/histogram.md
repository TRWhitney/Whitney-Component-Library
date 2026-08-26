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

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or separate controls and application-owned layout. Keep cross-chart selection, filtering, zooming, and brushing outside this component.

## Content

- Name the measured variable, its unit, and the ordinate directly. Choose thresholds that produce meaningful intervals. Do not describe unrelated categories as bins or pass pre-aggregated values as raw observations.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Histogram emits no consumer events and does not filter records, change domains, or own selection and coordinated chart state.
- Histogram manages direct bin readings internally. Pointer, keyboard, and touch interaction do not mutate observations, bins, or domains.
- The discriminated distribution contract separates raw and binned inputs. Runtime validation rejects invalid thresholds, overlapping or reversed intervals, negative ordinates, proportions above one, out-of-domain values, and unequal-width count bins. Raw bins use lower-inclusive intervals; the final bin includes its upper bound.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right traverse bins in domain order. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- title, description, both axis labels, and dataTableLabel are required. The horizontal label names the measured variable and unit; the vertical label names the count, proportion, or density being plotted.
- Localize titles, descriptions, state copy, axis labels, and units. Use each axis formatTick for locale-specific interval and ordinate formatting.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Contiguous translucent bins share the numeric baseline and use stronger boundaries to keep adjacent intervals distinct. Direct reading dims every other bin.
- The production chart frame scales type, strokes, and plot geometry from measured space while bin boundaries remain aligned to their numeric intervals. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent colors the histogram bins. Count, proportion, or density remains explicit in the axis, tooltip, and generated table rather than depending on color.
- Forced colors preserve axes and bin boundaries in system colors. Interval and ordinate values remain complete in the generated table.
- Reduced motion removes bin-emphasis and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.

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
