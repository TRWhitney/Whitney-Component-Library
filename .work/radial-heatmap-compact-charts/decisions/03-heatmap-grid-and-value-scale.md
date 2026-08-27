# 03 Heatmap grid and value scale

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

What cell identity, row and column domain, duplicate and missing-cell handling, sequential or
diverging value-scale contract, center semantics, and non-color encoding should Heatmap expose?

## Answer

Heatmap accepts explicitly ordered, labeled row and column domains of any size and preserves their
order. Each row and column pair identifies at most one cell. Duplicate coordinates are invalid
because the component cannot choose which value the consumer intended.

A cell value is finite numeric data. Negative values and zero are valid. A missing coordinate is
also valid, but means "no data," not zero. Missing cells therefore receive a localized missing-data
label and a neutral non-color treatment distinct from every numeric value in both the visual grid
and generated table. Non-finite cell values use the chart family's existing partial and invalid
feedback behavior.

Every numeric cell shares one unit, formatter, and color scale. Consumers choose either a
low-to-high scale or a two-sided scale around a meaningful declared midpoint such as zero or a
target. The chart derives its range from the data by default; consumers may provide a fixed range
when several heatmaps need a stable comparison.

Cells show their formatted values when space permits. Dense grids may omit visible cell text, but
retain the missing-data treatment, color key, pointer and keyboard reading, and complete structured
table. The component supports arbitrary row and column counts and uses local overflow before cells
become illegible. Exact colors, texture strength, and cell sizing remain prototype decisions.

Whitney accepted this contract with the expectation that its visual treatment may be adjusted
after seeing the prototype.

## Evidence

- [Foundation chart scope](../../library-foundation/decisions/13-charting-scope.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)
