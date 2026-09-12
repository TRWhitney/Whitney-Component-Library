# ComboBox

ComboBox filters local, dynamic, or asynchronous options and chooses one value.

## Use for

- one value is chosen from a collection that benefits from typing, locale-aware filtering, dynamic updates, or asynchronous query results

## Do not use for

- the list is short, custom text is a valid value, several values may be selected, or all options need to be visible at once

## Prefer instead

- Use Select for a finite collapsible list, RadioGroup for a small visible set, SearchField for submitted free text, and a future multi-select control for several values.

## Composition and parts

- Render ComboBox inside AppearanceProvider; use contains or startsWith for client filtering and manual when onInputChange drives a dynamic or asynchronous option list.
- ComboBox includes a field shell, text input, suggestion trigger, support area, positioned popover, listbox, option text, and selection rail.

## Preferred higher-level compositions

- Place related ComboBox controls in FieldGroup or FormSection.

## Content

- Use a visible label that names the chosen value, a short input hint, parallel option labels, and localized loading and empty messages.

## States

- Empty, editing, open, focused, selected, required, invalid, read-only, disabled, loading, and option-disabled states are visually distinct. Read-only keeps focus and text but rejects edits and selection.

## Control, events, validation, and forms

- Selection and input text may each be controlled or uncontrolled. Controlled value requires onChange, and controlled inputValue requires onInputChange. Do not pair either controlled prop with its default prop.
- onInputChange reports each query edit. onChange reports the committed option key or null.
- Use isRequired and validationBehavior to require a committed selection, validate for value rules, and isInvalid with errorMessage for application errors. Report asynchronous failure as an error, not an empty result.
- name and form serialize only the committed option key; editing text alone does not invent a submitted value, native reset restores both defaultValue and defaultInputValue, and required validation needs a committed option.

## Accessibility

- ComboBox exposes a labeled editable combobox, suggestion button, and single-select listbox with generated active-option, description, validation, read-only, loading, empty, and disabled relationships.

## Keyboard, labeling, localization, and direction

- Typing edits and filters, ArrowDown opens and moves through suggestions, Enter commits, Escape dismisses and restores the committed text, and Tab leaves the composite without trapping focus.
- label is always visible; placeholder is only a hint, and generated support, loading, empty, and active-option relationships require no consumer-authored ids.
- Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.
- Control text, chevrons, option padding, and the selection rail follow inherited writing direction. The application sets option order.

## Appearance and responsive behavior

- ComboBox extends the neutral field shell with an editable input and compact suggestion trigger; its raised collection uses the same neutral labels and slim selected rail as Select.
- The control fills its parent and inherits comfortable or compact density from AppearanceProvider. Compact option rows reduce padding while preserving wrapped descriptions; coarse pointers retain 44px minimum targets. The anchored list matches the trigger width, stays inside the viewport, and scrolls within the available height. Empty field support space is omitted unless reserveSupportSpace is true.

## Accent, forced colors, and reduced motion

- Selected option labels stay neutral. A slim leading rail and focus outline use accent colors adjusted for the raised list background. Invalid fields retain their danger boundary and thicken it on enabled hover.
- Forced-color mode maps control and overlay borders, focused options, and the selection rail to system colors without hiding option states.
- Reduced motion removes overlay, chevron, selection-rail, and loading transitions. Their final states remain visible.

## Examples

### Filter run modes

Filter a moderately sized local collection with locale-aware matching.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ComboBox} from '@trwhitney/component-library';

export function FilterRunModes() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ComboBox emptyMessage="No matching modes" label="Find run mode" placeholder="Type a mode" options={[
        {label: 'Conservative', value: 'conservative'},
        {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not add autocomplete to a short choice

A short list does not benefit from editable filtering.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ComboBox} from '@trwhitney/component-library';

export function ShortModeListCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ComboBox emptyMessage="No modes" label="Run mode" options={[
        {label: 'Conservative', value: 'conservative'},
        {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```
