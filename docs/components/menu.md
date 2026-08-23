# Menu

Menu presents a library-owned list of immediate commands from an explicit trigger.

## Use for

- a Button or IconButton opens a bounded list of immediate application commands

## Do not use for

- selection among values, persistent navigation, arbitrary interactive content, status, or actions attached to a pointer location rather than a menu button

## Prefer instead

- Use Select for value selection, ContextMenu for object actions at pointer location, Popover for arbitrary interactive content, or navigation components for destinations.

## Composition and parts

- Render inside AppearanceProvider so the surface, threshold, items, and focus treatment share the active theme and application accent.
- Pass library-owned items with stable ids, labels, callbacks, and optional descriptions, shortcuts, disabled state, danger tone, groups, separators, or submenus.
- Pass exactly one library Button or IconButton trigger. Consumers do not compose private menu parts or attach handlers to rendered rows.
- Menu owns its trigger relationship, anchored surface, arrow, command rows, groups, separators, descriptions, shortcuts, disabled states, and nested submenu surfaces.

## Preferred higher-level compositions

- Use Menu from a library Button or IconButton near the object or toolbar whose commands it contains.

## Content

- Use direct verb phrases for actions, group only commands that share a clear purpose, and show a shortcut only when the application implements it outside the open menu.

## States

- The root and each submenu may be closed or open. Items may be enabled or disabled, neutral or danger, described, grouped, separated, or nested.

## Control, events, validation, and forms

- Menu opens from press, dismisses after an enabled action, outside press, or Escape, and supports controlled isOpen with onOpenChange or uncontrolled defaultOpen.
- An enabled action calls its onAction once and closes the complete menu path. onOpenChange reports root open-state transitions.
- TypeScript requires discriminated library-owned item records and bounded placement, alignment, state, and tone choices. Runtime validation requires one rendered Button or IconButton trigger.
- Menu actions do not submit forms implicitly. An onAction callback may perform explicit application or form work.

## Accessibility

- Menu owns menu and menuitem semantics, focus movement, disabled state, groups, separators, submenu relationships, and focus restoration.

## Keyboard, labeling, localization, and direction

- Arrow keys move roving focus, printable characters provide typeahead, Home and End reach boundaries, Enter or Space runs an action, logical ArrowRight opens a submenu, logical ArrowLeft returns, and Escape dismisses.
- The trigger accessible name labels the menu. Every command and submenu has a concise label; descriptions and shortcuts remain supplementary.
- Localize trigger, group, command, description, and shortcut display strings. Labels wrap and typeahead uses the active locale.
- Logical placement, item copy, shortcuts, submenu arrows, and submenu opening keys follow the trigger writing direction.

## Appearance and responsive behavior

- Menu is a compact raised instrument with one focus rail per command, subdued group labels, and a joined anchor arrow.
- The surface flips when its requested side lacks room, stays inside the visual viewport, and scrolls its own content when available height is limited.

## Accent, forced colors, and reduced motion

- The application accent marks the top threshold, anchor bridge, and focus rail that connect the anchored surface to its trigger. Danger menu actions keep their semantic red treatment.
- Forced colors preserve the surface boundary, arrow, focused item or control, and trigger focus with system colors.
- Reduced motion removes the short anchored-surface settling transition without changing placement, focus, or dismissal.

## Examples

### Run command menu

Offer a short command list anchored to the action that reveals it.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Menu} from '@trwhitney/component-library';

export function RunActionsMenu() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Menu
        items={[
          {id: "duplicate", label: "Duplicate run", onAction: () => {}, type: "action"},
          {id: "divider", type: "separator"},
          {id: "delete", label: "Delete run", onAction: () => {}, tone: "danger", type: "action"},
        ]}
        trigger={<Button>Run actions</Button>}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace persistent navigation

Persistent destinations need a navigation component. Menu represents immediate commands rather than application structure.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Menu} from '@trwhitney/component-library';

export function NavigationMenuCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Menu
        items={[{id: "settings", label: "Settings", onAction: () => {}, type: "action"}]}
        trigger={<Button>Application sections</Button>}
      />
    </AppearanceProvider>
  );
}
```
