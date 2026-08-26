# 19 Statistical chart visual encoding

**Status:** resolved
**Blocked by:** [Statistical chart input contracts](17-statistical-chart-input-contracts.md),
[Statistical chart reading](18-statistical-chart-reading.md)
**Type:** prototype

## Question

How should points, magnitude, bins, quartiles, medians, whiskers, outliers, overlap, focus, and
emphasis use the existing role-aware palette and non-color chart language across supported sizes
and appearances?

## Answer

Use translucent series-color fills for points, bubbles, histogram bins, quartile boxes, and
outliers. Keep a series-colored edge so shape and color remain legible without making the interior
opaque. Bubble area is proportional to magnitude. Compact scatter marks compensate for plot
scaling so their rendered size remains usable. Box whiskers stop at Q1 and Q3, leaving only the
median inside the box.

Direct reading mutes every other statistical mark. Legend emphasis keeps group scope, and a pinned
group receives paint and pointer priority where marks overlap. Axes, tooltip structure, keyboard
boundary, touch retention, responsive behavior, forced colors, and reduced motion follow the
delivered Cartesian chart conventions. The prototype is evidence for these decisions, not a second
production chart framework.

## Evidence

- [Statistical chart visual encoding prototype](../prototypes/statistical-chart-encoding.md)
- [Statistical Chart Family](../tickets/20-statistical-chart-family.md)
- [Accent-derived, role-aware chart colors](../../chart-accent-palette/spec.md)
- [Shared Cartesian chart reading](../../chart-interactivity/spec.md)
- [Charting Scope](13-charting-scope.md)
