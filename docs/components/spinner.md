# Spinner

Spinner presents a brief labeled generic busy state only while work is active.

## Use for

- brief generic busy state is active but no meaningful amount or completion estimate exists

## Do not use for

- known or indeterminate operation progress needing completion meaning, a final semantic state, decorative idle motion, or an unlabeled loading glyph

## Prefer instead

- Use ProgressBar when the operation and its completion meaning should remain visible, or StatusIndicator after work settles.

## Composition and parts

- Render inside AppearanceProvider, place Spinner next to the region or action whose work it describes, and update isActive from that same operation state.
- Spinner owns one routed activity glyph and one visible label in a stable inline slot.

## Preferred higher-level compositions

- Compose next to a pending Button or inside a stable status field without adding a second live label for the same work.

## Content

- label names the work in active voice; do not use generic “Loading” when a specific operation name is available.

## States

- Active and inactive are explicit; only active has visible or accessible status content and activity motion, while the inactive visual slot remains reserved.

## Control, events, validation, and forms

- isActive is required; true exposes and animates the busy status, while false hides it semantically and visually but preserves its footprint.
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

- One compact routed arc sits beside a visible activity label; the complete slot remains stable when inactive.
- The inline glyph remains fixed while the activity label wraps without overflow; inactive state reserves the same footprint.

## Accent, forced colors, and reduced motion

- Spinner uses application accent only as active structure and never claims success, warning, or failure.
- Forced colors retain a system-highlight active arc, a system-colored route, and visible label.
- Reduced motion settles the active arc to one effectively instantaneous iteration while retaining its visible busy structure.

## Examples

### Generic solver activity

Expose a brief busy state before a meaningful progress estimate exists.

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

### Do not hide meaningful progress

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
