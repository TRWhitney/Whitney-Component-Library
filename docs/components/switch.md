# Switch

Switch changes one immediately applied binary setting.

## Use for

- a user turns one setting on or off and the change takes effect immediately

## Do not use for

- the value is a required acknowledgement, an optional batch-form choice, or one answer among several

## Prefer instead

- Use Checkbox for acknowledgement or deferred form choice and RadioGroup or SegmentedControl for exclusive modes.

## Composition and parts

- Render Switch inside AppearanceProvider and use the same label in both states.
- Switch includes one track, moving thumb, visible label, and optional description.

## Preferred higher-level compositions

- Place related Switch peers in FieldGroup or FormSection.

## Content

- Name the setting rather than the action; the on and off states must both make sense with the same persistent label.

## States

- On, off, read-only, and disabled states remain visible without changing the control size.

## Control, events, validation, and forms

- Switch supports controlled or uncontrolled boolean state; read-only keeps the value focusable and prevents change while disabled removes interaction.
- onChange reports the complete on/off boolean after each accepted interaction.
- Switch does not expose required or invalid state; use Checkbox when a binary value participates in acknowledgement validation.
- name, value, and form use native checkbox serialization; only the on state submits and reset restores defaultSelected.

## Accessibility

- Switch renders a native checkbox with switch semantics, a persistent visible label, and an automatically referenced description.

## Keyboard, labeling, localization, and direction

- Space toggles the focused switch; Tab moves to or from the enabled switch.
- label is required and does not change with state. description may add context.
- Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.
- Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.

## Appearance and responsive behavior

- Switch uses a compact pill track and logical-direction thumb movement beside a neutral label without changing row geometry. Its total control height follows field density, including padding, so it aligns with adjacent form controls.
- Set reserveSupportSpace={false} for compact settings and command groups without empty help or error rows. The default reserves support space for stable validation; visible descriptions and errors remain available in either mode.
- Choice rows fill their parent and option text wraps. Segmented options stay equal when their labels wrap on narrow screens.

## Accent, forced colors, and reduced motion

- Labels stay neutral. Selection indicators, focus outlines, and the segmented rail use the exact accent or a more saturated version of the same hue.
- Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.
- Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.

## Examples

### Toggle synchronization

Change an immediately applied workspace setting.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Switch} from '@trwhitney/component-library';

export function SynchronizationSetting() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Switch defaultSelected label="Keep results synchronized" name="synchronized" value="yes" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use a switch for acknowledgement

A required acknowledgement submitted with a form should use a checkbox.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Switch} from '@trwhitney/component-library';

export function ConsentSwitchCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Switch label="Accept final terms" />
    </AppearanceProvider>
  );
}
```
