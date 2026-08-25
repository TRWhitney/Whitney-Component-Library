# Chart reading interactions

## Destination

Add chart-owned pointer, keyboard, touch, and legend interactions that make the active datum,
series, category, and formatted value unambiguous without turning charts into application layouts.

## Current state

Implementation and validation are complete. Shared reading, pointer-following tooltips, value-axis
references, interactive legends, content-aware presentation, categorical label rows, proportional
line hit targets, and ScrollRegion-equivalent overflow now form one coherent chart behavior.

## Progress

- The existing Tooltip is intentionally limited to supplemental descriptions on named Buttons. It
  is not a suitable container for structured chart values or pointer-relative chart reading.
- The current SVG is visually hidden from assistive technology while a complete generated table
  carries static meaning. Interactive chart access therefore needs its own named keyboard boundary
  and announcements without weakening the table fallback.
- Legend items are static list entries today. The prototype tests hover, focus, and click-to-pin
  series emphasis without adding visibility toggles or changing the chart domain.
- The prototype now exercises all three existing mixed mark roles with pointer, keyboard, touch,
  legend, light/dark, wide/compact, collision, and reduced-motion treatments.
- Shared reading is accepted: pointer input selects the nearest recorded category, the tooltip lists
  every series, and the needle and nodes relate the reading to plotted values.
- Supporting behavior is accepted: one keyboard chart boundary, orientation-aware category
  traversal, persistent touch reading with outside dismissal, and legend emphasis with click-to-pin.
- Browser review invalidated the prototype's chart-contained tooltip placement. Mouse tooltips now
  follow the cursor in a fixed overlay outside chart scrolling; keyboard and touch tooltips remain
  category-anchored.
- Numeric reference lines on the value axis are part of every shared reading because their values
  are directly comparable with series values.
- Local chart scrolling is an accepted last fallback after legible compaction. Existing showcase
  examples must fit their specimens without it, and tooltips remain outside the scroll region.
- The accepted line hit target adds one rendered line width on either side, making the complete hit
  stroke three times the rendered line width at every presentation size.
- The accepted overflow fallback is a labeled, keyboard-focusable native scroll region using the
  same transient thumb visibility and forced-color behavior as ScrollRegion.

## Frontier

Deliver the accepted implementation and its effort record.

## Accepted sources

- [Cartesian chart foundation](../library-foundation/tickets/19-cartesian-chart-foundation.md)
- [Role-aware chart colors](../chart-accent-palette/spec.md)
- [Prototype question](prototypes/chart-reading-interactions.md)
- [Responsive sizing prototype](prototypes/responsive-chart-sizing.md)
- [Accepted specification](spec.md)

## Out of scope

- Zooming, panning, brush selection, range selection, drill-down, filtering, or data mutation
- Consumer-owned workflow or dashboard layout
- Replacing the generated data table

## Verification

- The isolated Vite production build passes and ESLint reports no prototype findings.
- Direct Chromium operation confirms shared three-value reading, direct one-value reading, expanded
  line hit zones, right-edge tooltip collision handling, legend hover and pinning, Escape clearing,
  keyboard category/series traversal, and touch selection.
- Inspected dark shared/direct and light compact screenshots retain readable labels, distinct
  emphasis, contained tooltips, local chart scrolling, and the role-aware palette.
- The first custom sizing artifact was invalidated because it reimplemented accepted reading
  behavior. The revised artifact composes the production LineChart and limits prototype behavior to
  sizing, label rows, overflow, and line hit tolerance.
- Direct Chromium operation of the production-composed prototype confirms all 16 categorical labels
  in alternating rows at 1080px without overflow, a modest measured gap between the lower row and
  the production X-axis label, local overflow at 560px, the accepted reading needle and two value
  nodes, the fixed all-value tooltip with Target, and tooltip placement outside the chart frame.
- `npm run check` passes: formatting, code and style lint, typecheck, all 453 tests, generated
  documentation, TypeScript declaration matrices, build, and chart renderer isolation.
- Direct Chromium inspection confirms all five showcase charts fit 492px panes without scrolling,
  labels render at the accepted readable size, and line hit targets remain three times their
  visible strokes.
- Direct Chromium inspection of the dense production-composed chart confirms 16 categorical labels
  in two rows, a 727px canvas within a 560px labeled focusable scroll region, active scrollbar
  state, retained Target reading, and a tooltip outside the scroll frame.
- Focused regression coverage confirms same-year compact labels keep their distinguishing category
  prefixes when staggered instead of collapsing to duplicate year-only labels.
- The review correction pass confirms public contracts describe the delivered interactions,
  keyboard End scrolls the dense frame to reveal its reading, touch replaces prior mouse state,
  content sizing uses bounded visible labels, reference rows have stable unique keys, and hydration
  reports no recoverable errors.
- Final Chromium validation confirms all five 492px showcase panes fit without local overflow. In
  the dense case, End reveals Apr 27 at scrollLeft 167 in a 727px canvas within a 560px region; its
  tooltip remains fully visible in the browser viewport and outside the scroll frame.
- Chromium at the 320px minimum confirms four medium labels fit without scrolling, render across
  two rows with a measured 4.3px clear gap before the X-axis label, and keep the anchored tooltip
  within the viewport from 8px to 184px. RTL overflow focus reveals the first category at
  scrollLeft -555 and End reveals the final category at the zero origin.
- Focused coverage exercises shared readings and direct-series emphasis across line, area, column,
  bar, and mixed charts. It also confirms stale legend ids cannot mute replacement series and uses
  localized consumer copy for accessible names while exposing keyboard commands structurally.
- The tooltip correction measures its rendered box before clamping. Chromium confirms horizontal
  pointer movement changes its left edge from 328px to 447.2px, flips from start to end at the plot
  edge, and remains within both ordinary and 320px viewports without entering chart overflow.
- Tooltip measurement is keyed to formatted tooltip content and viewport width rather than cursor
  coordinates or rebuilt data arrays. Focused coverage confirms movement within one category
  updates placement without another synchronous layout measurement.

## Continuation

- Branch: `master`
- Base commit: `39f4b0d` (`[Tweak] Make chart series legible`).
- Owned uncommitted paths: `.work/chart-interactivity/`, `docs/components/{area,bar,cartesian,column,line}-chart.md`, `showcase/showcase.tsx`, `src/charts/cartesian-chart.tsx`, `src/contracts/chart.contracts.ts`, `src/styles.css`, `tests/cartesian-charts.test.tsx`, and `tests/styles.test.ts`.
- Resume with
  `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work validation`.
- Next action: move to delivery, inspect the final diff, and commit the completed outcome with its
  effort record.
