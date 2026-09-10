# Heatmap visibility study

Status: Whitney approved the visibility behavior and style, reporting an intermittent first-hold inspect animation failure. That failure was traced to the prototype recreating filtered data when details changed and corrected by keeping data stable until visibility or fixture size changes. This is an isolated prototype, not public Heatmap visibility.

## Current direction

Open eyes reveal when a label is hovered or receives keyboard focus. Touchscreens keep eyes visible. Hiding removes the entire row or column, including its track. The remaining cells fill the available width. A closed eye with a hidden-item count beside Room opens an overlaid list of hidden rooms and times. Each item uses the same closed eye to restore it. No hidden track or bottom restoration section occupies chart space. Escape and clicking outside dismiss the list.

## Design plan

Reuse production theme tokens, the sequential blue palette and open/closed eye icons. Keep the 1.5rem heading and production utility labels. Preserve numeric cell colors, missing-value hatch and cell selection frames. Reveal fades for 150ms with reduced-motion support. The restore list appears over the chart, using the existing corner for its trigger. This replaces the rejected original-position labels and blank tracks.

## Operate

From the repository root:

```sh
npx vite .work/chart-interaction-composition/prototypes/heatmap-visibility --host 0.0.0.0 --port 5185
```

Open <http://localhost:5185/>. Hide North room and Midday, then open the closed eye beside Room to restore them. Hide every row and restore a single room. Compare Light appearance, Compact and More cells. Identify elements names controls and regions on hover/focus. Full readings retains the fixture, including missing values and zero.

## Direct observations

Operated the built prototype with desktop keyboard controls and a 390px native touch viewport. Hiding one row and one column leaves exactly three data tracks on each axis and nine cells, with no reserved hidden tracks. Restoring both returns sixteen cells. Hiding every row and restoring East room returns four cells. Inspected dark desktop/touch, the restore popup and light screenshots. No prototype tests or agent reviews were run.

## Boundaries

The study reuses production Heatmap interactions through a prototype-only filter and label portal adapter. Hidden data stays outside the renderer's interaction targets while the complete selection and raw table remain available. Production needs its own visibility API and full-source validation after acceptance. The accepted behavior is binding; the fixture, portal adapter and filtering implementation are flexible.

## Acceptance contract

Preserve reveal on label hover or keyboard focus, always-visible eyes on touch, and the permanently visible closed-eye/count restore control whenever dimensions are hidden. Hiding removes entire row/column tracks; visible cells refit. The corner control opens an overlaid list whose individual closed eyes restore items. Do not add blank tracks, eyes at intersections, or a bottom restoration section. Retain hidden selections, full readings, missing cells and the existing selection/activation gestures. First and repeated touch holds must open details and visibly animate without changing selection.

## Inspect correction

Native touch holds reproduced missing pulses on the first activation of each new cell, despite successful detail callbacks. Repeating the same cell animated. The prototype created a new filtered data array on every details render, which the shared production interaction hook treats as a dataset replacement and cancels its pulse. Memoizing the prototype's filtered rows, columns and data removes that accidental replacement. First and repeated holds on two cells now animate. The same four-hold sequence already animated in the production showcase before this change. No production code changed, and no regression suite or agent review was run for this prototype correction.
