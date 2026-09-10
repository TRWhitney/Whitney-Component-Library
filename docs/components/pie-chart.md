# PieChart

Show category shares of one whole in a proportional pie with bounded paging.

## Use for

- one nonnegative measure forms a meaningful whole and the relative category shares matter more than exact side-by-side comparison

## Do not use for

- precise comparison of similar values, values that do not form one meaningful whole, negative measures, independent series, or a trend over an ordered domain

## Prefer instead

- Use BarChart or ColumnChart for exact category comparison, LineChart for change over an ordered domain, or a native Table when values do not form one whole.

## Composition and parts

- Render PieChart inside AppearanceProvider in consumer-owned layout. Supply records, stable id and label accessors, one shared value meaning, state copy, localized paging and tooltip labels, a legend label, and a localized table label.
- Supply optional PartToWholeInteraction<Datum> through interaction, with independently optional selection and onActivate. The existing required idAccessor supplies each category identity. Applications own details and navigation and can share controlled selection between PieChart and DonutChart for the same category IDs.
- PieChart contains a named figure, visible caption, optional feedback, page indicator and Back button, interactive proportional pie, aggregate slice when needed, visible legend, shared tooltip, polite announcement, and generated native data table.
- Optional interaction adds outer-edge selection arcs, inset reading outlines, finite activation feedback, and a localized selection summary with Clear selection. Controls and application details remain outside the chart.

## Preferred higher-level compositions

- Compose the chart with separate filters and application-owned layout. Coordinate cross-chart selection through shared controlled category IDs; keep filtering and activation responses in the application.

## Content

- Use short category labels, one shared unit, a specific title, and a one-sentence description that states the comparison. Describe the aggregate as navigation over hidden records, never as a source category.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Zero is valid and remains in the table without a slice. All-zero data is empty. Invalid records are omitted and reported; an entirely invalid dataset is unavailable.

## Control, events, validation, and forms

- With more than eight positive categories, the first page shows seven ordinary slices and one aggregate. Activating the aggregate opens the next eight ranked categories, with another aggregate when records remain. Back returns through prior pages.
- Slice hover pops out the slice, mutes the others, and opens a cursor-following tooltip. Legend hover and focus use the same emphasis without a tooltip. A second activation releases the pin and temporary hover/focus emphasis without moving keyboard focus. Clicking a legend item pins that emphasis, another replaces it, and a repeat click or Escape clears it.
- With selection enabled, click or tap toggles an ordinary category. Control/Command-click activates without changing selection. Touch press-and-hold activates once and release does not also select. Movement and pointer cancellation cancel a pending hold. Without selection, click or tap activates when onActivate is supplied.
- Sweep across ordinary slices to collect only the categories crossed. A temporary dashed trail shows the pointer path until release or cancellation. A new drag replaces selection; Shift or Control/Command adds and Alt removes. The donut hole, empty space, and aggregate select nothing. Escape or pointer cancellation restores the selection from before the drag. A sweep never activates a category.
- Expansion and Back retain selection across pages. +N* appears when the remaining aggregate group contains selected or hidden categories. Both states share one asterisk. A selected or hidden ordinary category outside the aggregate does not add it. Hidden-only markers work without selection enabled and clear when those categories are restored; any remaining selection keeps the marker. Aggregate activation only navigates and never selects an aggregate ID or emits a category callback. Paging leaves the complete table intact.
- Ordinary legend names retain emphasis and pinning; they never select or activate categories. A directly hovered slice takes reading precedence over legend emphasis. Selection and activation do not mutate records, change proportions, or add slices for zero values.
- Supply visibilityLabels to add an independent eye beside each ordinary category. Hidden names remain in the ranked legend with closed eyes for restoration and consume no slice slots. Hiding pulls the next visible ranked category out of expansion. Restoration returns the category to rank order and moves overflow back into expansion. When all remaining visible categories fit, expansion disappears. The expansion has no eye; its legend entry opens the next page. Hiding clears that category pin and current readings, cancels pending gestures, and excludes hidden slices from pointer, keyboard, activation, and sweep targets.
- Page boundaries follow visible capacity and retain hidden legend entries in their ranked range. Category range labels cover that legend range, including hidden entries. If pages collapse, the current page settles to the nearest available page and stays there after restoration. Expansion counts and asterisks describe the remaining records, including hidden entries. Compact legends scroll within a bounded area. Visible slices refill the circle after hiding. For values 50/30/20, hiding 50 leaves shares of 60%/40% and a donut center total of 50. The table retains all valid raw records. Visible rows use the visible-total denominator; hidden rows use visibilityLabels.hidden in place of a percentage. Zero rows remain valid without a slice or eye.
- When all categories are hidden, pages collapse to one and visibilityLabels.allHidden replaces the plot. The full legend, table and selection remain available. Recovery copy should offer an individual eye or Show all; there is no other page to navigate to. Show all restores every category and focuses the first eye.
- PieChart keeps readings, legend emphasis, and chart paging internal. Pointer, keyboard, touch, and Back interaction do not change consumer data.
- interaction.onActivate receives PartToWholeActivation<Datum> with item containing id, the original datum, label, raw value, total, shareOfTotal, shareOnPage, and input of pointer, keyboard, or touch. Shares are fractions. total and shareOfTotal use the exact sum of visible valid categories across all pages; shareOnPage uses the sum of ordinary visible categories, excluding the aggregate, matching the existing reading denominator. No renderer objects or persistent inspected state are exposed.
- selection combines ChartSelection<PartToWholeSelectionItem> with a required localized containsSelection string. Use controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. Do not combine ownership models. onSelectionChange receives category items with stable id values independently of activation.
- Stable IDs preserve selection through value updates, reordering, paging, and hiding. Hidden positive categories retain selection and count toward the expansion asterisk. Off-page positive categories remain available and selected. Internal selection retires removed, invalid, and zero-valued categories. Controlled state remains application-owned; unavailable IDs are omitted from rendering and commands. Data, geometry, page, or interaction-mode changes cancel pending gestures and activation feedback.
- TypeScript limits accessors, aggregate sizing, labels, and state copy. Runtime preparation requires stable unique ids, nonempty labels, and finite nonnegative numbers. Zero is valid; negative and non-finite records are invalid. Positive categories rank by value with source order breaking ties.
- Part-to-whole charts are not form controls and do not submit, validate, or reset values. Place dataset controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the part-to-whole question. One title-named keyboard boundary owns slice readings and page announcements. The SVG is hidden from assistive technology, and the generated native table retains every valid category, including zero values and categories outside the current page.
- Optional selection adds localized instructions, a selected count, category names, off-page labels, and Clear selection outside the SVG. The aggregate announces containsSelection when its remaining categories include a selection and names hidden remaining categories with visibilityLabels.hidden.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right read visible slices clockwise. Home and End reach page endpoints. Enter or Space on the aggregate opens the next page and reads its first slice. Escape clears the reading. Back returns to the prior page.
- With selection enabled, Enter or Space toggles the current ordinary category; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates when onActivate is supplied. Escape cancels an active drag and restores its prior selection before clearing a reading. Every ordinary visible category and the aggregate remain keyboard reachable.
- title, description, dataTableLabel, value label, legend label, state copy, page range, Back, aggregate count, and share labels are required. Category ids stay stable while labels provide human-readable names.
- selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Use stable IDs to name categories and describe the enabled gestures. selection.containsSelection supplies the accessible equivalent of the aggregate asterisk.
- visibilityLabels supplies hidden, hideSeries(label), showSeries(label), showAll, and allHidden title/description. Label shareOfTotal and the donut center as visible totals when enabling visibility. selection.labels.hidden should describe hidden or off-page categories.
- Localize all visible and announced copy. categoryRange and moreCategories receive their numeric inputs, while value.formatValue controls locale-specific number formatting.
- Caption, paging copy, legend labels, tooltip copy, and table content follow inherited writing direction. Slice order remains clockwise after ranking by value.

## Appearance and responsive behavior

- Ordinary slices remain proportional to one another. The aggregate uses a dashed boundary and bold +N count. It is proportional by default, while aggregateSizing="smallest" makes it smaller than every ordinary slice without changing their relative proportions.
- Selected slices have an outer-edge arc. The current reading has an inset dashed outline and the existing pop-out, separate from selection. Activation gives finite pulse feedback, including repeated activation of the same category. These cues preserve slice proportions in light, dark, and compact layouts without a whole-chart focus outline.
- Like other chart figures, the default area stays bounded instead of filling an arbitrarily wide parent. Available width and height both bound the chart. Compact layouts reduce caption, paging, Back, legend type, swatches, gaps, and padding while preserving a balanced plot. Tall narrow areas may stack. The legend uses ScrollRegion transient scrollbar behavior without container chrome.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ranked category on each original page. Later categories use the role-aware chart palette. Colors and patterns stay attached to categories when hiding or restoration moves them between pages. A repeated color also receives a stable dash treatment so color is never its only identity.
- Forced colors preserve slice boundaries and the aggregate dash in system colors. Repeated roles retain their dash treatment, and the generated table remains the complete non-color representation.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Visibility animates slice boundaries over 240ms and can reverse from the current angles. Reduced motion settles immediately; paging and source-data changes reset directly. Readings, callbacks, table percentages, and the donut center always use exact current values, never interpolated values.
- Reduced motion removes slice pop-out and scrollbar-fade transitions. Reading, focus, paging, emphasis, and native scrolling behavior stays the same.
- Reduced motion replaces each activation pulse with brief static feedback. Callbacks and selection remain the same.

## Examples

### PieChart with complete category data

Show category shares of one whole in a proportional pie with bounded paging.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, PieChart} from '@trwhitney/component-library';

export function PieChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <PieChart
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
      />
    </AppearanceProvider>
  );
}
```

### PieChart with selection and activation

The chart owns selection in this uncontrolled example. Activation sends the original category record, stable ID, values, shares, and input method to application-owned details. The live example uses controlled selection and separate switches for selection and details.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, PieChart} from '@trwhitney/component-library';

export function SelectablePieChart({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <PieChart
        data={[{id: "residential", label: "Residential", value: 43}, {id: "offices", label: "Offices", value: 26}]}
        dataTableLabel="Annual energy by category"
        description="Residential customers account for the largest share of annual metered energy."
        emptyState={{title: "No energy use", description: "Choose a year with recorded use."}}
        idAccessor="id"
        invalidData={{title: "Invalid energy use", description: "Correct negative or non-finite values."}}
        labelAccessor="label"
        labels={{back: "Back", category: "Customer category", categoryRange: ({start, end, total}) => `Categories ${start} to ${end} of ${total}`, moreCategories: (count) => `More categories (${count})`, shareOfTotal: "Share of visible total", shareOnPage: "Share on this page"}}
        legend={{label: "Categories on this page"}}
        title="Community energy use"
        value={{accessor: "value", label: "Energy use", unit: "MWh"}}
        visibilityLabels={{hidden: "Hidden", hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, showAll: "Show all categories", allHidden: {title: "All categories are hidden", description: "Restore a category or show all categories."}}}
        interaction={{
          onActivate: ({item, datum, value, total, shareOfTotal, shareOnPage, input}) => onOpenDetails(`${datum.label} [${item.id}]: ${value} of ${total} MWh, ${(shareOfTotal * 100).toFixed(1)}% of total, ${(shareOnPage * 100).toFixed(1)}% of this page, opened by ${input}`),
          selection: {
            defaultSelectedItems: [],
            containsSelection: "Contains selected categories",
            labels: {
              instructions: "Click or tap to select a category. Sweep across slices to select those crossed; Shift or Control/Command adds, Alt removes, and Escape restores selection. Control/Command-click or touch press-and-hold opens details. Arrow keys read slices; Home and End reach endpoints. Enter or Space selects; add Control/Command to open details. The aggregate opens the next page.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => `${count} categories selected`,
              item: ({id}) => id === "residential" ? "Residential" : "Offices",
              hidden: (label) => `${label} (hidden or on another page)`,
            },
          },
        }}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use PieChart for precise comparison

Use BarChart or ColumnChart when small differences need precise comparison against a common baseline.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, PieChart} from '@trwhitney/component-library';

export function MisusedPieChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <PieChart
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
      />
    </AppearanceProvider>
  );
}
```
