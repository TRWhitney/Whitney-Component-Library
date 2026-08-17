# SearchField

SearchField collects, submits, and clears a search query with native semantics.

## Use for

- a user enters, submits, and may quickly clear a query that filters or searches content

## Do not use for

- the text is stored as ordinary form data without search, filter, submit, or clear meaning

## Prefer instead

- Use TextField for ordinary stored text and a later filter composition for multiple structured filter dimensions.

## Composition and parts

- Render SearchField inside AppearanceProvider and place it near the collection or result region it searches.
- SearchField owns a label, search glyph, native search input, conditional clear command, and stable support track.

## Preferred higher-level compositions

- Pair SearchField with the collection region it affects; use FormSection only when search is part of a larger form workflow.

## Content

- Name the searched domain in the label and provide clearLabel in the application locale; placeholder is optional context only.

## States

- Empty, nonempty, controlled, uncontrolled, required, invalid, read-only, disabled, and pending states preserve one control size.

## Control, events, validation, and forms

- SearchField owns controlled or uncontrolled query text, Enter submission, Escape or clear-command clearing, and read-only pending state.
- onChange reports query edits, onSubmit reports Enter submission, and onClear reports an explicit or Escape clear action.
- Required, pattern, length, custom validate, and external invalidity share the stable error track when a query is validated.
- name and form use native search-string serialization and reset while Enter also invokes onSubmit.

## Accessibility

- SearchField renders a native search input and a localized clear command only while an editable query is present.

## Keyboard, labeling, localization, and direction

- Native text editing remains intact; Enter submits the query and Escape clears it when editable and nonempty.
- label is the required visible input name; clearLabel is the required accessible name for the icon-only clear command.
- Supply visible labels, descriptions, errors, pending messages, and explicit command labels in the application locale, and allow them to wrap.
- Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- The field family uses compact rounded controls, one consistent single-line control height, neutral surfaces, and a reserved support track beneath each control.
- Fields fill their bounded parent width; support text grows below without moving or resizing the control, and responsive groups collapse through content-owned minimums.

## Accent, forced colors, and reduced motion

- Resting field content stays neutral; hover and focus use saturated same-hue accent structure, while invalid and pending states retain independent danger and warning colors.
- Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.
- Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.

## Examples

### Search runs

Expose a recognizable query input with one localized clear command.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, SearchField} from '@trwhitney/component-library';

export function SearchRunsExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SearchField label="Search runs" clearLabel="Clear query" name="query" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use search semantics for ordinary text

A stored text value is not a query and does not need clear or submit semantics.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, SearchField} from '@trwhitney/component-library';

export function StoredSearchCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <SearchField label="Run name" clearLabel="Clear" />
    </AppearanceProvider>
  );
}
```
