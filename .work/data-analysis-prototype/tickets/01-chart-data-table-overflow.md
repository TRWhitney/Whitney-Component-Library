# 01 Keep hidden chart data tables within the page

**What to build:** Prevent the chart's visually hidden data table from widening a narrow page while preserving its complete accessible data alternative.

**Blocked by:** none.

**Status:** complete

## Reproduction and evidence

Run `npm run prototype:analysis`, open `http://localhost:5174/` and set the viewport to 390 pixels wide. Distribution is the initial chart panel. The app keeps the document within the viewport. In the prior layout, the hidden table increased the work pane's scroll width to 440 pixels in both Chromium and Firefox. The chart itself fits and is 281 pixels high. The pane should not need this extra horizontal scroll.

The following measurements isolated the same defect in the earlier prototype layout:

The visible chart figures fitted their 317-pixel containers. The scatter chart's hidden native table still measures 583 pixels wide and extends to approximately x = 612. The earlier page became horizontally scrollable. Its cells impose the table's minimum content width despite the hidden-element rule specifying `inline-size: 1px`.

The shared rule in `src/styles.css` applies absolute positioning, one-pixel dimensions, hidden overflow, and `clip-path: inset(50%)` directly to the native table. The computed display remains `table` and the computed inline size remains 583 pixels.

As a temporary browser diagnostic, setting only these hidden tables to `display: block !important` reduced document scroll width from 612 to 375 pixels in the 390-pixel viewport. Removing that diagnostic restored the overflow. This identifies the source, not an accepted implementation. The prototype source retains no override.

Separate Chromium and Firefox checks also reproduce the issue. With their default font metrics and a changed two-building comparison, the document measures 648 pixels at a 390-pixel viewport. The same temporary diagnostic returns it to 390 pixels. The exact overflow varies with table content and browser font metrics.

## Client boundary

The client can choose an appropriate layout and short labels. It cannot fix the library's hidden table sizing through a public chart prop. Overriding private selectors or clipping the whole chart could mask the issue or clip chart content. The library owns both the hidden table and its accessibility behavior.

- [x] Hidden chart tables do not contribute document overflow in narrow containers, including long localized headers and several series.
- [x] Complete table names, headers, row relationships, and values remain accessible to assistive technology. Do not hide or remove the data alternative.
- [x] Visible plots, focus outlines, tooltips, and exploration controls retain their behavior without requiring client overflow rules.
- [x] Cover the shared chart families affected by this hidden-table rule with a focused browser check and inspect the accessibility tree.
- [x] Update the component showcase in the same library change, as required by the repository instructions.

## Accepted sources

- [Approved library fix specification](../spec.md).

- [Data analysis prototype](../prototype.md).
- [ScatterChart contract](../../../docs/components/scatter-chart.md).
- [LineChart contract](../../../docs/components/line-chart.md).
- [Repository component-example requirement](../../../AGENTS.md).

## Completion evidence

The shared hidden chart table rule now sets `display: block`, a one-pixel maximum inline size, and strict containment. Existing one-pixel dimensions and clipping remain in place. This removes native table minimum-width expansion without changing visible plots or hiding the accessible data alternative.

An isolated browser fixture uses the actual library stylesheet, a 260px figure inside a 320px viewport, twelve long column headers, a row header, and twelve values. Chromium measured 2504px document width before the fix and 320px after; Firefox measured 2934px before and 320px after. The hidden table measured exactly one pixel with the fix in both left-to-right and right-to-left layouts.

Chromium's browser accessibility tree retained the named table, both rows, all thirteen column headers, the row header, and all twelve cells. Chromium and Firefox ARIA snapshots retained the table name, final header, row header, and final value. No explicit role override was needed in these browsers. Rendered public chart families, overlays, focus states, and examples are covered by the shared verification record.

Focused regression: the new hidden-table style test failed before implementation. `application-style-regressions` and `styles` pass together after implementation.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
