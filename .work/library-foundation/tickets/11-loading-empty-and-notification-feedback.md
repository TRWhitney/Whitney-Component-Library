# 11 Loading, Empty, and Notification Feedback

**What to build:** Skeleton, empty-state, and toast/notification exports with bounded temporal and
placement behavior that complements rather than duplicates inline alerts and status.

**Blocked by:** [Status, Progress, and Alerts](10-status-progress-and-alerts.md),
[Action Family](03-action-family.md)

**Status:** complete

- [x] Skeletons preserve the eventual region's approximate layout and are hidden appropriately
      from assistive technology.
- [x] Empty states distinguish no data, no results, and unavailable content and support one bounded
      recovery action where appropriate.
- [x] Notifications have typed semantic tone, title/content constraints, dismissal, timeout, pause,
      queuing, and maximum-visible behavior.
- [x] Urgent and non-urgent announcements use appropriate live-region behavior.
- [x] Notification timing never creates the only path to recover or inspect important information.
- [x] Focus is not stolen when notifications arrive, and keyboard dismissal remains available.
- [x] Motion, reduced motion, compact layout, theme, forced-color, SSR, hydration, and types pass.
- [x] Contracts distinguish toast, alert banner, inline alert, status, and dialog use.

## Accepted sources

- [Specification](../spec.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Skeleton, EmptyState, and NotificationProvider are public, contracted exports with generated human
guidance and maintained showcase specimens. Skeleton exposes bounded geometry while remaining
assistive-technology hidden. EmptyState distinguishes no data, no results, and unavailable content
with at most one paired recovery action. NotificationProvider owns semantic urgency, bounded
placement, timeout or persistence, hover/focus pause, Escape and button dismissal, newest-first
queuing, and maximum-visible behavior without moving focus.

`npm run check` passes formatting, zero-warning lint, strict source types, 302 tests, generated
artifacts, and the TypeScript 5.9, 6, and 7 declaration matrix. `npm run verify:package` passes SSR,
hydration, public types, and browser builds in packed React 18.3.1 and React 19.2.8 consumers.
`npm run showcase:build`, `npm audit --audit-level=high`, `git diff --check`, and the source/test/
tooling no-`Any` scan pass.

Direct Chromium, Firefox, and WebKit operation confirms visible skeleton geometry, all three empty
states, focus-preserving notification arrival, keyboard and button dismissal semantics, logical RTL
placement under a mismatched browser locale, live-region structure, and compact containment without
overflow or console/page errors. Chromium also confirms focus-paused timing and covers light and
dark appearance, reduced motion, and forced colors. Focused public-seam tests cover programmatic
dismissal and post-removal callbacks. All inspected screenshots were discarded after validation.
