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
typed contract for accent color and light or dark appearance; the library derives bounded support
roles. The literal accent remains intact for primary filled emphasis and other suitable
identity-bearing uses, and rich hover tint preserves its hue. Ordinary text remains neutral.
Focus, rails, accent-bearing edges and underlines, and conditional boundaries use the exact accent
when it is already visible on their actual surface and otherwise use saturated same-hue support.
Contrast is role-local rather than imposed against every owned surface. Achromatic accents receive
neutral support. A supporting boundary, rather than a recolored fill, distinguishes an exact accent
that is too close to its surrounding surface. General token customization is outside the first
release.

## Evidence

- The library must reduce variance in agentic output while reserving an accent color that can
  propagate throughout a consuming application.
- The React and TypeScript target permits either runtime styling, utility-framework integration,
  or static CSS with a typed React configuration boundary.
- [Architecture decision: Own Styles and Bound Theming](../../../docs/adr/0002-own-styles-and-bound-theming.md)
- [Accepted Accent Family Exploration](../prototypes/accent-family-exploration.md)
