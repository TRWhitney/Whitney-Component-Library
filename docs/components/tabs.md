# Tabs

Tabs selects one peer content panel without changing application location.

## Use for

- switching among peer panels within the same task or page context

## Do not use for

- navigation among URL destinations, choosing a submitted value, progressive steps, or hiding optional supporting detail

## Prefer instead

- Use CollapsibleNavigationPane or Link for destinations, SegmentedControl for a submitted choice, and Disclosure for optional detail.

## Composition and parts

- Render inside AppearanceProvider so the route, focus, surface, and text roles use the active theme and accent.
- Pass a non-empty library-owned item list containing stable ids, short labels, and matching panel content.
- Use controlled selectedId when application state or a URL parameter determines the active panel; keep route navigation in links or CollapsibleNavigationPane.
- Tabs owns one tab list, its tab controls, and their matching tab panels.

## Preferred higher-level compositions

- Compose Tabs inside a Section or application workspace where its panels remain part of one task.

## Content

- Use short parallel labels and keep each panel focused on one peer section. Do not place href destinations in tab items.

## States

- Selection may be controlled or uncontrolled; items may be disabled individually.

## Control, events, validation, and forms

- Tabs support controlled selectedId with onSelectionChange or uncontrolled defaultSelectedId, horizontal or vertical orientation, and automatic or manual activation.
- onSelectionChange reports the selected item id after pointer or keyboard activation.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Enabled links, tab controls, and disclosure triggers use a pointer cursor across their label and padding. Disabled controls use not-allowed; passive headings, current breadcrumb text, and panel content retain normal text selection.
- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Arrow keys move among enabled tabs according to orientation and direction. Automatic activation selects on focus; manual activation waits for Enter or Space.
- ariaLabel names the tab list and each visible item label names its panel.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- Tabs use a quiet shared baseline and one moving accent rail. The selected panel remains a separate bounded surface.
- Horizontal tabs remain reachable through a compact scroll track. Vertical tabs return to a horizontal track when the viewport is narrow.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### Peer content panels

Switch between peer run-detail panels without changing location.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Tabs} from '@trwhitney/component-library';

export function RunDetailTabs() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Tabs
        ariaLabel="Run details"
        defaultSelectedId="summary"
        items={[
          {id: "summary", label: "Summary", panel: <p>Convergence summary</p>},
          {id: "inputs", label: "Inputs", panel: <p>Solver inputs</p>},
        ]}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use tabs as route links

Destinations with their own URLs belong in CollapsibleNavigationPane or ordinary links, not panel-selection tabs.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Tabs} from '@trwhitney/component-library';

export function RunRouteTabsCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Tabs
        ariaLabel="Workspace destinations"
        items={[{id: "runs", label: "Runs", panel: <p>Route content</p>}]}
      />
    </AppearanceProvider>
  );
}
```
