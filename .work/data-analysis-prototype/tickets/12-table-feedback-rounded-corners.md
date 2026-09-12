# 12 Match table interaction borders to rounded corners

**What to build:** Make hover, pressed, and focus borders follow the table's rounded outer corners without clipping or flattening those states.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

In Energy desk's Readings table, hovering the selected last row draws a straight accent border along its bottom. At the lower corner this border is clipped by the rounded scroll container instead of following its curve.

Table's overflow container has a border radius. Its cell `::after` overlays draw rectangular borders, including the first and last cell's inline borders, with no corresponding corner radii. The last-row cell backgrounds and selection rail share this boundary. The component owns this geometry and has no public state-border styling option. The prototype leaves this for library work rather than overriding internal cell pseudo-elements.

## Acceptance

- [x] Hover and pressed feedback on the last row follows both bottom corners of the visible table boundary.
- [x] Keyboard focus remains complete and visible at the same corners, including its thicker outline.
- [x] Selection rails and cell backgrounds remain inside the rounded boundary without erasing or flattening feedback.
- [x] Middle rows retain straight boundaries; a one-row table handles both lower corners correctly.
- [x] Verify selected and unselected rows, horizontal overflow, writing direction, light and dark appearance, and forced colors.
- [x] Update the Table contract and rendered showcase examples in the same change.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's Readings screenshot with the selected Materials Lab row.
- [Table styles](../../../src/styles.css).
- [Table contract](../../../docs/components/table.md).
- [Prototype Readings table](../../../prototypes/data-analysis/main.tsx).

## Implementation

The last row's first and last cell backgrounds follow the scroll container's inner radius. Interaction strokes sit one pixel inside the frame, with their logical bottom radii reduced accordingly. This separates the accent stroke from the gray frame so the rounded corner does not blend into a lighter highlight. The rule applies to hover, pressed, and thicker keyboard focus borders without changing middle cells or rows. The selected last-row rail stops above the rounded corner to keep its complete signal inside the boundary.

The compact application showcase includes a selected final row, a disabled row, and a switch for a single-row table. Its normal table width also permits checking horizontal scrolling in a narrow pane. The shared verification record covers appearance, direction, forced colors, horizontal overflow, and computed interaction states.

Focused verification: both supplied style regression tests failed before implementation. All 69 tests pass across `application-style-regressions` and `styles`.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
