# TextField

TextField collects one line of text with native form and validation behavior.

## Use for

- a user enters one line of plain text, contact data, a URL, or a password

## Do not use for

- the value is multiline prose, numeric, a search query, or a constrained choice

## Prefer instead

- Use TextArea for prose, NumberField for locale-aware numeric values, and SearchField for clearable query submission.

## Composition and parts

- Render TextField inside AppearanceProvider and place related peers in FieldGroup rather than rebuilding label or support parts.
- TextField includes a label, single-line input shell, native input, and fixed support area.

## Preferred higher-level compositions

- Use FieldGroup for adjacent related values and FormSection for a named workflow region.

## Content

- Choose inputType for the value’s native text semantics; keep the label persistent and use placeholder only as an optional example.

## States

- Controlled, uncontrolled, required, invalid, read-only, disabled, and pending states use the same control size.

## Control, events, validation, and forms

- TextField supports controlled or uncontrolled string ownership and becomes read-only while pending so its value stays focusable and copyable.
- onChange reports the complete current string after each accepted text edit.
- Native length, pattern, required, custom validate, and application errors share the fixed error area.
- name and form use native string serialization and reset; validationBehavior defaults to native and validate may return localized errors.

## Accessibility

- TextField renders a labeled native single-line input with generated description and error relationships and visible focus indication.

## Keyboard, labeling, localization, and direction

- Native text editing, selection, composition, and browser autofill continue to work.
- label is required and always visible. Descriptions, errors, and required state are linked automatically.
- Localize visible labels, descriptions, errors, pending messages, and command labels. Allow them to wrap.
- Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- The field family uses rounded controls, a consistent single-line height, and neutral surfaces. Empty support tracks are omitted by default; reserveSupportSpace keeps room for two lines when stable form height matters.
- Fields fill their parent width and inherit comfortable or compact density from AppearanceProvider. Description, error, and pending text remain visible and grow below the control. Responsive groups align their support tracks and collapse when their content no longer fits.

## Accent, forced colors, and reduced motion

- Resting field content stays neutral; enabled hover and focus use saturated same-hue accent structure, while disabled controls remain inert. Invalid controls retain their danger boundary and thicken it on enabled hover; pending controls retain their warning color.
- Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.
- Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.

## Examples

### Name a run

Collect one required, named text value with durable guidance.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TextField} from '@trwhitney/component-library';

export function RunNameFieldExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TextField label="Run name" name="run-name" description="Visible in exports." isRequired />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use single-line entry for prose

Long prose needs multiline editing and visible line capacity.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TextField} from '@trwhitney/component-library';

export function ProseTextFieldCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TextField label="Notes" />
    </AppearanceProvider>
  );
}
```
