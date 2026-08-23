# 02 Drawer guidance and showcase

**What to build:** Make the expanded Drawer behavior visible and accurately described in the
component showcase, public contract, and generated documentation source.

**Blocked by:** [01 Drawer placement and docking](01-drawer-placement-and-docking.md)

**Status:** complete

- [x] The showcase provides working start, end, top, and bottom examples.
- [x] The showcase demonstrates no dock, grip-only, and preview-strip docking without covering its
      content.
- [x] Human-facing guidance explains the new props, placement semantics, interaction, accessibility,
      responsive behavior, and preview-content boundary.
- [x] Contract, showcase, generated-documentation, and package checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Prototype acceptance](../prototypes/acceptance.md)
- [Interactive Drawer lab](../prototypes/drawer-lab.html)

## Completion evidence

- The rendered showcase exposes all four placements and all three dock modes, with the optional
  preview handle aligned with the open trigger.
- `npm run showcase:build` succeeds.
- `npm run verify:package` verifies packed SSR, hydration, declarations, and browser builds with
  React 18.3.1 and React 19.2.8.
- `npm run check` confirms the generated Drawer documentation matches its public contract.
