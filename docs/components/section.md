# Section

Section gives a content region a visible heading and aligned actions.

## Use for

- a content region needs a visible title, optional explanation, actions, and body

## Do not use for

- content has no meaningful heading, needs disclosure behavior, or uses the title as decorative filler

## Prefer instead

- Use Stack for unnamed grouping and the future disclosure primitive for collapsible content.

## Composition and parts

- Render Section inside AppearanceProvider to load its text and spacing tokens.
- Choose the heading level from document hierarchy and keep actions specific to the complete section.
- Section exposes heading, optional description, optional actions, and content regions.

## Preferred higher-level compositions

- Place Section inside Surface for named containment or use it directly when surrounding structure already supplies a surface.

## Content

- Use a concise string title, an optional explanatory sentence, and body content that belongs under that heading.

## States

- The primitive has no internal state. Changing a prop updates its structural attributes.

## Control, events, validation, and forms

- Props set the title, description, actions, and heading level. Section has no collapse state.
- The primitive emits no callbacks and has no interactive state.
- The TypeScript API rejects custom classes, inline styles, token values, and unsupported options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Section renders a labeled section landmark whose accessible name comes from its required visible heading.

## Keyboard, labeling, localization, and direction

- Section introduces no focus target; actions keep their own keyboard behavior and DOM order.
- The required visible title labels the section through a deterministic generated heading id.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Section uses the library text and spacing styles but adds no background or border.
- Heading and actions share a row when space permits and reflow into one column at compact widths without a divider.

## Accent, forced colors, and reduced motion

- Section does not apply the application accent or semantic status color.
- Forced-color mode inherits system text and surfaces without adding decorative section color.
- The primitive has no motion, so the reduced-motion setting does not change it.

## Examples

### Name a review region

Use the visible title as the section accessible name.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Section} from '@trwhitney/component-library';

export function BoundarySection() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Section title="Boundary conditions" description="Resolve every condition before running.">
        <p>Six of six conditions resolved.</p>
      </Section>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not invent a heading for decoration

Use Stack when related content has no meaningful section name.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Section} from '@trwhitney/component-library';

export function DecorativeSection() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Section title="Information">
        <p>Solver: Adaptive mesh</p>
      </Section>
    </AppearanceProvider>
  );
}
```
