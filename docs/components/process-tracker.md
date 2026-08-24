# ProcessTracker

ProcessTracker reports the ordered status of a staged process without owning it.

## Use for

- a user needs to observe the ordered status of a multi-stage operation, import, build, conversion, deployment, or analysis

## Do not use for

- interactive step navigation, a checklist, an arbitrary timeline, page navigation, one changing status, or numeric progress without meaningful stages

## Prefer instead

- Use StatusIndicator for one state, ProgressBar for measurable completion, Spinner for a compact generic busy state, Tabs for switching panels, or ordinary Buttons and sections for a user-controlled wizard.

## Composition and parts

- Render ProcessTracker inside AppearanceProvider wherever the consuming application needs staged status. The application owns the surrounding layout, actions, and state transitions.
- Place a separate ProgressBar nearby when the active stage also has meaningful numeric or indeterminate progress.
- ProcessTracker includes one named ordered stage list, a relationship rail, one non-color marker per stage, visible labels and descriptions, and visually hidden localized status text.

## Preferred higher-level compositions

- Compose ProcessTracker with PageHeader, ProgressBar, StatusIndicator, and application-owned actions without wrapping them in a library workflow component.

## Content

- Use concise stage labels, optional outcome or current-work descriptions, stable ids, and localized status labels. Keep stages ordered by the process they describe.

## States

- Each stage is complete, active, pending, warning, or failed. The collection is non-empty, ids are unique, and no more than one stage is active.

## Control, events, validation, and forms

- ProcessTracker is status-only. It does not start work, navigate stages, retry failures, infer valid stage sequences, or coordinate other components.
- announcement defaults to off. Polite and assertive modes use the shared atomic live-region behavior when the consumer needs a stage change announced.
- ProcessTracker emits no events. The consumer updates the immutable stages collection when process state changes.
- TypeScript requires a non-empty immutable stage tuple and all localized status labels. Runtime validation rejects empty collections, blank ids or labels, duplicate ids, more than one active stage, blank ariaLabel, and blank status labels.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- ProcessTracker exposes one named ordered list. Each stage retains its list position, visible label and description, localized status text, and aria-current step meaning for the active stage.
- The tracker adds no focus target. Optional announcement wraps the same visible list in one atomic live region rather than rendering duplicate status content.

## Keyboard, labeling, localization, and direction

- ProcessTracker adds no tab stop or keyboard command because stages are status rather than controls.
- ariaLabel names the process. statusLabels supplies localized text for complete, active, pending, warning, and failed meaning.
- Localize ariaLabel, every stage label and description, and all five statusLabels. Long text wraps without changing stage order.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A compact pale-accent rail connects distinct stage markers. Check, open circle, warning triangle, and failed diamond shapes keep status legible without color.
- Labels use the reading face at 13 pixels with strong weight; optional descriptions use the muted reading role at 12 pixels.
- The vertical rail keeps a fixed marker column while labels and descriptions wrap in compact containers without horizontal overflow.

## Accent, forced colors, and reduced motion

- Application accent identifies the active stage. Complete uses semantic success, warning and failed retain their semantic colors, and pending remains neutral.
- Forced colors keep the rail and every marker shape in system colors. Highlight identifies the active marker without removing its solid core.
- Reduced motion stops the active marker pulse while its accent ring, solid center, localized status text, and aria-current meaning remain.

## Examples

### Active staged process

Report ordered solve status without owning the surrounding workflow.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ProcessTracker} from '@trwhitney/component-library';

export function ThermalSolveTracker() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ProcessTracker
        announcement="polite"
        ariaLabel="Thermal solve stages"
        stages={[
          {id: "geometry", label: "Geometry validated", description: "12 surfaces, no open edges", status: "complete"},
          {id: "boundary", label: "Boundary pass", description: "4 of 6 conditions resolved", status: "active"},
          {id: "solve", label: "Solve pending", status: "pending"},
        ]}
        statusLabels={{active: "Active", complete: "Complete", failed: "Failed", pending: "Pending", warning: "Needs review"}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use as step navigation

A user-controlled wizard needs navigation controls and step panels. ProcessTracker only reports process status.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ProcessTracker} from '@trwhitney/component-library';

export function InteractiveWizardCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ProcessTracker ariaLabel="Account setup" stages={[{id: "profile", label: "Choose profile", status: "active"}]} statusLabels={{active: "Active", complete: "Complete", failed: "Failed", pending: "Pending", warning: "Needs review"}} />
    </AppearanceProvider>
  );
}
```
