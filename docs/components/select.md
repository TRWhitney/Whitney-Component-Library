# Select

Select chooses one value from a finite collapsible list.

## Use for

- one value must be chosen from a finite list that would take too much space to show in full

## Do not use for

- users need to filter options, compare a small set in full, select several values, or view an immutable value

## Prefer instead

- Use ComboBox for editable filtering or asynchronous query results, RadioGroup for a small visible exclusive set, and plain text or a summary surface for immutable values.

## Composition and parts

- Render Select inside AppearanceProvider. Use durable string keys and localized empty and loading messages. Keep the selected option in the collection.
- Select includes a field shell, trigger and value, chevron, support area, positioned popover, listbox, option text, and selection rail.

## Preferred higher-level compositions

- Place related Select controls in FieldGroup or FormSection.

## Content

- Use a question-like visible label and concise parallel option labels; descriptions may clarify durable consequences but must not carry the only distinction between options.

## States

- Empty, selected, open, focused, required, invalid, disabled, loading, and option-disabled states are visually distinct. Select is non-editable and has no read-only prop.

## Control, events, validation, and forms

- Use value with onChange for controlled selection or defaultValue for uncontrolled selection. null means no selection. Option keys must not depend on array identity or order.
- onChange reports the selected string key, or null after an external clear.
- Use isRequired and validationBehavior for native requirements, validate for value rules, and isInvalid with errorMessage for errors supplied by the application. Loading does not imply an error.
- name and form serialize the selected key through the hidden native control; native reset restores defaultValue, and required native validation prevents empty submission.

## Accessibility

- Select exposes a labeled button and single-select listbox with generated description, validation, required, disabled, loading, empty, and option-disabled relationships.

## Keyboard, labeling, localization, and direction

- Enter or Space opens the collection, arrows move focus, locale-aware typeahead locates options, Enter commits, and Escape dismisses and restores focus to the trigger.
- label is always visible; description, errors, requirement, loading, and empty copy are generated without consumer-authored ids.
- Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.
- Control text, chevrons, option padding, and the selection rail follow inherited writing direction. The application sets option order.

## Appearance and responsive behavior

- Select extends the neutral field shell with one compact chevron and a raised anchored collection; selection is carried by a slim leading rail rather than selected-label color.
- The control fills its parent. The anchored list matches the trigger width when possible, stays inside the viewport, scrolls within the available height, and wraps option text on narrow screens.

## Accent, forced colors, and reduced motion

- Selected option labels stay neutral. A slim leading rail and focus outline use accent colors adjusted for the raised list background. Invalid fields retain their danger boundary and thicken it on enabled hover.
- Forced-color mode maps control and overlay borders, focused options, and the selection rail to system colors without hiding option states.
- Reduced motion removes overlay, chevron, selection-rail, and loading transitions. Their final states remain visible.

## Examples

### Choose one run mode

Choose one run mode and submit its key through the native form.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Select} from '@trwhitney/component-library';

export function BoundedRunMode() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Select defaultValue="balanced" emptyMessage="No modes" label="Run mode" name="mode" options={[
        {label: 'Conservative', value: 'conservative'},
        {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide a searchable collection behind Select

A large or query-driven collection needs text filtering.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Select} from '@trwhitney/component-library';

export function SearchableModesCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Select emptyMessage="No modes" label="Search a large mode catalog" options={[
        {label: 'Conservative', value: 'conservative'},
        {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```
