# 14 Select and activate Sparkline readings

**What to build:** Deliver the approved compact reading selection, range dragging and independent activation through the public Sparkline component.

**Blocked by:** none

**Status:** complete

- [x] Optional interaction supports stable row IDs, controlled/uncontrolled selection, localized summaries and clearing. Missing and removed readings are pruned; zero is a target. Invalid or duplicate IDs are rejected.
- [x] Click/tap selects, Control/Command-click and touch hold activate independently, and activation without selection works. Callbacks preserve original datum, position, value and input.
- [x] Visible horizontal range dragging supports replacement, addition, removal, capture and cancellation on Escape, pointer cancellation, data/geometry/status/configuration changes.
- [x] Keyboard reading order and endpoints remain; separate selection/activation shortcuts work without pointer focus jumping to the first record.
- [x] Rings preserve current and half-filled extrema cues, meet normal borders, and remain clear in compact dark/light, dense, forced-color and reduced-motion states. Shared activation motion, tooltip, summary and table remain available.
- [x] Public exports, contracts, generated guides and rendered showcase are current. Meaningful public tests, repository/package checks, direct production browser operation and independent production reviews pass.

## Accepted sources

- [Sparkline specification](../spec.md#sparkline-recorded-value-interaction)
- [Accepted study](../prototypes/sparkline-selection.md)
- [Shared motion](../spec.md#shared-activation-motion)

## Completion evidence

The six initial public interaction tests failed for the missing API behavior. All eleven interaction
tests now pass alongside the fourteen existing Sparkline tests. Coverage includes zero and gap
boundaries, original datum identity after invalid rows, duplicate positions with separate IDs,
controlled and uncontrolled ownership, pruning, keyboard shortcuts, finite activation lifetime,
horizontal drag modifiers, cancellation and touch hold. Public type examples preserve typed
positions and require stable application IDs.

Direct production browser operation confirms selection, visible range feedback, keyboard activation
and touch hold without selection changes. Compact dark/light, a dense 24-reading fixture, forced
colors and reduced motion were inspected. Forced-color inspection exposed transparent outlines on
the canvas and its frame; both are suppressed for interactive Sparkline, with readings retained as
focus feedback. The final forced-color replay confirms no surrounding outline. Shared activation
motion becomes static under reduced motion. Existing cue borders meet selection rings.

`npm run check` passes 697 tests across 43 files, format/lint/type checks, generated-output checks,
TypeScript 5/6/7 declarations and chart isolation. The final CSS-only correction passes formatting
and style lint; builds and packed React 18/19 SSR, hydration, type and browser checks pass after that correction. Production showcase
controls occupy separate lines. Independent intent and engineering production reviews pass with no findings. Screenshot files were inspected and removed. No prototype tests or reviews were run.
