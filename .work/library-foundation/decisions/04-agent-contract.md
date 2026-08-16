# 04 Agent-Facing Contract

**Status:** resolved
**Blocked by:** [Supported Consumption Model](01-consumption-model.md),
[Behavior and Accessibility Foundation](03-behavior-foundation.md)
**Type:** discussion

## Question

Which parts of appropriate component use should be enforced by the TypeScript and composition API,
and which should be communicated through agent-readable guidance and examples?

## Answer

Accepted boundary:

- Narrow TypeScript APIs enforce finite variants and valid state combinations without exposing
  upstream React Aria props. They enforce composition where the relevant relationship survives
  JSX typing.
- Structural containers preserve consumer-owned React composition. Behavior-owning composites
  constrain the rendered controls and DOM relationships that participate in their behavior, but
  do not reject an otherwise valid consumer abstraction solely because it introduces a React
  component boundary.
- When JSX erases the component identity needed for reliable compile-time composition checks, the
  component validates the rendered relationship at runtime. A required DOM relationship may still
  exclude DOM-producing wrappers unless a named part explicitly supports them.
- Each public export has one canonical structured contract covering appropriate and inappropriate
  use, preferred alternatives, content rules, composition, states, accessibility obligations, and
  focused examples or counterexamples.
- Human documentation, a machine-readable component manifest, and a compact agent index are
  derived from those canonical contracts.
- Higher-level constructs are supported exports, and their contracts direct agents toward them
  when their use cases match.
- Repository verification is deterministic: contract completeness and references, generated
  artifact drift, example compilation, public types, and component behavior. Agent-output
  adherence evaluation is neither owned here nor prescribed as a consumer workflow.

## Evidence

- Reducing variance and advertising appropriate use to agents are primary project goals.
- A private React Aria foundation makes this library's public API and documentation the complete
  surface agents should consume.
- Semantic appropriateness and JSX child identity cannot always be represented by TypeScript,
  while finite variants, state ownership, and many explicit part or slot relationships can be.
- [Architecture decision: Preserve Consumer Composition Boundaries](../../../docs/adr/0010-preserve-consumer-composition-boundaries.md)
- [Component Library Context](../../../CONTEXT.md)
- [Architecture decision: Publish Canonical Component Contracts](../../../docs/adr/0004-publish-canonical-component-contracts.md)
