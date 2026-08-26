# 18 Statistical chart reading

**Status:** resolved
**Blocked by:** [Statistical chart input contracts](17-statistical-chart-input-contracts.md)
**Type:** discussion

## Question

How should each statistical chart map pointer, keyboard, touch, legend, and structured-table
reading onto points, bins, and box-plot groups while preserving the delivered chart interaction
model?

## Answer

Every statistical chart keeps one title-named keyboard boundary, a chart-owned tooltip, retained
touch reading, Escape clearing, a polite announcement, and a complete generated table. It does not
add one tab stop per visible mark.

Pointer and touch reading begins only on a visible statistical mark. Moving through blank plot
space clears pointer reading immediately; the chart does not infer a nearby point, bin, summary, or
outlier. Directional keyboard reading for ScatterChart and BubbleChart remains spatial, with stable
point identity as the final tie-breaker. Home and End reach the lowest and highest X positions.
Coincident points remain separate records and keyboard traversal can reach each one.

Histogram traverses bins in domain order and reports bracketed boundaries, ordinate meaning, value,
and unit. BoxPlot traverses groups in domain order and reports both whiskers, Q1, median, and Q3.
The generated table retains the whisker method and complete outlier set instead of repeating them in
the group tooltip. Direct outlier reading reports only its group and that outlier value.

Direct mark reading mutes every other statistical mark. Legend interaction has group scope instead:
hover or focus temporarily emphasizes one group, while click pins it and mutes other groups. A
pinned group is painted and hit-tested above other groups, so its mark receives pointer priority at
an overlap. Tooltip placement, touch retention, Escape clearing, feedback, responsive behavior, and
structured output retain the delivered chart conventions. Selection callbacks, filtering, zooming,
brushing, and coordinated state remain in Ticket 22.

## Evidence

- [Architecture decision: Read statistical charts by their data unit](../../../docs/adr/0014-read-statistical-charts-by-their-data-unit.md)
- [Statistical Chart Family](../tickets/20-statistical-chart-family.md)
- [Shared Cartesian chart reading](../../chart-interactivity/spec.md)
- [Charting Scope](13-charting-scope.md)
