# 12 Dialog and Drawer Overlays

**What to build:** Dialog, alert dialog, and drawer exports with library-owned containment,
dismissal, responsive layout, and action composition.

**Blocked by:** [Action Family](03-action-family.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** complete

- [x] Dialog and alert-dialog contracts distinguish ordinary tasks from consequential confirmation.
- [x] Focus enters predictably, remains contained where required, and restores on every close path.
- [x] Escape, backdrop, close action, and programmatic dismissal follow each overlay's explicit
      contract.
- [x] Required titles, descriptions, action ordering, and destructive semantics are accessible.
- [x] Drawers preserve dialog behavior while owning edge placement and compact full-screen reflow.
- [x] Nested and sequential overlays avoid orphaned focus and hidden active content.
- [x] Scroll locking, viewport changes, touch, keyboard, browser accessibility-tree, theme, reduced
      motion, SSR, hydration, and types pass.
- [x] Public composition does not expose raw React Aria overlay parts.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)

## Completion evidence

Dialog, AlertDialog, and Drawer are public, contracted exports with generated human guidance and
maintained showcase specimens. Their library-owned APIs require triggers, visible titles and
descriptions, controlled or uncontrolled open state, explicit dismissal labels or confirmation
actions, and logical drawer placement without exposing React Aria parts. Dialog and Drawer own
reversible dismissal and action composition. AlertDialog owns cancellation-first consequential
confirmation, non-dismissible backdrop behavior, and explicit confirm or destructive emphasis.

`npm run check` passes formatting, zero-warning lint, strict source types, 315 tests, generated
artifacts, and the TypeScript 5.9, 6, and 7 declaration matrix. `npm run verify:package` passes SSR,
hydration, public types, interactive overlay semantics, and browser builds in packed React 18.3.1
and React 19.2.8 consumers. `npm run showcase:build`, `npm audit --audit-level=high`,
`git diff --check`, and the source/test/tooling no-`Any` scan pass.

Direct Chromium, Firefox, and WebKit operation confirms focus entry, containment, and restoration;
Escape, close, action, and alert-backdrop behavior; nested and sequential overlays; scroll locking;
locally scoped logical RTL placement through the portal; compact full-screen reflow; dark and light
appearance; keyboard and browser accessibility structure; and settled layout without overflow or
console/page errors. Chromium also confirms long localized AlertDialog copy remains bounded and
scrollable without clipping its decisions, plus touch activation, reduced motion, and forced-color
rendering. Runtime tests reject triggers that do not render exactly one library Button or
IconButton, including after descendant-only trigger changes, while preserving wrapper-free consumer
component boundaries and direct Toolbar or ButtonGroup composition. All inspected screenshots were
discarded after validation.
