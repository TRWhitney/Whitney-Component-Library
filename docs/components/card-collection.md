# CardCollection

CardCollection groups keyed summary cards while keeping static content, nested actions, and selection explicit.

## Use for

- related records need separate summary surfaces with optional visible actions or explicit selection

## Do not use for

- hidden whole-card commands or links, long documents, sortable tables, menus, or unrelated dashboard layout

## Prefer instead

- Use List for simple sequences, DescriptionList for one record, ListBox for compact options, or Table for column comparison.

## Composition and parts

- Render CardCollection inside AppearanceProvider.
- Pass title, optional description, content, actions, and stable id through items. Selectable items may also declare disabled state.
- The component owns the responsive group, cards, headings, selection behavior, action slot, and collection feedback.

## Preferred higher-level compositions

- Place CardCollection in Section and use SearchField outside it when consumers filter the keyed items.

## Content

- Keep each card concise. Put commands in actions and declare selectionMode instead of attaching click behavior to the card surface.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.
- Selectable cards support focused, selected, disabled, hovered, and pressed states. Static cards expose none of those widget states.

## Control, events, validation, and forms

- Interactive card labels and whitespace use the pointer cursor. Disabled cards use not-allowed while nested enabled controls keep their own cursor. Passive records retain text selection.
- selectionMode none keeps cards static. Single and multiple modes add collection focus and selection through typed controlled or uncontrolled props.
- Dynamic item updates preserve collection focus when the focused stable id remains present.
- Selection callbacks use the same single or item-ordered multiple id values as ListBox. Nested actions own their own events.
- Every card id must be a nonempty stable string and unique within the collection.
- Static cards do not accept disabled state. Disabled selectable cards do not accept nested actions.
- CardCollection does not serialize selection. Nested form controls retain their own form behavior.

## Accessibility

- none mode renders a native list of named articles. Single and multiple modes render a labeled grid list with selected rows.
- Nested actions stay real controls and do not turn the whole static card into an unnamed button or link.

## Keyboard, labeling, localization, and direction

- Selectable cards use grid-list arrow, Home, End, typeahead, and selection keys. Nested controls retain their own keyboard behavior.
- ariaLabel names the group. title names each article or selectable row, and headingLevel preserves page hierarchy.
- Consumers localize the group label, card copy, action labels, empty copy, and status copy.
- Card flow, nested actions, focus, and the selection rail follow logical direction.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Cards use equal responsive columns and collapse to one column on compact viewports.

## Accent, forced colors, and reduced motion

- Selectable cards use an accent focus ring and selection rail without tinting ordinary card content.
- Card boundaries, focus, selection, disabled state, text, and actions use system colors.
- The selection rail settles without transition. Cards add no movement.

## Examples

### Run summary with an action

A static named article exposes its command as a visible nested Button.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, CardCollection} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <CardCollection
  ariaLabel="Recent runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  headingLevel={3}
  items={[{
    id: 'run-284',
    title: 'RUN 0284',
    description: 'Completed two minutes ago',
    actions: <Button size="compact">Inspect run</Button>,
  }]}
  selectionMode="none"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not hide interaction in the card surface

Do not add a click handler around the rendered card. Use an actions control, explicit selection, or a future navigation-card contract.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CardCollection} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <CardCollection
  ariaLabel="Recent runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  headingLevel={3}
  items={[{id: 'run-284', title: 'RUN 0284', description: 'Complete'}]}
  selectionMode="none"
  />
</AppearanceProvider>;
```
