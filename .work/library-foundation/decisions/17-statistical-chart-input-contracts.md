# 17 Statistical chart input contracts

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

What public record contracts should ScatterChart, BubbleChart, Histogram, and BoxPlot accept for
point identity, bubble magnitude, raw versus pre-binned distributions, and statistical summaries?

## Answer

ScatterChart and BubbleChart accept one record per point with separate stable identity and
human-readable label accessors. Both axes are quantitative. Bubble magnitude maps to area and its
source value remains available to readings and structured output.

Histogram uses an explicit raw or binned mode. Raw mode bins an observation accessor with D3's
lower-inclusive, upper-exclusive convention, except that the last bin includes its upper endpoint.
Binned mode requires lower and upper bounds plus an explicitly named count, proportion, or density
ordinate. Unequal-width bins cannot present unscaled counts because their rectangle areas would
misrepresent the distribution.

BoxPlot uses an explicit raw or summary mode. Raw mode calculates R-7 quartiles and uses Tukey
1.5-IQR whiskers by default, with min-max whiskers available. Summary mode requires Q1, median, Q3,
lower and upper whiskers, and explicit outlier values. Outlier means classification by the selected
whisker rule, not invalid data.

## Evidence

- [Statistical chart input research](../research/statistical-chart-inputs.md)
- [Architecture decision: Model statistical chart inputs explicitly](../../../docs/adr/0013-model-statistical-chart-inputs-explicitly.md)
- [Statistical Chart Family](../tickets/20-statistical-chart-family.md)
- [Shared Cartesian chart reading](../../chart-interactivity/spec.md)
- [Charting Scope](13-charting-scope.md)
