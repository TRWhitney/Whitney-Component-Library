# Chart interaction and composition

## Destination

Readers can hide, activate, select, and explore chart data with consistent feedback. Applications
can coordinate selections and use the approved additional mixed charts through public APIs.

## Notes

The bar decision is delivered in ticket 05. The [area and mixed prototype](prototypes/area-mixed-selection.md)
records the accepted Value marker and overlap-only legend priority. Ticket 06 delivers that contract.
Existing approvals and deliveries remain canonical in the [specification](spec.md) and completed tickets.

## Decisions so far

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

## Not yet specified

- Statistical visibility is delivered for scatter, bubble and box groups in [Ticket 15](tickets/15-statistical-visibility.md). Radar follows. Pie/donut and heatmap require the remaining decisions. Histogram and Sparkline visibility are excluded.
- Exploration controls and their interaction with selection, automatic fitting, and explicit domains.
- General data-change animation and responsiveness budgets.
- Detailed public boundaries of scatter plus line and line plus changing range band.

## Out of scope

Scatter with adjacent distributions, application layouts, and implicit statistical calculations.
