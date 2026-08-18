# SegmentedControl

SegmentedControl selects one compact mode through equal adjacent radio segments.

## Use for

- a user switches among two or more compact, visible, mutually exclusive views or modes

## Do not use for

- options can be combined, labels need long explanations, or the choices are loaded from an open or large collection

## Prefer instead

- Use RadioGroup for verbose visible choices, CheckboxGroup for multiple selection, and later Select for a larger or open collection.

## Composition and parts

- Render SegmentedControl inside AppearanceProvider and provide at least two stable options whose short labels fit adjacent comparison.
- SegmentedControl owns one group label, equal segment track, single moving rail, and support track.

## Preferred higher-level compositions

- Place SegmentedControl near the content or mode it directly changes.

## Content

- Use short parallel labels and stable values; move verbose explanation to the group description rather than individual segments.

## States

- Selected, unselected, required, invalid, read-only, group-disabled, and option-disabled states preserve equal segment geometry.

## Control, events, validation, and forms

- SegmentedControl owns controlled or uncontrolled exclusive string selection; a controlled value uses one option value or null for the unselected state, while disabled options remain visible and the selected rail follows current state.
- onChange reports the newly selected segment value after accepted pointer or keyboard input.
- Use isRequired when an empty selection is invalid and isInvalid with errorMessage for externally owned invalidity.
- name and form serialize the selected native radio value; reset restores defaultValue without losing the rail position.

## Accessibility

- SegmentedControl exposes one named native radio group with one tab stop, equivalent segment labels, and generated group support relationships.

## Keyboard, labeling, localization, and direction

- Tab enters the selected or first enabled segment; arrow keys move focus and selection through enabled segments according to writing direction.
- label names the radiogroup and every segment has visible text; no accent-colored label carries selection alone.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- SegmentedControl keeps equal adjacent segments on one neutral surface; one group-owned accent bottom rail glides between selected segments while every label remains neutral and no selected fill or elevation persists.
- Choice rows fill their bounded parent; option copy wraps, and segmented peers remain equal while their labels wrap at compact widths.

## Accent, forced colors, and reduced motion

- Labels remain neutral; selected indicators, focus structure, and the segmented rail use the exact or saturated same-hue accent role appropriate to the surface.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose display density

Compare and switch among a compact bounded set of modes.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, SegmentedControl} from '@trwhitney/component-library';

export function DensitySegments() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SegmentedControl defaultValue="balanced" label="Display density" name="density" options={[
        {label: 'Conservative', value: 'conservative'},
        {label: 'Balanced', value: 'balanced'},
        {label: 'Fast', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not compress verbose answers into segments

Use RadioGroup when labels or option consequences need substantial vertical explanation.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, SegmentedControl} from '@trwhitney/component-library';

export function VerboseSegmentsCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SegmentedControl label="Run mode" options={[
        {label: 'Conservative with maximum precision', value: 'conservative'},
        {label: 'Balanced speed and precision', value: 'balanced'},
        {label: 'Fast with approximate results', value: 'fast'},
      ]} />
    </AppearanceProvider>
  );
}
```
