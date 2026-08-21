# AppearanceProvider

AppearanceProvider scopes the library visual system to light or dark appearance and one application accent.

## Use for

- an application or isolated region needs the library appearance and accent

## Do not use for

- a component needs a semantic success, warning, or danger state
- an application wants to replace library spacing, typography, shape, or other design tokens

## Prefer instead

- Use the component semantic tone API for status meaning.
- Use supported component variants instead of replacing internal design tokens.

## Composition and parts

- Place one provider around the interface that uses library components.
- Nest a provider only when a contained region intentionally uses a different appearance or accent.
- The provider exposes one children region and no named parts or slots.

## Preferred higher-level compositions

- Place the provider around the application shell. Nest one only for a region with a different appearance or identity.

## Content

- Pass rendered application content as children.
- Provide one six-digit hexadecimal accent and a light or dark appearance.

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

- Choose any valid accent. Primary fills use it unchanged and select a readable foreground separately.
- When the exact primary fill is too close to its actual surrounding surface, the library adds saturated same-hue structural support instead of recoloring the accent.
- Contrast applies to the specific surface a structural role actually meets; filled rest and hover states choose readable foreground content independently.
- Black and white accents use neutral borders because they have no hue.
- Do not use the application accent in place of success, warning, or danger meaning.

## Keyboard, labeling, localization, and direction

- The provider introduces no keyboard interaction, focus target, or focus-management behavior.
- The provider creates no semantic region that needs a label; label the rendered child interface according to its own structure.
- The provider renders no localized content and does not alter the locale inherited by its children.
- The provider inherits writing direction from its surroundings and does not set a direction attribute.

## Appearance and responsive behavior

- Light and dark are the only supported appearances.
- Appearance selects the library canvas, background, text, and border colors within the provider.
- The provider does not introduce viewport-specific behavior or mutate the document root.

## Accent, forced colors, and reduced motion

- The application accent feeds focus, selection, progress, active structure, and relationship rails.
- Primary fills and other identity elements use the application accent unchanged.
- Hover colors keep the chosen hue while body text stays neutral.
- Focus, rail, edge, underline, and conditional-boundary roles use the exact accent when it is visible and otherwise derive a saturated same-hue signal.
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
