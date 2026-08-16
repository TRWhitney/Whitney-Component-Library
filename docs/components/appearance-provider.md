# AppearanceProvider

AppearanceProvider scopes the library visual system to light or dark appearance and one application accent.

## Use for

- an application or a deliberately isolated application region needs the library appearance and accent

## Do not use for

- a component needs a semantic success, warning, or danger state
- an application wants to replace spacing, typography, shape, or other owned design tokens

## Prefer instead

- Use the component semantic tone API for status meaning.
- Use supported component variants instead of replacing internal design tokens.

## Composition and parts

- Place one provider around the library-owned interface region.
- Nest a provider only when a contained region intentionally uses a different appearance or accent.
- The provider exposes one children region and no named parts or slots.

## Preferred higher-level compositions

- Place the provider around the application shell, or around a deliberately isolated interface region when a nested identity is required.

## Content

- Pass rendered application content as children.
- Use exactly one six-digit hexadecimal accent and one explicit appearance.

## States

- Changing appearance or accent updates the scoped custom properties without remounting children.
- Server and first client render derive identical attributes and color roles from identical props.

## Control, events, validation, and forms

- Appearance and accent are required controlled props; the provider has no defaults or internal uncontrolled state.
- The provider emits no library callback events; rerender it with new props to change appearance or accent.
- The TypeScript API restricts appearance to light or dark; accent is runtime-validated as an exact six-digit hexadecimal color.
- An invalid accent throws during rendering before incomplete theme variables are applied.
- The provider does not participate in form submission, reset, constraint validation, or field state.

## Accessibility

- Choose an accent freely; the provider derives separate contrast-safe fill, text, focus, and rail roles, including readable accent text on the accent-soft hover surface.
- Do not use the application accent in place of success, warning, or danger meaning.

## Keyboard, labeling, localization, and direction

- The provider introduces no keyboard interaction, focus target, or focus-management behavior.
- The provider creates no semantic region that needs a label; label the rendered child interface according to its own structure.
- The provider renders no localized content and does not alter the locale inherited by its children.
- The provider inherits writing direction from its surroundings and does not set a direction attribute.

## Appearance and responsive behavior

- Light and dark are the only supported appearances.
- Appearance selects the library-owned neutral canvas, surface, text, and border roles within the provider region.
- The provider does not introduce viewport-specific behavior or mutate the document root.

## Accent, forced colors, and reduced motion

- The application accent feeds focus, selection, progress, active structure, and relationship rails.
- The provider derives a surface-distinct primary fill plus contrast-safe accent text, focus, and rail roles instead of applying the raw accent indiscriminately.
- Forced-color mode replaces decorative color roles with system colors through the static stylesheet.
- Reduced motion changes transition duration without changing state meaning or removing feedback.

## Examples

### Set the application appearance

Scope one appearance and accent around the application.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider} from '@trwhitney/component-library';

export function DarkApplication() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <main>Profile</main>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not change application identity to communicate status

Keep semantic status independent from the application accent.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider} from '@trwhitney/component-library';

export function StatusColoredIdentity() {
  return (
    <AppearanceProvider appearance="light" accent="#16794a">
      <p>Stable</p>
    </AppearanceProvider>
  );
}
```
