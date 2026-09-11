# Chart interaction and composition

## Destination

Readers can hide, activate, select, and explore chart data with consistent feedback. Applications
can coordinate selections and use the approved additional mixed charts through public APIs.

## Notes

The bar decision is delivered in ticket 05. The [area and mixed prototype](prototypes/area-mixed-selection.md)
records the accepted Value marker and overlap-only legend priority. Ticket 06 delivers that contract.
Existing approvals and deliveries remain canonical in the [specification](spec.md) and completed tickets.

## Decisions so far

- [Line-chart pan and zoom](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract): approved for the demonstrated continuous-time LineChart. Area, grouped/stacked columns and mixed columns/line are also approved in the [combined study](prototypes/chart-exploration-comparison.md#accepted-behavior). Scatter/bubble and the remaining distribution/category/heatmap families are approved in the linked studies. Tickets 26–30 deliver public navigation.

- [Bar selection indicators](decisions/01-bar-selection.md): Frame, adjoining shared edges, and a continuous inner month contour.

- [Area and mixed selection](prototypes/area-mixed-selection.md#accepted-contract): Value marker and legend priority only among overlapping marks.

The [scatter/bubble prototype](prototypes/scatter-bubble-selection.md) records approved Centers inside
rectangle selection. Ticket 07 delivers scatter/bubble observation interaction. The [histogram/box-plot prototype](prototypes/distribution-selection.md) records approved Box touched selection and the inner-outline-only summary reading cue. [Ticket 08](tickets/08-distribution-interaction.md) delivers the production callback boundary. Whitney chose stable application IDs for interactive outliers. Ticket 08 is complete with passing validation and independent production reviews.

The [pie/donut study](prototypes/radial-selection.md) is accepted. Whitney chose Outer edge and requested an asterisk on the expansion count when it contains a selected category. The revised prototype and sweep gesture are accepted; [Ticket 09](tickets/09-pie-donut-interaction.md) delivers this boundary with visible sweep feedback, passing validation, and independent production reviews.

The [radar study](prototypes/radar-selection.md) uses the chosen Label underline, point rings and visible rectangle selection. Reading fills now match the existing neutral radial guide. Dimension activation animates that guide rather than circles; the revision is accepted.

The radar record also documents a read-only marker-spacing audit: Cartesian point rings already account for border width; statistical circle selection rings leave a small gap at the rendered normal border width. Ticket 10 corrects that spacing. Zero radar values are keyboard/dimension targets, with no center-click target. [Ticket 11](tickets/11-radar-interaction.md) delivers the approved radar interaction with passing validation and independent production reviews.

The [heatmap study](prototypes/heatmap-selection.md) uses the chosen Cell frames. Missing cells are accepted selection/activation targets identified by row and column; their absent value remains distinct from zero. [Ticket 13](tickets/13-heatmap-interaction.md) delivers this interaction with dashed inner hover, passing production checks and independent reviews.

[Ticket 12](tickets/12-shared-activation-motion.md) standardizes production activation motion and applies it to the heatmap study. Dashed inner heatmap hover is approved and applied in the study; solid Cell frames remain selection.

The [Sparkline study](prototypes/sparkline-selection.md) is approved, including point rings around existing compact cues, range dragging and recorded-value-only targeting. [Ticket 14](tickets/14-sparkline-interaction.md) delivers the public interaction with passing repository/package checks and independent production reviews.

Statistical visibility is delivered for scatter, bubble and box groups in [Ticket 15](tickets/15-statistical-visibility.md). Radar visibility is delivered in [Ticket 16](tickets/16-radar-visibility.md). Pie/donut visible-total recalculation is accepted in [the specification](spec.md#pie-and-donut-visibility-accepted-totals). Whitney chose individual category eyes only; [Ticket 18](tickets/18-pie-donut-visibility.md) implements visibility and keeps expansion as navigation. [Ticket 19](tickets/19-radial-page-refill.md) replaces fixed pie/donut pages with automatic refill from expansion when hiding frees space. The [heatmap visibility study](prototypes/heatmap-visibility.md) uses Whitney's chosen reveal behavior and removes hidden tracks entirely, with a corner closed-eye control opening an overlaid restore list. Separate bottom restoration and compressed blank tracks were rejected; Whitney approved the corner control and visibility design. A first-hold animation issue caused by prototype data recreation has been corrected. [Ticket 21](tickets/21-heatmap-visibility.md) delivers public visibility with passing repository/browser/package checks and independent production reviews. Histogram and Sparkline visibility are excluded.

## Resolved work

- All demonstrated exploration groups are approved. [Production boundary](spec.md#production-exploration-boundary) and tickets 25–30 define the implementation sequence, with [layout prerequisites](tickets/25-exploration-layout-foundation.md) delivered. The [modal overview](prototypes/modal-overview.md#accepted-behavior) is approved. A quiet chart icon opens the overview directly in a Dialog; touch dragging follows the pointer without animation lag. Tickets 26–30 deliver production navigation across these families. Ordinary wheel scrolling remains unchanged.
- The [initial compact-layout audit](research/compact-layout-audit.md) is complete across the current showcase and crowded reproduction fixtures. [Ticket 22](tickets/22-consistent-axis-label-fitting.md) fixes omitted continuous-axis fitting and dropped box-plot staggering; [Ticket 23](tickets/23-visible-axis-titles.md) fixes clipped vertical titles. Both are delivered with passing validation and independent reviews.
- The radar sizing defect is fixed in [Ticket 24](tickets/24-readable-radar-labels.md), retaining the approved layout and interactions with a 12px rendered minimum. Validation and independent reviews pass. The audit records evidence. Full locale/theme/visibility combinations and the exploration-host residual page overflow remain follow-up checks, not declared passes.
- General data-change animation and responsiveness budgets. The [value-change study](prototypes/value-motion.md) is approved for motion between existing values across five chart types; the [data-transition study](prototypes/data-transitions.md) is approved for additions, removals, reordering and automatic scale fitting across three chart types. Tickets 34–37 deliver the reviewed families with passing validation and independent reviews. The [remaining chart study](prototypes/remaining-motion.md) records the approved radar, Sparkline, histogram and box-plot value motion, including the Sparkline marker handoff correction. Tickets 38–40 deliver that numeric motion with passing checks and independent reviews. Approved immediate membership/topology updates complete that boundary. [Ticket 41](tickets/41-chart-responsiveness.md) records the measured performance accepted by Whitney for closure. [Ticket 42](tickets/42-crowded-heatmap-visibility.md) completes the compact visibility manager. The unconfirmed heatmap canvas experiment was not adopted. Numeric label fitting under exploration deserves continued compact coverage: scatter with a supplied line now accounts for its reserved pan gutter before staggering. Other exploration families retain their earlier contracts.
- [Additional combined charts](decisions/02-combined-chart-plan.md): scatter plus a supplied line and line plus a changing range. The shared study is approved, including connected range-selection markers and revised vertical pan controls. [Tickets 32 and 33](spec.md#production-combined-chart-boundary) deliver the approved combinations with passing production validation and independent reviews.

## Out of scope

Scatter with adjacent distributions, application layouts, and implicit statistical calculations.

[Ticket 17](tickets/17-legend-release.md) corrects repeated legend activation across chart families.
A second activation clears temporary emphasis and button fill while preserving keyboard focus.
