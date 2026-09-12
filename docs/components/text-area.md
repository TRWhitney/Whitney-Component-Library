# TextArea

TextArea collects multiline plain text with a preset initial height.

## Use for

- a user enters multiline notes, explanation, source text, or other plain prose

## Do not use for

- the value is one short line, numeric, a search query, or rich Markdown editing

## Prefer instead

- Use TextField for one line, NumberField for numbers, and MarkdownEditor for Markdown source editing and safe preview.

## Composition and parts

- Render TextArea inside AppearanceProvider. Its parent sets the width, and rows sets the initial height.
- TextArea includes a label, resizable multiline shell, native textarea, and fixed support area.

## Preferred higher-level compositions

- Place related prose and metadata fields in FieldGroup or a named FormSection.

## Content

- Use the label to name the content and description to explain format or scope; do not depend on placeholder as the label.

## States

- Controlled, uncontrolled, required, invalid, read-only, disabled, and pending states use the same text area shell.

## Control, events, validation, and forms

- TextArea supports controlled or uncontrolled strings, vertical resizing, and three preset row counts.
- onChange reports the complete current multiline string after each accepted edit.
- Native length, required, custom validate, and application errors appear below the text area instead of moving it.
- name and form use native multiline serialization and reset; native or custom validation uses the same support track.

## Accessibility

- TextArea renders a labeled native textarea with generated description and error relationships.

## Keyboard, labeling, localization, and direction

- Native multiline editing, selection, composition, and newline behavior continue to work.
- label is required and always visible. Description, error, required, and pending relationships are automatic.
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

### Collect review notes

Choose a preset initial height instead of injecting a custom one.

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
