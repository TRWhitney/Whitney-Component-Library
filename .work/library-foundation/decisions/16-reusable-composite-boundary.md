# 16 Reusable Composite Boundary

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

When should the library publish a composite component, and when should composition remain owned by
the consuming application?

## Answer

Publish a composite when it owns one recurring semantic or behavioral relationship with a clear
contract. PageHeader is valid because it coordinates page identity, status, title, description,
and actions without deciding what the page contains. A staged-process tracker is valid because it
standardizes ordered stage status and updates without owning the process or surrounding task.

Do not publish workflow, data-workspace, Markdown-workspace, workbench, or application-shell
components that arrange otherwise independent components into a prescribed application. Keep the
four accepted integration fixtures as non-exported packed-package consumers. They verify public
component interoperability but establish no required layout, state model, or appearance.

## Evidence

- Whitney rejected the proposed operational workflow construct as too prescriptive, retained
  PageHeader as a legitimate composite, identified staged-process progress as a reusable component,
  and retained the four integration proofs as fixtures.
- [Architecture decision: Own Reusable Concepts, Not Applications](../../../docs/adr/0012-own-reusable-concepts-not-applications.md)
- [Architecture decision: Preserve Consumer Composition Boundaries](../../../docs/adr/0010-preserve-consumer-composition-boundaries.md)
