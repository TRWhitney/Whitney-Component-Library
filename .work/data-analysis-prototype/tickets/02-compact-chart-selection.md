# 02 Make chart selection fit application layouts

**What to build:** A compact chart-selection presentation with discoverable controls and optional help, usable when the application already owns comparison and detail views.

**Blocked by:** none.

**Status:** complete

## Evidence

Whitney rejected the permanent gesture tutorial, selected-item list, and duplicated controls below the prototype's scatterplot. The first client supplied the long instructions, but the library requires an instruction string and unconditionally renders a paragraph, item list, and clear command whenever selection is enabled.

This occurs in the Cartesian, statistical, radial, radar, heatmap, and Sparkline implementations. The footer can be much larger than the chart's caption and repeats selection information already present in the application's comparison UI. It is not a necessary feature of charts.

The revised client gives scatter points one ordinary activation action, opening the building inspector. Comparison uses fixed-size pin actions and app-owned controls. This is an appropriate client flow, but does not fix the library's inability to offer native point or rectangle multi-selection without the permanent footer. No private selectors or empty-label tricks suppress that footer in the app.

- [x] A public presentation choice renders either the selection panel or on-chart selection controls, never both. Both presentations expose equivalent selection state and commands.
- [x] Routine chart actions are apparent through compact, named controls and visible state rather than a permanent tutorial paragraph.
- [x] Optional gesture and keyboard help is available on demand. Accessible instructions and announcements remain connected to the reading boundary without requiring a visible paragraph.
- [x] Applications can compose native chart selection with their own comparison and detail UI without a forced duplicate list of selected records.
- [x] Selection count, clear, hidden selections, keyboard operation, touch, and focus remain discoverable and accurate.
- [x] Use consistent behavior across chart families and verify it in a real application composition.
- [x] Update public contracts and the human-facing component showcase in the same library change.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's rejection of tutorial-like chart presentation and instruction to record library deficiencies.
- [Prototype design](../design.md).
- [Chart selection labels](../../../src/charts/chart-types.ts).
- [Statistical chart rendering](../../../src/charts/statistical-chart.tsx).

## Completion evidence

`ChartSelection.presentation` chooses `panel` or `controls`, with panel as the compatible default. A shared renderer supplies selection count, clear, hidden-record labels, and focus recovery to Cartesian, statistical, radial, radar, heatmap, and Sparkline charts. Controls expose selected records and help through the count disclosure; instructions remain connected to the chart for assistive technology while the disclosure is closed. Escape closes the disclosure and returns focus to its summary. Both modes clear through the existing selection state.

Focused regressions cover mutual exclusion, disclosure, clear, and chart focus in all chart families. `ChartSelectionPresentationExample` switches presentation while retaining the selected months. Showcase wiring, contracts, CSS entry import, and application verification belong to integration.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
