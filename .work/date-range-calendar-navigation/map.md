# Date range calendar navigation

## Destination

A range calendar that makes the active endpoint explicit, edits both endpoints predictably by click or drag, moves through dates efficiently, and retains the component library's compact calendar language.

## Notes

The installed primitives provide two visible months, single-month paging, fixed six-week grids, month selection, and a 20-year selector. Explicit endpoint identity, non-closing drag commits, edge drag paging, and navigation above the year level require library-owned behavior.

## Accepted decisions

- [Endpoint editing](decisions/01-endpoint-editing.md): Preserve the existing opposite endpoint while editing, advance start clicks to end, close only after an ordinary completing click, and never close after endpoint drag.
- [Partial range boundary](decisions/02-partial-range-boundary.md): Keep partial endpoint edits as picker draft state; public values, form values, and `onChange` remain complete-range-or-null.
- [Endpoint crossing](decisions/03-endpoint-crossing.md): Normalize crossed endpoint drags by swapping settled start/end identities and updating both fields.
- [Two-month paging](decisions/04-two-month-layout.md): Range calendars show consecutive months and page one month at a time with shared navigation.
- [Drag edge paging](decisions/05-drag-edge-paging.md): Pointer drag pages from side gutters or beyond the popup after a dwell, while all date cells take priority.
- [Stable calendar height](decisions/06-stable-calendar-height.md): Day views reserve six week rows so month length never resizes the pane.
- [Hierarchical navigation](decisions/07-hierarchical-navigation.md): A fixed 12-item, four-column hierarchy replaces the day content and drills between months, years, decades, and larger periods.
- [Keyboard and assistive interaction](decisions/08-keyboard-accessibility.md): Preserve calendar keyboard semantics, announce endpoint activity, and provide spatial hierarchy navigation.
- [Single-date scope](decisions/09-single-date-scope.md): Stable height and hierarchy apply to both pickers; dual panes and endpoints remain range-only.

## Out of scope

- More than two simultaneous month grids
- Non-contiguous ranges
- Date-time or time-zone selection
