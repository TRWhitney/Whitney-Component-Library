# 06 Initial Public Scope

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md),
[Style and Theme Contract](02-style-and-theme-contract.md),
[Behavior and Accessibility Foundation](03-behavior-foundation.md),
[Agent-Facing Contract](04-agent-contract.md),
[Visual Direction and Permitted Variation](05-visual-direction.md)
**Type:** discussion

## Question

Which public component use cases must the initial pre-release slice support so it demonstrates the
library's system coherently without constraining the stable catalog or prescribing an application?

## Answer

Use a **breadth-aware vertical slice**. One non-exported consumer fixture configures an operation,
validates and reviews it, executes it, and monitors its semantic status and progress using only
public package components. The required public capabilities are the theme and accent boundary,
actions, relevant input and selection controls, semantic status and progress, dialog-based review,
field and section composition, and a staged-process tracker. The fixture owns the workflow and
layout relationships among those parts.

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

- The release must expose components, styles, behaviors, and agent-facing guidance while proving
  that they compose through the packed public package.
- A staged-process tracker demonstrates useful synthesis without turning a complete workflow into
  a component.
- A broad parity catalog would multiply unsettled component semantics and delay evidence that the
  library's distinctive contracts and visual direction work together.
- The accepted prototype provides evidence for tool and simulator workflows involving
  configuration, validation, bounded selection, semantic status, review, progress, and execution,
  but its application-specific content is not itself a proposed component API.
- [Component Library Context](../../../CONTEXT.md)
- [Architecture decision: Build a Breadth-Aware Vertical Slice](../../../docs/adr/0005-build-a-breadth-aware-vertical-slice.md)
- [Architecture decision: Own Reusable Concepts, Not Applications](../../../docs/adr/0012-own-reusable-concepts-not-applications.md)
- [Interactive visual direction prototype](../prototypes/visual-directions.html)
