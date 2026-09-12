# 08 Enforce cursor shapes that match interaction

**What to build:** Audit public controls and document and enforce cursor shapes that match their behavior.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Energy desk uses Tree branch selection to toggle campus expansion. Hovering the branch label shows a text-selection cursor, although clicking the label runs that command. The client now sets a pointer cursor on its browser's semantic expandable rows. This covers both the label and row whitespace without selecting private library attributes. The chevron retains its own button behavior.

The library does not know whether every consumer uses a branch as a disclosure command. Its contract should still distinguish interactive rows and controls from editable text and passive content. A blanket pointer cursor for the entire application would be wrong.

## Acceptance

- [x] Define cursor behavior for clickable disclosure rows, selection rows, buttons, links, editable fields, disabled and pending controls, resize handles, and chart interactions.
- [x] Tree labels and row whitespace expose the cursor appropriate to their configured interaction. A disclosure command must not show the text-editing cursor.
- [x] Cursor behavior remains consistent across a control's glyph, label, padding, and nested content. Nested controls preserve their own behavior.
- [x] Keep text cursors for editable inputs and useful text selection in passive content. Do not disable text selection globally.
- [x] Audit the rendered showcase and add focused computed-style checks for the observed mismatches and their disabled states.
- [x] Update affected component contracts and showcase examples in the same change.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's campus label hover report.
- [Tree implementation](../../../src/collections/tree.tsx).
- [Component styles](../../../src/styles.css).
- [Client cursor rule](../../../prototypes/data-analysis/styles.css).

## Implementation and cursor audit

Selectable Tree, ListBox, CardGrid, and Table rows now expose `pointer` on their semantic selection targets. Tree disclosure rows and chevrons also expose `pointer`. Disabled rows and chevrons use `not-allowed`. Passive rows do not receive a pointer rule. Navigation breadcrumb and pane links declare their pointer behavior explicitly.

Editable field inputs retain `text`; disabled input descendants now inherit the disabled meaning instead of falling back to the browser input cursor. Pending field inputs use `progress`. Enabled nested buttons retain their own cursor even inside a selection-disabled row.

Existing action buttons, menu items, tabs, disclosure triggers, pagination controls, choice controls, and selection options already declare pointer/disabled behavior. Pending Button already uses progress. SplitView separators use col-resize; range and drawer drags use grab/grabbing; chart selection uses crosshair and overview movement/resize controls use grab/grabbing and axis/corner resize cursors. No global pointer or text-selection suppression was added.

The compact application showcase now includes enabled, disabled, and pending actions; editable and disabled fields; selectable Tree and Table rows; and passive text. Computed cursor checks over labels, whitespace, and nested controls pass.

Focused verification: both supplied style regression tests failed before implementation. All 69 tests pass across `application-style-regressions` and `styles`.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
