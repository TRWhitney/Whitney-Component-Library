# Activation and selection working example

## Decision

A chart can expose application activation independently of optional selection while making the
current reading, activation feedback, and persistent selection distinguishable.

## Status

Accepted by Whitney on 2026-09-08: "Looks good, I approve of the behaviors and styles under review."
This approval covers the final rendered prototype following the light-mode marker-spacing fix.
No further approval of these reviewed behaviors or styles is required. Production delivery and
unreviewed interaction boundaries remain separate work.

## Accepted convention

### Binding behavior

- With selection enabled, an ordinary click toggles the targeted item. Control/Command-click
  activates it without changing selection. With selection disabled, an ordinary click activates.
- On touchscreens with selection enabled, tapping selects and pressing and holding activates
  without changing selection. Releasing after activation must not also toggle selection. Movement
  into a drag and cancellation cancel the pending hold. With selection off, tapping activates.
  Whitney chose press-and-hold explicitly after approving the reviewed mouse/keyboard design.
- Activation is an application callback, not a retained inspection state. Opening the example's
  details neither pins a reading nor selects an item. The application chooses what activation does.
- Month activation identifies one category with associated series values. It is not two point
  callbacks. Point activation identifies one category and one series.
- The reading preview and click use the same target. Resolve the nearest month horizontally and,
  for a point, the nearest visible point vertically within that month. Between series, the filled
  point must still be the point that will receive the click.
- Clicking can retain multiple selected items. Dragging replaces selection with an inclusive month
  range or a rectangle of points. Shift or Control/Command adds dragged items; Alt removes them.
  Escape or pointer cancellation restores the selection from before the drag. Dragging does not
  activate the application. Hide readings during selection dragging.
- Left/Right explore months; Up/Down change visible series for point targeting. Home/End reach the
  first/last month. Enter/Space follows ordinary click; Control/Command plus Enter/Space activates
  without changing selection. Pointer focus does not initialize a stale January keyboard reading.
- Clear selection affects only selection. Hiding a series hides its plotted selection indicator
  while retaining the selection and identifying it in the summary; restoring the series restores
  its indicator. Selection does not change the plotted domain.
- Legend names retain series emphasis; separate eyes retain visibility behavior.

### Binding appearance

- Filled centers identify current readings. Apply this meaning consistently to circular point
  markers across the applicable chart families; do not invent circles for other mark geometries.
- Underlines below category labels identify selected months. A single outer ring identifies a
  selected point. Brackets, soft bands, and checked bands remain historical comparison controls
  in the artifact and are not approved production alternatives.
- The center fill meets the actual point outline. The selection ring meets its outer edge. Derive
  their geometry from the rendered marker, including outline-width changes during emphasis.
  No background gaps or extra outer halo appear in light or dark mode.
- Activation produces the accepted larger, stronger brief pulse, currently 620ms. Month activation
  also briefly strengthens the vertical guide. Repeated activation restarts the feedback. It
  expires without creating selection or inspection state. Reduced motion uses a brief static cue.
- Keep existing chart typography, colors, spacing, appearance controls, responsive presentation,
  and visibility-scale animation. Do not add a permanent selection toolbar to the chart.

### Flexible qualities and boundaries

The financial fixture, application details panel, experiment switches, and DOM adapter are not a
public component API. Production must use normal component-owned rendering and established public
state conventions, preserving the accepted visible behavior. Example settings are not chart chrome.

The accepted touch extension uses press-and-hold, with a prototype threshold of 500ms. The dwell
threshold and movement tolerance are flexible implementation details. Approval does not cover other
chart geometries or settle pan/zoom conflicts. Existing touch readings remain required. Public API details and broader family rollout belong to implementation
planning; the convention must be consistent across applicable charts by parent-ticket completion.

## Accepted flows and evidence

Whitney directly reviewed the running example through the final spacing correction and approved
its behaviors and styles. Supporting direct Chromium observations:

- Between March's series, the filled point was March operating costs. Ordinary click selected it;
  Control-click and Command-click opened its details while preserving selection. Another ordinary
  click removed it. With selection off, ordinary click opened the same details.
- Month mode filled both March points and activated March once with both values and a guide pulse.
  Leaving the plot cleared the current reading; activation feedback expired independently.
- February-to-April dragging selected three months. Clicking added June, additive dragging retained
  it, subtractive dragging removed the range, and Escape restored the pre-drag selection. Point
  rectangle selection retained its enclosed points.
- Control+Enter opened keyboard-target details without changing the selected months.
- Final light and dark inspection of a selected, currently read point showed adjoining fill,
  point-outline, and selection-ring edges after removing the extra halo.

These are direct prototype observations, not production validation. No subagents or automated test
suites were used for the accepted refinements. Earlier implementation checks of the shared focus
fix are recorded separately in [ticket 02](../tickets/02-pointer-reading-focus.md#evidence).

## Retained artifact and run instructions

Source: [main.tsx](activation-selection/main.tsx), [styles.css](activation-selection/styles.css),
[index.html](activation-selection/index.html), and [tsconfig.json](activation-selection/tsconfig.json).
The prototype reuses the repository's LineChart and the pending shared pointer-focus correction.
It is isolated from production entry points and remains uncommitted with the active effort.

From the repository root, with repository dependencies installed:

```sh
npx vite .work/chart-interaction-composition/prototypes/activation-selection --host 0.0.0.0 --port 5175
```

Open `http://localhost:5175`. Select Point or Month and leave Underline as the month style. With
Selection On, click to select and Control/Command-click to activate. Turn Selection Off to activate
with an ordinary click. Open details on activation demonstrates the application's callback response.
On a touchscreen, tap to select and press and hold to activate. Try dragging, keyboard navigation, visibility eyes, Clear selection, light/dark appearance, compact
width, and Identify elements. The data is the embedded January-to-June financial fixture.

## Touch extension evidence

Native Chromium touch input confirmed that tapping March operating costs selects it, holding it
opens its details, and releasing preserves the existing selection. Moving into a drag before the
hold threshold prevented activation; a cancelled touch also left details unopened. This extension
was directly operated without subagents or automated suites. The approved mouse/keyboard behavior
and styles were preserved.
