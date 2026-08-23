# ContextMenu

ContextMenu presents secondary commands for one named object at its invocation point.

## Use for

- an object or bounded region has secondary commands at its invocation point

## Do not use for

- the only path to an important action, primary navigation, value selection, arbitrary interactive content, or an unlabeled region

## Prefer instead

- Use Menu for a visible command trigger, Popover for interactive content, or AlertDialog to confirm a consequential action.

## Composition and parts

- Render inside AppearanceProvider so the target focus, command surface, threshold, and items share the active theme and application accent.
- Pass target content, a targetLabel, and the same library-owned item model used by Menu. ContextMenu owns the focusable target region and rendered command parts.
- ContextMenu owns a focusable target region, invocation-point anchor, command surface, items, groups, separators, and submenus.

## Preferred higher-level compositions

- Pair ContextMenu with a visible Menu or ordinary Button path when actions must remain readily discoverable.

## Content

- Include only actions that apply to the named target and keep every important action available through a visible or otherwise discoverable path.

## States

- Closed and open may be controlled or uncontrolled. Invocation may come from pointer, touch, or keyboard, and item states match Menu.

## Control, events, validation, and forms

- Right-click, platform context-menu gestures, touch long press, and Shift+F10 open the menu at the invocation point. An enabled action, outside press, or Escape dismisses it.
- An enabled command calls onAction once and closes the complete menu path. onOpenChange reports open-state transitions when state is controlled.
- TypeScript requires a target label and discriminated library-owned items. The owned focusable target keeps context activation and restoration coherent.
- Context-menu actions do not submit forms implicitly. An onAction callback may perform explicit application or form work.

## Accessibility

- ContextMenu gives its target an accessible name and keyboard focus, owns menu semantics and navigation, and restores focus after dismissal or selection.

## Keyboard, labeling, localization, and direction

- Shift+F10 opens from the focused target. Arrow keys, typeahead, Home, End, Enter, Space, submenu keys, and Escape match Menu behavior.
- targetLabel names the focusable target and therefore labels its context menu. Item labels name every command and submenu.
- Localize the target label and all item copy. Typeahead uses the active locale and logical submenu keys follow direction.
- Item copy, shortcuts, submenu arrows, and keyboard opening follow the target writing direction while the surface remains within the viewport.

## Appearance and responsive behavior

- ContextMenu uses the same compact command surface and whole-row item highlights as Menu, anchored to the invocation point.
- The surface flips when its requested side lacks room, stays inside the visual viewport, and scrolls its own content when available height is limited.

## Accent, forced colors, and reduced motion

- The application accent marks the top threshold and anchor bridge that connect the anchored surface to its trigger. Focused items and controls retain a visible component-specific treatment.
- Forced colors preserve the surface boundary, arrow, focused item or control, and trigger focus with system colors.
- Reduced motion removes the short anchored-surface settling transition without changing placement, focus, or dismissal.

## Examples

### Boundary object actions

Attach secondary commands to one named object and preserve keyboard access.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ContextMenu} from '@trwhitney/component-library';

export function BoundaryContextMenu() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ContextMenu
        items={[{id: "inspect", label: "Inspect boundary", onAction: () => {}, type: "action"}]}
        targetLabel="Boundary condition BC-12"
      >
        <span>BC-12 · insulated</span>
      </ContextMenu>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide the only action path

A context menu cannot be the only path to an important or consequential action. Keep a visible discoverable path and confirm deletion with AlertDialog.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ContextMenu} from '@trwhitney/component-library';

export function OnlyDeleteContextMenuCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ContextMenu
        items={[{id: "delete", label: "Delete run", onAction: () => {}, tone: "danger", type: "action"}]}
        targetLabel="RUN 0284"
      >
        <span>RUN 0284</span>
      </ContextMenu>
    </AppearanceProvider>
  );
}
```
