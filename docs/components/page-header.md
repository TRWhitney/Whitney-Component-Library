# PageHeader

PageHeader coordinates page identity, semantic status, ancestry, description, and actions without owning routing.

## Use for

- a page or workspace needs one title plus optional ancestry, page identifier, status content, description, or page-level actions

## Do not use for

- local section headings, card headings, dialog titles, repeated collection rows, or a second status label

## Prefer instead

- Use Section for local headed content, Surface for an unheaded panel, or a workflow construct for staged identity and progress.

## Composition and parts

- Render PageHeader inside AppearanceProvider at the start of the application-owned page region.
- Pass Breadcrumbs through breadcrumbs, optional status content through status, and a compact ButtonGroup or Toolbar through actions. StatusIndicator is available when the status has a semantic tone, but PageHeader does not require a pill.
- Use identity for a run, document, or workspace identifier that changes how the adjacent status should be read.
- PageHeader exposes optional breadcrumb and context rows, one identity-to-status Route, one heading and description group, and one action group.

## Preferred higher-level compositions

- Compose PageHeader in an application-owned page region with Breadcrumbs, optional status content, ButtonGroup, or Toolbar.

## Content

- Use one concise page title, one optional sentence of description, an optional compact identifier, optional consumer-named status content, and only page-level actions.
- Do not repeat status text in the title, description, Route track, or actions.

## States

- Breadcrumbs, identity, status, description, and actions are optional. Route appears only for the complete identity and status pair.

## Control, events, validation, and forms

- PageHeader owns no routing or action state. It renders Route only when both identity and status contain renderable endpoints.
- PageHeader emits no events. Breadcrumbs, status content, and action controls retain their own events.
- TypeScript limits headingLevel to semantic headings, requires identity and status endpoints to be renderable strings, numbers, or elements, requires statusTone with status content, and excludes consumer styling and arbitrary region slots.
- Application structure does not submit values. Forms and controls inside each named region retain their own behavior.

## Accessibility

- PageHeader labels itself with its real heading and keeps breadcrumb navigation, status semantics, and action controls in their own descendants.
- The Route track is hidden from assistive technology because identity and status already provide its meaning.

## Keyboard, labeling, localization, and direction

- PageHeader adds no focus target. Breadcrumb links and actions remain in DOM order and own their keyboard behavior.
- title labels the header through the selected headingLevel. Consumer components provide names for breadcrumbs, status, and actions.
- Localize visible content and every region, resize, collapse, and restore label. Titles, identifiers, descriptions, and actions may wrap without changing DOM order.
- Logical region placement, Route gradients, pane diagrams, pointer sizing, and keyboard resizing follow inherited writing direction.

## Appearance and responsive behavior

- PageHeader uses utility typography for an optional page identifier, reading typography for the page title, and a flexible Route track only between present identifier and status endpoints. Its open origin uses the accent and its solid endpoint uses statusTone, independent of the rendered status content.
- Route remains a flexible track between distinct endpoints. Compact containers stack heading actions below the title without reordering focus or inserting a divider.

## Accent, forced colors, and reduced motion

- The application accent marks Route structure, the split resize rail, and focus without recoloring semantic status content.
- Forced colors preserve region boundaries, the Route track, resize state, collapse controls, and focus with system colors.
- Reduced motion removes pane and rail transitions without changing resize, collapse, focus, or responsive behavior.

## Examples

### Run workspace header

Connect run identity to semantic status while keeping page actions separate.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Breadcrumbs, Button, PageHeader} from '@trwhitney/component-library';

export function RunPageHeader() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <PageHeader
        actions={<Button>Run profile</Button>}
        breadcrumbs={<Breadcrumbs ariaLabel="Run location" items={[{id: "runs", label: "Runs", href: "/runs"}, {id: "current", label: "RUN 0284", href: "/runs/0284"}]} />}
        description="Evaluate the 18-minute ramp profile."
        identity="SIM / THERMAL / 0284"
        status={<span><small>Run state</small><strong>Converged</strong></span>}
        statusTone="success"
        title="North chamber"
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace a section heading

A local headed group belongs in Section rather than creating another page identity.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, PageHeader} from '@trwhitney/component-library';

export function SectionAsPageHeader() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <PageHeader title="Boundary conditions" description="A local group inside the current page." />
    </AppearanceProvider>
  );
}
```
