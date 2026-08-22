# EmptyState

EmptyState explains why a loaded content region has nothing to show.

## Use for

- a loaded content region has no data, no matching results, or temporarily unavailable content and can explain the next useful step

## Do not use for

- content still loading, a failed command, field validation, broad application conditions, transient notifications, or multiple competing recovery choices

## Prefer instead

- Use Skeleton while known content loads, InlineAlert for a local condition, AlertBanner for broad scope, or a dialog when recovery needs a decision.

## Composition and parts

- Render inside AppearanceProvider where the missing collection or content would appear. Supply at most one bounded recovery action through actionLabel and onAction.
- EmptyState includes one hidden condition glyph, visible title, visible description, and at most one Button.

## Preferred higher-level compositions

- Place EmptyState inside the same Section, Surface, list, table, or chart region that owns the absent content.

## Content

- title names the condition and description explains what the reader can do next. Distinguish an empty source from filters with no matches and from content that failed to become available.

## States

- No data means the source is empty, no results means current criteria match nothing, and unavailable means expected content cannot currently load.

## Control, events, validation, and forms

- EmptyState adds no behavior without actionLabel and onAction. Supplying both renders exactly one compact secondary action; neither may appear alone.
- onAction runs when the optional recovery Button is pressed. EmptyState emits no event when it appears.
- kind is a finite choice. TypeScript requires actionLabel and onAction together and prevents either from appearing alone.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The visible title and description form one ordinary content group. The kind glyph is hidden, so wording rather than color or shape identifies the condition.

## Keyboard, labeling, localization, and direction

- The optional recovery Button follows ordinary Tab and activation behavior. EmptyState itself adds no tab stop or keyboard command.
- title and description are visible and required. actionLabel is visible when a recovery action exists.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A reserved open field pairs one stable condition glyph with left-aligned copy. An optional compact secondary Button stays with the copy rather than turning the state into a dialog.
- The glyph and copy use two columns when space permits. Long localized text and the optional action wrap without horizontal overflow.

## Accent, forced colors, and reduced motion

- No-data and no-results states remain neutral. Unavailable content uses warning structure without borrowing the application accent or claiming an error outcome.
- Forced colors preserve the field, glyph, text, and action boundaries with system colors.
- EmptyState has no motion or transient state.

## Examples

### Empty source with one action

Explain the missing source data and offer one direct next step.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, EmptyState} from '@trwhitney/component-library';

export function NoBoundaryConditions() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <EmptyState actionLabel="Add boundary" description="Add a boundary condition before running the profile." kind="no-data" onAction={() => undefined} title="No boundary conditions" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide an operation failure

A failed operation needs durable explanatory feedback and a recovery path, not an empty-content treatment.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, EmptyState} from '@trwhitney/component-library';

export function FailedSaveEmptyCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <EmptyState description="Your draft was not saved." kind="unavailable" title="Save failed" />
    </AppearanceProvider>
  );
}
```
