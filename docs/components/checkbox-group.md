# CheckboxGroup

CheckboxGroup selects several related values under one accessible question.

## Use for

- a user may choose zero, one, or several related values under one question

## Do not use for

- exactly one answer is allowed or one independent checkbox needs no group question

## Prefer instead

- Use Checkbox for one independent value and RadioGroup or SegmentedControl for mutually exclusive selection.

## Composition and parts

- Render CheckboxGroup inside AppearanceProvider and supply durable option keys. Each option description must describe that value.
- CheckboxGroup includes a group label, option list, checkbox indicators, and support area.

## Preferred higher-level compositions

- Place CheckboxGroup inside FormSection for a larger configuration flow.

## Content

- Use a concise group label and parallel option labels. Option keys must work for state and form submission.

## States

- Empty, partial, and complete selection combine with required, invalid, read-only, group-disabled, and option-disabled states.

## Control, events, validation, and forms

- CheckboxGroup supports controlled or uncontrolled string-array selection. Each option remains an independent checkbox tab stop.
- onChange reports the complete selected string array after each accepted change.
- isRequired requires at least one selected option. isInvalid and errorMessage report group errors supplied by the application.
- name and form serialize one entry per selected option in option order; reset restores defaultValue and disabled options do not submit new selections.

## Accessibility

- CheckboxGroup exposes one named group and native checkbox options with generated group description, error, required, disabled, and read-only relationships.

## Keyboard, labeling, localization, and direction

- Tab moves among enabled checkboxes and Space toggles the focused option without changing any other selection.
- label names the group; each option has visible label text and may have a separately referenced description.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- CheckboxGroup aligns option rows and indicators in one vertical list.
- Choice rows fill their parent and option text wraps. Segmented options stay equal when their labels wrap on narrow screens.

## Accent, forced colors, and reduced motion

- Labels stay neutral. Selection indicators, focus outlines, and the segmented rail use the exact accent or a more saturated version of the same hue.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose multiple result layers

Choose any combination of result layers.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CheckboxGroup} from '@trwhitney/component-library';

export function ResultLayerChoices() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CheckboxGroup defaultValue={['thermal']} label="Result layers" name="layers" options={[
        {label: 'Thermal', value: 'thermal'},
        {label: 'Pressure', value: 'pressure'},
        {label: 'Velocity', value: 'velocity'},
      ]} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use multiple selection for one answer

A single mutually exclusive answer requires a radio group.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CheckboxGroup} from '@trwhitney/component-library';

export function ExclusiveLayersCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CheckboxGroup label="Quality" options={[
        {label: 'Conservative', value: 'conservative'},
        {label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```
