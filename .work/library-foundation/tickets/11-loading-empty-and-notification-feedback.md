# 11 Loading, Empty, and Notification Feedback

**What to build:** Skeleton, empty-state, and toast/notification exports with bounded temporal and
placement behavior that complements rather than duplicates inline alerts and status.

**Blocked by:** [Status, Progress, and Alerts](10-status-progress-and-alerts.md),
[Action Family](03-action-family.md)

**Status:** blocked

- [ ] Skeletons preserve the eventual region's approximate layout and are hidden appropriately
  from assistive technology.
- [ ] Empty states distinguish no data, no results, and unavailable content and support one bounded
  recovery action where appropriate.
- [ ] Notifications have typed semantic tone, title/content constraints, dismissal, timeout, pause,
  queuing, and maximum-visible behavior.
- [ ] Urgent and non-urgent announcements use appropriate live-region behavior.
- [ ] Notification timing never creates the only path to recover or inspect important information.
- [ ] Focus is not stolen when notifications arrive, and keyboard dismissal remains available.
- [ ] Motion, reduced motion, compact layout, theme, forced-color, SSR, hydration, and types pass.
- [ ] Contracts distinguish toast, alert banner, inline alert, status, and dialog use.

## Accepted sources

- [Specification](../spec.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Pending implementation.
