# 20 Mark hidden categories in expansion

**What to build:** Reuse the expansion asterisk when it contains selected or hidden categories.

**Blocked by:** none

**Status:** complete

- [x] Pie and donut show one asterisk for selected or hidden remaining categories, with or without selection enabled.
- [x] Restoration clears a hidden-only marker; a remaining selection keeps it. Categories outside expansion do not mark it.
- [x] Accessible expansion names and keyboard readings explain hidden category membership using existing localized labels. Paging, counts, callbacks and styling remain intact.
- [x] Update both rendered examples and canonical guides; focused/repository checks, browser operation and independent review pass.

## Accepted sources

- [Expansion marker](../spec.md#pie-and-donut-visibility-accepted-totals)

## Completion evidence

- Three new public-component cases failed for missing hidden markers/names, then passed. Focused pie/donut suites pass 35 tests. Coverage includes hidden-only markers without selection in both chart kinds, restoration, ordinary hidden categories, accessible expansion/keyboard names, and one marker for combined selected/hidden membership.
- `npm run check` passes formatting, code/style lint, types, all 743 tests, generated guides, TypeScript 5/6/7 public declarations and chart isolation.
- Native mobile touch and keyboard flows for both charts: open expansion, hide Public markets, return to +7*, read the hidden category announcement, restore and return to +7. Inspected the unchanged marker style in the rendered chart. Screenshots are removed after review.
- Public contracts, generated guides and both rendered examples explain the combined marker. No new public props or styling were added. Independent intent and engineering review passed with no findings on either axis. One fresh reviewer covered this small derived-status change.
