# Pagination

Pagination moves through a finite numbered collection while exposing current location.

## Use for

- moving among numbered pages in one bounded result collection

## Do not use for

- workflow progress, unbounded loading, carousel position, or peer content panels

## Prefer instead

- Use Tabs for peer panels, ProgressBar for task completion, or a collection loading control for unbounded results.

## Composition and parts

- Render inside AppearanceProvider so the current marker, focus, and text roles use the active theme and accent.
- Provide a positive pageCount, a currentPage within that range, a locale for number formatting, and localized previous, next, and page labels.
- Provide getPageHref for native URL navigation or onPageChange for consumer-controlled in-place paging; both may be used together.
- Pagination owns the navigation landmark, direction controls, page controls, current marker, and gap indicators.

## Preferred higher-level compositions

- Place Pagination adjacent to the result collection whose page it changes.

## Content

- Keep the landmark label tied to the paged collection and do not rename page numbers.

## States

- Current page is explicit and controlled by the consumer; boundary direction controls are disabled.

## Control, events, validation, and forms

- Pagination keeps the first, last, current, and neighboring pages reachable, uses inert ellipses for gaps, and disables unavailable previous or next movement.
- onPageChange reports a requested page; getPageHref supplies the corresponding URL.
- TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.
- This component does not submit a form value. Keep navigation and disclosure state separate from form data.

## Accessibility

- Enabled links, tab controls, and disclosure triggers use a pointer cursor across their label and padding. Disabled controls use not-allowed; passive headings, current breadcrumb text, and panel content retain normal text selection.
- Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.

## Keyboard, labeling, localization, and direction

- Tab reaches each rendered page link or button; Enter activates it.
- ariaLabel names the paged collection; previousLabel and nextLabel name direction controls; getPageLabel names each localized page control.
- Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.
- Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.

## Appearance and responsive behavior

- Pagination uses compact utility-number controls with an accent underline for the current page.
- The complete rendered page set stays reachable through horizontal overflow at compact widths.

## Accent, forced colors, and reduced motion

- The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.
- Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.
- Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.

## Examples

### URL-backed result pages

Navigate a result collection while preserving shareable URLs.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Pagination} from '@trwhitney/component-library';

export function RunPagination() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Pagination
        ariaLabel="Run result pages"
        currentPage={8}
        getPageHref={(page) => `/runs?page=${page}`}
        getPageLabel={(_page, number) => `Page ${number}`}
        locale="en-US"
        nextLabel="Next page"
        pageCount={20}
        previousLabel="Previous page"
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not model workflow steps as pages

A workflow needs named stages and validation, not numbered collection pages.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Pagination} from '@trwhitney/component-library';

export function WorkflowPaginationCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Pagination ariaLabel="Setup steps" currentPage={2} getPageLabel={(_page, number) => `Step ${number}`} locale="en-US" pageCount={4} previousLabel="Back" nextLabel="Next" />
    </AppearanceProvider>
  );
}
```
