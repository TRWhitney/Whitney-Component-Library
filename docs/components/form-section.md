# FormSection

FormSection gives a larger form workflow a visible region name.

## Use for

- a larger form workflow needs a named region containing fields, groups, or supporting form actions

## Do not use for

- the region is read-only content, only one field, or merely needs a visual surface

## Prefer instead

- Use FieldGroup for one related fieldset, Section for general named content, and Surface for unnamed containment.

## Composition and parts

- Render FormSection inside AppearanceProvider with FieldGroup or individual fields as children. Use Section when the region is not form structure.
- FormSection includes a visible heading, optional description, and form content region.

## Preferred higher-level compositions

- Use FormSection around one or more FieldGroups when a form has distinct workflow stages.

## Content

- Use a task-oriented title and optional section-wide description; keep per-field instructions on the fields they describe.

## States

- Heading levels one through six follow document hierarchy. Content reflows without adding divider lines.

## Control, events, validation, and forms

- FormSection provides a heading and vertical spacing but no form state, submission, or aggregate validation.
- FormSection emits no events and does not intercept child field or form events.
- FormSection does not aggregate child validity or move child validation messages into a section-level summary.
- FormSection does not render a form element or own submission; place it inside the application’s native form boundary.

## Accessibility

- FormSection renders a section labeled by a visible heading at the chosen document level.

## Keyboard, labeling, localization, and direction

- FormSection adds no keyboard interaction. Children stay in document order.
- title is required and labels the region. headingLevel follows the surrounding document hierarchy.
- Supply the title and optional section description in the application locale and allow them to wrap within the section width.
- The section keeps document order and inherited writing direction. It does not reposition its heading, description, or children.

## Appearance and responsive behavior

- FormSection uses a visible heading, optional muted description, and consistent vertical spacing without adding a background, border, or divider.
- FormSection fills its parent and keeps its vertical spacing as content wraps or narrows.

## Accent, forced colors, and reduced motion

- FormSection adds no accent treatment of its own; descendant fields, groups, and actions retain their role-local accent behavior.
- FormSection adds no border or background in forced-color mode. Its heading and spacing stay intact, while children render their own states.
- FormSection adds no motion of its own.

## Examples

### Organize solver setup

Name a form workflow and keep the nested fieldset relationship.

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

Read-only content belongs in Section or Surface rather than a form-specific container.

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
