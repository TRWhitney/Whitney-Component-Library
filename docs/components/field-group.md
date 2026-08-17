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
- FieldGroup owns a legend, optional group description, and one bounded field-layout region.

## Preferred higher-level compositions

- Nest FieldGroup in FormSection when a workflow section contains one or more semantically related control sets.

## Content

- Use a concise legend that names the relationship and an optional description that applies to every child field.

## States

- One-column and responsive equal-column layouts preserve child control dimensions; responsive peers keep controls aligned when a label wraps, and disabled propagates to native and library-owned custom fields.

## Control, events, validation, and forms

- FieldGroup owns group naming, disabled propagation, equal column layout, aligned peer label and control rows, and child spacing but no child values or events.
- FieldGroup emits no aggregate value or change event; each child field retains its own ownership.
- The group does not invent aggregate invalidity; child fields expose their own errors while the group description remains stable.
- isDisabled uses native fieldset propagation and an internal context so library and custom Field children receive disabled state; child names, validation, serialization, and reset remain owned by each field.

## Accessibility

- FieldGroup renders a native fieldset whose visible legend names the related controls and whose description is linked to the group.

## Keyboard, labeling, localization, and direction

- FieldGroup adds no roving focus or arrow model; child fields remain in normal document tab order.
- legend is required and visible; description is linked to the native fieldset without consumer-authored ids.
- Supply the visible legend and optional group description in the application locale and allow both to wrap without disturbing descendant control alignment.
- Logical fieldset padding, column gaps, and descendant order follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- FieldGroup uses one compact rounded subtle fieldset surface with a visible legend, optional description, bounded padding, and equal responsive field columns.
- Responsive equal columns collapse through a content-owned minimum; peer fields share label and control rows when adjacent and return to ordinary one-column rhythm when stacked.

## Accent, forced colors, and reduced motion

- The fieldset surface stays neutral and establishes subtle-surface accent roles for descendant fields, which retain ownership of their own hover, focus, validation, and pending states.
- Forced-color mode maps the fieldset surface and boundary to system Canvas and CanvasText while descendants retain their own system-color state treatment.
- FieldGroup adds no motion of its own; descendant controls retain their reduced-motion behavior.

## Examples

### Group boundary inputs

Keep related peer controls equally sized while preserving their distinct value semantics.

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
