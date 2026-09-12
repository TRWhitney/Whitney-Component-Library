# Disclosure

Disclosure toggles one optional supporting section under a semantic heading.

## Use for

- showing or hiding one optional supporting section in place

## Do not use for

- multiple coordinated sections, peer panel selection, navigation, or required primary content

## Prefer instead

- Use Accordion for related sections, Tabs for peer panels, or Section for always-visible content.

## Composition and parts

- Render inside AppearanceProvider so the boundary, focus, and text roles use the active theme and accent.
- Pass a concise title, headingLevel, and panel content. Use controlled isExpanded when another state owner coordinates visibility.
- Disclosure owns one semantic heading, expansion button, chevron, and labeled panel.

## Preferred higher-level compositions

- Compose Disclosure beside the content or controls its optional detail explains.

## Content

- Make the title describe the hidden content and keep essential instructions visible outside the disclosure.

## States

- Expanded state may be controlled or uncontrolled; disabled remains visible and inert.

## Control, events, validation, and forms

- Disclosure supports controlled isExpanded or uncontrolled defaultExpanded and an explicit disabled state.
- onExpandedChange reports every requested expansion transition.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Enabled links, tab controls, and disclosure triggers use a pointer cursor across their label and padding. Disabled controls use not-allowed; passive headings, current breadcrumb text, and panel content retain normal text selection.
- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Tab reaches the heading button; Enter or Space toggles its panel.
- The visible title names the trigger, labels its region, and renders at the supplied heading level.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- Disclosure uses one quiet boundary and a rotating chevron without creating a card.
- The full-width trigger and panel copy wrap without horizontal overflow.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### Optional supporting detail

Keep optional advanced settings near the controls they qualify.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Disclosure} from '@trwhitney/component-library';

export function AdvancedSettingsDisclosure() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Disclosure headingLevel={3} title="Advanced solver settings"><p>Iteration and tolerance controls</p></Disclosure>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide required work

A primary action should remain visible instead of being hidden as optional detail.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Disclosure} from '@trwhitney/component-library';

export function PrimaryActionDisclosureCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Disclosure headingLevel={2} title="Run solver"><Button>Start run</Button></Disclosure>
    </AppearanceProvider>
  );
}
```
