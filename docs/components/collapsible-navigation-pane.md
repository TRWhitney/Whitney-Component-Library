# CollapsibleNavigationPane

CollapsibleNavigationPane exposes grouped application destinations without owning a router.

## Use for

- persistent navigation among grouped and hierarchical application destinations

## Do not use for

- commands, transient choices, contextual actions, panel selection, or routing implementation

## Prefer instead

- Use Menu for commands, Tabs for peer panels, Breadcrumbs for ancestry, or Link for isolated destinations.

## Composition and parts

- Render inside AppearanceProvider so the surface, route, focus, and text roles use the active theme and accent.
- Pass labeled groups containing stable destination ids, labels, href values, and optional nested destinations.
- Set currentId from the active route. Control isCollapsed from an application breakpoint when compact layout should begin collapsed.
- CollapsibleNavigationPane owns its landmark, collapse control, labeled groups, nested lists, links, and current marker.

## Preferred higher-level compositions

- Place CollapsibleNavigationPane wherever the application needs a bounded persistent navigation region. It does not require sidebar placement.

## Content

- Use short destination nouns, group labels only when they clarify hierarchy, and no command actions.

## States

- Current destination is consumer-owned; collapse may be controlled or uncontrolled; links may be disabled.

## Control, events, validation, and forms

- CollapsibleNavigationPane supports controlled or uncontrolled collapse, preserves native link navigation, and reports destination ids through onNavigate.
- onNavigate reports the activated destination id without replacing href routing. onCollapsedChange reports compact-state requests.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Enabled links, tab controls, and disclosure triggers use a pointer cursor across their label and padding. Disabled controls use not-allowed; passive headings, current breadcrumb text, and panel content retain normal text selection.
- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Tab reaches the collapse control and every enabled visible link; Enter activates the focused control.
- ariaLabel names the navigation landmark; collapseLabel and expandLabel name the state-changing control.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- CollapsibleNavigationPane uses one restrained surface, quiet nested guide rails, and an accent route marker for the current destination.
- The controlled or uncontrolled collapsed state reduces the compact layout to one reachable expansion control.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### Application destinations

Expose grouped application destinations and the current route.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CollapsibleNavigationPane} from '@trwhitney/component-library';

export function WorkspaceNavigation() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CollapsibleNavigationPane
        ariaLabel="Workspace"
        collapseLabel="Collapse navigation"
        currentId="active-runs"
        expandLabel="Expand navigation"
        groups={[{
          id: "workspace",
          label: "Workspace",
          items: [{id: "overview", label: "Overview", href: "/overview"}, {id: "active-runs", label: "Active runs", href: "/runs"}],
        }]}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not place commands in collapsible navigation pane

Commands belong in Menu, Toolbar, or Button actions rather than destination navigation.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CollapsibleNavigationPane} from '@trwhitney/component-library';

export function RunActionsCollapsibleNavigationPaneCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <CollapsibleNavigationPane ariaLabel="Run actions" collapseLabel="Collapse" expandLabel="Expand" currentId="delete" groups={[{id: "actions", items: [{id: "delete", label: "Delete", href: "#delete"}]}]} />
    </AppearanceProvider>
  );
}
```
