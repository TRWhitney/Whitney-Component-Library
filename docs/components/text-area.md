# TextArea

TextArea collects multiline plain text with bounded initial sizing.

## Use for

- a user enters multiline notes, explanation, source text, or other plain prose

## Do not use for

- the value is one short line, numeric, a search query, or rich Markdown editing

## Prefer instead

- Use TextField for one line, NumberField for numbers, and the later Markdown editor for structured Markdown authoring.

## Composition and parts

- Render TextArea inside AppearanceProvider; let its parent determine width while its bounded rows establish initial height.
- TextArea owns a label, resizable multiline shell, native textarea, and stable support track.

## Preferred higher-level compositions

- Place related prose and metadata fields in FieldGroup or a named FormSection.

## Content

- Use the label to name the content and description to explain format or scope; do not depend on placeholder as the label.

## States

- Controlled, uncontrolled, required, invalid, read-only, disabled, and pending states preserve the textarea shell.

## Control, events, validation, and forms

- TextArea supports controlled or uncontrolled strings, vertical resizing, and three bounded initial row counts.
- onChange reports the complete current multiline string after each accepted edit.
- Native length, required, custom validate, and externally owned invalidity appear beneath rather than moving the textarea.
- name and form use native multiline serialization and reset; native or custom validation uses the same support track.

## Accessibility

- TextArea renders a labeled native textarea with generated description and error relationships.

## Keyboard, labeling, localization, and direction

- Native multiline editing, selection, composition, and newline behavior remain intact.
- label is required and remains visible; description, error, required, and pending relationships are automatic.
- Supply visible labels, descriptions, errors, pending messages, and explicit command labels in the application locale, and allow them to wrap.
- Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- The field family uses compact rounded controls, one consistent single-line control height, neutral surfaces, and a reserved support track beneath each control.
- Fields fill their bounded parent width; support text grows below without moving or resizing the control, and responsive groups collapse through content-owned minimums.

## Accent, forced colors, and reduced motion

- Resting field content stays neutral; hover and focus use saturated same-hue accent structure, while invalid and pending states retain independent danger and warning colors.
- Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.
- Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.

## Examples

### Collect review notes

Provide a deliberate initial writing area without arbitrary height injection.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TextArea} from '@trwhitney/component-library';

export function ReviewNotesExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TextArea label="Review notes" name="notes" rows={5} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use prose entry for numbers

A numeric value needs parsing, stepping, bounds, and numeric form serialization.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TextArea} from '@trwhitney/component-library';

export function NumericTextAreaCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TextArea label="Tolerance" />
    </AppearanceProvider>
  );
}
```
