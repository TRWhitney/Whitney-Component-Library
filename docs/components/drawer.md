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
- Pass exactly one Button or IconButton trigger, title, description, closeLabel, optional body and actions, and choose placement start, end, top, or bottom.
- Pass dragHandleLabel to add an accessible grip that can extend the drawer from its docked edge. Pass dockedPreview for a noninteractive preview that remains visible and reserves page space while docked.
- Use nested overlays sparingly and keep each trigger mounted so focus can return through the overlay stack.
- Drawer includes its trigger, underlay, edge-attached dialog surface, title, description, close control, optional scrolling body and action area, optional drag handle, and optional docked preview.

## Preferred higher-level compositions

- Compose Drawer with library fields and Button actions for inspectors, filters, or supplemental editors that need more vertical room.

## Content

- Title the supplemental task, explain its relationship to the page, and keep actions in the fixed footer while long content scrolls in the body.

## States

- Closed and open may be controlled or uncontrolled. placement is start, end, top, or bottom, and nested overlays retain independent focus boundaries.
- With a handle or preview, the closed drawer remains docked at its edge. Grip-only docking exposes the accent seam; preview docking also exposes the supplied presentational strip.

## Control, events, validation, and forms

- Drawer supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Backdrop press, Escape, the close button, and an action calling close dismiss it.
- When dragHandleLabel is present, pressing the grip toggles the drawer and dragging it toward the page opens it after the distance or velocity threshold. Dragging back toward its edge docks it.
- dockedPreview is presentational and does not replace the trigger or drag handle. Its reserved provider space remains stable while the drawer opens, preventing covered content and layout jumps.
- onOpenChange reports every open-state transition; action content owns domain events and calls the provided close function when the task should end.
- TypeScript validates explicit state and variant combinations. Runtime validation requires the trigger to render exactly one library Button or IconButton; consumers validate task data and keep validation feedback inside the active overlay.
- The overlay is not a form itself. A consumer may place a form in its body and must connect submission, validation, and reset behavior explicitly.

## Accessibility

- Opening moves focus into the overlay, focus remains contained while it is open, and closing restores focus to its trigger, including nested and sequential overlays.
- The visible title labels the dialog and the visible description is announced with it; background content is excluded from the accessibility tree while the overlay is open.

## Keyboard, labeling, localization, and direction

- Opening places focus on the close control, Tab and Shift+Tab remain inside, Escape dismisses, and focus returns to the trigger.
- A drag handle supports Enter or Space to toggle, Home to dock, End to open fully, and placement-relative arrow keys to move in ten-percent steps.
- title and description are required visible strings. closeLabel names the icon-only close control, and placement never substitutes for a meaningful title.
- dragHandleLabel is required whenever the optional grip is rendered and should name the drawer it moves. dockedPreview is hidden from assistive technology and must not contain interactive or essential content.
- Supply localized title, description, trigger, dismissal, and decision labels as applicable; allow visible copy and actions to wrap without truncation.
- placement uses logical start and end: start maps to the left in left-to-right contexts and right in right-to-left contexts, with end mapping oppositely. Top and bottom are physical block edges in either direction.

## Appearance and responsive behavior

- Drawer is a raised panel attached to a viewport edge, with a short faded accent seam on the content-facing edge and a dimmed underlay behind it.
- A drag handle continues the straight seam through a shallow tapered grip; a docked preview uses the same surface and edge treatment rather than appearing as a separate control.
- At compact widths Drawer becomes a full-screen visual-viewport surface; at larger widths it remains edge-attached with a bounded inline size. Edge motion stays clipped to the viewport without introducing horizontal scrolling.
- A docked preview reserves 88 pixels at a logical inline edge or 70 pixels at a block edge through AppearanceProvider, so ordinary application content reflows instead of sitting underneath it.
- AppearanceProvider publishes the current physical reservation as --wcl-drawer-reserved-left, --wcl-drawer-reserved-right, --wcl-drawer-reserved-top, and --wcl-drawer-reserved-bottom. Fixed consumer controls add the relevant value to their inset; NotificationProvider does this automatically.

## Accent, forced colors, and reduced motion

- The application accent identifies the overlay threshold and primary ordinary action; warning and danger confirmation meaning always use their semantic colors instead.
- Forced colors preserve the panel boundary, content-facing seam, grip outline and marks, text, close control, and action focus indicators with system colors.
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

### Docked inspector with preview

Reserve an edge preview and let the user click, drag, or use the keyboard grip to extend the same drawer surface.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Drawer} from '@trwhitney/component-library';

export function DockedRunInspectorDrawer() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Drawer
        closeLabel="Close run inspector"
        description="Inspect solver inputs without leaving the run list."
        dockedPreview={<span>RUN 0284 · Stable</span>}
        dragHandleLabel="Move run inspector"
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
