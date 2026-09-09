# Area and mixed selection prototype

**Status:** accepted. Whitney: "Looks good now. I choose value marker."

## Decision

Should an individual area value use a marker at its upper boundary or a narrow slice through its
filled extent? Does the approved bar-frame and line-ring combination remain clear where marks overlap?

Area slice is the starting candidate. Value marker is a comparison that introduces circular cues
on an area boundary and needs explicit acceptance. Both use the approved selection/activation
gestures and month underlines. Month slices combine visible filled extents without an internal seam.
Mixed month reading previews both the bar and line point. Individual mixed targeting gives a line
point a small nearby hit area, then compares distances to the visible marks. Area slice ties use
the nearest upper boundary so overlapping fills remain individually reachable.

## Design plan

Use the existing `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, and
`--wcl-border` tokens with the established blue and orange chart series. Keep library body text
at 0.9375rem, headings at 1.5rem, and utility labels at 0.75rem. Place comparison controls above
one chart, with current values, selection, and application details below. The distinctive comparison
is a narrow cross-section of a filled area versus a marker on its value boundary. Activation pulses
are finite and become static acknowledgments under reduced motion. No whole-chart focus outline.
This preserves the accepted chart language except for the explicitly undecided area cues and
mixed targeting priority. No additional palette, dashboard, or detail-view design is proposed.

## Run

```sh
npx vite .work/chart-interaction-composition/prototypes/area-mixed-selection --host 0.0.0.0 --port 5177
```

Open <http://localhost:5177>. [Source](area-mixed-selection/) uses local monthly revenue and
operating-cost fixture data with crossings. The disposable adapter reads production chart marks;
production APIs and components are unchanged.

## Try

- Compare Area slice and Value marker with Overlapping and Stacked areas.
- Click an individual value, move away, and hover another. Switch to Month and drag a range.
- Switch to Bars + line. Select the line point inside March's bar, then the body of that same bar.
- Control/Command-click to open details without changing selection, or press and hold on touch.
- Compare dark/light and compact views. Identify elements gives stable names on hover or focus.

## Direct observations

Native Chromium operation selected March's operating-cost slice and opened its details without
changing selection. Month dragging selected February through April. The value-marker comparison
selected March's stacked operating-cost value. In the mixed chart, March's line point and revenue
bar selected independently; month mode showed both reading cues and one label underline.
Inspected dark overlapping and stacked month slices and light markers/mixed marks. A native touch
hold opened March details without selecting it. Keyboard traversal and Enter selected a month.
Element identification reported Appearance.
These observations make the alternatives reviewable; they do not establish acceptance or production
completion. No subagents or automated test suites were used.

Whitney clarified that legend priority applies only to overlapping marks under the pointer.
The prototype now checks the actual filled area, including sloping boundaries between months.
With Operating costs pinned, direct pointer movement read Operating costs in the overlap, Revenue
in the blue-only region, then Operating costs on returning to the overlap. Clicking the blue-only
region selected Revenue. Month targeting still includes both visible series.

## Accepted contract

Use Value marker at an area's upper value boundary, including stacked areas. Its filled center
previews the current target; an outer ring persists for individual selection. Month selection
underlines the label and previews all visible values. Mixed charts keep bar frames and line rings.
Legend priority chooses among overlapping shapes under the pointer only. A region occupied only
by blue targets blue even if red is pinned. Preserve the corrected sloping-boundary hit behavior,
click/tap selection, modifier activation, touch hold, dragging, finite feedback, both appearances,
and the absence of a whole-chart focus outline. Area slice is rejected for production.
Fixture data, comparison controls, and DOM adaptation are flexible. Production owns its geometry
and uses the existing shared identity, callback, and controlled-selection contract. This acceptance
covers AreaChart and the existing CartesianChart composition, not the new scatter/range compositions.
