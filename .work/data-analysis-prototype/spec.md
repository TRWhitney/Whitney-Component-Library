# Library fixes proven in Energy desk

## Problem statement

The accepted packed-consumer application exposes thirteen library defects or missing public behaviors. Client workarounds leave library consumers with inconsistent layout, focus, feedback, and chart interaction.

## Solution

Complete the thirteen [implementation tickets](status.md#library-follow-up), update public contracts and rendered showcase examples, and verify their behavior in the retained [accepted prototype](prototype.md#acceptance). Whitney approved all tickets and authorized implementation and normal work-system commits.

Selection has an explicit either-or presentation: a selection panel or on-chart controls, never both. The selected presentation provides equivalent commands, enabled states, accessible state, keyboard operation, and responsive sizing. This equivalence also applies to exploration panels and controls. Preserve existing chart gestures and controlled data semantics.

## User stories

1. Consumers can build compact application layouts without private style overrides or duplicate chart controls.
2. Users can search, inspect, select, open context menus, and explore charts without losing focus or receiving misleading feedback.
3. Chart keyboard shortcuts work by default with focus on the canvas or its exploration buttons.

## Implementation decisions

The [design](design.md), [accepted prototype](prototype.md), and individual tickets define supported behavior. React Aria remains private. Public component changes include showcase and contract updates. Remove client workarounds when native behavior replaces them. Preserve the prototype's coordinated workspace and session-only scope.

Implement cohesive batches: collection/overlay and density fixes; chart geometry and feedback; mutually exclusive controls and default keyboard exploration; packed-consumer integration and delivery. These group related edits without changing the thirteen acceptance boundaries.

## Testing decisions

Use existing public component tests, type and generated-contract checks, and browser inspection. Add regressions for demonstrated focus, context-state, cursor, geometry, and keyboard defects. Verify chosen chart presentations across supported families. Run the repository's required checks and packed-consumer verification, then operate corrected workflows in Energy desk before delivery. Release-wide gates outside Ticket 23 remain separate.

## Out of scope

New application features, persistence, backend, desktop packaging, production hardening of the prototype, and unrelated library expansion.
