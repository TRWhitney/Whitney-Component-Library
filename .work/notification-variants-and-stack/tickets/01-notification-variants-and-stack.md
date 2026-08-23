# 01 Add notification variants, actions, and a legible timed stack

**What to build:** Deliver the complete public notification experience described in the accepted
specification, including its API, behavior, styling, generated guidance, tests, package examples,
and showcase specimen.

**Blocked by:** none

**Status:** complete

- [x] General, success, warning, and error notifications use the accepted accent and semantic
      colors.
- [x] An optional paired action renders in the notification tone, invokes its callback, and closes
      its notification.
- [x] The top-aligned region shows the total message count and at least five ordinary messages as a
      compact stack before viewport-bounded native scrolling becomes necessary.
- [x] Overflow keeps all rendered messages reachable and uses ScrollRegion's transient scrollbar
      visibility semantics.
- [x] `maxVisible` caps the scroll viewport at the measured height of that many cards without
      removing or queue-hiding any notification.
- [x] Every timed visible message has a matching lifetime rail; persistent messages do not; hover
      and focus pause the rail with the timeout.
- [x] Keyboard dismissal, live-region urgency, placement, timeout bounds, queue order, SSR, forced
      colors, reduced motion, and callback behavior remain covered.
- [x] Canonical contracts regenerate human and machine guidance; four consistently styled showcase
      buttons and a separate three-card cap toggle demonstrate every variant, actions, stacking,
      scrolling, and expiry.
- [x] Repository checks, packed consumer verification, and the production showcase build pass.

## Accepted sources

- [Specification](../spec.md)
- `src/feedback/notification-provider.tsx`
- `src/feedback/feedback-types.ts`
- `src/contracts/feedback.contracts.ts`
- `src/styles.css`
- React Aria 1.20.0 toast implementation installed in `node_modules`
