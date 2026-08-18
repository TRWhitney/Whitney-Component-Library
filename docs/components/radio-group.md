# RadioGroup

RadioGroup selects one visible mutually exclusive value with native radio behavior.

## Use for

- a user must choose at most or exactly one answer from a visible set

## Do not use for

- several options may be combined, one immediate binary setting is changing, or the set is compact enough for segmented comparison

## Prefer instead

- Use CheckboxGroup for multiple selection, Switch for one immediate setting, and SegmentedControl for a compact bounded mode set.

## Composition and parts

- Render RadioGroup inside AppearanceProvider and supply a stable options tuple; keep all mutually exclusive options in the same group.
- RadioGroup owns a group label, radio option track, indicators, and support track.

## Preferred higher-level compositions

- Place RadioGroup inside FormSection for a larger configuration flow.

## Content

- Use parallel option labels and stable submitted values; descriptions clarify individual consequences without becoming option names.

## States

- Unselected and selected values combine with required, invalid, read-only, group-disabled, and option-disabled states.

## Control, events, validation, and forms

- RadioGroup owns controlled or uncontrolled exclusive string selection; a controlled value uses one option value or null for the unselected state, while focus movement remains distinct from the group container.
- onChange reports the newly selected option value.
- Use isRequired when no empty answer is valid and isInvalid with errorMessage for externally owned invalidity.
- name and form serialize the selected native radio value; reset restores defaultValue.

## Accessibility

- RadioGroup exposes one named native radio group with one tab stop and generated group description, error, required, disabled, and read-only relationships.

## Keyboard, labeling, localization, and direction

- Tab enters the selected or first enabled radio; arrow keys move focus and selection through enabled options according to writing direction.
- label names the radiogroup; every radio has visible option text and may reference one option description.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- RadioGroup uses aligned circular indicators and stable vertical option rows with neutral labels.
- Choice rows fill their bounded parent; option copy wraps, and segmented peers remain equal while their labels wrap at compact widths.

## Accent, forced colors, and reduced motion

- Labels remain neutral; selected indicators, focus structure, and the segmented rail use the exact or saturated same-hue accent role appropriate to the surface.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose one run mode

Expose one visible mutually exclusive run configuration.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadioGroup} from '@trwhitney/component-library';

export function RunModeChoice() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadioGroup defaultValue="balanced" label="Run mode" name="mode" options={[
        {label: 'Conservative', value: 'conservative'},
        {label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not spend vertical space on a compact mode switcher

A small compact set that benefits from adjacent comparison should use segmented selection.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadioGroup} from '@trwhitney/component-library';

export function DenseModeCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadioGroup label="Display density" options={[
        {label: 'Conservative', value: 'conservative'},
        {label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```
