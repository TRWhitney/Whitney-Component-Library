# FieldGroup

FieldGroup names and lays out one related set of form fields.

## Use for

- multiple fields form one meaningful input set that should be announced together

## Do not use for

- content is not a related control set, needs only visual containment, or represents a larger form workflow region

## Prefer instead

- Use FormSection for a larger named workflow and Surface for unrelated visual containment.

## Composition and parts

- Render FieldGroup inside AppearanceProvider, place fields directly within it, and choose one or responsive equal columns; do not use it as an arbitrary surface.
- FieldGroup includes a legend, optional description, and one field layout region.

## Preferred higher-level compositions

- Nest FieldGroup in FormSection when a workflow section contains one or more semantically related control sets.

## Content

- Use a concise legend that names the relationship and an optional description that applies to every child field.

## States

- One-column and equal-column layouts keep child control dimensions. Adjacent controls stay aligned when a label wraps, and disabled propagates to native and custom library fields.

## Control, events, validation, and forms

- FieldGroup handles its name, disabled propagation, equal columns, aligned labels and controls, and child spacing. It does not handle child values or events.
- FieldGroup emits no aggregate value or change event; each child field retains its own ownership.
- The group has no aggregate invalid state. Each child shows its own error, and the group description does not move.
- isDisabled uses native fieldset propagation and internal context to disable library and custom Field children. Each field still handles its name, validation, submission value, and reset.

## Accessibility

- FieldGroup renders a native fieldset whose visible legend names the related controls and whose description is linked to the group.

## Keyboard, labeling, localization, and direction

- FieldGroup adds no roving focus or arrow keys. Child fields stay in normal document tab order.
- legend is required and visible; description is linked to the native fieldset without consumer-authored ids.
- Supply the visible legend and optional group description in the application locale and allow both to wrap without disturbing descendant control alignment.
- Logical fieldset padding, column gaps, and descendant order follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- FieldGroup uses a compact rounded fieldset with a subtle background, visible legend, optional description, preset padding, and equal responsive columns.
- Equal columns collapse when their content no longer fits. Adjacent fields align their label and control rows, then return to a normal one-column layout when stacked.

## Accent, forced colors, and reduced motion

- The fieldset surface stays neutral and establishes subtle-surface accent roles for descendant fields, which retain ownership of their own hover, focus, validation, and pending states.
- Forced-color mode maps the fieldset surface and boundary to system Canvas and CanvasText while descendants retain their own system-color state treatment.
- FieldGroup adds no motion of its own; descendant controls retain their reduced-motion behavior.

## Examples

### Group boundary inputs

Keep related controls equally sized without changing their value behavior.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FieldGroup, NumberField, TextField} from '@trwhitney/component-library';

export function BoundaryFieldGroupExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FieldGroup legend="Boundary inputs" columns="responsive">
        <TextField label="Solver" />
        <NumberField label="Tolerance" locale="en-US" />
      </FieldGroup>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use a field group as a surface

Non-form prose does not form a related native control group.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FieldGroup} from '@trwhitney/component-library';

export function ContentFieldGroupCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FieldGroup legend="Layout"><p>Explanation only</p></FieldGroup>
    </AppearanceProvider>
  );
}
```
