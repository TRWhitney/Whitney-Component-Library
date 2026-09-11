# Value-change motion

## Accepted decision

Should existing chart items move smoothly to updated values using the shared 240 ms ease-out timing? Compare Animated and Instant across a line with a range, grouped columns, bubbles, a donut and a heatmap. Whitney requested this comparison before deciding how added, removed or reordered items should behave.

Status: accepted. Whitney approved the demonstrated value-change motion across all five examples. The isolated prototype remains separate from production implementation.

## Design and scope

Use existing `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted` and `--wcl-border` tokens, with accent blue `#2878ff` and the existing series colors. Body typography carries headings and controls, with a 24px study heading; utility typography carries axes and readings at native chart sizes. Each segmented choice occupies its own row. The chart-type row scrolls locally at narrow widths.

The chart remains the primary content, with one Update values button directly above it. Moving marks and retained selection indicators provide the visual comparison. There is no entrance animation or automatic update loop. Retarget an interrupted transition from its current position. Respect the system reduced-motion preference. Heatmap color uses the same duration and an equivalent CSS ease-out curve.

These choices preserve the existing chart appearance; the comparison changes numeric geometry and color only. Native charts retain legend eyes, selection, hover and activation. Readings and detail callbacks report supplied values. The prototype adapters animate displayed Cartesian rows and bubble coordinates/magnitudes separately from their source data, and reuse native donut angle motion.

Item identities, ordering, counts, valid-value topology and axis ranges stay fixed. Donut values retain rank order. Adding/removing items, changing gaps, automatic axis fitting, exploration during data updates, and general production gesture cancellation are not settled by this study. Existing accepted behavior outside the motion being reviewed takes precedence over incidental adapter differences.

## Run

Source: [value-motion](value-motion/main.tsx). The fixtures contain three readings for eight months, fourteen buildings, five energy-use categories and sixteen room/time cells. No external data or account is needed.

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/value-motion --config .work/chart-interaction-composition/prototypes/value-motion/vite.config.ts --host 127.0.0.1 --port 5191
```

Open <http://localhost:5191>.

The isolated Vite adapters target production `f3087f9`. They do not edit or alter the normal production build.

## Operated flows

At 390px, switched through all five chart types and updated twice before the first transition finished. Intermediate line paths, bar heights, bubble positions, donut arcs and heatmap colors changed before reaching the latest supplied values. Each page stayed 390px wide. Adjusted the heatmap example height so all four rows remain visible.

Selected January, updated its value and observed the retained point ring move with it. Switched to Instant and operated an update in the light theme at 1200px. Operated reduced-motion mode and Identify elements, which identified the focused Update values button. Inspected compact dark, wide light and selection screenshots, then removed them.

No subagents, production changes or regression tests were used. Whitney approved the resulting study with "that all looks good".

## Acceptance contract

- Animate changes to existing values using the demonstrated shared 240 ms ease-out motion. Preserve line/range reshaping, grouped-column resizing, bubble position and area changes, donut angle changes and heatmap color changes.
- Retarget from the current displayed state when another update arrives. Do not queue updates or loop automatically.
- Keep selection attached to the same item, with its existing indicator following the displayed geometry. Readings and activation details retain supplied values rather than invented intermediate readings.
- Respect reduced motion with immediate settlement. Preserve existing chart styles, legend eyes, selection and activation conventions outside the motion under review.
- Retain the demonstrated compact and wide, light and dark usability. The fixed axes and unchanged item counts/order bound this acceptance; they are not new production restrictions.

Fixture values, example copy, the prototype comparison controls and adapter implementation are flexible. Added/removed/reordered items, changing gaps, coordination with automatic scale fitting and gestures during updates require further planning. Approval does not promote incidental adapter behavior into the production contract.
