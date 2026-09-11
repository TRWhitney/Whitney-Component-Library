# Additional combined charts

## Accepted scope

The [parent ticket](../../library-foundation/tickets/22-chart-interaction-and-composition.md#reconciled-scope) includes scatter with a supplied line and a line with a supplied changing lower/upper range. Existing line/area/column combinations already ship. Applications supply calculated trends and ranges; the library does not compute them.

Whitney requested continuing with these combinations after accepting the mobile heatmap correction. Review both additions together when a prototype is needed. Preserve the approved chart controls and visual language. Prototype work uses no subagents or production regression tests.

## Production boundaries

- Scatter observations and line samples can have different counts and positions. Repeated observation coordinates remain distinct through stable IDs. A line joins its own supplied samples rather than joining the observations.
- A range carries a lower and upper value at each supplied domain position. Missing values leave honest gaps. The reading names both limits. Invalid reversed limits must not silently change meaning.
- Each chart uses compatible shared axes and units. Visibility, automatic fitting, complete tables and stable selection identity follow the existing public contracts.
- Scatter with a line retains two-axis exploration and its rectangular Overview. Line with a range retains domain exploration and its horizontal Overview.
- Existing click selection, Control/Command activation, touch hold, drag previews, overlap-only legend priority and two-finger exploration remain the starting behavior.

The executable boundary is recorded in the [specification](../spec.md#production-combined-chart-boundary). Public API details preserve the approved behavior and reuse existing component contracts.

## Accepted interaction decision

Whitney confirmed that the range conveys distinct information and should be separately selectable with its own activation details. At a month, its reading names both limits. The line remains independently selectable. The [combined study](../prototypes/combined-charts.md#acceptance-contract) is approved, including its connected pair of outer selection rings for one range item.

## Precedence

Whitney explicitly limited approval to behavior and styling under scrutiny. The [acceptance contract](../prototypes/combined-charts.md#precedence-and-scope-of-approval) preserves earlier accepted cross-chart conventions over incidental prototype differences. Do not carry adapter behavior into production as a new default without an explicit decision.

## Prototype direction

The accepted study contains both combinations. Use the existing surface, text, muted-text and border tokens, series blue `#2878ff` and series orange `#d14f00`. Keep the body face for names and controls and utility face for axes/readings. Use the existing quiet icon controls and Dialog, with the chart-type choice on its own row. Preserve shared activation motion and reduced motion.

The new visual relationship is a changing shaded interval behind a measured line. Inspect its reading and selection where it overlaps the line, alongside scatter/line overlap. Compare mobile and wide, light and dark states. Reuse production interactions where possible so existing behavior is represented faithfully. Include the existing Identify elements aid. The [combined study](../prototypes/combined-charts.md#acceptance-contract) is the accepted production reference.
