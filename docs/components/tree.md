# Tree

Tree navigates keyed hierarchical information with explicit expansion and optional selection.

## Use for

- nested keyed information needs disclosure, keyboard hierarchy navigation, and optional selection

## Do not use for

- flat commands, breadcrumb navigation, tabular comparison, arbitrary indentation, or relationship diagrams

## Prefer instead

- Use List for flat content, ListBox for flat selection, Table for columns, or CollapsibleNavigationPane for persistent destinations.

## Composition and parts

- Render Tree inside AppearanceProvider.
- Provide recursive items with stable ids, plain labels for typeahead, optional descriptions, children, and visible nested actions.
- The component owns the tree grid, recursive collection, levels, chevrons, item copy, action slot, focus recovery, selection, and feedback.

## Preferred higher-level compositions

- Place Tree in Section or Surface and keep commands in each item actions slot.

## Content

- Use hierarchy only when parent and child relationships change meaning. Keep labels concise and do not imitate indentation with spaces.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.
- Items support collapsed, expanded, focused, selected, disabled, hovered, and pressed states. Focus recovery follows dynamic updates.

## Control, events, validation, and forms

- Expansion and selection are separate controlled or uncontrolled typed states.
- Stable ids preserve focused items through insertion and reordering. Removing the focused item moves focus to a nearby remaining item.
- onExpandedChange and onSelectionChange report ids in depth-first item order. Nested controls own their own events.
- Every item id must be a nonempty stable string and unique across the full hierarchy.
- Disabled items cannot contain active nested actions. Virtualization and asynchronous per-level loading are not public APIs.
- Tree does not serialize expansion or selection. Nested form controls retain their own behavior.

## Accessibility

- Tree owns a labeled tree grid with hierarchical levels, positions, expansion state, disabled items, and optional selection.
- Every expandable item includes a named chevron control. Nested actions remain separate named controls.

## Keyboard, labeling, localization, and direction

- Up and Down move between visible items. Logical Right and Left expand, collapse, or move between parent and child. Home, End, typeahead, and selection keys follow tree-grid behavior.
- ariaLabel names the tree grid. Item labels name rows and support typeahead. expandLabel and collapseLabel localize chevron commands.
- Consumers localize the tree name, item labels and descriptions, expansion labels, action labels, empty copy, and status copy.
- Indentation, chevrons, expansion keys, nested actions, and selection rails follow inherited writing direction.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Long labels wrap within their hierarchy level. Compact layouts preserve indentation without causing document overflow.
- Inherited compact density uses border-box row sizing and a smaller empty chevron slot. Coarse pointers retain larger targets.

## Accent, forced colors, and reduced motion

- Selected items use the established leading accent rail. Focus and expansion controls use the active accent roles.
- Hierarchy, chevrons, focus, selection, disabled state, boundaries, and text use system colors.
- Chevrons and the selection rail settle without transition. Tree adds no continuous motion.

## Examples

### Study and run hierarchy

Expansion reveals runs while selection remains an independent state.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Tree} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <Tree
    ariaLabel="Study hierarchy"
    collapseLabel="Collapse"
    defaultExpandedIds={['study']}
    emptyState={{kind: 'no-data', title: 'No studies', description: 'Create a study first.'}}
    expandLabel="Expand"
    items={[{
      id: 'study',
      label: 'Thermal study',
      children: [{id: 'run-284', label: 'RUN 0284'}],
    }]}
    selectionMode="single"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not use hierarchy for commands

A flat command collection belongs in Menu or Toolbar, not a tree.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Tree} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <Tree
    ariaLabel="Commands"
    collapseLabel="Collapse"
    emptyState={{kind: 'no-data', title: 'No commands', description: 'No commands are available.'}}
    expandLabel="Expand"
    items={[{id: 'delete', label: 'Delete run'}]}
    selectionMode="none"
  />
</AppearanceProvider>;
```
