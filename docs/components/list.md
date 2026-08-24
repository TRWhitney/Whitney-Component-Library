# List

List presents keyed static content with ordered, unordered, or visually unmarked native list semantics.

## Use for

- a readable sequence or set of related content needs native list semantics without selection

## Do not use for

- selection, tabular comparison, term and value pairs, navigation, or command rows

## Prefer instead

- Use DescriptionList for terms and values, ListBox for selection, or CardCollection for grouped summaries.

## Composition and parts

- Render List inside AppearanceProvider.
- Pass keyed items through items. primary and optional secondary content remain consumer-owned React content.
- The component owns the native list, keyed list items, copy layout, and collection feedback.

## Preferred higher-level compositions

- Place List in Section or Surface when the sequence needs a visible heading.

## Content

- Use number only when order matters, bullet for an unordered set, and none when surrounding presentation already supplies the grouping.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.

## Control, events, validation, and forms

- List has no command, navigation, focus-management, or selection behavior.
- Dynamic insertion, removal, and reordering occur by replacing items with the same stable id domain.
- Every item id must be a nonempty stable string and unique within the collection.
- List does not submit form values.

## Accessibility

- List renders native ul or ol and li semantics without adding focus or selection behavior.

## Keyboard, labeling, localization, and direction

- List adds no keyboard interaction to its content.
- ariaLabel names the native list for assistive technology.
- Consumers localize labels, item content, empty copy, and status copy.
- Markers and content inset follow logical inline direction in left-to-right and right-to-left contexts.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Long primary and secondary content wraps without horizontal overflow.

## Accent, forced colors, and reduced motion

- Ordered and unordered markers use the application accent rail color.
- Markers, text, and collection feedback use system colors.
- List has no motion. Spinner feedback follows its own reduced-motion behavior.

## Examples

### Ordered run sequence

A numbered process keeps its native order and concise secondary state.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, List} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <List
  ariaLabel="Run sequence"
  emptyState={{kind: 'no-data', title: 'No steps', description: 'Add a step first.'}}
  items={[
    {id: 'prepare', primary: 'Prepare mesh', secondary: 'Complete'},
    {id: 'solve', primary: 'Solve model', secondary: 'Running'},
  ]}
  marker="number"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not add selection to a content list

A selectable result set needs ListBox instead of click handlers on List rows.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, List} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <List
  ariaLabel="Runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  items={[{id: 'run-284', primary: 'RUN 0284'}]}
  marker="bullet"
  />
</AppearanceProvider>;
```
