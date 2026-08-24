# Own Reusable Concepts, Not Applications

The library may publish composite components when they own one recurring semantic or behavioral
relationship, such as PageHeader or a staged-process tracker. It does not publish workflow,
workspace, workbench, or application-shell components that prescribe how independent tasks,
regions, and state should be arranged.

Consumer applications own their activity sequence, state coordination, and overall layout.
Non-exported integration fixtures may assemble public components to verify interoperability and
package use, but those fixtures establish no public composition or visual contract. This decision
supersedes the higher-level workflow-export expectation in ADR 0005 while retaining its
breadth-aware integration proof.
