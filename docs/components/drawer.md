# Drawer

Drawer hosts a supplemental workflow or larger focused task at a logical viewport edge.

## Use for

- a supplemental workflow or larger focused task should open from a logical viewport edge while retaining the current page context

## Do not use for

- persistent application navigation, a small confirmation, transient feedback, a non-modal side rail, or primary work that deserves its own route

## Prefer instead

- Use Dialog for a compact centered task, AlertDialog for consequential confirmation, a page-level navigation region for persistent navigation, or a route for primary work.

## Composition and parts

- Render inside AppearanceProvider so the panel, threshold, text, and focus treatment share the active theme and application accent.
- Pass exactly one Button or IconButton trigger, title, description, closeLabel, optional body and actions, and choose logical placement start or end.
- Use nested overlays sparingly and keep each trigger mounted so focus can return through the overlay stack.
- Drawer includes its trigger, underlay, edge-attached dialog surface, title, description, close control, optional scrolling body, and optional action area.

## Preferred higher-level compositions

- Compose Drawer with library fields and Button actions for inspectors, filters, or supplemental editors that need more vertical room.

## Content

- Title the supplemental task, explain its relationship to the page, and keep actions in the fixed footer while long content scrolls in the body.

## States

- Closed and open may be controlled or uncontrolled. placement is logical start or end, and nested overlays retain independent focus boundaries.

## Control, events, validation, and forms

- Drawer supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Backdrop press, Escape, the close button, and an action calling close dismiss it.
- onOpenChange reports every open-state transition; action content owns domain events and calls the provided close function when the task should end.
- TypeScript validates explicit state and variant combinations. Runtime validation requires the trigger to render exactly one library Button or IconButton; consumers validate task data and keep validation feedback inside the active overlay.
- The overlay is not a form itself. A consumer may place a form in its body and must connect submission, validation, and reset behavior explicitly.

## Accessibility

- Opening moves focus into the overlay, focus remains contained while it is open, and closing restores focus to its trigger, including nested and sequential overlays.
- The visible title labels the dialog and the visible description is announced with it; background content is excluded from the accessibility tree while the overlay is open.

## Keyboard, labeling, localization, and direction

- Opening places focus on the close control, Tab and Shift+Tab remain inside, Escape dismisses, and focus returns to the trigger.
- title and description are required visible strings. closeLabel names the icon-only close control, and placement never substitutes for a meaningful title.
- Supply localized title, description, trigger, dismissal, and decision labels as applicable; allow visible copy and actions to wrap without truncation.
- placement uses logical start and end: start maps to the left in left-to-right contexts and right in right-to-left contexts, with end mapping oppositely.

## Appearance and responsive behavior

- Drawer is a raised panel attached to a logical viewport edge, with its accent threshold rail on the content-facing edge and a dimmed underlay behind it.
- At compact widths Drawer becomes a full-screen visual-viewport surface; at larger widths it remains edge-attached with a bounded inline size. Edge motion stays clipped to the viewport without introducing horizontal scrolling.

## Accent, forced colors, and reduced motion

- The application accent identifies the overlay threshold and primary ordinary action; warning and danger confirmation meaning always use their semantic colors instead.
- Forced colors preserve the panel boundary, content-facing threshold, text, close control, and action focus indicators with system colors.
- Reduced motion removes the edge slide and underlay fade while preserving placement, focus, and dismissal behavior.

## Examples

### Supplemental inspector

Open supplemental detail from the logical end edge and preserve page context.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Drawer} from '@trwhitney/component-library';

export function RunInspectorDrawer() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Drawer
        actions={({close}) => <Button onPress={close}>Done</Button>}
        closeLabel="Close run inspector"
        description="Inspect solver inputs without leaving the run list."
        placement="end"
        title="Run inspector"
        trigger={<Button>Inspect run</Button>}
      >
        <p>RUN 0284 is ready for review.</p>
      </Drawer>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace persistent navigation

Persistent application navigation needs a stable page-level navigation region rather than a task overlay.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Drawer} from '@trwhitney/component-library';

export function NavigationDrawerCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Drawer
        closeLabel="Close navigation"
        description="Move between the application sections."
        placement="start"
        title="Navigation"
        trigger={<Button>Open navigation</Button>}
      >
        <nav aria-label="Primary">Application destinations</nav>
      </Drawer>
    </AppearanceProvider>
  );
}
```
