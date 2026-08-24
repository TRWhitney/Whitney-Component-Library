# SplitView

SplitView coordinates two named workspace panes with bounded resizing, collapse of either pane, and compact stacking.

## Use for

- two related workspace panes need bounded user resizing, collapse in either direction, and a stacked compact fallback

## Do not use for

- unrelated responsive columns, a fixed sidebar, application navigation, arbitrary dashboard layout, or content with no primary and supporting relationship

## Prefer instead

- Use ResponsiveGrid for equivalent automatic columns, an application-owned layout for page regions, Surface for a panel, or Drawer for temporary overlay detail.

## Composition and parts

- Render SplitView inside AppearanceProvider and an application-owned bounded region with meaningful available width.
- Pass one complete primary region and one secondary region with accessible pane and resize labels plus explicit collapse and restore labels for each pane.
- Use controlled state when pane size or collapse must persist outside the component; otherwise use the matching defaults.
- SplitView owns two named panes, one resize rail and separator, and distinct pane-target collapse or restore controls.

## Preferred higher-level compositions

- Compose SplitView below PageHeader when a page needs two resizable related regions.

## Content

- Keep the primary task in primary and supporting comparison, inspection, preview, or context in secondary.
- Do not place required completion actions only in a pane that may collapse.

## States

- Primary size and collapsed pane may each be controlled or uncontrolled. Collapse preserves descendants of either pane. Compact stacking is container-owned and does not change either application state.

## Control, events, validation, and forms

- Primary size is a bounded percentage with a default range of 25 through 75 and a default value of 60. Minimum and maximum values may narrow that range within 10 through 90.
- Either pane may collapse, but never both at once. Collapsed-pane state and primary size each support controlled or uncontrolled ownership. Pointer drag and keyboard resizing report the same clamped integer percentage.
- onPrimarySizeChange reports each clamped keyboard or pointer size. onCollapsedPaneChange reports primary, secondary, or null for collapse and restore requests.
- TypeScript prevents mixed controlled and uncontrolled ownership. Runtime validation rejects non-finite sizes, bounds outside 10 through 90, reversed bounds, and sizes outside the active bounds.
- Application structure does not submit values. Forms and controls inside each named region retain their own behavior.

## Accessibility

- SplitView names its group and both pane regions. The focusable separator exposes orientation, current percentage, minimum, and maximum values.
- Collapsing a pane hides its focusable descendants while preserving their local state. If focus was inside that pane, SplitView restores it to the persistent expansion control.

## Keyboard, labeling, localization, and direction

- In left-to-right layout, Left and Right decrease and increase primary size; right-to-left layout reverses those keys. Home and End use the minimum and maximum. Each pane-target control toggles with Enter or Space.
- The stacked compact fallback disables the resize separator while keeping both pane-target controls reachable.
- ariaLabel names the split relationship. primaryLabel, secondaryLabel, resizeLabel, collapsePrimaryLabel, collapseSecondaryLabel, restorePrimaryLabel, and restoreSecondaryLabel name every region and control.
- Localize visible content and every region, resize, collapse, and restore label. Titles, identifiers, descriptions, and actions may wrap without changing DOM order.
- Logical region placement, Route gradients, pane diagrams, pointer sizing, and keyboard resizing follow inherited writing direction.

## Appearance and responsive behavior

- SplitView uses two quiet content planes separated by one complete resize rail. Two compact split-panel controls identify which pane they collapse without relying on directional chevrons. Their hover and pressed states match quiet secondary buttons.
- Wide containers place panes beside one vertical separator. Containers at or below 40 rem stack panes in DOM order, disable resizing, preserve the collapse control, and add no decorative divider.

## Accent, forced colors, and reduced motion

- The application accent marks Route structure, the split resize rail, and focus without recoloring semantic status content.
- Forced colors preserve region boundaries, the Route track, resize state, collapse controls, and focus with system colors.
- Reduced motion removes pane and rail transitions without changing resize, collapse, focus, or responsive behavior.

## Examples

### Resizable workspace inspector

Resize configuration and inspection while preserving their distinct regions.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Section, SplitView} from '@trwhitney/component-library';

export function RunInspectorSplit() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SplitView
        ariaLabel="Run workspace"
        collapsePrimaryLabel="Hide run configuration"
        collapseSecondaryLabel="Hide run inspector"
        defaultPrimarySize={60}
        primary={<Section title="Run configuration">Configuration fields</Section>}
        primaryLabel="Run configuration"
        resizeLabel="Resize run inspector"
        restorePrimaryLabel="Show run configuration"
        restoreSecondaryLabel="Show run inspector"
        secondary={<Section title="Inspector">Selected run details</Section>}
        secondaryLabel="Run inspector"
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not join unrelated regions

Unrelated content belongs in separate sections or routes. Resizing should express a real primary and supporting relationship.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, SplitView} from '@trwhitney/component-library';

export function UnrelatedSplitColumns() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SplitView ariaLabel="Summary" collapsePrimaryLabel="Hide settings" collapseSecondaryLabel="Hide news" primary="Account settings" primaryLabel="Settings" resizeLabel="Resize" restorePrimaryLabel="Show settings" restoreSecondaryLabel="Show news" secondary="Release notes" secondaryLabel="News" />
    </AppearanceProvider>
  );
}
```
