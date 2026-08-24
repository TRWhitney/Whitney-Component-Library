# DescriptionList

DescriptionList presents keyed term and value pairs for one described subject.

## Use for

- a compact set of terms and corresponding values describes one subject

## Do not use for

- sortable records, selection, commands, navigation, or unrelated prose

## Prefer instead

- Use List for a sequence, CardCollection for separate summaries, or Table for comparable records and columns.

## Composition and parts

- Render DescriptionList inside AppearanceProvider.
- Pass keyed term and description content through items.
- The component owns the native description list, keyed pairs, compact reflow, and collection feedback.

## Preferred higher-level compositions

- Place DescriptionList beside a heading in Section or inside a detail Surface.

## Content

- Terms stay concise. Descriptions may contain formatted content but should not become dense tables or independent cards.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.

## Control, events, validation, and forms

- DescriptionList has no row activation, focus-management, or selection behavior.
- Dynamic insertion, removal, and reordering occur by replacing items with stable ids.
- Every pair id must be a nonempty stable string and unique within the collection.
- DescriptionList does not submit form values.

## Accessibility

- DescriptionList renders one native dl with paired dt and dd elements.

## Keyboard, labeling, localization, and direction

- DescriptionList adds no keyboard interaction to its content.
- ariaLabel names the description list for assistive technology.
- Consumers localize the label, terms, values, empty copy, and status copy.
- Term and description columns follow logical reading direction and stack on compact layouts.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Term and value columns stack below the compact breakpoint.

## Accent, forced colors, and reduced motion

- DescriptionList reserves accent for shared feedback and does not color ordinary values.
- Dividers, terms, values, and feedback use system colors.
- DescriptionList has no motion. Spinner feedback follows its own reduced-motion behavior.

## Examples

### Run facts

Terms and values describe one run without pretending to be a table.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DescriptionList} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <DescriptionList
  ariaLabel="Run details"
  emptyState={{kind: 'no-data', title: 'No details', description: 'Select a run first.'}}
  items={[
    {id: 'run', term: 'Run', description: 'RUN 0284'},
    {id: 'profile', term: 'Profile', description: 'Balanced'},
  ]}
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not imitate a data table

Repeated records with sortable columns belong in Table, not a description list.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DescriptionList} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <DescriptionList
  ariaLabel="Runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  items={[{id: 'run', term: 'RUN 0284', description: 'Complete'}]}
  />
</AppearanceProvider>;
```
