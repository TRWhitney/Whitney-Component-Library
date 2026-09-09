# Scatter and bubble selection prototype

**Status:** accepted. Whitney approved Centers inside and continued production implementation.

## Decision and design plan

Does rectangle selection of bubbles feel clearer when their centers must be inside the box, or
when any part of the mark is touched? Compare both with actual ScatterChart/BubbleChart geometry.
Keep click/tap selection, modified activation, touch hold, additive/subtractive dragging, and
cancellation. Individual observations are the target; these charts have no shared month category.
Legend priority applies only to overlapping hit shapes. Selection outlines follow the mark shape;
a small filled center indicates the current reading without changing the bubble's magnitude.

Use the established canvas, surface, text, muted-text, and border tokens plus the existing blue
and orange series colors. Body text stays at 0.9375rem, heading 1.5rem, and utility labels 0.75rem.
One chart occupies the main view with comparison controls above and reading/selection/details
below. Shape-following outlines are the distinctive element. Activation pulses are finite;
reduced motion uses a static acknowledgment. No whole-chart focus outline.
The existing chart symbols and bubble areas retain their data meanings. This compares selection
semantics rather than proposing a new palette or mark encoding.

## Run

```sh
npx vite .work/chart-interaction-composition/prototypes/scatter-bubble-selection --host 0.0.0.0 --port 5178
```

Open <http://localhost:5178>. [Source](scatter-bubble-selection/) uses local operating observations:
ambient temperature, thermal demand, and water volume across two loops. Deliberately coincident and
nearby observations expose overlap targeting. The adapter is isolated from production code.

## Review flow

Compare Scatter/Bubbles, then Centers inside/Touching marks. Drag from empty space through part of a
large bubble. Pin a legend series and move between overlapping and singly occupied regions.
Select a mark, activate another, and inspect retained selection. Compare light/dark and compact
layouts. Identify elements names regions on pointer hover and keyboard focus.

## Direct observations

Native Chromium operation pinned South and read the South observation in the coincident pair, then
read North in a North-only mark. Modified activation opened North's details without changing the
South selection. The same drag through the edge of the large noon bubble selected nothing with
Centers inside and selected North noon with Touching marks. Inspected bubble outlines and the
scatter diamond selection in dark/light. A native touch hold opened North's details while retaining
South's prior selection. Identify elements reported Drag inclusion. Left/Right traverse observations
in fixture order, including coincident points; Up/Down move to a point in that spatial direction.
No agents or automated test suites were used. This is a prototype, not production acceptance.

## Accepted contract

Use Centers inside for rectangle selection, including bubbles. Click/tap selects; Control/Command
click activates without changing selection. Enter/Space and their modified forms follow the same
rule. Touch hold activates without selecting on release. Drag from empty plot space replaces
selection; Shift/Control/Command adds, Alt removes, and Escape or pointer cancellation restores.

Reading uses a filled center, selection follows the full symbol outline, and activation gives a
finite visible pulse. Bubble magnitude and all existing symbol shapes keep their data meanings.
Legend priority applies only to actual overlapping hit shapes. Empty space has no click target.
Left/Right traverse observations in data order, including coincident points; Up/Down navigate
spatially, and Home/End reach the first/last observation. No whole-chart focus outline.

The Touching marks alternative is rejected for production. The retained comparison records why
Centers inside was chosen. The production showcase puts segmented radio controls on their own rows.
