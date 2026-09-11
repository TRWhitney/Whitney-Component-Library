# 22 Chart Interaction and Composition

**What to build:** Extend the delivered chart readings with series visibility, activation callbacks,
selection, coordinated views, domain exploration, purposeful animation, and specific additional
mixed-chart combinations.

**Blocked by:** none. [Statistical Chart Family](20-statistical-chart-family.md) and
[Radial, Heatmap, and Compact Charts](21-radial-heatmap-and-compact-charts.md) are complete.

**Status:** complete. Whitney signed off on the measured timings and closure.

## Delivered foundation

- [x] Chart-owned pointer, keyboard, and touch readings expose formatted data and accessible
      announcements according to each chart's accepted reading unit.
- [x] Legends support transient emphasis and click-to-pin emphasis where applicable, with non-color
      identity cues and no series hiding.
- [x] Charts provide named keyboard reading boundaries, ordered traversal, responsive presentation,
      and complete generated data tables. Keyboard access does not require a tab stop per mark.
- [x] CartesianChart combines compatible line, area, and column series with bounded scales and
      reference lines, bands, and point annotations while keeping renderer objects private.
- [x] The existing column-and-line combination can display columns with a moving-average line when
      the application supplies the calculated values.

## Acceptance checks

- [x] Separate, obvious, visually restrained legend controls hide and restore individual series
      while clicking the series name retains the existing emphasis behavior. Hidden entries remain
      discoverable and restorable. An opening/closing eye is the leading visual candidate, subject
      to review in a working example; its meaning must also be accessible without the icon.
- [x] Hiding or restoring series automatically fits the scale to visible data without requiring an
      application setting to enable that behavior. Required chart baselines remain valid.
- [x] Applications can receive activation callbacks for actual chart items, including categories
      and points, with sufficient identity and associated data to act on them. Activation does not
      require adopting chart selection. Pointer, keyboard, and touch have equivalent activation
      paths.
- [x] Apply the [accepted indicator convention](../../chart-interaction-composition/spec.md#accepted-activation-and-selection-convention)
      consistently: filled centers mark current readings on circular point markers, a brief pulse
      acknowledges activation without retained inspection state, outer rings mark selected points,
      and underlines mark selected months. With selection enabled, ordinary clicks select and
      Control/Command-clicks activate without changing selection. With selection disabled, ordinary
      clicks activate. Reading previews and clicks target the same item. Category activation emits
      one category event with associated values. Reduced motion retains a brief static acknowledgment.
- [x] Charts support visible selection and application-controlled selection. Applications can
      deliberately coordinate charts, tables, detail views, or filters through explicit public
      state and callbacks without hidden global coupling or a prescribed application action.
- [x] Meaningful chart domains support pan, zoom, and brush/range selection, with keyboard paths,
      discoverable controls, an easy reset, and range callbacks available to the application.
- [x] Exploration and selection controls are intuitive, visually restrained, and consistent with
      the chart. Their gestures do not accidentally interfere with value reading, activation, or
      legend emphasis. Working examples demonstrate both appearance and operation before acceptance.
- [x] Brief, purposeful animations explain data and scale changes, remain responsive to further
      input, never loop idly, and settle immediately under reduced motion.
- [x] Scatter points can share a chart with a supplied trend, target, or other compatible line.
- [x] A line can share a chart with a supplied lower/upper range band that changes along the domain,
      such as an uncertainty or forecast band. This extends the existing fixed reference bands.
- [x] Applications supply calculated trend, average, forecast, and range values. Charts do not
      silently choose statistical calculations or expose private renderer objects.
- [x] Accessible names, readings, focus, and structured data alternatives remain accurate as
      visibility, filters, selection, and the displayed domain change. Selection is distinguishable
      without color alone, and the complete-data alternative remains available.
- [x] Representative datasets have recorded responsiveness measurements covering reading, selection,
      visibility changes, exploration and animation. Whitney accepted the measured timings.
- [x] Public contracts, generated guidance, showcase examples, and focused interaction, type,
      accessibility, reduced-motion, server-rendering, hydration, and package checks cover the
      delivered additions.

## Reconciled scope

Whitney accepted these remaining requirements in the reconciliation discussion on 2026-09-07.
They extend the earlier chart efforts, whose exclusions of visibility controls, consumer callbacks,
coordinated state, domain exploration, and geometry animation bounded those completed deliveries.
Those exclusions do not prohibit the additions accepted here.

Mixed-chart scope is the existing line/area/column composition, including supplied moving averages,
plus scatter with a line and a line with a changing range band. Scatter with adjacent distribution
charts is excluded from this composition work because it is an arrangement of separate charts.
General coordination between separate charts remains in scope; no dashboard or prescribed layout
is added.

The accepted controls, gestures, selection rules and visibility behavior are implemented across the chart families. Numeric value changes use the approved shared motion; unreviewed structural changes settle immediately. Individual delivery records and their accepted prototypes remain in the [implementation effort](../../chart-interaction-composition/status.md).

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)
- [Accepted Cartesian reading and sizing](../../chart-interactivity/spec.md)
- [Completed chart-reading effort](../../chart-interactivity/status.md)
- [Completed radial, heatmap, and compact effort](../../radial-heatmap-compact-charts/status.md)

## Completion evidence

The [implementation effort](../../chart-interaction-composition/status.md) records the public chart additions and their individual tests, native inspections, package checks and production reviews. Tickets 01–24 deliver consistent visibility, selection, activation and compact sizing. Tickets 25–30 deliver exploration. Tickets 32–33 implement the supplied scatter/line and line/range combinations. Tickets 34–40 deliver all approved numeric animations, including the corrected Sparkline extrema handoff. Approved immediate structural updates are part of that completed boundary.

Current repository checks pass 938 tests, formatting, lint, generated guidance, TypeScript 5/6/7 and chart isolation. Packed React 18.3.1/19.2.8 SSR, hydration, types and browser builds pass. The production showcase is current.

The crowded-axis correction in [Ticket 42](../../chart-interaction-composition/tickets/42-crowded-heatmap-visibility.md) preserves the full heatmap grid and replaces overlapping eyes with the existing corner eye and a list of all tracks. Public regression and native dark/light, narrow/wide and touch checks pass.

[Ticket 41](../../chart-interaction-composition/tickets/41-chart-responsiveness.md) records the full measurement matrix and the original diagnostic target misses. Whitney accepted those timings and explicitly signed off on closing this issue. All desktop cases passed the original targets; the slower-browser dense-data timings were accepted as sufficient.

A proposed heatmap experiment would paint numeric cell backgrounds on one canvas while retaining DOM borders, values and interaction. Its appearance and performance were unconfirmed, and it was not adopted. Whitney signed off on closure with this experiment unconfirmed. The existing CSS heatmap rendering remains in production. No further optimization is required for this ticket.
