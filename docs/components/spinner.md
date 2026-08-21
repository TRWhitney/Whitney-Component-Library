# Spinner

Spinner presents a brief labeled generic busy state only while work is active.

## Use for

- a brief generic busy state is active but no amount or completion estimate exists

## Do not use for

- known or indeterminate operation progress that needs a completion description, a final state, decorative idle motion, or an unlabeled loading icon

## Prefer instead

- Use ProgressBar when the operation and its completion description should stay visible, or StatusIndicator after work finishes.

## Composition and parts

- Render inside AppearanceProvider, place Spinner next to the region or action whose work it describes, and update isActive from that same operation state.
- Spinner includes one six-capsule activity icon and one visible label in a fixed inline slot.

## Preferred higher-level compositions

- Place Spinner next to a pending Button or inside a fixed status field. Do not add a second live label for the same work.

## Content

- label names the work in active voice. Use the operation name instead of a generic "Loading" label.

## States

- Only the active state has visible or accessible status content and motion. The inactive state reserves the same space.

## Control, events, validation, and forms

- isActive is required. true shows and animates the busy status. false hides it visually and from assistive technology but reserves its space.
- Spinner emits no events and does not own cancellation or operation lifecycle.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- Spinner keeps one empty atomic status mounted while inactive, then supplies the visible label when active without marking that live region aria-busy, so assistive technology can announce the transition without deferral.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- label is required and visible; do not duplicate it through a surrounding status live region.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- Six thick, rounded accent capsules rotate beside a visible activity label. They appear and disappear one complete capsule at a time, and the slot keeps its size when inactive.
- The icon stays fixed while the activity label wraps without overflow. The inactive state reserves the same space.

## Accent, forced colors, and reduced motion

- Spinner uses application accent only as active structure and never claims success, warning, or failure.
- Forced colors retain system-highlight activity capsules and a visible label.
- Reduced motion stops the rotation and shows all six capsules as a static busy structure.

## Examples

### Generic solver activity

Show a brief busy state before a progress estimate exists.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Spinner} from '@trwhitney/component-library';

export function SolverSpinner() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Spinner isActive label="Preparing solver" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide measurable progress

Known advancement should expose numeric value and completion through ProgressBar.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Spinner} from '@trwhitney/component-library';

export function KnownProgressSpinnerCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Spinner isActive label="18 of 25 passes" />
    </AppearanceProvider>
  );
}
```
