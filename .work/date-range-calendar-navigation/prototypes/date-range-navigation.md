# Date range navigation prototype

**Status:** accepted

## Accepted outcome

The endpoint activity, two-month movement, cross-month dragging, responsive layout, and hierarchical date navigation demonstrated here define the production interaction contract.

The prototype uses the current DateRangePicker's segmented field, trigger, focus behavior, and anchored popover. Experimental behavior is confined to the opened calendar.

## Runnable artifact

- Source: [`showcase/prototypes/date-range-navigation.tsx`](../../../showcase/prototypes/date-range-navigation.tsx)
- Styles: [`showcase/prototypes/date-range-navigation.css`](../../../showcase/prototypes/date-range-navigation.css)
- Entry: [`showcase/date-range-navigation.html`](../../../showcase/date-range-navigation.html)

Run `npm run showcase -- --host 127.0.0.1`, then open `http://127.0.0.1:5173/date-range-navigation.html`.

## Decision-bearing flows

1. With the calendar closed, focus and edit the current month, day, or year segments. No pane appears and direct entry remains unchanged.
2. Activate the calendar button. The two-month surface appears in the current anchored popover and starts with the start endpoint active.
3. If direct entry left the complete range in descending order, opening the calendar settles it into chronological order, clears the committed ordering error, and aligns the calendar's start and end identities with the displayed fields.
4. Choose a new start, then an end. The existing end remains visible after the start change, and the ordinary end click closes the calendar with focus returning to the trigger.
5. Reopen and drag either endpoint. Release commits through the picker's range state, updates the fields and validation together, and keeps the calendar open. A full field rail identifies the active endpoint throughout the open interaction.
6. Drag start beyond end or end before start. The displayed range remains ordered, and endpoint identities swap at settlement.
7. Drag into a leading or trailing gutter or continue beyond the calendar boundary and hold. Paging starts after 350 ms and repeats no faster than every 500 ms while drag state remains active; visible date cells, including the outer columns, take priority and never activate paging.
8. Page normally. The two-month window advances one month, carrying the old right month into the left pane.
9. Click a month or year heading. The fixed-height hierarchy surface supports months, 12 years, 12 decades, and successively larger periods, with selection drilling back toward days.
10. Resize the browser and verify that both adjacent panes fit without a popup scrollbar.
11. Enable `Identify parts` to obtain stable names for feedback.

## Direct inspection

- TypeScript compilation passed.
- Closed-field segment selection and keyboard adjustment, descending direct-entry validation, open-time chronological settlement, validation clearing, trigger opening, active-endpoint rail movement, ordinary start/end selection and exit, focus restoration, reset, non-closing crossed drag, relaxed in-boundary edge paging, month view, year view, decade promotion, hierarchy drill-down, and right-panel month alignment were operated in Chromium.
- Wide, 403 px adjacent, and hierarchy states were visually inspected in the dark appearance. At 403 by 700 px, popover client and scroll dimensions match on both axes, so no scrollbar is introduced.
- The prototype intentionally uses native buttons and Gregorian fixture arithmetic; production must retain React Aria's locale, calendar-system, validation, and assistive semantics.

## Proposed binding qualities

- Explicit start/end activity and the accepted click/drag state transitions.
- A full-width rail under the active start or end input whenever the calendar is open.
- The current segmented field remains visible and independently editable; the calendar exists only in the trigger-opened anchored popover.
- Two consecutive logical months with shared one-month paging.
- Six week rows per day pane and a hierarchy surface that does not resize the calendar.
- A 12-item, 4-column hierarchy that promotes by clicking its heading and drills down by selecting an item.
- Edge dwell before drag paging and a slower repeat cooldown.

## Still flexible

- Exact spacing and type sizing within existing library tokens.
- Internal state and event implementation.
- The precise dwell and repeat durations if production pointer testing shows a nearby value is more stable.

## Resolved feedback

- The adjacent panes remain together and contract within the viewport without adding a popup scrollbar.
- The hierarchy temporarily replaces the day panes within the fixed-height surface.
- Hierarchy levels use a compact four-column grid and retain the current calendar system.
- Fixed height and hierarchy navigation apply to DatePicker and DateRangePicker.
