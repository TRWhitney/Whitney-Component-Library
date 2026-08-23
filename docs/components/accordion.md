# Accordion

Accordion coordinates expansion across several related disclosure sections.

## Use for

- organizing several related optional sections under one labeled group

## Do not use for

- peer panel selection, page navigation, mandatory sequential steps, or one isolated optional section

## Prefer instead

- Use Disclosure for one section, Tabs for peer panels, or always-visible Sections for required content.

## Composition and parts

- Render inside AppearanceProvider so the connected boundaries, focus, and text roles use the active theme and accent.
- Pass a non-empty item list with stable ids, titles, content, and optional disabled state.
- Choose single expansion when open sections compete for attention or multiple when comparison matters.
- Accordion owns a labeled group of semantic disclosure headings, buttons, and panels.

## Preferred higher-level compositions

- Compose Accordion inside a Section when a larger task needs grouped optional detail.

## Content

- Use parallel section titles and keep essential task order outside the accordion.

## States

- Expansion may be single or multiple, controlled or uncontrolled; the group or individual items may be disabled.

## Control, events, validation, and forms

- Accordion supports single or multiple expansion and controlled expandedIds or uncontrolled defaultExpandedIds.
- onExpandedChange reports the complete ordered set of expanded item ids.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Tab reaches each enabled heading button; Enter or Space toggles it without changing other focus order.
- ariaLabel names the group and every item title labels its own heading and panel.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- Accordion joins related disclosures through shared quiet boundaries and aligned expansion controls.
- Headings and panels wrap in place without adding horizontal overflow.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### Related configuration sections

Group related configuration sections with one open at a time.

```tsx
import '@trwhitney/component-library/styles.css';
import {Accordion, AppearanceProvider} from '@trwhitney/component-library';

export function RunConfigurationAccordion() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Accordion
        ariaLabel="Run configuration"
        defaultExpandedIds={["geometry"]}
        expansionMode="single"
        items={[
          {id: "geometry", title: "Geometry", content: <p>Mesh settings</p>},
          {id: "solver", title: "Solver", content: <p>Precision settings</p>},
        ]}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace tabs with accordion sections

Peer views that replace one another belong in Tabs.

```tsx
import '@trwhitney/component-library/styles.css';
import {Accordion, AppearanceProvider} from '@trwhitney/component-library';

export function PeerPanelsAccordionCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Accordion ariaLabel="Run views" items={[{id: "summary", title: "Summary", content: <p>Summary</p>}]} />
    </AppearanceProvider>
  );
}
```
