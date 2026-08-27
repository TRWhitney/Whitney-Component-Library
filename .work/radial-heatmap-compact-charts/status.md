# Radial, heatmap, and compact charts

## Destination

Deliver PieChart, DonutChart, RadarChart, Heatmap, and Sparkline as public components whose data
contracts, readings, structured alternatives, visual encoding, and compact behavior preserve the
delivered chart family's conventions while bounding uses that would imply false precision or omit
necessary context.

## Current state

Delivery is ready for [PieChart and DonutChart](tickets/01-pie-and-donut.md) after renewed validation
and clean correction review. The accepted [specification](spec.md) and four vertical implementation
tickets resolve the chart-specific contracts, prototype decisions, public boundaries,
verification, and delivery order.

## Progress

- Inspected the accepted chart scope, chart architecture decision, delivered Cartesian and
  statistical chart decisions, public types, interaction model, styling, contracts, tests, and
  showcase coverage.
- Confirmed that the existing chart frame supplies the baseline for visible title and description,
  explicit feedback states, one keyboard boundary, pointer and touch reading, polite announcements,
  generated native tables, role-aware colors, legend emphasis, responsive sizing, local overflow,
  forced colors, reduced motion, SSR, and hydration.
- Opened the decision route for each chart's data semantics, the shared reading model, and the
  visual and responsive direction.
- Completed and independently checked the bounded external research. It confirms the existing
  accessibility frame, separates required outcomes from product policy, and records the remaining
  choices for each chart.
- Resolved PieChart and DonutChart around arbitrary category counts, eight-category ranked pages,
  valid zero records, derived totals, proportional aggregation by default, and a consumer option
  for the deliberately smallest aggregate navigation slice.
- Resolved RadarChart around dimensions and series, one shared scale, missing-as-zero behavior,
  invalid negative and non-finite values, and the Jumpchain visualizer's sparse-fill shoulders.
- Resolved Heatmap around ordered row and column domains, missing cells that remain distinct from
  zero, sequential or two-sided shared color scales, and local overflow for dense grids.
- Set the prototype acceptance boundary. Prototypes must reuse the real chart system, identify the
  exact questions under review, and cannot make incidental prototype differences into accepted
  production behavior.
- Resolved the Sparkline data and behavior contract around one ordered series, honest gaps,
  factual derived summaries, existing reading behavior, and comparable fixed ranges. Caption,
  endpoint, and minimum-size choices will be compared in the faithful prototype.
- Resolved chart reading around each chart's actual data unit while preserving the existing
  one-boundary interaction, tooltip, touch, announcement, legend, state, and generated-table
  behavior.
- Built the focused [Sparkline caption prototype](prototypes/sparkline-caption.md) on the production
  LineChart. It compares only embedded, compact, and standard caption ownership while retaining
  production chart reading and appearance behavior.
- Whitney accepted the standard visible chart caption for Sparkline. The component keeps the
  delivered caption typography, spacing, and state relationship; prototype sizing and hidden-axis
  padding do not bind production.
- Built the focused [Sparkline cue prototype](prototypes/sparkline-cues.md) on the production
  LineChart. It compares line only, a filled current endpoint, and a filled current endpoint with
  hollow observed-range markers while holding the accepted caption and reading behavior fixed.
- Whitney selected Current and observed range after the bounded marker revision. The prototype
  contract is confirmed: current is filled, every observed low and high is hollow, and ties retain
  their source positions.
- Closed the Sparkline minimum-size prototype route because the LineChart adapter keeps hidden axis
  margins and a Cartesian view box. Production will use a provisional compact default and the
  accepted size override, with review against the real Sparkline geometry.
- Accepted the focused [Pie and donut aggregate-slice prototype](prototypes/pie-donut-paging.md).
  It fixes the remaining count, eight-category pages, proportional aggregation by default with a
  smallest-slice option, ScrollRegion's transient scrollbar, and the current bounded resize
  behavior.
- Direct review exposed a fidelity defect in the radial prototype's tooltip. The first version
  pinned it inside the chart. The corrected version uses the existing fixed provider-level overlay,
  follows the mouse cursor, flips at viewport edges, and anchors keyboard and touch readings to the
  active slice.
- The radial legend now uses the delivered temporary and pinned emphasis behavior without opening
  a tooltip. Pie and donut add slice popout to that emphasis and direct slice hover.
- Playwright exposed that a width-only reflow merely traded horizontal clipping for unchecked
  vertical growth. The prototype now treats width and height as hard bounds. Its legend compacts
  gaps, button padding, swatches, and type first, then scrolls locally if the remaining rows cannot
  fit. Narrow areas stack only when they are tall enough.
- Short areas now reduce the caption and page-indicator type slightly, narrow the space reserved for
  Back, and give the plot and legend a more even share of the width.
- The first legend-density revision attached its size variables to the query container itself, so
  the browser ignored them. The corrected revision applies those variables to the chart inside the
  container. Browser-computed styles now confirm the compact values rather than relying on visual
  comparison alone.
- Compact side-by-side layouts now reuse the chart family's 1.15-to-0.85 plot and legend balance
  instead of equal columns. At 300 by 300, this increases the rendered plot column from 138px to
  about 159px while leaving the complete legend locally reachable.
- The pie count now uses the slice's area center instead of a fixed radius and stays visually bold.
  It holds its compact rendered size at the minimum, then grows modestly with the plotted slice.
- The donut center now compensates for SVG scaling as well. Its total is modestly larger, and its
  unit uses larger, heavier, full-contrast text.
- A new legend toggle applies ScrollRegion's transient scrollbar thumb without its border,
  background, padding, rounded container, or outline. The thumb appears during activity or legend
  focus and disappears after the shared idle delay.
- The accepted interaction contract includes slice popout with cursor-following tooltips, legend
  hover and focus popout without tooltips, pinned legend emphasis, replacement, and Escape clearing.
- The Back button now joins the compact resize treatment. At 300 by 300 it uses a 24px height, 11px
  type, and 6px inline padding instead of retaining its normal 40px dimensions.
- Aggregate and Back pointer navigation now clear the prior tooltip instead of forcing a persistent
  first-slice reading. Enter or Space keeps that reading for keyboard continuity.
- Recorded the accepted [specification](spec.md) and four vertical tickets. Pie and donut, Heatmap,
  and Sparkline are ready. Radar follows the private radial base delivered with pie and donut.
- Implemented public PieChart and DonutChart exports with typed accessors, localized labels,
  complete tables, state handling, stable ranking, valid zero records, fixed eight-category paging,
  proportional and smallest aggregate geometry, and a derived DonutChart center total.
- Implemented pointer, touch, and keyboard slice reading, live reading text, cursor-following
  tooltips, page announcements, Back traversal, tooltip clearing, radial popout, and the delivered
  transient and pinned legend emphasis hierarchy.
- Integrated responsive production styling for width and height bounds, compact captions and Back,
  side-by-side and tall-narrow layouts, slice-aware count scaling, readable donut-center text,
  repeated-color dash treatment, transient legend scrollbars, reduced motion, and forced colors.
- Added canonical contracts, generated PieChart and DonutChart guidance, root and chart exports,
  public type fixtures, SSR and hydration coverage, and production showcase specimens.

## Frontier

The [decision map](map.md) is resolved. [PieChart and DonutChart](tickets/01-pie-and-donut.md) are
validated. [RadarChart](tickets/02-radar-chart.md), [Heatmap](tickets/03-heatmap.md), and
[Sparkline](tickets/04-sparkline.md) are ready for implementation, with RadarChart next.

## Accepted sources

- [Foundation chart scope](../library-foundation/decisions/13-charting-scope.md)
- [Accessible chart-family architecture](../../docs/adr/0008-own-an-accessible-chart-family.md)
- [Shared chart-reading specification](../chart-interactivity/spec.md)
- [Role-aware chart-color specification](../chart-accent-palette/spec.md)
- [Statistical chart input contracts](../library-foundation/decisions/17-statistical-chart-input-contracts.md)
- [Statistical chart reading](../library-foundation/decisions/18-statistical-chart-reading.md)
- [Statistical chart visual encoding](../library-foundation/decisions/19-statistical-chart-visual-encoding.md)
- [Parent implementation ticket](../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
- [Chart semantics and accessibility research](research/chart-semantics-and-accessibility.md)
- [Architecture decision: Page large part-to-whole charts](../../docs/adr/0015-page-large-part-to-whole-charts.md)
- [Jumpchain radar behavior](research/jumpchain-radar-behavior.md)
- [Architecture decision: Preserve radar values while shaping sparse fills](../../docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md)
- [Accepted implementation specification](spec.md)

## Verification

- Sparkline caption prototype: Prettier, ESLint, Stylelint, TypeScript, production Vite build, and
  two prototype smoke checks pass.
- The smoke checks cover all caption treatments, width and appearance changes, region
  identification, production keyboard reading and tooltip content, and the generated table.
- Direct visual review and acceptance-contract confirmation selected Standard caption.
- Sparkline cue prototype: Prettier, ESLint, Stylelint, TypeScript, production Vite build, and two
  prototype smoke checks pass. The initial cues were too slight to distinguish; the bounded marker
  revision passes the same checks. Direct review selected Current and observed range.
- Pie and donut aggregate-slice prototype: Prettier, ESLint, Stylelint, TypeScript, production
  showcase build, live Vite load, and seven prototype smoke checks pass. The checks cover the
  remaining count, page limits of 6, 8, and 10, both aggregate sizing modes, the reduced aggregate
  tooltip, legend hover and pinning without a tooltip, radial popout, Back, pointer and keyboard
  activation, pie and donut forms, light and dark appearances, both available dimensions, the
  complete table, pointer-following placement, and viewport-edge flipping.
- Playwright screenshots at 300 by 300, 480 by 300, and 300 by 640 chart areas, plus a 375px browser
  viewport, show that the chart stays inside both supplied dimensions. The two short layouts keep
  the plot and compact legend side by side and give excess legend rows local overflow. The tall
  narrow layout stacks the plot above a compact two-column legend.
- Browser-computed styles confirm 11px legend text and 12 by 4px pills in both tested 300px-wide
  compact layouts. A 620 by 440 layout retains the normal 14px text and 20 by 8px pills.
- Browser measurements confirm that the aggregate count remains near 11px at the minimum chart
  size and rises toward 14px as the plot gains room.
- Browser inspection confirms the ScrollRegion comparison adds no border, background, padding, or
  outline. Its thumb is transparent while idle, uses the shared border color during activity, and
  returns to transparent after the shared 900ms idle delay.
- Playwright confirms that Back measures 24px high with 11px type in the 300 by 300 chart area and
  returns to 40px with 14px type at 620 by 440.
- Browser operation confirms one tooltip before pointer activation, none after aggregate or Back
  navigation, and one first-slice tooltip after keyboard activation.
- Production focused tests cover ranked paging, proportional and smallest aggregates, zero and
  invalid records, complete structured output, localized headings, donut totals, slice and legend
  emphasis, reduced aggregate tooltip copy, pointer and keyboard page changes, live readings,
  loading and error states, runtime validation, SSR, and hydration. Nine tests pass.
- Contract, showcase, static appearance, TypeScript, ESLint, Stylelint, production build, and
  focused component checks pass. Browser screenshots at 300 by 280, 300 by 300, 480 by 300, 300 by
  640, 512 by 389, and 720 by 500 confirm the production chart remains bounded and the default
  showcase uses the available width.
- Browser operation confirms the production tooltip follows the cursor, aggregate and Back
  navigation clear it, the reduced aggregate tooltip exposes only count and combined value, the
  compact Back button measures 24px high with 11px type, and the legend thumb uses the shared idle
  activity state.
- `npm run check` passes formatting, ESLint, Stylelint, TypeScript, 483 tests, generated docs, the
  supported TypeScript matrix, the production build, and chart-isolation verification.
- `npm run verify:package`, `npm run showcase:build`, and `git diff --check` pass. Package checks
  cover clean React 18.3.1 and React 19.2.8 consumers, SSR, hydration, public types, and browser
  builds.
- Direct production review in light, dark, and forced-color modes confirms the plot, legend,
  captions, paging, and donut center remain readable without clipping at 300 by 300 and 480 by 300.
  Forced colors resolve slices and swatches to Canvas and CanvasText, preserve the aggregate dash,
  and reduced motion removes segment transitions.
- Direct browser operation with 25 categories confirms a consumer category id of `aggregate`
  emphasizes only that category, later aggregate pages advance through ranges 8 to 15 and 16 to 23,
  and Back returns through both prior pages. A zero record plus an invalid record renders invalid
  feedback, the empty state, one structured row, and no slice. Inspected screenshots show both
  corrected states without clipping or style leakage.
- Independent intent and engineering correction reviews pass with no findings after inspecting the
  admitted aggregate identity, duplicate detection, zero-plus-invalid feedback, runtime validation,
  and later-page coverage corrections.

## Out of scope

- Selection callbacks, filtering, pan, zoom, brush selection, and coordinated chart state owned by
  Ticket 22.
- The advanced mixed-chart composition API owned by Ticket 22.
- Geographic maps, network graphs, Sankey diagrams, treemaps, candlesticks, 3D charts, and
  dashboard layout.
- Changes to the established chart palette, caption, feedback, tooltip, table, legend, or local
  overflow conventions unless a chart-specific semantic requirement proves them unsuitable.

## Continuation

- Resume with `python3 /home/trwhitney/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
- Branch: `master`.
- Owned uncommitted paths: `.work/radial-heatmap-compact-charts/`, `CONTEXT.md`, and
  `docs/adr/0015-page-large-part-to-whole-charts.md`, and
  `docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md`.
- Next action: commit the delivered PieChart and DonutChart outcome, then continue with
  [RadarChart](tickets/02-radar-chart.md).
