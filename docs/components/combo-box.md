# ComboBox

ComboBox filters and chooses one stable value from local, dynamic, or asynchronous options.

## Use for

- one value is chosen from a collection that benefits from typing, locale-aware filtering, dynamic updates, or asynchronous query results

## Do not use for

- the collection is short and bounded, arbitrary custom text must be accepted as the value, several values may be selected, or all options need simultaneous comparison

## Prefer instead

- Use Select for a bounded collapsible list, RadioGroup for a small visible exclusive set, SearchField when submitting free text, and a later multi-select collection control for several values.

## Composition and parts

- Render ComboBox inside AppearanceProvider; use contains or startsWith for client filtering and manual when onInputChange drives a dynamic or asynchronous option list.
- ComboBox owns one field shell, text input, suggestion trigger, support track, positioned popover, listbox, option copy, and selected rail over a private shared collection model.

## Preferred higher-level compositions

- Place related ComboBox controls in FieldGroup or FormSection.

## Content

- Use a visible label that names the chosen value, a short input hint, parallel option labels, and explicit localized loading and empty messages.

## States

- Empty, editing, open, focused, selected, required, invalid, read-only, disabled, loading, and option-disabled states remain distinct; read-only preserves focus and text while rejecting edits and selection.

## Control, events, validation, and forms

- Selection and input text each have independent controlled or uncontrolled ownership; controlled value requires onChange, controlled inputValue requires onInputChange, and the two ownership channels cannot mix their respective default props.
- onInputChange reports each accepted query edit; onChange separately reports the committed stable option value or null.
- Use isRequired and validationBehavior for committed-selection requirement, validate for selected-value rules, and isInvalid with errorMessage for external errors; asynchronous failure is supplied as an explicit error state rather than disguised as empty.
- name and form serialize only the committed option key; editing text alone does not invent a submitted value, native reset restores both defaultValue and defaultInputValue, and required validation needs a committed option.

## Accessibility

- ComboBox exposes a labeled editable combobox, suggestion button, and single-select listbox with generated active-option, description, validation, read-only, loading, empty, and disabled relationships.

## Keyboard, labeling, localization, and direction

- Typing edits and filters, ArrowDown opens and moves through suggestions, Enter commits, Escape dismisses and restores the committed text, and Tab leaves the composite without trapping focus.
- label is always visible; placeholder is only a hint, and generated support, loading, empty, and active-option relationships require no consumer-authored ids.
- Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.
- Control copy, chevrons, option padding, and the selected leading rail follow inherited writing direction; option order remains application-defined.

## Appearance and responsive behavior

- ComboBox extends the neutral field shell with an editable input and compact suggestion trigger; its raised collection uses the same neutral labels and slim selected rail as Select.
- The control fills its bounded parent; the anchored collection matches its trigger when space allows, stays inside the viewport, scrolls within available height, and wraps option copy at compact widths.

## Accent, forced colors, and reduced motion

- Selected option labels remain neutral; a slim leading rail and focus structure use the saturated same-hue accent roles for the raised collection surface.
- Forced-color mode maps control and overlay boundaries, focused options, and the selected rail to system colors without removing semantic option states.
- Reduced motion removes overlay, chevron, selected-rail, and loading transitions while retaining their settled state.

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

### Do not add autocomplete to a short bounded choice

A short bounded collection does not benefit from editable filtering.

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
