# Notification variants and legible stacking

## Destination

NotificationProvider has general, success, warning, and error variants, optional matched actions,
a clear top-aligned stack with viewport overflow, and visible timeout progress.

## Current state

The corrected implementation, current completion evidence, and bounded independent correction
reviews are complete on [Ticket 01](tickets/01-notification-variants-and-stack.md). The effort is
delivered as one cohesive feature commit on `master`.

## Progress

- Accepted the [specification](spec.md).
- Applied the existing component library visual language to a connected stack and lifetime rail.
- Kept notification terminology local to its canonical component contract. No durable glossary or
  ADR change is warranted.
- Accepted success as an additive notification tone alongside general, warning, and error.
- Accepted an uncapped default stack that fits at least five ordinary messages on a standard
  desktop viewport, then uses viewport-bounded scrolling with transient scrollbar visibility.
- Accepted top-end as the default placement so the first message starts at the top edge.
- Implemented `maxVisible` as an exact measured-card scroll viewport cap. Every notification remains
  rendered and scrollable.
- Added a showcase toggle for the three-card viewport cap, separated from four consistently styled
  tone triggers.
- Preserved the existing capped and uncapped behavior through focused component, contract, style,
  layout, and showcase tests.

## Verification

- `npm run check` passed formatting, code and style lint, TypeScript, 19 test files with 331 tests,
  generated artifact checks, and the TypeScript current/6/7 declaration matrix.
- `npm run showcase:build` passed. Its existing large-chunk advisory remains informational.
- `npm run verify:package` passed packed SSR, hydration, declarations, and browser builds with
  React 18.3.1 and React 19.2.8.
- Direct Chromium inspection confirmed five uncapped messages fit without scrolling and thirteen
  use viewport-bounded overflow. Five capped messages remained as five rendered cards in a 276px
  three-card viewport with 411px of scroll content and a 135px reachable scroll offset.
- Direct Chromium interaction confirmed the separate cap toggle and four consistently styled tone
  buttons, action dismissal, transient scrollbar activity, keyboard focus, light and dark themes,
  a 390px viewport, reduced motion, and forced colors. The final run emitted no page or console
  errors, and every screenshot was checked for clipping, overflow, alignment, and hierarchy.
- Correction validation confirmed that timed notifications added during an existing hover or focus
  pause remained visible after 4.5 seconds, kept their rails paused, and expired only after the
  paused state ended. A persistent notification rendered without a lifetime rail.
- Direct Chromium accent-matrix validation covered the default blue accent, black on light, white
  on dark, and muted blue on dark. General titles retained 13.31:1 to 16.56:1 contrast; glyphs,
  rails, and focus indicators retained at least 3.60:1; matched action colors retained at least
  5.83:1. Keyboard focus was visibly rendered in every case, all screenshots were inspected, and
  the run emitted no page or console errors.
- Independent bounded correction reviews reported no remaining intent or engineering findings,
  judgment calls, or missing evidence for the arbitrary-accent correction.

## Frontier

- [Ticket 01](tickets/01-notification-variants-and-stack.md)

## Accepted sources

- [Specification](spec.md)
- Existing notification implementation, tests, component contract, generated documentation, and
  local React Aria toast source

## Out of scope

Arbitrary notification composition, multiple actions, links, and changes to other feedback tone
APIs.
