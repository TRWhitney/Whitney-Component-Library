# 02 Radar dimensions and normalization

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

How must RadarChart declare dimensions, per-dimension domains and direction, normalized values,
series bounds, missing values, and ordering so every spoke has a comparable interpretation without
presenting negative values or precise comparison as supported uses?

## Answer

A dimension is one labeled spoke and one measured quality. A series is one subject's complete set
of values across those dimensions and renders as one polygon. RadarChart accepts three or more
dimensions with stable declared order and one to six series. It imposes no hard dimension maximum,
but its contract guides excessive axes or overlapping polygons to a table or another chart.

Every dimension uses the same nonnegative numeric meaning, unit, and shared scale. The chart derives
a readable maximum from all valid values. It does not expose separate dimension ranges,
normalization settings, direction options, or an out-of-range invalid state.

Each series provides a value for every dimension. A missing value becomes zero. Zero is valid and
produces no point away from the center. A negative or non-finite value invalidates that complete
series. The chart reports partial data when another series remains valid and invalid data when none
remain.

Use the accepted [radar shoulder](../../../CONTEXT.md) behavior from the Jumpchain visualizer. When
an isolated positive spoke has zero neighbors on both sides, add visual-only shoulders to the two
neighboring spokes. Each shoulder is capped at the positive value and otherwise uses the greater of
eight percent of the radius or twenty-five percent of that positive spoke. Do not add shoulders
beside adjacent positive values, and keep an all-zero polygon empty. Points, tooltips, readings, and
structured output retain the exact source values.

## Evidence

- [Foundation chart scope](../../library-foundation/decisions/13-charting-scope.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)
- [Jumpchain radar behavior](../research/jumpchain-radar-behavior.md)
- [Architecture decision: Preserve radar values while shaping sparse fills](../../../docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md)
