# Breadcrumbs

Breadcrumbs exposes the current page within a navigable hierarchy.

## Use for

- showing the hierarchical path from a broad location to the current page

## Do not use for

- peer navigation, history, workflow steps, or pagination

## Prefer instead

- Use Tabs for peer panels, CollapsibleNavigationPane for persistent destinations, and Pagination for numbered result pages.

## Composition and parts

- Render inside AppearanceProvider so the route, focus, and text roles use the active theme and accent.
- Pass an ordered non-empty list of stable ids, labels, and href values. The last item is the current page.
- Use maxVisible to collapse middle ancestors behind a labeled ellipsis control in an anchored overlay while retaining the root and current location.
- Breadcrumbs owns the navigation landmark, ordered path, separators, and optional anchored overflow overlay.

## Preferred higher-level compositions

- Place Breadcrumbs near the page or workspace heading whose location it names.

## Content

- Use destination names, not explanatory sentences, and keep the hierarchy shallow.

## States

- The last item is always current; the middle-ancestor overlay is closed or open.

## Control, events, validation, and forms

- Breadcrumbs marks the final item as the current page and opens every collapsed middle destination in the anchored overflow overlay named by moreLabel.
- Navigation remains native link activation; consumers integrate routing through href.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Enabled links, tab controls, and disclosure triggers use a pointer cursor across their label and padding. Disabled controls use not-allowed; passive headings, current breadcrumb text, and panel content retain normal text selection.
- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Tab reaches every visible link and the overflow control; Enter activates them.
- ariaLabel names the navigation landmark and moreLabel names the collapsed ancestors.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- Breadcrumbs form a compact route with directional separators, muted ancestors, and a stronger current location.
- Ancestor links and the overflow control use the same filled hover treatment without link underlines.
- Long labels truncate visually and middle destinations may collapse into the ellipsis overlay, which keeps every destination reachable without displacing page content.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### Current location path

Expose the current run within its application hierarchy.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Breadcrumbs} from '@trwhitney/component-library';

export function RunBreadcrumbs() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Breadcrumbs
        ariaLabel="Run location"
        items={[
          {id: "workspaces", label: "Workspaces", href: "/workspaces"},
          {id: "runs", label: "Runs", href: "/workspaces/runs"},
          {id: "run", label: "RUN 0284", href: "/workspaces/runs/284"},
        ]}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not represent history as hierarchy

A chronological or peer list is not a hierarchy. Use ordinary links or a collection.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Breadcrumbs} from '@trwhitney/component-library';

export function RunHistoryBreadcrumbCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Breadcrumbs ariaLabel="Recent pages" items={[{id: "one", label: "Run 1", href: "/1"}, {id: "two", label: "Run 2", href: "/2"}]} />
    </AppearanceProvider>
  );
}
```
