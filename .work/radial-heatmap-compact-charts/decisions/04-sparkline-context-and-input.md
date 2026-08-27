# 04 Sparkline context and input

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

What ordered-domain and value contract, series bound, summary and trend meaning, endpoint and range
context, invalid-row handling, and compact-size boundary should Sparkline require while remaining
compact?

## Answer

Sparkline accepts one ordered series. Consumers use LineChart when they need to compare several
series. Numeric, time, and categorical positions keep the chart family's established scale
behavior. Negative values and zero are valid.

A missing value creates a gap. The component does not turn it into zero or connect the line across
it. A non-finite value invalidates that record and follows the existing partial-data behavior. An
entirely invalid series uses the invalid-data state.

The component derives its value range by default and accepts a fixed range when several
sparklines need direct comparison. It derives an exact summary containing the first, last, lowest,
and highest valid values. Consumer-written description supplies the domain meaning rather than
asking the component to infer whether a change is good, bad, or statistically meaningful.

Sparkline keeps the existing tooltip, keyboard reading, announcements, focus treatment, feedback
states, and generated table. It omits axes and a legend. It remains compact without local
scrolling. Exact endpoint and range marks, the smallest legible size, and how much caption text it
renders are visual questions for the faithful prototype.

Whitney authorized this recommended contract and deferred the unfamiliar presentation choices to
direct prototype evaluation.

## Evidence

- [Foundation chart scope](../../library-foundation/decisions/13-charting-scope.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)
