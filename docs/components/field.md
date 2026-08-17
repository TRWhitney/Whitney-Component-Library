# Field

Field provides a bounded accessible shell for one custom form control.

## Use for

- one custom form control needs the library field layout and accessible support relationships but no specialized library control applies

## Do not use for

- TextField, TextArea, NumberField, SearchField, or another semantic library field already owns the required behavior

## Prefer instead

- Prefer TextField, TextArea, NumberField, SearchField, and later semantic field exports whenever their behavior matches the value being collected.

## Composition and parts

- Render Field inside AppearanceProvider; return one direct native control without overriding its native role, or one semantically neutral element with a button, checkbox, combobox, listbox, radio, searchbox, slider, spinbutton, switch, or textbox role. Spread every supplied control prop onto it without a DOM wrapper or overridden relationship or state prop. Field rejects native role overrides uniformly and protects its direct structure and generated relationships; it does not verify complete role-specific widget behavior.
- Field owns a label, one control shell, and one stable support track.

## Preferred higher-level compositions

- Place related Field peers in FieldGroup and organize larger form workflows with FormSection.

## Content

- Use a concise visible label; use description for durable input guidance, errorMessage for actionable correction, and pendingMessage only for temporary checking.

## States

- Required, invalid, read-only, disabled, and pending states affect the generated control props and stable support presentation without changing geometry; required and read-only may be used only when the rendered native element or ARIA role supports that state.

## Control, events, validation, and forms

- Field owns support and state relationships, removes a disabled custom control from tab order, and suppresses its direct activation; the rendered control retains value, non-activation events, domain behavior, and role-specific keyboard and ARIA conformance.
- Field emits no events; the callback-rendered control owns its domain event contract.
- Set isInvalid with errorMessage for externally owned invalidity; the custom control remains responsible for native or domain validation behavior.
- Field does not serialize a value; native name, form association, validation, submission, and reset remain the custom control’s responsibility.

## Accessibility

- Field generates stable label, description, error, required, invalid, busy, native and ARIA disabled, and native and ARIA read-only props for exactly one direct supported control.

## Keyboard, labeling, localization, and direction

- Field adds no enabled keyboard model; the rendered custom control must provide the keyboard behavior appropriate to its semantic role and honor the supplied read-only state.
- label is always visible; the generated control props reference it and any supplied description or error without consumer-authored ids.
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
