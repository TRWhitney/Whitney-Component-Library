# 17 Clear legend emphasis on repeat activation

**What to build:** A second tap, click or keyboard activation of a pinned legend entry visibly releases it.

**Blocked by:** none

**Status:** complete

- [x] Repeat activation clears both the pin and temporary legend emphasis while the entry remains hovered or focused, across Cartesian, statistical, radar and pie/donut legends.
- [x] Keyboard focus stays on the button. A later hover or focus can preview the entry again, and another activation can pin it again.
- [x] Preserve other chart reading, selection, visibility and activation semantics. Showcase and public guides explain the release behavior.
- [x] Focused regression tests, affected checks, native tap/click/keyboard operation and independent production review pass.

## Accepted sources

- User report: tapping a highlighted radar legend entry does not visibly release it; mouse behavior was uncertain.
- [Accepted legend contract](../prototypes/legend-visibility.md#accepted-contract)
- [Specification](../spec.md#legend-release)

## Completion evidence

Native Chromium reproduces the issue on the public radar preview with mouse click and touchscreen
tap. The first press sets aria-pressed=true and emphasis; the second sets aria-pressed=false while
emphasis remains. Legend hover/focus leaves temporary emphasis active after the pin toggles off.
The other three legend renderers use the same independent temporary/pinned state pattern.

Eight regression cases failed with emphasis remaining after release, covering hover and focus
across all four renderers. All eight now pass; the focused suites pass 54 tests. The same activation
clears temporary legend state and toggles its pin. The shared button fill follows actual legend
emphasis or a pin; keyboard focus keeps its separate outline. Direct screenshots confirm that
both the chart emphasis and the colored button background release on repeat tap/click.

`npm run check` passes 724 tests across 45 files, code/style lint, formatting, types,
generated-output checks, TypeScript 5/6/7 and chart isolation. Following the final CSS correction,
style lint, formatting, build and generated-output checks were renewed. Native Chromium verifies
mouse, touch and keyboard pin/release/repin for line, scatter, pie and radar, including transparent
released button backgrounds and retained keyboard focus. Evidence is in
`/tmp/legend-release-red.log`, `/tmp/legend-release-green.log`, `/tmp/legend-release-check.log`,
`/tmp/legend-release-style-check.log` and `/tmp/legend-release-browser-final.log`.
The production build repeats all twelve native flows successfully in
`/tmp/legend-release-remote-final.log`. Independent production review passes on both intent and engineering axes with no findings.
One fresh reviewer covered this small correction read-only using the existing evidence.
