# 03 Expand the handover workspace

**What to build:** A shared-document register and a commissioning-review workflow beside the accepted editor.

**Blocked by:** none

**Status:** complete

- [x] Navigate among the three related tools and retain drafts, source selection, filters, review state, and browser history.
- [x] Filter, sort, select, and open register documents; batch readiness affects only eligible selected documents and updates the shared packet.
- [x] Inspect systems, capture date/checkpoints/decision/notes/evidence, and create a review document through a valid pass or hold path.
- [x] The generated review follows the existing save, readiness, and export workflow.
- [x] Verify desktop/phone layouts, alignment, empty results, invalid reviews, and the existing editor workflow through the packed public API.

## Accepted sources

- [Expanded specification](../spec.md)
- [Applied design](../design.md)
- Whitney's acceptance of the original demo and request for broader related content.

## Completion evidence

Implemented in the public-package consumer and verified in Chromium and Firefox. See [verification](../verification.md) for the complete flows and responsive evidence. Whitney ended critique and authorized closure, while recording that the demo design remains confusing. The integration proof is complete; no further demo redesign is scheduled.

## Layout critique

Whitney rejected the commissioning layout because chrome and chart content were cut off, excessive empty space coexisted with two-axis scrolling, and the composition felt like a webpage. The previous root-overflow checks did not prove that the contents of each pane fit.

Correction acceptance: use bounded form/evidence panes with fixed heading/actions, reduce duplicated and oversized header content, move progress into the system rail, bound chart geometry, use the notes editor for remaining working space, and move evidence to a drawer at compact widths. Verify complete default content at 1440×900, 2048×1120, and 2560×1440; verify scrolling and file/draft continuity at short and narrow sizes. All corrections remain in the consumer.

Correction implemented and verified through [the focused layout check](../../../prototypes/application-workbench/verify-review-layout.mjs). See [current evidence](../verification.md#commissioning-layout-correction).
