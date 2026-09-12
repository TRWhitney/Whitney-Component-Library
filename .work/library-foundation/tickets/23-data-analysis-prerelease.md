# 23 Data Analysis Integration Proof

**What to build:** A non-exported packed-package fixture that proves public collection, filter,
chart, feedback, and application-structure components can support data analysis under
consumer-owned layout and state.

**Blocked by:** none.

**Status:** complete. Whitney accepted the client design on 2026-09-11. The thirteen library fixes are now complete and verified in the packed-consumer app. This remains a proof of concept without production hardening.

- [x] The fixture coordinates filter/query state, collection state, chart state, selection, and
      detail inspection through public controlled APIs rather than hidden library coupling.
- [x] Table and chart selection can coordinate while retaining their separate roles and focus.
      Tree and Readings selection and chart activation share the working building. Comparison pins retain their separate role; the library showcase proves both native selection presentations.
- [x] Loading, empty, no-results, partial, stale, and error states preserve context and recovery.
- [x] Responsive reflow keeps dense analysis usable without decorative chart identity or lost data.
- [x] Keyboard users can perform every search, selection, comparison, and inspection task, and the
      browser accessibility tree exposes the corresponding controls, relationships, and state.
- [x] A clean packed-package fixture implements the complete slice with no private imports or
      external substitute component.
- [x] No data-workspace export, contract, required layout, or shared application-state controller is
      introduced. Existing contracts continue to guide component and chart choice.
- [x] Theme, accent, semantic colors, reduced motion, browsers, SSR, hydration, types, and generated
      guidance pass.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Charting Scope](../decisions/13-charting-scope.md)

## Completion evidence

The [prototype app](../../../prototypes/data-analysis/) and [inspection record](../../data-analysis-prototype/status.md) deliver the accepted client prototype. Run `npm run prototype:analysis` for the live app or `npm run prototype:analysis:build` for a packed-consumer browser build. Energy desk combines a campus tree, analysis tabs, native chart exploration, comparison pins, and a resizable investigation queue in one workspace. Notes and CSV export remain part of that workspace.

All thirteen [library follow-up tickets](../../data-analysis-prototype/status.md#library-follow-up) are complete. Public contracts and rendered showcase examples accompany the fixes. Client workarounds have been removed.

The [verification record](../../data-analysis-prototype/verification.md) records all 1009 passing tests, repository checks, packed React 18/19 SSR and hydration, TypeScript 5.9/6/7 compatibility, builds, and direct Chromium/Firefox application checks. Manual screen-reader and wider browser release gates remain with Ticket 30; they are not claimed here.
