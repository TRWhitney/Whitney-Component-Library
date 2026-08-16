# 06 Initial Public Scope

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md),
[Style and Theme Contract](02-style-and-theme-contract.md),
[Behavior and Accessibility Foundation](03-behavior-foundation.md),
[Agent-Facing Contract](04-agent-contract.md),
[Visual Direction and Permitted Variation](05-visual-direction.md)
**Type:** discussion

## Question

Which public component and higher-level construct use cases must the initial pre-release slice
support so it demonstrates the library's system coherently without constraining the stable catalog?

## Answer

Use a **breadth-aware vertical slice**. The initial pre-release slice must support one complete,
domain-independent workflow for configuring an operation, validating and reviewing it, executing
it, and monitoring its semantic status and progress. It includes the theme and accent boundary,
actions, the input and selection controls required by the workflow, semantic status and progress,
dialog-based review, field and section composition, and a higher-level workflow construct that
owns the relationships among those parts.

Before its public foundations are frozen, map the wider action, input, selection, overlay,
collection, navigation, feedback, layout, and composition territory and validate cross-cutting
contracts against representative difficult cases from those families. Those cases do not all
become first-release implementations. They prevent the initial workflow from becoming an implicit
architectural ceiling.

Expansion toward stable release is additive by default. Shared conventions may govern state, validation, sizing,
labeling, and semantic tone, but the library will not introduce a universal component-props
interface that accumulates unrelated behavior. Public APIs remain library-owned, extensibility is
explicit, and compatibility stabilization waits until several slices and a wider catalog,
including accepted specialized components, have exercised the foundation.

## Evidence

- The release must expose components, styles, behaviors, agent-facing guidance, and at least one
  higher-level construct to exercise all four project goals as one system.
- A primitives-only catalog would not demonstrate synthesis or give agents a preferred path for a
  recurring advanced use case.
- A broad parity catalog would multiply unsettled component semantics and delay evidence that the
  library's distinctive contracts and visual direction work together.
- The accepted prototype provides evidence for tool and simulator workflows involving
  configuration, validation, bounded selection, semantic status, review, progress, and execution,
  but its application-specific content is not itself a proposed component API.
- [Component Library Context](../../../CONTEXT.md)
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Interactive visual direction prototype](../prototypes/visual-directions.html)
