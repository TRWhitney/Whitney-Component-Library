# DonutChart

Show category shares of one whole in a proportional ring with a derived center total.

## Use for

- one nonnegative measure forms a meaningful whole and the relative category shares matter more than exact side-by-side comparison

## Do not use for

- precise comparison of similar values, values that do not form one meaningful whole, negative measures, independent series, or a trend over an ordered domain

## Prefer instead

- Use BarChart or ColumnChart for exact category comparison, LineChart for change over an ordered domain, or a native Table when values do not form one whole.

## Composition and parts

- Render DonutChart inside AppearanceProvider in consumer-owned layout. Supply records, stable id and label accessors, one shared value meaning, state copy, localized paging and tooltip labels, a legend label, and a localized table label.
- DonutChart contains a named figure, visible caption, optional feedback, page indicator and Back button, interactive proportional ring, aggregate slice when needed, derived total and localized label in its center, visible legend, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose the chart with separate filters and application-owned layout. Keep cross-chart selection and filtering outside the component.

## Content

- Use short category labels, one shared unit, a specific title, and a one-sentence description that states the comparison. Center copy names the derived total. Describe the aggregate as navigation over hidden records, never as a source category.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Zero is valid and remains in the table without a slice. All-zero data is empty. Invalid records are omitted and reported; an entirely invalid dataset is unavailable.

## Control, events, validation, and forms

- With more than eight positive categories, the first page shows seven ordinary slices and one aggregate. Activating the aggregate opens the next eight ranked categories, with another aggregate when records remain. Back returns through prior pages.
- Slice hover pops out the slice, mutes the others, and opens a cursor-following tooltip. Legend hover and focus use the same emphasis without a tooltip. Clicking a legend item pins that emphasis, another replaces it, and a repeat click or Escape clears it.
- DonutChart emits no consumer events and does not filter, select, or mutate records. Paging changes only the visible chart page; the table remains complete.
- DonutChart keeps readings, legend emphasis, and chart paging internal. Pointer, keyboard, touch, and Back interaction do not change consumer data.
- TypeScript limits accessors, aggregate sizing, labels, and state copy. Runtime preparation requires stable unique ids, nonempty labels, and finite nonnegative numbers. Zero is valid; negative and non-finite records are invalid. Positive categories rank by value with source order breaking ties.
- Part-to-whole charts are not form controls and do not submit, validate, or reset values. Place dataset controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the part-to-whole question. One title-named keyboard boundary owns slice readings and page announcements. The SVG is hidden from assistive technology, and the generated native table retains every valid category, including zero values and categories outside the current page.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right read visible slices clockwise. Home and End reach page endpoints. Enter or Space on the aggregate opens the next page and reads its first slice. Escape clears the reading. Back returns to the prior page.
- title, description, dataTableLabel, value label, legend label, state copy, page range, Back, aggregate count, and share labels are required. Category ids stay stable while labels provide human-readable names.
- Localize all visible and announced copy. categoryRange and moreCategories receive their numeric inputs, while value.formatValue controls locale-specific number formatting.
- Caption, paging copy, legend labels, tooltip copy, and table content follow inherited writing direction. Slice order remains clockwise after ranking by value.

## Appearance and responsive behavior

- Ordinary slices remain proportional to one another. The aggregate uses a dashed boundary and bold +N count. It is proportional by default, while aggregateSizing="smallest" makes it smaller than every ordinary slice without changing their relative proportions.
- Available width and height both bound the chart. Compact layouts reduce caption, paging, Back, legend type, swatches, gaps, and padding while preserving a balanced plot. Tall narrow areas may stack. The legend uses ScrollRegion transient scrollbar behavior without container chrome.

## Accent, forced colors, and reduced motion

- Application accent identifies the largest visible category. Later categories use the role-aware chart palette. A repeated color also receives a stable dash treatment so color is never its only identity.
- Forced colors preserve slice boundaries and the aggregate dash in system colors. Repeated roles retain their dash treatment, and the generated table remains the complete non-color representation.
- Reduced motion removes slice pop-out and scrollbar-fade transitions. Reading, focus, paging, emphasis, and native scrolling behavior stays the same.

## Examples

### DonutChart with complete category data

Show category shares of one whole in a proportional ring with a derived center total.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DonutChart} from '@trwhitney/component-library';

export function DonutChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DonutChart
        data={[{id: "residential", label: "Residential", value: 43}, {id: "offices", label: "Offices", value: 26}]}
        dataTableLabel="Annual energy by category"
        description="Residential customers account for the largest share of annual metered energy."
        emptyState={{title: "No energy use", description: "Choose a year with recorded use."}}
        idAccessor="id"
        invalidData={{title: "Invalid energy use", description: "Correct negative or non-finite values."}}
        labelAccessor="label"
        labels={{back: "Back", category: "Customer category", categoryRange: ({start, end, total}) => `Categories ${start} to ${end} of ${total}`, moreCategories: (count) => `More categories (${count})`, shareOfTotal: "Share of total", shareOnPage: "Share on this page"}}
        legend={{label: "Visible categories"}}
        title="Community energy use"
        value={{accessor: "value", label: "Energy use", unit: "MWh"}}
        totalLabel="MWh total"
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use DonutChart for precise comparison

Use BarChart or ColumnChart when small differences need precise comparison against a common baseline.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DonutChart} from '@trwhitney/component-library';

export function MisusedDonutChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DonutChart
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        data={[{id: "north", label: "North", value: 41}, {id: "south", label: "South", value: 42}]}
        description="Nearly equal regional readings need exact comparison."
        idAccessor="id"
        labelAccessor="label"
        labels={{back: "Back", category: "Region", categoryRange: ({start, end, total}) => `Categories ${start} to ${end} of ${total}`, moreCategories: (count) => `More categories (${count})`, shareOfTotal: "Share of total", shareOnPage: "Share on this page"}}
        legend={{label: "Regions"}}
        title="Regional readings"
        value={{accessor: "value", label: "Reading"}}
        totalLabel="Total readings"
      />
    </AppearanceProvider>
  );
}
```
