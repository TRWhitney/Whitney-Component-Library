# Chart interaction and composition

## Destination

Readers can hide, activate, select, and explore chart data with consistent feedback. Applications
can coordinate selections and use the approved additional mixed charts through public APIs.

## Notes

The bar decision is settled; production ticket 05 delivers it before further interface decisions.
Existing approvals and deliveries remain canonical in the [specification](spec.md) and completed tickets.

## Decisions so far

- [Bar selection indicators](decisions/01-bar-selection.md): Frame, adjoining shared edges, and a continuous inner month contour.

## Not yet specified

- Selection and visibility for the remaining area, mixed, statistical, radial, heatmap, and compact reading units.
- Exploration controls and their interaction with selection, automatic fitting, and explicit domains.
- General data-change animation and responsiveness budgets.
- Detailed public boundaries of scatter plus line and line plus changing range band.

## Out of scope

Scatter with adjacent distributions, application layouts, and implicit statistical calculations.
