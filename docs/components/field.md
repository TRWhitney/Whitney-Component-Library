# Field

Field provides an accessible shell for one custom form control.

## Use for

- one custom form control needs the library field layout and accessible support relationships but no specialized library control applies

## Do not use for

- TextField, TextArea, NumberField, SearchField, or another library field already provides the required behavior

## Prefer instead

- Prefer TextField, TextArea, NumberField, SearchField, or another library field when it already matches the value.

## Composition and parts

- Render Field inside AppearanceProvider.
- Return either one direct native control without a role override, or one neutral element with a button, checkbox, combobox, listbox, radio, searchbox, slider, spinbutton, switch, or textbox role.
- Spread every supplied control prop onto that element without a DOM wrapper or overridden relationship or state prop. Field protects this structure but does not verify all behavior required by the chosen role.
- Field includes a label, one control shell, and one fixed support area.

## Preferred higher-level compositions

- Place related Field peers in FieldGroup and organize larger form workflows with FormSection.

## Content

- Use a concise visible label; use description for durable input guidance, errorMessage for actionable correction, and pendingMessage only for temporary checking.

## States

- Required, invalid, read-only, disabled, and pending states update the control props and support text without changing layout. Use required and read-only only when the rendered element or ARIA role supports them.

## Control, events, validation, and forms

- Field connects support text and state to the control. It removes a disabled custom control from tab order and blocks direct activation. The control still handles its value, other events, domain behavior, keyboard input, and ARIA requirements.
- Field emits no events. The rendered control handles its domain events.
- Set isInvalid with errorMessage for application errors. The custom control still handles native or domain validation.
- Field does not submit a value. The custom control handles name, form association, validation, submission, and reset.

## Accessibility

- Field generates label, description, error, required, invalid, and busy props for one supported direct child.
- It supplies both native and ARIA versions of disabled and read-only state.

## Keyboard, labeling, localization, and direction

- Field adds no keyboard model. The custom control must provide keyboard behavior for its role and honor the supplied read-only state.
- label is always visible; the generated control props reference it and any supplied description or error without consumer-authored ids.
- Localize visible labels, descriptions, errors, pending messages, and command labels. Allow them to wrap.
- Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- The field family uses compact rounded controls, one consistent single-line control height, neutral surfaces, and a reserved support track beneath each control.
- Fields fill their parent width. Support text grows below without moving or resizing the control. Responsive groups collapse when their content no longer fits.

## Accent, forced colors, and reduced motion

- Resting field content stays neutral; hover and focus use saturated same-hue accent structure, while invalid and pending states retain independent danger and warning colors.
- Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.
- Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.

## Examples

### Label a custom control

Spread the generated relationship onto one custom native control.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Field} from '@trwhitney/component-library';

export function CustomFieldExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Field label="Workspace" description="Use the team identifier.">
        {(controlProps) => <input {...controlProps} name="workspace" />}
      </Field>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not render display content as a field control

Static content is not a form control and cannot honor the generated relationship.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Field} from '@trwhitney/component-library';

export function StaticFieldCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Field label="Tolerance">
        {() => <div>0.0025 K</div>}
      </Field>
    </AppearanceProvider>
  );
}
```
