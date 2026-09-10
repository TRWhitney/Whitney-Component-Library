# Scatter and bubble exploration

## Decision and status

Does a rectangular overview, two-finger movement and pinch provide intuitive two-axis exploration
for scatter and bubble charts? Whitney approved the centered, directly resizable map and plain
expanded dialog with "Much better. Use that design." The horizontal monthly study is approved
in [its contract](chart-exploration-comparison.md#accepted-behavior).

## Direction

Reuse the approved plot-attached zoom controls, collapsed Disclosure overview, production
selection and activation, and separate chart-type choices. Four direction arrows move the view
in load or demand. The overview's rectangle is the distinctive addition; it represents both axis
ranges, with draggable corners for independent width and height changes.

Use existing canvas, surface, text, muted-text and border tokens, accent `#2878ff` and the existing
second-series orange. The production body face carries explanations and controls; the utility
face carries chart values. Production chart sizing owns readable axis text. Overview movement
uses 180ms transitions and respects reduced motion. Light appearance and element identification
remain available. This applies the existing chart language without introducing a new control style.

## Accepted behavior

- Two fingers move both axes together. Pinch scales both spans around the gesture center.
- Plus and minus zoom about the center; reset shows the full fixture domain.
- Preserve the full-space reference in a compact map, centered in the disclosed region with
  correct proportions. Both the compact and expanded maps allow moving and resizing the region.
- The existing quiet expand IconButton belongs inside the map frame. Expansion opens the existing
  Dialog with a larger synchronized map. Closing keeps the adjusted view. Dialog content is
  limited to Overview, the current ranges, the map's scale labels, Reset view and Done.
- The overview starts closed. Drag its window, draw a new rectangle outside it, click outside to
  recenter, or resize a corner. Arrow keys move a focused window or resize a focused corner.
- One finger and desktop dragging retain production Centers inside selection, live replacement
  previews and selected mark outlines. Control/Command-click or touch hold activates.
- Selection stays with stable observation IDs, including outside the viewport and across type
  changes. The production point shapes and group emphasis remain in use.
- Bubble sizes keep the full dataset's magnitude reference during navigation. Zoomed marks clip
  at the plot boundary, keeping the axis labels clear.

## Source and run instructions

[Source](point-exploration/main.tsx), [styles](point-exploration/styles.css),
[isolated build adapter](point-exploration/vite.config.ts).

From the repository root:

```sh
./node_modules/.bin/vite .work/chart-interaction-composition/prototypes/point-exploration --config .work/chart-interaction-composition/prototypes/point-exploration/vite.config.ts --host 0.0.0.0 --port 5187
```

## Direct operation

Operated both chart types at 390px, including mid-drag selection previews, Control-click and first
hold activation, zoom buttons, demand movement, diagonal two-finger pan and pinch. Pinch did not
select; the center reading's bubble radius remained unchanged. Moved and resized the overview by
pointer and keyboard. Inspected dark mobile and light wide rendering at 1100px. The final mobile
root remains 390px wide after containing the hidden table's intrinsic width. No agents or
production regression tests were used. Screenshots were inspected and removed.

## Prototype boundaries

The fixture is a disposable 25-reading grid, with two groups and positive stored-energy values.
Both axes cover 0–100; each visible span is at least 20, so every reachable window has a reading.
Empty views and arbitrary application data still require production handling after the navigation
contract settles. Wheel behavior and the public range API remain open.

Production components own point rendering and interaction. A prototype-only Vite transform keeps
the magnitude reference at the full fixture maximum and clips marks to the viewport. It applies
the same radius calculation to rendering and interaction geometry. Repository production source
is unchanged. Filtering, capture-phase touch arbitration and this build adapter are experimental
techniques, not a proposed public implementation.

The mobile overflow came from the production visually hidden table retaining its intrinsic width.
The prototype contains it at its host. This is an additional compact-layout finding to resolve
when delivering the exploration host, rather than evidence that the earlier audit covered every
embedding case.

## Compact overview revision

Whitney rejected the large overviews as effectively repeating the main chart. Both modes now
use a 120px-high navigator at every width, with small screen-sized marks. Removed the redundant
introductory caption and shortened its instructions. Inspected the wide overview and operated
window dragging and corner resizing at 1100px and 390px. That strip revision was rejected and is retained here only to explain the subsequent design.

## Proportional map and expanded navigator

Whitney rejected the compressed strip because it distorted the dimensions and made positioning
imprecise. Removing the overview was also rejected: the full-space reference is valuable and
must remain available. The strip revision above is superseded.

The current candidate keeps a small proportional map beside an existing quiet Expand button.
Expand opens the library Dialog with a larger navigator using the same proportions and viewport.
Window movement and corner resizing are available in both maps. Changes apply live, and Done or dismissal keeps the adjusted view. The expanded map
is temporary rather than permanently duplicating the chart. The centered revision below supersedes this intermediate candidate.

Operated opening, window movement, corner keyboard adjustment and closing at 1100px and 390px.
Both map instances update together and each measures its own drawing area. Inspected the desktop
compact overview and mobile expanded dialog; neither root overflowed. No agents or production
checks were used.

## Centered controls and plain copy

Whitney requested centering the compact map, direct resizing without expansion, an integrated
expand control and plain dialog copy. The compact map is centered within the disclosed region
and exposes all four resize corners. The existing quiet IconButton now supplies the expand
control in the map frame. The dialog shows Overview, the current ranges, the map and its actions.
Removed the page introduction, repeated explanatory footer and dialog instructions.

Directly dragged a compact resize corner, opened the icon control and inspected the compact map
and dialog at 390px. Existing close handling and navigation behavior remain unchanged. No agents
or production tests were used.

## Acceptance contract

The accepted behavior above and the current runnable source are binding for scatter and bubble
production exploration. Preserve compact and expanded proportions, centered placement, direct
resizing in either size, icon placement, restrained copy, selection feedback and gesture
separation. The fixture, implementation adapters and exact example ranges are flexible.

The explicit public viewport API, arbitrary datasets and empty viewport handling remain production
planning work. This approval does not silently extend the design to heatmaps or distributions.
