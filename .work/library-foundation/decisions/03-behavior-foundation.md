# 03 Behavior and Accessibility Foundation

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md)
**Type:** research

## Question

Should the first release own its accessible interaction primitives directly or build its public
components on a maintained React behavior foundation, and which foundation best fits the accepted
styling and composition constraints?

## Answer

Use React Aria Components as the private behavior and accessibility foundation. Build this
library's design intent on top through its own public concepts, props, compositions, styles, and
semantic tests; do not merely re-export React Aria components or inherit their complete public
prop types.

## Evidence

- The library must include behavior as well as presentation while producing dependable agent
  output.
- The library owns its styling and must preserve a narrow theme boundary.
- Accessible keyboard, focus, overlay, selection, and form behavior is costly to reproduce and
  easy to make subtly inconsistent.
- [Research: Accessible React Behavior Foundations](../research/behavior-foundations.md)
- [Architecture decision: Build on React Aria Privately](../../../docs/adr/0003-build-on-react-aria-privately.md)
