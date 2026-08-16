# 02 Style and Theme Contract

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md)
**Type:** discussion

## Question

How should styles be delivered, and which visual choices should consuming applications be allowed
to customize in the first release?

## Answer

Ship static library CSS backed by semantic custom properties. The library owns typography,
spacing, shape, elevation, component structure, and interaction states. Consumers receive a narrow
typed contract for accent color and light or dark appearance; the library derives accessible
accent roles. General token customization is outside the first release.

## Evidence

- The library must reduce variance in agentic output while reserving an accent color that can
  propagate throughout a consuming application.
- The React and TypeScript target permits either runtime styling, utility-framework integration,
  or static CSS with a typed React configuration boundary.
- [Architecture decision: Own Styles and Bound Theming](../../../docs/adr/0002-own-styles-and-bound-theming.md)
