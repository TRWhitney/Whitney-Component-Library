# Bar selection prototype

**Status:** accepted. Whitney: "Looks good. I like frame not end cap."

## Decision and design plan

Compare persistent selection as a complete outer frame or a cap at the value end of each bar.
Use actual ColumnChart and BarChart marks in grouped and stacked layouts. Keep the approved
click/select, modified activation, touch hold, drag modifiers, and category underlines.

Reuse `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, and `--wcl-border`, plus the
existing series colors. Body text uses the library body font at 0.9375rem; headings use the same
family at 1.5rem and utility labels use the library utility font at 0.75rem.
The chart occupies the main content width, with comparison controls above and current reading,
selection, and application details below. Selection frames are the distinctive element.
Only activation pulses animate, with a static acknowledgment under reduced motion.

The proposal preserves existing bar fills and patterns. A thin inner outline marks the reading;
the selection treatment remains outside the bar. Whole-month selection underlines its label in
either orientation. A drag rectangle selects bars it intersects, including stacked segments.
These are proposals for this geometry, not new meanings inferred from the LineChart approval.

## Run

From the repository root:

```sh
npx vite .work/chart-interaction-composition/prototypes/bar-selection --host 0.0.0.0 --port 5176
```

Open `http://localhost:5176`. Source is in [bar-selection/](bar-selection/).
Fixture values are monthly revenue and operating costs, supplied locally in the source.
The disposable adapter reads the production chart's rendered rectangles; it is not production architecture.
No agents or automated test suites are used for this prototype.

## Review flow

Switch between Frame and End cap, then between grouped/stacked and columns/horizontal bars.
Click a bar, move away, hover another, then Control/Command-click to open details. Drag through
several bars. Month mode retains label underlines. Compare light and dark appearances.
Identify elements reveals stable names on hover and focus.

## Direct observations

Operated the example in Chromium. March selection stayed selected after modified April activation.
A horizontal category drag selected February through April; a rectangle through those bar bodies
selected their Revenue segments. A native touch hold opened January details and retained the
three prior selections. Inspected Frame/dark, End cap/light, and stacked horizontal rendering.
Compact mode at a 480px viewport had a 480px document width. Element identification reported
Selection style. These observations support presenting the choices; they do not establish
acceptance or production completion.

Whitney rejected the whole-chart focus outline as distracting. The prototype now keeps focus
feedback on the current bar or category; keyboard entry starts a visible reading. No outer chart
outline is drawn. This does not settle Frame versus End cap for individual selected bars.

Whitney requested a continuous inner outline for a month and removal of overlapping borders.
Month reading and activation now follow the combined silhouette of its touching bars, with no
internal seam. Individual selection frames meet at shared edges without extending into their
neighbor. The inner reading outline stays inset and renders above activation feedback. Direct
Chromium inspection covered adjacent selections, grouped month hover, stacked month hover,
and horizontal stacks in light appearance. No agents or automated suites were used.

## Accepted contract

Whitney accepted the corrected grouped/stacked outlines and chose Frame. This binds production
BarChart and ColumnChart to the displayed relationships: persistent bar frames, separate inset
reading outlines, continuous month contours without internal seams, shared borders that do not
cover reading cues, and category-label underlines. No whole-chart focus outline is added.
The existing click/tap, modifier activation, touch hold, drag replacement/addition/removal,
cancellation, and clear-selection behavior remain binding. Frame works in both orientations
and both appearances. Activation is finite and respects reduced motion.

End cap is rejected for production and remains only a historical comparison in this artifact.
Fixture data, comparison controls, and DOM adaptation are flexible. Production uses chart-owned
geometry and state, with the existing stable row IDs and selection/callback contract. This acceptance
does not cover area, mixed, statistical, or radial geometry, or exploration gestures.
