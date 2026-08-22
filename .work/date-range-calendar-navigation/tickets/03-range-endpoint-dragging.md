# 03 Range endpoint dragging and edge paging

**What to build:** Pointer dragging for either settled DateRangePicker endpoint, including non-closing settlement, crossed identity swaps, and guarded paging from the leading or trailing gutter while drag state continues.

**Blocked by:** [02 Sequential range endpoint workflow](02-range-endpoint-workflow.md)

**Status:** complete

- [x] Either endpoint can be dragged to a visible valid date and release never closes the popup.
- [x] The accepted active-role matrix is preserved after start and end drags.
- [x] Crossing the opposite endpoint previews an ordered interval and settles by swapping endpoint identities and both fields.
- [x] Outer-column date cells remain stable drag targets and never activate paging.
- [x] The side gutter or area beyond the popup pages after 350 ms, repeats every 500 ms, cancels on exit or date entry, and keeps the endpoint attached.
- [x] Disabled, read-only, unavailable, bounded, invalid, controlled, touch/pointer-cancel, and dismissal paths cannot leave drag or validation state stale.
- [x] The showcase demonstrates endpoint dragging, crossing, and edge paging.
- [x] Focused automated, type, formatting, style, build-generation, and visual checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Endpoint editing](../decisions/01-endpoint-editing.md)
- [Endpoint crossing](../decisions/03-endpoint-crossing.md)
- [Two-month layout](../decisions/04-two-month-layout.md)
- [Drag edge paging](../decisions/05-drag-edge-paging.md)
- [Keyboard and assistive interaction](../decisions/08-keyboard-accessibility.md)
- [Accepted prototype](../prototypes/date-range-navigation.md)

## Completion evidence

- Date-time family regressions cover non-closing endpoint drag, crossed identity swaps, date-cell priority, the 350 ms first dwell, the 500 ms repeat interval, one-month paging, retained drag identity, and the newly visible boundary endpoint.
- Direct Chromium operation dragged start from August 22 to August 18 and observed the updated field, end activity, and an open dialog. A separate edge drag activated the next state inside the forgiving 36–56 px band, displayed a 20 px handle, preserved outer-cell priority, and produced no console errors.
- Dark and light captures were inspected for endpoint joins, drag range continuity, edge-handle visibility, own-month suppression, clipping, overflow, spacing, and compact field geometry.
- `npm run check` and `npm run showcase:build` passed against the complete change.
