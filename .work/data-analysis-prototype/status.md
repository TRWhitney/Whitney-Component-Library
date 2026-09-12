# Energy desk prototype

## Destination

Deliver the accepted packed-consumer application for [Ticket 23](../library-foundation/tickets/23-data-analysis-prerelease.md) and complete its thirteen library fixes.

## Current state

All thirteen library fixes are complete and verified. The accepted prototype now uses the public library behavior in place of its focus, context-menu, cursor, and keyboard workarounds. [Ticket 23](../library-foundation/tickets/23-data-analysis-prerelease.md) is complete. The implementation, tests, contracts, examples, and accepted application are delivered in separate outcome commits.

The rework corrects table corner contrast, keeps full-range point marks inside the axes, restores filter spacing, fits popovers to short windows, and adds focused wheel zoom and middle-button drag panning. Existing tickets 03, 07, 11, and 12 record these corrections.

Selection panels and on-chart controls are mutually exclusive. Exploration has chart and panel presentations plus a public Toolbar composition with one command set. Both retain the same callbacks, limits, keyboard behavior, and focus recovery.

## Verification

`npm run check` passes all 1009 tests, formatting, lint, strict types, generated guidance, TypeScript 5.9/6/7 declarations, and chart bundle isolation. `npm run verify:package` passes packed SSR, hydration, types, and browser builds with React 18.3.1 and 19.2.8. The showcase and packed prototype builds pass.

Chromium and Firefox pass the application workflow at desktop, laptop, and phone widths. Direct inspection covers compact filters, stable search focus, row menus without leaked pressed state, complete marks and overview windows, exclusive command presentations, rapid Fit-to-keyboard operation, and rounded table feedback. [Verification details](verification.md) map each ticket to its evidence.

## Library follow-up

1. [Hidden chart table overflow](tickets/01-chart-data-table-overflow.md).
2. [Compact native chart selection](tickets/02-compact-chart-selection.md).
3. [Complete markers at domain edges](tickets/03-complete-point-markers-at-domain-edges.md).
4. [Collection row context actions](tickets/04-table-row-context-actions.md).
5. [Chart aspect-ratio geometry](tickets/05-chart-aspect-ratio-geometry.md).
6. [Exploration control sizing and composition](tickets/06-chart-exploration-control-composition.md).
7. [Compact fields, dropdown options, and collection rows](tickets/07-compact-field-and-collection-layout.md).
8. [Cursor contracts and enforcement](tickets/08-interactive-cursor-contracts.md).
9. [Tree focus recovery and empty state](tickets/09-tree-filtering-focus-and-empty-state.md).
10. [Chart activation feedback through state updates](tickets/10-chart-activation-feedback-through-updates.md).
11. [Keyboard exploration enabled by default](tickets/11-chart-keyboard-exploration.md).
12. [Table feedback at rounded corners](tickets/12-table-feedback-rounded-corners.md).
13. [Context-menu pressed-state isolation](tickets/13-context-menu-pressed-state-isolation.md).

## Accepted sources

- [Approved specification](spec.md).
- [Accepted design](design.md).
- [Prototype and acceptance](prototype.md).
- [Application source](../../prototypes/data-analysis/).

## Out of scope

Backend, persistent storage, desktop packaging, production hardening of the prototype, and unrelated library features. Wider release gates remain with the foundation effort.

## Continuation

- Branch: `main`, baseline `19a050f`.
- Delivery contains thirteen library outcome commits, a focused showcase test-query correction, and the accepted prototype with this effort record. A local whitespace fixup was folded into the hidden-table commit. No history was pushed.
- Rework is folded into the original density, table feedback, chart exploration, boundary-mark, and prototype commits. Validation and independent intent/engineering review pass. The independent notification hydration-test fix remains a separate commit.
- Rework workflow complete. No accepted work remains. Next planned foundation work remains Ticket 24, which has not begun.
