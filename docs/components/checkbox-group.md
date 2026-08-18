# CheckboxGroup

CheckboxGroup selects several related values under one accessible question.

## Use for

- a user may choose zero, one, or several related values under one question

## Do not use for

- exactly one answer is allowed or one independent checkbox needs no group question

## Prefer instead

- Use Checkbox for one independent value and RadioGroup or SegmentedControl for mutually exclusive selection.

## Composition and parts

- Render CheckboxGroup inside AppearanceProvider and supply a stable options tuple; option descriptions belong to their specific values.
- CheckboxGroup owns a group label, option track, checkbox indicators, and support track.

## Preferred higher-level compositions

- Place CheckboxGroup inside FormSection for a larger configuration flow.

## Content

- Use one concise group label and parallel option labels; each option value must be stable and suitable for state and form serialization.

## States

- Empty, partial, and complete selection combine with required, invalid, read-only, group-disabled, and option-disabled states.

## Control, events, validation, and forms

- CheckboxGroup owns controlled or uncontrolled string-array selection while preserving each option as an independent checkbox tab stop.
- onChange reports the complete selected string array after each accepted change.
- isRequired requires at least one selected option; isInvalid and errorMessage describe externally owned invalidity for the group.
- name and form serialize one entry per selected option in option order; reset restores defaultValue and disabled options do not submit new selections.

## Accessibility

- CheckboxGroup exposes one named group and native checkbox options with generated group description, error, required, disabled, and read-only relationships.

## Keyboard, labeling, localization, and direction

- Tab moves among enabled checkboxes and Space toggles the focused option without changing any other selection.
- label names the group; each option has visible label text and may have a separately referenced description.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- CheckboxGroup aligns equivalent option rows and indicators in one stable vertical choice track.
- Choice rows fill their bounded parent; option copy wraps, and segmented peers remain equal while their labels wrap at compact widths.

## Accent, forced colors, and reduced motion

- Labels remain neutral; selected indicators, focus structure, and the segmented rail use the exact or saturated same-hue accent role appropriate to the surface.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose multiple result layers

Choose any number of independently combinable result layers.

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
