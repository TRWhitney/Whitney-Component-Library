# SegmentedControl

SegmentedControl selects one compact mode through equal adjacent radio segments.

## Use for

- a user switches among two or more compact, visible, mutually exclusive views or modes

## Do not use for

- options can be combined, labels need long explanations, or the choices are loaded from an open or large collection

## Prefer instead

- Use RadioGroup for verbose visible choices, CheckboxGroup for multiple selection, and later Select for a larger or open collection.

## Composition and parts

- Render SegmentedControl inside AppearanceProvider. Provide at least two options with durable keys and short labels that fit side by side.
- SegmentedControl includes one group label, equal segment row, moving rail, and support area.

## Preferred higher-level compositions

- Place SegmentedControl near the content or mode it directly changes.

## Content

- Use short parallel labels and durable keys. Put longer explanations in the group description.

## States

- Selected, unselected, required, invalid, read-only, group-disabled, and option-disabled states keep segments equal.

## Control, events, validation, and forms

- SegmentedControl supports controlled or uncontrolled exclusive string selection. A controlled value is one option key or null. Disabled options remain visible, and the rail follows the selection.
- onChange reports the newly selected segment value after accepted pointer or keyboard input.
- Use isRequired when an empty selection is invalid. Use isInvalid with errorMessage for errors supplied by the application.
- name and form serialize the selected native radio value; reset restores defaultValue without losing the rail position.

## Accessibility

- SegmentedControl exposes one named native radio group with one tab stop, equivalent segment labels, and generated group support relationships.

## Keyboard, labeling, localization, and direction

- Tab enters the selected or first enabled segment; arrow keys move focus and selection through enabled segments according to writing direction.
- label names the radiogroup and every segment has visible text; no accent-colored label carries selection alone.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- SegmentedControl places equal adjacent segments on a neutral background. One accent rail moves below the selection. Labels stay neutral, and selection adds no fill or shadow.
- Set reserveSupportSpace={false} for compact settings and command groups without empty help or error rows. The default reserves support space for stable validation; visible descriptions and errors remain available in either mode.
- Choice rows fill their parent and option text wraps. Segmented options stay equal when their labels wrap on narrow screens.

## Accent, forced colors, and reduced motion

- Labels stay neutral. Selection indicators, focus outlines, and the segmented rail use the exact accent or a more saturated version of the same hue.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Choose display density

Compare and switch among a few compact modes.

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
