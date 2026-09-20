# Release browser and accessibility hardening

## Destination

Complete [foundation Ticket 30](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md)
with browser, interaction, appearance, and assistive-technology evidence.

## Current state

Complete on `main`, starting at `c8b87ac`. All Ticket 30 checks and both independent review axes
pass. The fixes and repeatable verification are committed as separate outcomes. No external
publication or stable-candidate acceptance has occurred.

## Progress

- Added repeatable component, integration, and accessibility browser runners.
- Fixed Markdown task names, nested-list semantics, annotation contrast, and Preview reading.
- Fixed Heatmap grouping, DropZone unavailable state, Tree search announcements, and process-status speech.
- Fixed integration fixture focus/naming issues and narrow overlay pointer selection.
- Fixed Select/ComboBox option clipping at high zoom with a shared scrolling-list correction.
- Updated affected showcase examples, canonical contracts, and generated guidance.
- Completed focused Orca/Firefox exercises with Whitney. Manual coverage follows distinct library
  interactions. Integration fixtures are test artifacts; Fieldnotes and Docket do not require
  additional application walkthroughs.

## Accepted sources

- [Foundation specification](../library-foundation/spec.md)
- [Quality boundary](../library-foundation/decisions/10-quality-and-release-boundary.md)
- [Visual direction](../library-foundation/decisions/05-visual-direction.md)

## Verification

See [verification and scanner adjudication](verification.md) and the [screen-reader checklist](screen-reader.md).
Final results include 1,201 tests, 39 browser groups across three engines, 24 integration paths,
packed React 18/19 SSR/hydration/types/builds, eight accessibility scenarios with documented
adjudication, and direct native Chromium zoom at 200% and 400%. No known ticket blocker remains.

## Out of scope

Stable release acceptance, publication, historical browser certification, and separate manual
acceptance of each fixture application. Linux browser-engine coverage does not claim native
Windows/macOS or physical mobile-device coverage.

## Continuation

Ticket 30 has no remaining work. The final delivery commit contains the repeatable browser
runners and this evidence record. Independent intent and engineering reviews passed. Intent
review's stale-summary finding was corrected and independently confirmed resolved.

Development entries remain on 5173 for the showcase and 5179 for operational proof. Built
consumer previews remain on 5184, 5186, and 5187. Existing user servers were preserved.
Temporary zoom-browser settings were isolated from Whitney's browser; the temporary browser
was restored to 100% and closed. Task-owned screenshots are removed after inspection.

## Delivery history

- `7352089` [Fix] Expose readable Markdown documents
- `01ab552` [Fix] Keep Markdown annotations legible
- `d9f1124` [Fix] Clarify Heatmap reading controls
- `9282c72` [Fix] Expose unavailable drop zones
- `b345e4f` [Fix] Announce filtered tree results
- `43c45f0` [Fix] Make process announcements understandable
- `ca04a9c` [Fix] Give labeled fixture groups semantics
- `96ea5e0` [Fix] Advance focus through publication review
- `0717baa` [Fix] Name compact Docket details controls
- `8006b33` [Fix] Keep showcase popup choices stationary
- `248fe56` [Fix] Scroll selection options at high zoom
- `11adf00` [Fix] Await touch-test selection cleanup

The commit containing this record adds the release browser, integration, and accessibility
verification commands and closes Ticket 30. No history was squashed.
