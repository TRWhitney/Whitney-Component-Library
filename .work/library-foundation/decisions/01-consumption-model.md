# 01 Supported Consumption Model

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

What primary runtime and authoring model must the library support in its first coherent release?

## Answer

The first coherent release will target web applications using React and TypeScript. Behavior will
remain independent of presentation where doing so has concrete value, but framework-agnostic
distribution is not a first-release requirement.

## Evidence

- The repository is empty and imposes no existing framework or runtime constraint.
- The stated goals require components, styles, behaviors, higher-level constructs, and reliable
  agent consumption; the chosen model must expose all five coherently.
- [Architecture decision: Target React and TypeScript](../../../docs/adr/0001-target-react-and-typescript.md)
