# FormSection

FormSection gives a larger form workflow a visible semantic region name.

## Use for

- a larger form workflow needs a named region containing fields, groups, or supporting form actions

## Do not use for

- the region is read-only content, only one field, or merely needs a visual surface

## Prefer instead

- Use FieldGroup for one related fieldset, Section for general named content, and Surface for unnamed containment.

## Composition and parts

- Render FormSection inside AppearanceProvider and compose FieldGroup or individual semantic fields as children; use Section instead when the region is not specifically form structure.
- FormSection owns a visible heading, optional description, and form-specific content region.

## Preferred higher-level compositions

- Use FormSection around one or more FieldGroups when a form has distinct workflow stages.

## Content

- Use a task-oriented title and optional section-wide description; keep per-field instructions on the fields they describe.

## States

- Heading levels one through six preserve document hierarchy; content reflows without adding compact divider lines.

## Control, events, validation, and forms

- FormSection owns semantic heading and spaced vertical region structure but no form state, submission, or aggregate validation.
- FormSection emits no events and does not intercept child field or form events.
- FormSection does not aggregate child validity or move child validation messages into a section-level summary.
- FormSection does not render a form element or own submission; place it inside the application’s native form boundary.

## Accessibility

- FormSection renders a section labeled by a visible heading at an explicit document level.

## Keyboard, labeling, localization, and direction

- FormSection adds no keyboard interaction; children remain in document order.
- title is required and labels the region; headingLevel preserves the surrounding document hierarchy.
- Supply the title and optional section description in the application locale and allow them to wrap within the section width.
- The section preserves logical document order and inherited writing direction without repositioning its heading, description, or children.

## Appearance and responsive behavior

- FormSection uses a visible heading, optional muted description, and owned vertical rhythm without adding a surface, border, or divider.
- FormSection fills its bounded parent and preserves its vertical heading, description, and child rhythm as content wraps or narrows.

## Accent, forced colors, and reduced motion

- FormSection adds no accent treatment of its own; descendant fields, groups, and actions retain their role-local accent behavior.
- FormSection paints no custom boundary or surface in forced-color mode; its semantic heading and content rhythm remain intact while children own their state treatment.
- FormSection adds no motion of its own.

## Examples

### Organize solver setup

Name a form workflow while preserving the nested fieldset relationship.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FieldGroup, FormSection, TextField} from '@trwhitney/component-library';

export function SolverFormSectionExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FormSection title="Solver setup" description="Configure the run inputs.">
        <FieldGroup legend="Boundary inputs">
          <TextField label="Solver" />
        </FieldGroup>
      </FormSection>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use form structure for display content

Read-only content needs ordinary Section or Surface semantics rather than form-specific organization.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FormSection} from '@trwhitney/component-library';

export function DisplayFormSectionCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FormSection title="Card"><p>Read-only metrics</p></FormSection>
    </AppearanceProvider>
  );
}
```
