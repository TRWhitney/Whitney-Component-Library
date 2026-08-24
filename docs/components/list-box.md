# ListBox

ListBox presents a visible keyed option collection with explicit none, single, or multiple selection.

## Use for

- one or more keyed items must be selected from a visible collection

## Do not use for

- commands, navigation destinations, hidden select fields, arbitrary interactive descendants, or tabular records

## Prefer instead

- Use Select for a collapsed single choice, Menu for commands, List for static content, or CardCollection for summary cards.

## Composition and parts

- Render ListBox inside AppearanceProvider.
- Pass label, optional description, disabled state, and stable id through library-owned items.
- The component owns the listbox, options, focus ring, selection rail, disabled state, and collection feedback.

## Preferred higher-level compositions

- Pair ListBox with SearchField when a visible result collection needs consumer-owned filtering.

## Content

- Labels are plain localized strings so locale-aware typeahead remains dependable.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.
- Options support focused, selected, disabled, hovered, and pressed states without conflating focus and selection.

## Control, events, validation, and forms

- selectionMode explicitly chooses none, single, or multiple behavior. Controlled and uncontrolled selection use separate typed props.
- Dynamic item updates preserve collection focus when the focused stable id remains present.
- onSelectionChange reports one id or null in single mode and an item-ordered id array in multiple mode.
- Every option id must be a nonempty stable string and unique within the collection.
- ListBox does not serialize values. Consumers own any form representation of collection selection.

## Accessibility

- ListBox owns listbox and option semantics, active focus, disabled options, and selected state.
- Focus and selection remain separate so moving through options does not silently commit a choice.

## Keyboard, labeling, localization, and direction

- Arrow keys move focus, Home and End move to boundaries, locale-aware typeahead finds labels, and Space or Enter toggles selection.
- ariaLabel supplies the required listbox name. Item labels supply option names and typeahead text.
- Consumers localize the collection label, item text, empty copy, and status copy.
- Arrow behavior and the selection rail follow the inherited text direction.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Options keep a touch-sized row and wrap secondary descriptions without horizontal overflow.

## Accent, forced colors, and reduced motion

- The active item uses the focus ring, while selected items use a separate accent rail.
- Focus, selection, boundaries, disabled state, and text use system colors.
- The selection rail settles without transition. No other motion is introduced.

## Examples

### Compare runs

Multiple selection is declared and keyed independently from keyboard focus.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ListBox} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <ListBox
  ariaLabel="Compared runs"
  defaultSelectedIds={['run-284']}
  emptyState={{kind: 'no-results', title: 'No matches', description: 'Try another query.'}}
  items={[
    {id: 'run-284', label: 'RUN 0284', description: 'Converged'},
    {id: 'run-283', label: 'RUN 0283', description: 'Converged'},
  ]}
  selectionMode="multiple"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not use options as commands

A command row belongs in Menu or Toolbar. ListBox models focus and selection, not command activation.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ListBox} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <ListBox
  ariaLabel="Commands"
  emptyState={{kind: 'no-data', title: 'No commands', description: 'No commands are available.'}}
  items={[{id: 'delete', label: 'Delete run'}]}
  selectionMode="none"
  />
</AppearanceProvider>;
```
