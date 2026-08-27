# 01 Pie and donut part-to-whole contract

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

What record shape, total semantics, category bound, zero and negative-value handling, ordering, and
donut-center meaning should PieChart and DonutChart expose so they communicate one honest
part-to-whole relationship without implying unsupported precision?

## Answer

PieChart and DonutChart accept any number of records with stable ids, labels, one shared unit, and
finite nonnegative values. They derive the total from the records. Negative or non-finite records
follow the existing partial and invalid-data behavior. Zero is valid, stays available to structured
output, and produces no slice. A dataset with no positive value reaches the empty state rather than
the invalid-data state.

Rank positive categories by value, using declared record order to break ties. Do not expose a sort
prop. With eight or fewer positive categories, render every category and size each slice by its share
of their total.

With more than eight positive categories, the first page renders the seven largest categories and
one [aggregate navigation slice](../../../CONTEXT.md). That aggregate represents every remaining
category. Its angle is proportional to their combined value by default. Expose an aggregate-sizing
option that lets a consumer use the earlier deliberately smallest slice instead. Ordinary slices
preserve their relative proportions in either mode.

Activating the aggregate moves to the next eight ranked categories. If categories still remain,
that page also includes an aggregate navigation slice. Continue in groups of eight until no
aggregate remains. The user can return through every previous chart page. Pointer, touch, and
keyboard activation receive equivalent navigation, but the exact controls and transition belong
to the reading and visual decisions.

DonutChart displays the derived total with a localized label in its center and does not accept
arbitrary center content. PieChart and DonutChart keep the complete dataset in structured output,
including zero values and categories outside the current visual page.

## Evidence

- [Foundation chart scope](../../library-foundation/decisions/13-charting-scope.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)
- [Architecture decision: Page large part-to-whole charts](../../../docs/adr/0015-page-large-part-to-whole-charts.md)
