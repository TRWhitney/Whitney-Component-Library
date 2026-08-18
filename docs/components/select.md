# Select

Select chooses one stable value from a bounded collapsible collection.

## Use for

- one value must be chosen from a bounded collection and showing every option inline would consume unnecessary space

## Do not use for

- users need to type to filter or query options, compare a small set visibly, select several values, or preserve a truly immutable value

## Prefer instead

- Use ComboBox for editable filtering or asynchronous query results, RadioGroup for a small visible exclusive set, and plain text or a summary surface for immutable values.

## Composition and parts

- Render Select inside AppearanceProvider; supply stable string values and localized empty/loading copy, and keep the selected option present while its value is active.
- Select owns one field shell, trigger and value, chevron, support track, positioned popover, listbox, option copy, and selected rail.

## Preferred higher-level compositions

- Place related Select controls in FieldGroup or FormSection.

## Content

- Use a question-like visible label and concise parallel option labels; descriptions may clarify durable consequences but must not carry the only distinction between options.

## States

- Empty, selected, open, focused, required, invalid, disabled, loading, and option-disabled states remain distinct; Select is inherently non-editable and deliberately has no read-only prop.

## Control, events, validation, and forms

- Select owns either controlled value plus onChange or uncontrolled defaultValue; null means no selection, and option values are stable keys independent of array identity or order.
- onChange reports the accepted stable string value, or null after an external clear.
- Use isRequired and validationBehavior for native requirement, validate for value rules, and isInvalid with errorMessage for externally owned errors; loading is progress, not invalidity.
- name and form serialize the selected key through the hidden native control; native reset restores defaultValue, and required native validation prevents empty submission.

## Accessibility

- Select exposes a labeled button and single-select listbox with generated description, validation, required, disabled, loading, empty, and option-disabled relationships.

## Keyboard, labeling, localization, and direction

- Enter or Space opens the collection, arrows move focus, locale-aware typeahead locates options, Enter commits, and Escape dismisses and restores focus to the trigger.
- label is always visible; description, errors, requirement, loading, and empty copy are generated without consumer-authored ids.
- Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.
- Control copy, chevrons, option padding, and the selected leading rail follow inherited writing direction; option order remains application-defined.

## Appearance and responsive behavior

- Select extends the neutral field shell with one compact chevron and a raised anchored collection; selection is carried by a slim leading rail rather than selected-label color.
- The control fills its bounded parent; the anchored collection matches its trigger when space allows, stays inside the viewport, scrolls within available height, and wraps option copy at compact widths.

## Accent, forced colors, and reduced motion

- Selected option labels remain neutral; a slim leading rail and focus structure use the saturated same-hue accent roles for the raised collection surface.
- Forced-color mode maps control and overlay boundaries, focused options, and the selected rail to system colors without removing semantic option states.
- Reduced motion removes overlay, chevron, selected-rail, and loading transitions while retaining their settled state.

## Examples

### Choose one run mode

Choose one bounded mode while preserving native form serialization.

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
